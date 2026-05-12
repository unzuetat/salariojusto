# Genera el universo de candidatos para investigacion de volumenes en Keyword Planner.
# Output:
#   convenios-candidatos.csv  -> 1 fila por convenio (sectorial provincial + autonomico + estatal + empresa)
#   queries-keyword-planner.txt -> 1 query por linea, lista para pegar en GKP por lotes de ~700.
#
# Metodologia:
#   Cada convenio aporta 3 variantes de query (las que la GSC del proyecto ha demostrado mas usadas).
#   No filtramos a priori cruces "imposibles" (p.ej. metal en Soria): Keyword Planner devolvera 0 y se filtra despues.
#
# Decisiones:
#   - 5 sectores principales x 52 provincias = 260
#   - 5 sectores secundarios x 20 provincias relevantes = 100
#   - 15 autonomicos + estatales destacados = 15
#   - 50 empresas con convenio propio o de centro = 50
#   Total esperado: ~425 entradas, ~1275 queries.

$ErrorActionPreference = "Stop"

# Provincias (52)
$provincias = @(
    "Álava","Albacete","Alicante","Almería","Asturias","Ávila","Badajoz","Baleares",
    "Barcelona","Bizkaia","Burgos","Cáceres","Cádiz","Cantabria","Castellón","Ciudad Real",
    "Córdoba","A Coruña","Cuenca","Gipuzkoa","Girona","Granada","Guadalajara","Huelva",
    "Huesca","Jaén","León","Lleida","Lugo","Madrid","Málaga","Murcia","Navarra","Ourense",
    "Palencia","Las Palmas","Pontevedra","La Rioja","Salamanca","Segovia","Sevilla","Soria",
    "Tenerife","Tarragona","Teruel","Toledo","Valencia","Valladolid","Zamora","Zaragoza",
    "Ceuta","Melilla"
)

# Sectores principales (5) — provincial mayoritario o muy buscado por provincia aunque sea estatal
$sectores_principales = @(
    @{ slug = "metal"; nombre = "Metal" },
    @{ slug = "limpieza"; nombre = "Limpieza de Edificios y Locales" },
    @{ slug = "hosteleria"; nombre = "Hostelería" },
    @{ slug = "construccion"; nombre = "Construcción" },
    @{ slug = "transporte-mercancias"; nombre = "Transporte de Mercancías por Carretera" }
)

# Provincias relevantes para sectores secundarios (las grandes + las industriales)
$provincias_secundarias = @(
    "Madrid","Barcelona","Valencia","Bizkaia","Gipuzkoa","Álava","Sevilla","Zaragoza",
    "Asturias","A Coruña","Tarragona","Cádiz","Málaga","Granada","Las Palmas","Tenerife",
    "Baleares","Navarra","Murcia","Alicante"
)

# Sectores secundarios (5)
$sectores_secundarios = @(
    @{ slug = "comercio-metal"; nombre = "Comercio del Metal" },
    @{ slug = "oficinas-despachos"; nombre = "Oficinas y Despachos" },
    @{ slug = "quimica"; nombre = "Industria Química" },
    @{ slug = "panaderia"; nombre = "Panadería" },
    @{ slug = "comercio"; nombre = "Comercio General" }
)

# Autonomicos + estatales destacados (15)
$autonomicos_estatales = @(
    @{ tipo = "autonomico"; sector = "hosteleria"; territorio = "Catalunya" },
    @{ tipo = "autonomico"; sector = "hosteleria"; territorio = "Galicia" },
    @{ tipo = "autonomico"; sector = "hosteleria"; territorio = "Andalucía" },
    @{ tipo = "autonomico"; sector = "limpieza"; territorio = "Catalunya" },
    @{ tipo = "autonomico"; sector = "ayuda a domicilio"; territorio = "Andalucía" },
    @{ tipo = "autonomico"; sector = "ayuda a domicilio"; territorio = "Catalunya" },
    @{ tipo = "autonomico"; sector = "ayuda a domicilio"; territorio = "Madrid" },
    @{ tipo = "autonomico"; sector = "ayuda a domicilio"; territorio = "País Vasco" },
    @{ tipo = "autonomico"; sector = "dependencia"; territorio = "Andalucía" },
    @{ tipo = "estatal"; sector = "construccion"; territorio = "Estatal" },
    @{ tipo = "estatal"; sector = "metal"; territorio = "Estatal" },
    @{ tipo = "estatal"; sector = "hosteleria"; territorio = "Estatal" },
    @{ tipo = "estatal"; sector = "seguridad privada"; territorio = "Estatal" },
    @{ tipo = "estatal"; sector = "comercio"; territorio = "Estatal" },
    @{ tipo = "estatal"; sector = "transporte mercancias"; territorio = "Estatal" }
)

