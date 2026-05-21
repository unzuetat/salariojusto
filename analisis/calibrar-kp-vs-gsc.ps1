# Calibracion KP vs GSC real
# Cruza cada URL de gsc-paginas con su entrada en ranking-final y reporta
# ratio entre vol KP (buckets) e impresiones GSC mensuales reales.

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot

function ConvertTo-Slug {
  param([string]$s)
  $s = $s.ToLower()
  $s = $s -replace 'á', 'a' -replace 'é', 'e' -replace 'í', 'i' -replace 'ó', 'o' -replace 'ú', 'u' -replace 'ü', 'u' -replace 'ñ', 'n'
  $s = $s -replace '[^a-z0-9]', ''
  return $s
}

$gsc = Import-Csv (Join-Path $root "gsc-paginas.csv") -Delimiter ";"
$ranking = Import-Csv (Join-Path $root "ranking-final.csv") -Delimiter ";"

# Indexar ranking por (sectorSlug, terSlug)
$rankIdx = @{}
foreach ($r in $ranking) {
  $key = "$(ConvertTo-Slug $r.sector)|$(ConvertTo-Slug $r.territorio)"
  if (-not $rankIdx.ContainsKey($key)) {
    $rankIdx[$key] = $r
  }
}

# Mapping slug compuesto en URL -> (sector, ter)
function Parse-LandingUrl {
  param([string]$url)
  $name = ($url -replace 'https?://[^/]+/', '') -replace '\.html$', ''
  if ($name -notlike 'convenio-*') { return $null }
  $rest = $name -replace '^convenio-', ''
  # Casos especiales: edificios-locales (pilar sin territorio), oficinas-valencia, etc.
  if ($rest -eq 'limpieza-edificios-locales') { return @{ sector = 'limpieza'; ter = 'estatal' } }
  if ($rest -eq 'hosteleria') { return @{ sector = 'hosteleria'; ter = 'estatal' } }
  # Split por ultimo guion: el ultimo token es el territorio, lo demas es sector
  $parts = $rest -split '-'
  if ($parts.Count -lt 2) { return $null }
  $ter = $parts[-1]
  $sector = ($parts[0..($parts.Count-2)]) -join ''
  return @{ sector = $sector; ter = $ter }
}

$rows = foreach ($g in $gsc) {
  $parsed = Parse-LandingUrl $g.url
  if (-not $parsed) { continue }
  $key = "$($parsed.sector)|$($parsed.ter)"
  $rankMatch = $rankIdx[$key]
  $impsMonthly = [Math]::Round([double]$g.impressions_3m / 3)
  $clicksMonthly = [Math]::Round([double]$g.clicks_3m / 3)

  if ($rankMatch) {
    $volKp = [int]$rankMatch.vol_total
    $ratio = if ($volKp -gt 0) { [Math]::Round($impsMonthly / $volKp, 2) } else { 'n/a' }
    [PSCustomObject]@{
      url = $g.url -replace 'https://salariojusto.es/', ''
      sector = $rankMatch.sector
      territorio = $rankMatch.territorio
      gsc_imps_mes = $impsMonthly
      gsc_clicks_mes = $clicksMonthly
      gsc_ctr = $g.ctr
      gsc_pos = $g.avg_position
      kp_vol = $volKp
      ratio_imps_vs_kp = $ratio
    }
  } else {
    [PSCustomObject]@{
      url = $g.url -replace 'https://salariojusto.es/', ''
      sector = $parsed.sector
      territorio = $parsed.ter
      gsc_imps_mes = $impsMonthly
      gsc_clicks_mes = $clicksMonthly
      gsc_ctr = $g.ctr
      gsc_pos = $g.avg_position
      kp_vol = 'NO MATCH'
      ratio_imps_vs_kp = 'n/a'
    }
  }
}

$rows | Sort-Object @{Expression={[int]$_.gsc_imps_mes}; Descending=$true} | Format-Table -AutoSize
Write-Host ""
Write-Host "── Ratios por bucket KP ──"
$buckets = @{
  "100"     = @()
  "500"     = @()
  "1000"    = @()
  "5000"    = @()
  "10000"   = @()
  "50000"   = @()
  "100000"  = @()
}
foreach ($r in $rows) {
  if ($r.kp_vol -eq 'NO MATCH') { continue }
  $v = [int]$r.kp_vol
  $matched = $null
  foreach ($b in @(100,500,1000,5000,10000,50000,100000)) {
    if ($v -le $b) { $matched = $b; break }
  }
  if ($null -ne $matched -and $r.ratio_imps_vs_kp -ne 'n/a') {
    $buckets["$matched"] += [double]$r.ratio_imps_vs_kp
  }
}
foreach ($b in @("100","500","1000","5000","10000","50000","100000")) {
  $vals = $buckets[$b]
  if ($vals.Count -gt 0) {
    $avg = [Math]::Round(($vals | Measure-Object -Average).Average, 2)
    Write-Host ("  KP <= {0,-7} | n={1,-3} | ratio promedio imps/KP = {2}" -f $b, $vals.Count, $avg)
  }
}
