# Cruce de candidatos × volúmenes KP × landings publicadas → ranking-final.csv
#
# Inputs:
#   convenios-candidatos.csv       — 425 candidatos del universo (gen-candidatos.ps1)
#   raw-kp/kp-stats-batch-*.csv    — exports Google Ads Keyword Planner (UTF-16 LE, TAB)
#   (escanea repo root)            — landings HTML publicadas
#
# Output:
#   ranking-final.csv              — candidatos enriquecidos con vols + landing + score, ordenados desc
#
# Score = vol_total (suma de los 3 queries) ponderado por tipo:
#   sectorial-provincial: ×1.0
#   autonomico:           ×0.8  (audiencia más fragmentada)
#   estatal:              ×0.7  (más competencia SEO)
#   empresa:              ×0.6  (cola larga, intent específico)
#
# Uso: pwsh ./analisis/merge-kp.ps1

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$repoRoot = Split-Path -Parent $root

# ── 1. Leer KP exports ────────────────────────────────────────────────────
$kpFiles = Get-ChildItem (Join-Path $root "raw-kp") -Filter "kp-stats-batch-*.csv"
$volByQuery = @{}

foreach ($f in $kpFiles) {
  # KP exports: UTF-16 LE BOM, TAB-separated, cabecera en línea 3 (líneas 1-2 son metadatos)
  $lines = Get-Content $f.FullName -Encoding Unicode
  if ($lines.Count -lt 4) { continue }

  $header = $lines[2] -split "`t"
  $idxKeyword = [Array]::IndexOf($header, "Keyword")
  $idxAvg = [Array]::IndexOf($header, "Avg. monthly searches")
  $idxSeg = [Array]::IndexOf($header, "Segmentation")
  if ($idxKeyword -lt 0 -or $idxAvg -lt 0) {
    Write-Warning "Cabecera no reconocida en $($f.Name) — skip"
    continue
  }

  for ($i = 3; $i -lt $lines.Count; $i++) {
    $cols = $lines[$i] -split "`t"
    if ($cols.Count -le $idxAvg) { continue }

    # Filas agregadas ("Todo", "España", "Mobile devices", etc.) tienen keyword vacío y solo Segmentation
    $kw = $cols[$idxKeyword].Trim()
    if (-not $kw) { continue }

    # KP filtra por país; cada keyword aparece varias veces (Todo + España + dispositivos).
    # Queremos el agregado "Todo" o "España" (mismo valor). Tomamos el primero no vacío.
    $rawVol = $cols[$idxAvg].Trim()
    if (-not $rawVol -or $rawVol -eq "0") { continue }

    $vol = 0
    if ([double]::TryParse($rawVol, [ref]$vol)) {
      if (-not $volByQuery.ContainsKey($kw)) {
        $volByQuery[$kw] = [Math]::Round($vol)
      }
    }
  }
}

Write-Host "KP queries con volumen: $($volByQuery.Count)"

# ── 2. Escanear landings publicadas ───────────────────────────────────────
# Slug normalización: lowercase + remove tildes + remove non-alfanum
function ConvertTo-Slug {
  param([string]$s)
  $s = $s.ToLower()
  $s = $s -replace 'á', 'a' -replace 'é', 'e' -replace 'í', 'i' -replace 'ó', 'o' -replace 'ú', 'u' -replace 'ü', 'u' -replace 'ñ', 'n'
  $s = $s -replace '[^a-z0-9]', ''
  return $s
}

$landingFiles = Get-ChildItem $repoRoot -Filter "convenio-*.html" | ForEach-Object { $_.Name }
# También construccion-estatal-suelo-salarial.html (pilar Construcción estatal)
$landingFiles += "construccion-estatal-suelo-salarial.html"

