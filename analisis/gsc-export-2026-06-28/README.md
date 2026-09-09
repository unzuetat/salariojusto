# GSC Export · corte 2026-06-28

Export manual de Search Console del 2026-06-30, ventana **Últimos 3 meses** (29-mar a 28-jun).

## Archivos

- `paginas.csv` — URL-level (top páginas)
- `grafico-diario.csv` — serie diaria sitewide
- `dispositivos.csv` — desglose móvil/ordenador/tablet
- `consultas.csv` — queries top (texto pegado, no incluido en disco por tamaño — ver crumb MC)
- `paises.csv` — desglose por país (texto pegado, no incluido en disco por tamaño — ver crumb MC)
- `aparicion-busquedas.csv` — vacío (sin desglose en este corte)
- `filtros.csv` — config del export

## Key takeaways

- **+26.6% clicks WoW** semana de la apelación AdSense (22-28 jun vs 15-21 jun)
- **25-jun: 173 clicks = mejor día del proyecto**
- Posición media baja 7.6 → 6.5 en 3 semanas
- Asturias title B = confirmado quemado (16.651 imp / CTR 1.23%)
- Hostelería Baleares = quick win obvio (15.823 imp / CTR 2%)

## Cómo regenerar `analisis/gsc-paginas.csv`

```bash
.venv/bin/python -c "
import csv
with open('analisis/gsc-export-2026-06-28/paginas.csv') as i, open('analisis/gsc-paginas.csv','w') as o:
    o.write('url;clicks_3m;impressions_3m;ctr;avg_position\n')
    for row in csv.DictReader(i):
        url = row['Páginas principales']
        if '#' in url: continue  # skip anchors
        ctr = row['CTR'].replace('%','')
        o.write(f\"{url};{row['Clics']};{row['Impresiones']};{ctr};{row['Posición']}\n\")
"
```
