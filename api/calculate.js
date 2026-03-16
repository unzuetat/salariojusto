module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const {
    salary, profession, city, situation, pagas,
    hijos3, hijos25, asc65, asc75, discapacidad, movilidad,
    netMonthly, netAnnual
  } = req.body;

  if (!salary || !profession) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  const cityNames = {
    madrid:'Madrid', barcelona:'Barcelona', valencia:'Valencia', sevilla:'Sevilla',
    bilbao:'Bilbao', malaga:'Málaga', zaragoza:'Zaragoza',
    murcia:'Murcia', palma:'Palma de Mallorca', laspalmas:'Las Palmas de G.C.'
  };

  const situationNames = {
    single: 'soltero/a sin hijos',
    single_kids: 'soltero/a con hijos a cargo',
    married_noincome: 'casado/a con cónyuge sin ingresos significativos',
    married: 'casado/a con cónyuge con ingresos propios'
  };

  const allCities = Object.keys(cityNames);
  const cityLabel = cityNames[city] || city;

  // ── LLAMADA 1: Rangos salariales reales ──────────────────────
  const rangesPrompt = `Eres un experto en el mercado laboral español con datos actualizados de 2024-2025.

Necesito los rangos salariales BRUTOS ANUALES en euros para la profesión: "${profession}" en España.

Devuelve ÚNICAMENTE un objeto JSON válido, sin texto adicional, sin markdown, sin explicaciones:

{
  "madrid": [min, mediana, max],
  "barcelona": [min, mediana, max],
  "valencia": [min, mediana, max],
  "sevilla": [min, mediana, max],
  "bilbao": [min, mediana, max],
  "malaga": [min, mediana, max],
  "zaragoza": [min, mediana, max],
  "murcia": [min, mediana, max],
  "palma": [min, mediana, max],
  "laspalmas": [min, mediana, max]
}

Reglas estrictas:
- Todos los valores en euros enteros
- El mínimo nunca puede ser inferior al SMI español (15.876€ brutos anuales en 2025)
- Los valores deben reflejar el mercado laboral real español de 2024-2025
- Madrid y Barcelona suelen ser un 20-35% más altos que ciudades medianas
- Bilbao es similar o ligeramente inferior a Barcelona
- Murcia, Las Palmas y ciudades medianas suelen ser un 15-25% menos que Madrid
- Solo JSON, nada más`;

  let ranges = null;
  let percentile = 50;
  let cityMedianVal = 0;
  let spainMean = 0;

  try {
    const rangesResp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [{ role: 'user', content: rangesPrompt }]
      })
    });

    if (rangesResp.ok) {
      const rangesData = await rangesResp.json();
      const rawText = rangesData.content?.[0]?.text || '';
      const clean = rawText.replace(/```json|```/g, '').trim();
      ranges = JSON.parse(clean);

      // Calcular percentil
      if (ranges[city]) {
        const [min, med, max] = ranges[city];
        cityMedianVal = med;
        const gross = parseFloat(salary);
        if (gross <= min) percentile = 10;
        else if (gross <= med) percentile = Math.round(10 + ((gross-min)/(med-min))*40);
        else if (gross <= max) percentile = Math.round(50 + ((gross-med)/(max-med))*40);
        else percentile = 95;

        const allMedians = allCities.map(c => ranges[c] ? ranges[c][1] : med);
        spainMean = Math.round(allMedians.reduce((a,b) => a+b, 0) / allMedians.length);
      }
    }
  } catch (e) {
    console.error('Ranges error:', e);
  }

  // ── LLAMADA 2: Análisis personalizado ────────────────────────
  const analysisPrompt = `Eres un experto en retribución salarial en España y en la Directiva Europea de Transparencia Retributiva (2023/970), que entra en vigor el 7 de junio de 2026.

PERFIL DEL TRABAJADOR:
- Profesión: ${profession}
- Salario bruto anual: ${parseInt(salary).toLocaleString('es-ES')} €
- Ciudad: ${cityLabel}
- Situación familiar: ${situationNames[situation] || situation}
- Hijos menores de 3 años: ${hijos3} | Hijos 3-25 años: ${hijos25}
- Movilidad geográfica: ${movilidad === 'si' ? 'sí' : 'no'}

DATOS DE MERCADO:
- Salario neto mensual estimado: ${netMonthly}
- Salario neto anual estimado: ${netAnnual}
- Percentil en ${cityLabel}: ${percentile}
- Mediana del mercado en ${cityLabel}: ${cityMedianVal ? cityMedianVal.toLocaleString('es-ES') + ' €' : 'no disponible'}
- Media salarial española para este perfil: ${spainMean ? spainMean.toLocaleString('es-ES') + ' €' : 'no disponible'}

Redacta un análisis en 3 párrafos cortos (4-5 líneas cada uno):

1. SITUACIÓN ACTUAL: Cómo está su salario respecto al mercado. Usa el percentil y la mediana. Directo y sin rodeos.
2. LO QUE DICE LA LEY: Qué derechos concretos le da la nueva Ley de Transparencia Retributiva. Específico para su situación.
3. RECOMENDACIÓN: 2-3 pasos concretos para negociar o defender su salario. Específico para su profesión y ciudad.

Tono: directo, útil, sin tecnicismos. Sin bullet points. Sin mencionar que eres IA.`;

  try {
    const analysisResp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 600,
        messages: [{ role: 'user', content: analysisPrompt }]
      })
    });

    if (!analysisResp.ok) throw new Error('Analysis API error');

    const analysisData = await analysisResp.json();
    const analysis = analysisData.content?.[0]?.text || '';

    return res.status(200).json({ analysis, ranges, percentile, cityMedian: cityMedianVal, spainMean });

  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(200).json({ analysis: '', ranges, percentile, cityMedian: cityMedianVal, spainMean });
  }
}