function Has-Landing {
  param([string]$tipo, [string]$sector, [string]$territorio)

  $sectorSlug = ConvertTo-Slug $sector
  $terSlug = ConvertTo-Slug $territorio

  # Mapping de slugs alternativos para sectores compuestos
  $sectorMap = @{
    "transportemercancias" = "transporte"
    "transporte-mercancias" = "transporte"
    "oficinas-despachos" = "oficinas"
    "comercio-metal" = "comerciometal"
    "metal-naval" = "metalnaval"
    "retail-textil" = "retailtextil"
    "ayuda a domicilio" = "ayudadomicilio"
    "ayudaadomicilio" = "ayudadomicilio"
  }
  if ($sectorMap.ContainsKey($sectorSlug)) { $sectorSlug = $sectorMap[$sectorSlug] }

  if ($tipo -eq "sectorial-provincial") {
    $candidate = "convenio-$sectorSlug-$terSlug.html"
    return ($landingFiles -contains $candidate)
  }
  if ($tipo -eq "autonomico") {
    $candidate = "convenio-$sectorSlug-$terSlug.html"
    return ($landingFiles -contains $candidate)
  }
  if ($tipo -eq "estatal") {
    if ($sectorSlug -eq "hosteleria" -and ($landingFiles -contains "convenio-hosteleria.html")) { return $true }
    if ($sectorSlug -eq "construccion") { return ($landingFiles -contains "construccion-estatal-suelo-salarial.html") }
    $candidate = "convenio-$sectorSlug-estatal.html"
    return ($landingFiles -contains $candidate)
  }
  # Empresas: pipeline B, no landings aún
  return $false
}

# ── 3. Leer candidatos y enriquecer ───────────────────────────────────────
$candidatosPath = Join-Path $root "convenios-candidatos.csv"
$candidatos = Import-Csv -Path $candidatosPath -Delimiter ";" -Encoding UTF8

$pesoTipo = @{
  "sectorial-provincial" = 1.0
  "autonomico"           = 0.8
  "estatal"              = 0.7
  "empresa"              = 0.6
}

$enriched = foreach ($c in $candidatos) {
  $v1 = if ($volByQuery.ContainsKey($c.query_1)) { $volByQuery[$c.query_1] } else { 0 }
  $v2 = if ($volByQuery.ContainsKey($c.query_2)) { $volByQuery[$c.query_2] } else { 0 }
  $v3 = if ($volByQuery.ContainsKey($c.query_3)) { $volByQuery[$c.query_3] } else { 0 }
  $volTotal = $v1 + $v2 + $v3
  $tengoLanding = Has-Landing -tipo $c.tipo -sector $c.sector -territorio $c.territorio
  $peso = if ($pesoTipo.ContainsKey($c.tipo)) { $pesoTipo[$c.tipo] } else { 0.5 }
  $score = [Math]::Round($volTotal * $peso, 1)

  [PSCustomObject]@{
    id              = $c.id
    tipo            = $c.tipo
    sector          = $c.sector
    territorio      = $c.territorio
    nombre_canonico = $c.nombre_canonico
    query_1         = $c.query_1
    vol_q1          = $v1
    query_2         = $c.query_2
    vol_q2          = $v2
    query_3         = $c.query_3
    vol_q3          = $v3
    vol_total       = $volTotal
    tengo_landing   = if ($tengoLanding) { "si" } else { "no" }
    peso_tipo       = $peso
    score           = $score
    notas           = $c.notas
  }
}

# ── 4. Ordenar y exportar ─────────────────────────────────────────────────
$sorted = $enriched | Sort-Object -Property @{Expression="score"; Descending=$true}, @{Expression="vol_total"; Descending=$true}

$outPath = Join-Path $root "ranking-final.csv"
$sorted | Export-Csv -Path $outPath -NoTypeInformation -Encoding UTF8 -Delimiter ";"

# ── 5. Resumen ────────────────────────────────────────────────────────────
$totalCandidatos = $sorted.Count
$conVolumen = ($sorted | Where-Object { $_.vol_total -gt 0 }).Count
$volSum = ($sorted | Measure-Object -Property vol_total -Sum).Sum
$volSumSinLanding = ($sorted | Where-Object { $_.tengo_landing -eq "no" } | Measure-Object -Property vol_total -Sum).Sum
$conLanding = ($sorted | Where-Object { $_.tengo_landing -eq "si" }).Count

Write-Host ""
Write-Host "═══ RESUMEN ═══"
Write-Host "Total candidatos:           $totalCandidatos"
Write-Host "Con volumen KP > 0:         $conVolumen"
Write-Host "Sin volumen KP (cero o n/d): $($totalCandidatos - $conVolumen)"
Write-Host "Volumen total addressable:  $volSum búsquedas/mes"
Write-Host "Volumen aún por capturar:   $volSumSinLanding (sin landing)"
Write-Host "Landings ya publicadas:     $conLanding de $totalCandidatos"
Write-Host ""
Write-Host "Output: $outPath"