# Empresas con convenio propio o de centro (50)
$empresas = @(
    @{ nombre = "Mercedes-Benz Vitoria"; sector = "metal"; centro = "Vitoria" },
    @{ nombre = "Ford España Almussafes"; sector = "metal"; centro = "Almussafes" },
    @{ nombre = "Volkswagen Navarra"; sector = "metal"; centro = "Pamplona" },
    @{ nombre = "Stellantis Vigo"; sector = "metal"; centro = "Vigo" },
    @{ nombre = "Stellantis Madrid"; sector = "metal"; centro = "Madrid" },
    @{ nombre = "Stellantis Zaragoza"; sector = "metal"; centro = "Zaragoza" },
    @{ nombre = "Iveco España"; sector = "metal"; centro = "Madrid/Valladolid" },
    @{ nombre = "Renault España"; sector = "metal"; centro = "Valladolid/Palencia" },
    @{ nombre = "Navantia Cádiz"; sector = "metal-naval"; centro = "Cádiz" },
    @{ nombre = "Navantia Ferrol"; sector = "metal-naval"; centro = "Ferrol" },
    @{ nombre = "Navantia Cartagena"; sector = "metal-naval"; centro = "Cartagena" },
    @{ nombre = "ArcelorMittal Asturias"; sector = "siderurgia"; centro = "Asturias" },
    @{ nombre = "Tubacex"; sector = "metal"; centro = "Álava" },
    @{ nombre = "Sidenor"; sector = "siderurgia"; centro = "Bizkaia" },
    @{ nombre = "Iberdrola"; sector = "energia"; centro = "Estatal" },
    @{ nombre = "Endesa"; sector = "energia"; centro = "Estatal" },
    @{ nombre = "Naturgy"; sector = "energia"; centro = "Estatal" },
    @{ nombre = "Repsol"; sector = "energia"; centro = "Estatal" },
    @{ nombre = "Cepsa"; sector = "energia"; centro = "Estatal" },
    @{ nombre = "Telefónica"; sector = "telecom"; centro = "Estatal" },
    @{ nombre = "Orange España"; sector = "telecom"; centro = "Estatal" },
    @{ nombre = "Vodafone España"; sector = "telecom"; centro = "Estatal" },
    @{ nombre = "MásMóvil"; sector = "telecom"; centro = "Estatal" },
    @{ nombre = "Santander"; sector = "banca"; centro = "Estatal" },
    @{ nombre = "BBVA"; sector = "banca"; centro = "Estatal" },
    @{ nombre = "CaixaBank"; sector = "banca"; centro = "Estatal" },
    @{ nombre = "Banco Sabadell"; sector = "banca"; centro = "Estatal" },
    @{ nombre = "Bankinter"; sector = "banca"; centro = "Estatal" },
    @{ nombre = "Iberia"; sector = "aviacion"; centro = "Estatal" },
    @{ nombre = "Vueling"; sector = "aviacion"; centro = "Estatal" },
    @{ nombre = "Air Europa"; sector = "aviacion"; centro = "Estatal" },
    @{ nombre = "AENA"; sector = "aviacion"; centro = "Estatal" },
    @{ nombre = "Mercadona"; sector = "retail"; centro = "Estatal" },
    @{ nombre = "Carrefour"; sector = "retail"; centro = "Estatal" },
    @{ nombre = "El Corte Inglés"; sector = "retail"; centro = "Estatal" },
    @{ nombre = "Decathlon España"; sector = "retail"; centro = "Estatal" },
    @{ nombre = "Amazon España"; sector = "logistica"; centro = "Estatal" },
    @{ nombre = "Inditex"; sector = "retail-textil"; centro = "Arteixo" },
    @{ nombre = "Campofrío"; sector = "alimentacion"; centro = "Estatal" },
    @{ nombre = "El Pozo"; sector = "alimentacion"; centro = "Murcia" },
    @{ nombre = "Mahou-San Miguel"; sector = "alimentacion"; centro = "Estatal" },
    @{ nombre = "Atento"; sector = "contact center"; centro = "Estatal" },
    @{ nombre = "Konecta"; sector = "contact center"; centro = "Estatal" },
    @{ nombre = "Adecco"; sector = "ETT"; centro = "Estatal" },
    @{ nombre = "Renfe"; sector = "ferrocarril"; centro = "Estatal" },
    @{ nombre = "Adif"; sector = "ferrocarril"; centro = "Estatal" },
    @{ nombre = "Correos"; sector = "postal"; centro = "Estatal" },
    @{ nombre = "Quirónsalud"; sector = "sanidad"; centro = "Estatal" },
    @{ nombre = "Sanitas"; sector = "sanidad"; centro = "Estatal" },
    @{ nombre = "Adeslas"; sector = "sanidad"; centro = "Estatal" }
)

