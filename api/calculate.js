export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const {
    salary, profession, city, situation, pagas,
    hijos3, hijos25, asc65, asc75, discapacidad, movilidad, categoria,
    netMonthly, netAnnual, percentile, cityMedian, profKey
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

  const prompt = `Eres un experto en retribución salarial en España y en la Directiva Europea de Transparencia Retributiva (2023/970), que entra en vigor el 7 de junio de 2026.

Un trabajador ha introducido los siguientes datos en la calculadora:

DATOS PERSONALES Y LABORALES:
- Profesión: ${profession}
- Salario bruto anual: ${parseInt(salary).toLocaleString('es-ES')} €
- Ciudad: ${cityNames[city] || city}
- Situación familiar: ${situationNames[situation] || situation}
- Número de pagas: ${pagas}
- Hijos menores de 3 años: ${hijos3}
- Hijos entre 3 y 25 años: ${hijos25}
- Ascendientes mayores de 65 años a cargo: ${asc65}
- Ascendientes mayores de 75 años a cargo: ${asc75}
- Discapacidad del contribuyente: ${discapacidad === '0' ? 'ninguna' : discapacidad + '%'}
- Movilidad geográfica: ${movilidad === 'si' ? 'sí' : 'no'}

RESULTADO DEL CÁLCULO:
- Salario neto mensual estimado: ${netMonthly}
- Salario neto anual estimado: ${netAnnual}
- Percentil en su profesión y ciudad: ${percentile}
- Mediana de mercado para su perfil: ${cityMedian}

Redacta un análisis personalizado y directo en 3 párrafos cortos (máximo 4-5 líneas cada uno):

1. SITUACIÓN ACTUAL: Explica cómo está su salario respecto al mercado de forma clara y directa. Usa los datos de percentil y mediana. Si está bien pagado, díselo; si está por debajo, díselo sin rodeos.

2. LO QUE DICE LA LEY: Explica qué derechos concretos le da la nueva Ley de Transparencia Retributiva en su situación específica. Menciona el derecho a solicitar información salarial, la prohibición de opacidad, y qué puede exigir a su empresa.

3. RECOMENDACIÓN ACCIONABLE: Da 2-3 argumentos o pasos concretos que puede usar para negociar o defender su salario. Sé específico con su profesión y ciudad.

Tono: directo, informado, útil. Sin tecnicismos innecesarios. Sin bullet points, solo párrafos fluidos. Sin mencionar que eres una IA.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 600,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic error:', err);
      return res.status(500).json({ error: 'Error al contactar con la IA' });
    }

    const data = await response.json();
    const analysis = data.content?.[0]?.text || '';

    return res.status(200).json({ analysis });

  } catch (error) {
    console.error('Function error:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