# Generador de queries para sectorial
function New-QueriesSectorial {
    param($slug_sector, $nombre_sector, $territorio)
    $sectorLow = $nombre_sector.ToLower()
    $terLow = $territorio.ToLower()
    return @(
        "convenio $sectorLow $terLow",
        "convenio $sectorLow $terLow 2026",
        "tabla salarial $sectorLow $terLow"
    )
}

# Generador de queries para empresa
function New-QueriesEmpresa {
    param($nombre_empresa)
    $low = $nombre_empresa.ToLower()
    return @(
        "convenio $low",
        "convenio $low 2026",
        "tabla salarial $low"
    )
}

# Acumuladores
$rows = New-Object System.Collections.ArrayList
$queries = New-Object System.Collections.ArrayList
$id = 0

# 1) Sectores principales x 52 provincias
foreach ($s in $sectores_principales) {
    foreach ($p in $provincias) {
        $id++
        $nombre = "Convenio $($s.nombre) $p"
        $q = New-QueriesSectorial -slug_sector $s.slug -nombre_sector $s.nombre -territorio $p
        [void]$rows.Add([PSCustomObject]@{
            id = $id
            tipo = "sectorial-provincial"
            sector = $s.slug
            territorio = $p
            nombre_canonico = $nombre
            query_1 = $q[0]
            query_2 = $q[1]
            query_3 = $q[2]
            tengo_landing = ""
            notas = ""
        })
        $queries.AddRange($q)
    }
}

# 2) Sectores secundarios x 20 provincias relevantes
foreach ($s in $sectores_secundarios) {
    foreach ($p in $provincias_secundarias) {
        $id++
        $nombre = "Convenio $($s.nombre) $p"
        $q = New-QueriesSectorial -slug_sector $s.slug -nombre_sector $s.nombre -territorio $p
        [void]$rows.Add([PSCustomObject]@{
            id = $id
            tipo = "sectorial-provincial"
            sector = $s.slug
            territorio = $p
            nombre_canonico = $nombre
            query_1 = $q[0]
            query_2 = $q[1]
            query_3 = $q[2]
            tengo_landing = ""
            notas = ""
        })
        $queries.AddRange($q)
    }
}

# 3) Autonomicos + estatales destacados
foreach ($ae in $autonomicos_estatales) {
    $id++
    $nombreSectorBonito = (Get-Culture).TextInfo.ToTitleCase($ae.sector)
    if ($ae.tipo -eq "estatal") {
        $nombre = "Convenio Estatal $nombreSectorBonito"
    } else {
        $nombre = "Convenio $nombreSectorBonito $($ae.territorio)"
    }
    $q = @(
        "convenio $($ae.sector) $($ae.territorio.ToLower())",
        "convenio $($ae.sector) $($ae.territorio.ToLower()) 2026",
        "tabla salarial $($ae.sector) $($ae.territorio.ToLower())"
    )
    [void]$rows.Add([PSCustomObject]@{
        id = $id
        tipo = $ae.tipo
        sector = $ae.sector
        territorio = $ae.territorio
        nombre_canonico = $nombre
        query_1 = $q[0]
        query_2 = $q[1]
        query_3 = $q[2]
        tengo_landing = ""
        notas = ""
    })
    $queries.AddRange($q)
}

# 4) Empresas (50)
foreach ($e in $empresas) {
    $id++
    $nombre = "Convenio $($e.nombre)"
    $q = New-QueriesEmpresa -nombre_empresa $e.nombre
    [void]$rows.Add([PSCustomObject]@{
        id = $id
        tipo = "empresa"
        sector = $e.sector
        territorio = $e.centro
        nombre_canonico = $nombre
        query_1 = $q[0]
        query_2 = $q[1]
        query_3 = $q[2]
        tengo_landing = ""
        notas = ""
    })
    $queries.AddRange($q)
}

# Export CSV (UTF-8 con BOM para Excel-ES)
$outCsv = Join-Path $PSScriptRoot "convenios-candidatos.csv"
$rows | Export-Csv -Path $outCsv -NoTypeInformation -Encoding UTF8 -Delimiter ";"

# Export TXT plano de queries (1 por linea, deduplicado)
$outTxt = Join-Path $PSScriptRoot "queries-keyword-planner.txt"
$queriesUnicas = $queries | Select-Object -Unique
$queriesUnicas | Out-File -FilePath $outTxt -Encoding utf8

# Resumen
Write-Host "Filas generadas:       $($rows.Count)"
Write-Host "Queries totales:       $($queries.Count)"
Write-Host "Queries unicas:        $($queriesUnicas.Count)"
Write-Host ""
Write-Host "Desglose por tipo:"
$rows | Group-Object tipo | Sort-Object Count -Descending | ForEach-Object {
    Write-Host ("  {0,-25} {1}" -f $_.Name, $_.Count)
}
Write-Host ""
Write-Host "Salidas:"
Write-Host "  $outCsv"
Write-Host "  $outTxt"
