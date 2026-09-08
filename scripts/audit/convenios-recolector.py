#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
scripts/audit/convenios-recolector.py — CAPA 0 de la auditoría de convenios.

Recolecta TODO lo que se puede medir por regla sobre las fichas convenio-*.html
y deja un JSON por ficha. Los agentes de juicio (capa 1) leen estos JSON y NO
vuelven a estimar nada que aquí ya esté contado.

Fuente del corpus: data/convenios/censo.json (nunca un glob del directorio).

Salida:
  analisis/auditoria-convenios/<fecha>/deterministas/<slug>.json
  analisis/auditoria-convenios/<fecha>/matriz-deterministas.csv
  analisis/auditoria-convenios/<fecha>/HARDFAILS-deterministas.md

Uso:
  python3 scripts/audit/convenios-recolector.py              # las 54
  python3 scripts/audit/convenios-recolector.py --piloto     # solo las 6 del piloto
  python3 scripts/audit/convenios-recolector.py --fecha 2026-08-20

Sin dependencias externas (stdlib). Determinista: dos pasadas sobre el mismo
árbol de trabajo dan exactamente el mismo resultado.
"""

import argparse
import csv
import json
import os
import re
import subprocess
import sys
import unicodedata
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CENSO = ROOT / "data" / "convenios" / "censo.json"
SITEMAP = ROOT / "sitemap.xml"
GSC_28D = ROOT / "analisis" / "gsc-paginas-28d.csv"
GENERADOR = ROOT / "scripts" / "generate-convenios.js"
OUT_BASE = ROOT / "analisis" / "auditoria-convenios"

SMI_2026_ANUAL = 17094.0          # € brutos/año, 14 pagas
SMI_OBSOLETOS = ["16.576", "16576", "15.876", "1.184"]   # SMI de años anteriores

PILOTO = [
    "convenio-tecnicos-espectaculos.html",
    "convenio-comercio-madrid.html",
    "convenio-limpieza-asturias.html",
    "convenio-metal-sevilla.html",
    "convenio-limpieza-zaragoza.html",
    "convenio-hosteleria-valencia.html",
]

# Términos que el lector no tiene por qué conocer (métrica 8.6)
JERGA = [
    "ultraactividad", "subrogación", "absorción y compensación", "prorrateo",
    "ámbito funcional", "comisión paritaria", "denuncia del convenio",
    "tácita reconducción", "salario de convenio", "devengo", "plus convenio",
]

# Conceptos que una ficha de convenio debería cubrir (métrica C3 / checklist)
CONCEPTOS = {
    "ambito_funcional": r"(?i)(ámbito funcional|a quién (se aplica|cubre)|te aplica|quién está cubierto)",
    "tablas": r"(?i)(tabla[s]? salarial|salario base|retribuci)",
    "pagas": r"(?i)(paga[s]? extra|gratificaci|mensualidades|\b1[2-8] pagas)",
    "jornada": r"(?i)(jornada (anual|semanal|de)|horas anuales|\bh(?:oras)? al año)",
    "vacaciones": r"(?i)vacaciones",
    "pluses": r"(?i)(plus|complemento)",
    "antiguedad": r"(?i)antig[üu]edad",
    "horas_extra": r"(?i)horas? extra",
    "nocturnidad": r"(?i)nocturnidad",
    "subrogacion": r"(?i)subrogaci",
    "vigencia": r"(?i)(vigencia|vigente hasta|ultraactividad|denunciad)",
    "paritaria": r"(?i)comisión paritaria",
    "fuente_oficial": r"(?i)(BO[PECBG]|BOCM|BOTHA|BOIB|DOG|REGCON|bopsevilla|boe\.es)",
    "que_hacer": r"(?i)(cobras menos|reclamar|reclamación|qué hacer si)",
}

BOLETINES = r"(BOE|BOCM|BOCYL|BOJA|BOPV|BOB|BOG|BOTHA|BOIB|BORM|BOA|BOC|BOR|DOGC|DOGV|DOG|BOP[A-Za-zÁ-ú ]*|BOPV)"
FUENTE_CERCA = re.compile(
    r"(?i)(\bart\.?\s*\d|artículo\s*\d|anexo\b|tabla\s+(salarial|del convenio)|" + BOLETINES + r"\b|resoluci[óo]n de|REGCON|código de convenio)"
)

RE_TAG = re.compile(r"<[^>]+>")
RE_SCRIPT = re.compile(r"(?is)<(script|style)\b.*?</\1>")
RE_COMMENT = re.compile(r"(?s)<!--.*?-->")
RE_CIFRA = re.compile(r"(\d{1,3}(?:\.\d{3})*(?:,\d+)?|\d+(?:,\d+)?)\s*(€|euros|%|horas|h\b|días|día)")
RE_LINK_INT = re.compile(r'(?is)<a\s[^>]*href="(/[a-z0-9\-]*\.html|/)(#[^"]*)?"[^>]*>(.*?)</a>')
RE_LINK_EXT = re.compile(r'(?is)<a\s[^>]*href="(https?://[^"]+)"[^>]*>(.*?)</a>')
RE_LDJSON = re.compile(r'(?is)<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>')
RE_HEADING = re.compile(r"(?is)<h([1-6])\b[^>]*>(.*?)</h\1>")
RE_P = re.compile(r"(?is)<p\b[^>]*>(.*?)</p>")

ANCHORS_GENERICOS = {"aquí", "aqui", "aquí.", "más info", "mas info", "ver más", "ver mas",
                     "leer más", "leer mas", "este enlace", "pincha aquí", "clic aquí",
                     "enlace", "link", "más", "ver"}

CATEGORIAS_MASC = re.compile(
    r"(?<![\w/])(Oficial(?:es)?|Peón(?:es)?|Peon(?:es)?|Jefe|Encargado|Ayudante|Camarero|Cocinero|"
    r"Limpiador|Dependiente|Mozo|Conductor|Auxiliar|Vendedor|Operario|Especialista|Portero|"
    r"Recepcionista|Vigilante|Repartidor|Almacenero|Cajero|Barman|Maitre|Botones|Aprendiz|Titulado|Licenciado)"
    r"(?![\w]*\s*/\s*a)(?![\w]*/a)(?!a\b)\b"
)

SINDICATOS = ["CCOO", "UGT", "ELA", "LAB", "USO", "CGT", "CIG", "SATSE", "CSIF"]

# Boletín que DEBE citar el sello según el territorio. Los forales no publican en el
# boletín autonómico: Bizkaia en el BOB, Gipuzkoa en el BOG, Álava en el BOTHA. El BOPV
# es autonómico y solo vale para normas autonómicas (p. ej. el acuerdo PRECO), nunca como
# fuente de un convenio provincial. Detectado el 24-ago: tres fichas de Bizkaia lo usaban.
BOLETIN_ESPERADO = {
    "bizkaia": ("BOB", ["BOPV", "BOE", "BOP "]),
    "gipuzkoa": ("BOG", ["BOPV", "BOE"]),
    "alava": ("BOTHA", ["BOPV", "BOE"]),
    "araba": ("BOTHA", ["BOPV", "BOE"]),
    "navarra": ("BON", ["BOE"]),
    "comunidad de madrid": ("BOCM", ["BOE"]),
    "madrid": ("BOCM", ["BOE"]),
}


# ─────────────────────────────────────────────────────────── utilidades

def strip_tags(s):
    s = RE_SCRIPT.sub(" ", s)
    s = RE_COMMENT.sub(" ", s)
    s = RE_TAG.sub(" ", s)
    s = (s.replace("&nbsp;", " ").replace("&amp;", "&").replace("&lt;", "<")
          .replace("&gt;", ">").replace("&quot;", '"').replace("&#39;", "'")
          .replace("&euro;", "€").replace("&middot;", "·").replace("&hellip;", "…")
          .replace("&mdash;", "—").replace("&ndash;", "–"))
    s = re.sub(r"&[a-zA-Z#0-9]+;", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def norm(s):
    s = unicodedata.normalize("NFD", s.lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9 ]+", " ", re.sub(r"\s+", " ", s)).strip()


def zonas_por_linea(lineas):
    """Devuelve, por índice de línea, el conjunto de zonas activas."""
    marcas = {"table": re.compile(r"(?i)<table\b"), "nav": re.compile(r"(?i)<nav\b"),
              "footer": re.compile(r"(?i)<footer\b"), "head": re.compile(r"(?i)<head\b"),
              "script": re.compile(r"(?i)<script\b"), "style": re.compile(r"(?i)<style\b")}
    cierres = {k: re.compile(r"(?i)</%s>" % k) for k in marcas}
    prof = {k: 0 for k in marcas}
    out = []
    for ln in lineas:
        activa = set()
        for k in marcas:
            abre = len(marcas[k].findall(ln))
            cierra = len(cierres[k].findall(ln))
            if prof[k] > 0 or abre > 0:
                activa.add(k)
            prof[k] = max(0, prof[k] + abre - cierra)
        out.append(activa)
    return out


def secciones_por_linea(lineas):
    """Mapa línea -> texto del último h2/h3 abierto (para agrupar cifras)."""
    actual = "(intro)"
    out = []
    for ln in lineas:
        m = re.search(r"(?is)<h[23]\b[^>]*>(.*?)</h[23]>", ln)
        if m:
            actual = strip_tags(m.group(1))[:120]
        out.append(actual)
    return out


def git_fecha(path):
    try:
        ts = subprocess.run(["git", "log", "-1", "--format=%at", "--", str(path)],
                            cwd=str(ROOT), capture_output=True, text=True, timeout=20).stdout.strip()
        if not ts:
            return None, None
        dt = datetime.fromtimestamp(int(ts), tz=timezone.utc)
        dias = (datetime.now(timezone.utc) - dt).days
        return dt.strftime("%Y-%m-%d"), dias
    except Exception:
        return None, None


def cargar_mapping_json():
    """slug de landing -> archivo JSON, leyendo CONVENIO_CONFIG del generador."""
    if not GENERADOR.exists():
        return {}, "generador ausente"
    js = (
        "const fs=require('fs');"
        "const s=fs.readFileSync(%r,'utf8');"
        "const m=s.match(/const CONVENIO_CONFIG = (\\{[\\s\\S]*?\\n\\});/);"
        "if(!m){console.log('{}');process.exit(0)}"
        "const CFG=eval('('+m[1]+')');"
        "const out={};for(const k of Object.keys(CFG)){const c=CFG[k];"
        "if(c.sectorSlug&&c.provinciaSlug){out['convenio-'+c.sectorSlug+'-'+c.provinciaSlug+'.html']=k}}"
        "console.log(JSON.stringify(out));"
    ) % str(GENERADOR)
    try:
        r = subprocess.run(["node", "-e", js], capture_output=True, text=True, timeout=30)
        return json.loads(r.stdout.strip() or "{}"), None
    except Exception as e:
        return {}, "no se pudo leer CONVENIO_CONFIG: %s" % e


def importes_de(obj, acc):
    """Extrae recursivamente importes numéricos de un JSON de convenio."""
    if isinstance(obj, dict):
        for v in obj.values():
            importes_de(v, acc)
    elif isinstance(obj, list):
        for v in obj:
            importes_de(v, acc)
    elif isinstance(obj, (int, float)) and not isinstance(obj, bool):
        if 3 <= float(obj) <= 200000:
            acc.add(round(float(obj), 2))
    elif isinstance(obj, str):
        for m in re.finditer(r"(\d{1,3}(?:\.\d{3})*,\d{2}|\d+,\d{2})", obj):
            acc.add(round(float(m.group(1).replace(".", "").replace(",", ".")), 2))
    return acc


def a_float(s):
    s = s.strip()
    try:
        if "," in s:
            return float(s.replace(".", "").replace(",", "."))
        if s.count(".") == 1 and len(s.split(".")[1]) == 3:
            return float(s.replace(".", ""))
        return float(s)
    except ValueError:
        return None


# ─────────────────────────────────────────────────────────── recolección

def analizar(archivo, censo_row, ctx):
    path = ROOT / archivo
    html = path.read_text(encoding="utf-8", errors="replace")
    lineas = html.split("\n")
    zonas = zonas_por_linea(lineas)
    secciones = secciones_por_linea(lineas)
    slug = archivo[:-5]

    d = {
        "slug": slug, "archivo": archivo,
        "sector": censo_row.get("sector"), "ambito": censo_row.get("ambito"),
        "censo": {k: censo_row.get(k) for k in
                  ("estado", "tipo", "indexable", "vigenciaFin", "confianza", "revisado", "fuenteEstado")},
        "bytes": len(html.encode("utf-8")),
    }

    # ── texto: cuerpo vs tabla vs cromo ────────────────────────────────
    txt_cuerpo, txt_tabla, txt_cromo = [], [], []
    for i, ln in enumerate(lineas):
        z = zonas[i]
        t = strip_tags(ln)
        if not t:
            continue
        if "head" in z or "script" in z or "style" in z:
            continue
        if "nav" in z or "footer" in z:
            txt_cromo.append(t)
        elif "table" in z:
            txt_tabla.append(t)
        else:
            txt_cuerpo.append(t)

    pal_cuerpo = len(" ".join(txt_cuerpo).split())
    pal_tabla = len(" ".join(txt_tabla).split())
    pal_cromo = len(" ".join(txt_cromo).split())
    total_contenido = pal_cuerpo + pal_tabla
    d["texto"] = {
        "palabras_prosa": pal_cuerpo,                       # 3.2
        "palabras_tabla": pal_tabla,
        "palabras_cromo": pal_cromo,
        "ratio_tabla": round(pal_tabla / total_contenido, 3) if total_contenido else 0.0,  # 3.3
        "caracteres_visibles": len(" ".join(txt_cuerpo + txt_tabla)),
    }

    # ── encabezados (7.5) ──────────────────────────────────────────────
    heads = []
    for m in RE_HEADING.finditer(html):
        nivel = int(m.group(1))
        linea = html[:m.start()].count("\n") + 1
        heads.append({"nivel": nivel, "texto": strip_tags(m.group(2))[:160], "linea": linea})
    saltos = []
    prev = None
    for h in heads:
        if prev is not None and h["nivel"] > prev + 1:
            saltos.append({"linea": h["linea"], "de": prev, "a": h["nivel"], "texto": h["texto"][:60]})
        prev = h["nivel"]
    d["headings"] = {
        "n": len(heads), "h1": sum(1 for h in heads if h["nivel"] == 1),
        "h2": sum(1 for h in heads if h["nivel"] == 2),
        "h3": sum(1 for h in heads if h["nivel"] == 3),
        "saltos_jerarquia": saltos,
        "lista": heads,
    }

    # ── cifras y su trazabilidad (5.1 / 5.11 / 4.4) ────────────────────
    cifras, huerfanas = [], []
    por_seccion = defaultdict(list)
    for i, ln in enumerate(lineas):
        z = zonas[i]
        if "head" in z or "script" in z or "style" in z or "nav" in z or "footer" in z:
            continue
        t = strip_tags(ln)
        for m in RE_CIFRA.finditer(t):
            por_seccion[secciones[i]].append((i + 1, m.group(0)))
    # una sección "tiene fuente" si en su rango aparece art./anexo/boletín
    fuente_seccion = defaultdict(bool)
    anio_seccion = defaultdict(bool)
    for i, ln in enumerate(lineas):
        z = zonas[i]
        if "head" in z or "script" in z:
            continue
        t = strip_tags(ln)
        if FUENTE_CERCA.search(t):
            fuente_seccion[secciones[i]] = True
        if re.search(r"\b20(2[0-9]|3[0-9])\b", t):
            anio_seccion[secciones[i]] = True
    for sec, items in por_seccion.items():
        for linea, txt in items:
            reg = {"seccion": sec, "linea": linea, "cifra": txt,
                   "fuente_en_seccion": bool(fuente_seccion[sec]),
                   "anio_en_seccion": bool(anio_seccion[sec])}
            cifras.append(reg)
            if not reg["fuente_en_seccion"]:
                huerfanas.append(reg)
    d["cifras"] = {
        "n": len(cifras),
        "huerfanas": len(huerfanas),
        "pct_huerfanas": round(len(huerfanas) / len(cifras), 3) if cifras else 0.0,
        "secciones_sin_fuente": sorted({h["seccion"] for h in huerfanas})[:20],
        "secciones_sin_anio": sorted({c["seccion"] for c in cifras if not c["anio_en_seccion"]})[:20],
        "muestra_huerfanas": huerfanas[:15],
    }

    # ── sello verificado (5.2) ─────────────────────────────────────────
    texto_plano = strip_tags(html)
    sello = re.search(r"(?i)verificad[oa]s?\s+(?:contra|con|el)\s+([^·\.<]{3,80}?)(?:\s*·|\s*\.|\s*$)", texto_plano)
    fecha_sello = re.search(r"(?i)verificad[oa][^.]{0,120}?(\d{1,2}\s*[-/ ]\s*(?:ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)[a-z]*\s*[-/ ]\s*20\d\d|\d{1,2}/\d{1,2}/20\d\d|20\d\d-\d{2}-\d{2})", texto_plano)
    d["sello"] = {
        "presente": bool(re.search(r"(?i)verificad", texto_plano)),
        "texto": sello.group(1).strip() if sello else None,
        "fecha": fecha_sello.group(1) if fecha_sello else None,
        "boletines_citados": sorted(set(re.findall(BOLETINES, texto_plano)))[:8],
    }

    # ── el sello cita el boletín que toca (5.2) ────────────────────────
    amb_key = (censo_row.get("ambito") or "").strip().lower()
    esperado = BOLETIN_ESPERADO.get(amb_key)
    d["sello"]["boletin_esperado"] = esperado[0] if esperado else None
    d["sello"]["boletin_incorrecto"] = None
    if esperado and d["sello"]["texto"] and censo_row.get("tipo") != "marco":
        txt_sello = d["sello"]["texto"]
        if esperado[0] not in txt_sello:
            for malo in esperado[1]:
                if malo.strip() in txt_sello:
                    d["sello"]["boletin_incorrecto"] = "cita «%s» donde corresponde %s" % (
                        malo.strip(), esperado[0])
                    break

    # ── léxico de estado jurídico (5.4) ────────────────────────────────
    estado = (censo_row.get("estado") or "").lower()
    decaido = "decaíd" in (censo_row.get("fuenteEstado", "") + censo_row.get("nota", "")).lower()
    lex = []
    if decaido:
        for pat, motivo in [(r"(?i)sigue aplic[áa]ndose", "dice que sigue aplicándose"),
                            (r"(?i)en ultraactividad", "lo llama ultraactividad"),
                            (r"(?i)congelad[oa][^.]{0,40}se aplica", "congelado y aplicándose"),
                            (r"(?i)\bvigente\b", "lo llama vigente")]:
            for m in re.finditer(pat, texto_plano):
                ventana = texto_plano[max(0, m.start()-70):m.end()+70]
                previo = texto_plano[max(0, m.start()-45):m.start()].lower()
                if motivo == "lo llama vigente" and (
                        re.search(r"(?i)\b(no|nunca|sin|dej[óo] de|ya no|hoy sin|non)\b", previo)
                        or re.search(r"(?i)(smi|salario m[íi]nimo|estatal|derecho|norma|ley)\s*$", previo.strip())):
                    continue                      # "no está vigente" / "el SMI vigente": uso correcto
                lex.append({"motivo": motivo, "extracto": ventana})
    d["estado_juridico"] = {
        "censo": estado, "es_decaido_segun_censo": decaido,
        "dice_ultraactividad": bool(re.search(r"(?i)ultraactividad", texto_plano)),
        "dice_decaido": bool(re.search(r"(?i)deca[íi]d", texto_plano)),
        "lexico_incoherente": lex[:10],
    }

    # ── SMI (5.5 / 12.2) ───────────────────────────────────────────────
    d["smi"] = {
        "menciona_smi": bool(re.search(r"(?i)\bSMI\b|salario mínimo interprofesional", texto_plano)),
        "cita_17094": bool(re.search(r"17\.?094", texto_plano)),
        "smi_obsoleto_citado": [s for s in SMI_OBSOLETOS if s in texto_plano],
        "smi_como_2026_erroneo": [
            texto_plano[max(0, m.start() - 90):m.end() + 40]
            for m in re.finditer(r"(?i)SMI\s*(?:de\s*)?2026[^.)]{0,25}(?:16\.576|15\.876|16576)|(?:16\.576|15\.876)[^.)]{0,25}SMI\s*(?:de\s*)?2026", texto_plano)
        ],
        "menciona_pagas": bool(re.search(r"(?i)\b1[2-8]\s*pagas|pagas extra", texto_plano)),
        "bajo_smi_mencionado": bool(re.search(r"(?i)(por debajo del SMI|bajo el SMI|inferior al SMI)", texto_plano)),
    }

    # ── enlaces (6.x) ──────────────────────────────────────────────────
    internos, externos = [], []
    for m in RE_LINK_INT.finditer(html):
        linea = html[:m.start()].count("\n") + 1
        z = zonas[min(linea - 1, len(zonas) - 1)]
        anchor = strip_tags(m.group(3))
        internos.append({
            "href": m.group(1), "ancla": m.group(2) or "", "anchor": anchor[:120], "linea": linea,
            "en_cuerpo": not ({"nav", "footer", "head"} & z),
            "generico": norm(anchor) in {norm(a) for a in ANCHORS_GENERICOS} or len(anchor.strip()) < 4,
        })
    for m in RE_LINK_EXT.finditer(html):
        linea = html[:m.start()].count("\n") + 1
        externos.append({"url": m.group(1), "anchor": strip_tags(m.group(2))[:100], "linea": linea})
    rotos = [l for l in internos if l["href"] != "/" and not (ROOT / l["href"].lstrip("/")).exists()]
    salientes_cuerpo = [l for l in internos if l["en_cuerpo"]]
    destinos = {l["href"] for l in internos}
    hermanas = {h for h in destinos if h.startswith("/convenio-")}
    mismo_sector = {h for h in hermanas if censo_row.get("sector") and censo_row["sector"] in h}
    kit = {h for h in destinos if "plantilla" in h or "reclamar" in h or "denunciar" in h or "pedir-banda" in h}
    d["enlaces"] = {
        "internos_total": len(internos),
        "internos_en_cuerpo": len(salientes_cuerpo),
        "destinos_unicos": len(destinos),
        "a_convenios": len(hermanas),
        "a_hermanas_mismo_sector": len(mismo_sector),
        "a_otro_sector_misma_provincia": sorted(hermanas - mismo_sector)[:10],
        "al_kit": sorted(kit),
        "anchors_genericos": [l for l in internos if l["generico"]][:10],
        "rotos": rotos,
        "con_ancla_hash": [l["href"] + l["ancla"] for l in internos if l["ancla"]][:10],
        "externos_total": len(externos),
        "externos_oficiales": [e["url"] for e in externos if re.search(
            r"(?i)(boe\.es|\.gob\.es|dipu|bop|juntadeandalucia|madrid\.org|bizkaia|gipuzkoa|araba|gencat|gva\.es|xunta|carm\.es|larioja|navarra|caib|gobiernodecanarias)", e["url"])][:20],
        "salida_del_cuerpo": len(salientes_cuerpo) > 0,
    }

    # ── head / SEO (2.4 · 2.5 · 2.8 · 2.9) ─────────────────────────────
    head = html[:html.find("</head>") + 7] if "</head>" in html else html[:6000]
    title = re.search(r"(?is)<title[^>]*>(.*?)</title>", head)
    meta = re.search(r'(?is)<meta\s+name="description"\s+content="(.*?)"', head)
    canon = re.search(r'(?is)<link\s+rel="canonical"\s+href="(.*?)"', head)
    robots = re.search(r'(?is)<meta\s+name="robots"\s+content="(.*?)"', head)
    og = {m.group(1): m.group(2) for m in re.finditer(r'(?is)<meta\s+property="og:([a-z:]+)"\s+content="(.*?)"', head)}
    t = strip_tags(title.group(1)) if title else ""
    m_ = strip_tags(meta.group(1)) if meta else ""
    d["seo"] = {
        "title": t, "title_len": len(t),
        "title_tiene_cifra": bool(re.search(r"\d", t)),
        "title_tiene_euro": "€" in t,
        "title_tiene_anio": bool(re.search(r"\b20\d\d\b", t)),
        "meta": m_, "meta_len": len(m_),
        "meta_tiene_cifra": bool(re.search(r"\d", m_)),
        "canonical": canon.group(1) if canon else None,
        "robots": robots.group(1) if robots else None,
        "noindex": bool(robots and "noindex" in robots.group(1).lower()),
        "og": {k: v[:120] for k, v in og.items()},
        "en_sitemap": ("/" + archivo) in ctx["sitemap"] or archivo in ctx["sitemap_raw"],
        "indexable_censo": censo_row.get("indexable"),
    }

    # ── schema (2.6) ───────────────────────────────────────────────────
    tipos, faqs, errores = Counter(), [], []
    for m in RE_LDJSON.finditer(html):
        raw = m.group(1).strip()
        try:
            data = json.loads(raw)
        except Exception as e:
            errores.append(str(e)[:120])
            continue
        for nodo in (data if isinstance(data, list) else [data]):
            if not isinstance(nodo, dict):
                continue
            tipos[nodo.get("@type", "?")] += 1
            if nodo.get("@type") == "FAQPage":
                for q in nodo.get("mainEntity", []):
                    resp = ""
                    a = q.get("acceptedAnswer") or {}
                    if isinstance(a, dict):
                        resp = strip_tags(a.get("text", ""))
                    faqs.append({"q": q.get("name", ""), "r_len": len(resp),
                                 "r_empieza_cifra": bool(re.match(r"^[^.]{0,40}?\d", resp)),
                                 "r": resp[:300], "_r_full": resp})
    for f in faqs:
        f.pop("_r_full_keep", None)
    d["schema"] = {
        "tipos": dict(tipos), "json_invalido": errores,
        "faq_n": len(faqs), "faq": faqs,
        "faq_sin_cifra": sum(1 for f in faqs if not f["r_empieza_cifra"]),
        "tiene_faqpage": "FAQPage" in tipos, "tiene_breadcrumb": "BreadcrumbList" in tipos,
        "tiene_article": "Article" in tipos,
    }

    # ── schema vs cuerpo: cifras que solo existen para las máquinas (4.5) ──
    cuerpo_visible = " ".join(txt_cuerpo + txt_tabla)
    imp_cuerpo = {m.group(1) for m in re.finditer(r"(\d{1,3}(?:\.\d{3})*,\d{2})\s*€", cuerpo_visible)}
    fugas = []
    for f in faqs:
        for m in re.finditer(r"(\d{1,3}(?:\.\d{3})*,\d{2})\s*€", f.get("_r_full", f["r"])):
            if m.group(1) not in imp_cuerpo:
                fugas.append({"cifra": m.group(1), "pregunta": f["q"][:90],
                              "contexto": f.get("_r_full", f["r"])[max(0, m.start() - 80):m.end() + 40]})
    d["schema_vs_cuerpo"] = {
        "importes_solo_en_schema": fugas[:15],
        "n": len(fugas),
        "_nota": "cifra que aparece en el JSON-LD y no en el texto visible: o está obsoleta en el schema, o el cuerpo la perdió. La leen los motores.",
    }

    # ── tablas: accesibilidad y móvil (11.1 · 7.1 · 7.2) ───────────────
    clases_verdes = {m.group(1) for m in re.finditer(
        r"(?:^|[\s,}])(?:[a-z]+)?\.([A-Za-z][\w-]*)[^{}]*\{[^}]*color\s*:\s*var\(--green\)", html)}
    tablas = []
    for m in re.finditer(r"(?is)<table\b.*?</table>", html):
        blk = m.group(0)
        linea = html[:m.start()].count("\n") + 1
        antes = html[max(0, m.start() - 300):m.start()]
        filas = len(re.findall(r"(?is)<tr\b", blk))
        cols = max([len(re.findall(r"(?is)<t[dh]\b", r)) for r in re.findall(r"(?is)<tr\b.*?</tr>", blk)] or [0])
        tablas.append({
            "linea": linea, "filas": filas, "columnas": cols,
            "th": len(re.findall(r"(?is)<th\b", blk)),
            "scope": len(re.findall(r"(?is)scope=", blk)),
            "caption": bool(re.search(r"(?is)<caption\b", blk)),
            "en_contenedor_scroll": bool(re.search(r'(?i)(tabla-wrap|overflow|scroll)', antes)),
            "verde_dentro": len(re.findall(r"var\(--green", blk)) + sum(
                1 for c in re.finditer(r'(?is)<t[dh]\b[^>]*class="([^"]*)"', blk)
                if clases_verdes & set(c.group(1).split())),
        })
    reflow = bool(re.search(r"(?is)@media[^{]*\{(?:[^@]{0,4000}?)t[rd]\s*\{[^}]*display\s*:\s*block", html))
    d["tablas"] = {
        "estrategia_movil": "reflow-a-tarjetas" if reflow else ("scroll" if any(t_["en_contenedor_scroll"] for t_ in tablas) else "ninguna"),
        "n": len(tablas),
        "sin_th": sum(1 for t_ in tablas if t_["th"] == 0),
        "sin_scope": sum(1 for t_ in tablas if t_["scope"] == 0),
        "sin_caption": sum(1 for t_ in tablas if not t_["caption"]),
        "sin_contenedor_scroll": sum(1 for t_ in tablas if not t_["en_contenedor_scroll"]),
        "verde_en_tablas": sum(t_["verde_dentro"] for t_ in tablas),
        "clases_verdes_css": sorted(clases_verdes),
        "max_columnas": max([t_["columnas"] for t_ in tablas] or [0]),
        "lista": tablas,
    }
    d["verde_total_pagina"] = len(re.findall(r"var\(--green", html))

    # ── párrafos densos (7.4) ──────────────────────────────────────────
    largos = []
    for m in RE_P.finditer(html):
        txt = strip_tags(m.group(1))
        n = len(txt.split())
        if n > 100:
            largos.append({"linea": html[:m.start()].count("\n") + 1, "palabras": n,
                           "tipo": "p", "inicio": txt[:120]})
    for m in re.finditer(r"(?is)<div\b[^>]*>((?:(?!<(?:div|table|p)\b).)*?)</div>", html):
        txt = strip_tags(m.group(1))
        n = len(txt.split())
        if n > 100:
            largos.append({"linea": html[:m.start()].count("\n") + 1, "palabras": n,
                           "tipo": "div", "inicio": txt[:120]})
    d["parrafos"] = {"n": len(RE_P.findall(html)),
                     "largos_100": sorted(largos, key=lambda x: x["linea"])}

    # ── jerga (8.6) ────────────────────────────────────────────────────
    jerga = {}
    low = texto_plano.lower()
    for term in JERGA:
        i = low.find(term)
        if i >= 0:
            ventana = texto_plano[i:i + 400]
            jerga[term] = {
                "primera_aparicion_char": i,
                "explicacion_cerca": bool(re.search(r"(?i)(es decir|significa|quiere decir|esto es|o sea|:\s|\()", ventana)),
                "extracto": ventana[:220],
            }
    d["jerga"] = jerga

    # ── norma de casa (8.7 · 8.8 · 8.10 · 7.3 · 7.7) ───────────────────
    cuerpo_txt = " ".join(txt_cuerpo + txt_tabla)
    masc = Counter(m.group(0) for m in CATEGORIAS_MASC.finditer(cuerpo_txt))
    d["norma"] = {
        "categorias_masc_candidatas": dict(masc.most_common(15)),
        "categorias_masc_total": sum(masc.values()),
        "sindicatos": {s: len(re.findall(r"\b%s\b" % s, texto_plano)) for s in SINDICATOS if re.search(r"\b%s\b" % s, texto_plano)},
        "dice_los_sindicatos": len(re.findall(r"(?i)los sindicatos", texto_plano)),
        "autoria_incorrecta": len(re.findall(r"(?i)Telmo\s+Unzueta", html)),
        "ibm_plex_mono": len(re.findall(r"(?i)IBM Plex Mono", html)),
        "footer_legal": {
            "privacidad": "/privacidad.html" in html,
            "aviso_legal": "/aviso-legal.html" in html,
            "contacto": "/contacto.html" in html,
        },
        "quien_audita": bool(re.search(r"(?i)qui[eé]n audita", texto_plano)),
        "fecha_actualizacion_visible": bool(re.search(r"(?i)(actualizad[oa]|última revisión|revisad[oa]) (el )?\d", texto_plano)),
    }

    # ── cobertura de conceptos (C3) ────────────────────────────────────
    d["conceptos"] = {k: bool(re.search(rx, cuerpo_txt)) for k, rx in CONCEPTOS.items()}
    d["conceptos_ausentes"] = [k for k, v in d["conceptos"].items() if not v]

    # ── respuesta directa arriba (1.1) ─────────────────────────────────
    primeros = " ".join(txt_cuerpo[:25])
    d["respuesta_directa"] = {
        "cifra_en_primeros_bloques": bool(re.search(r"\d{1,3}(?:\.\d{3})*(?:,\d{2})?\s*€", primeros)),
        "anio_en_primeros_bloques": bool(re.search(r"\b20\d\d\b", primeros)),
        "fuente_en_primeros_bloques": bool(FUENTE_CERCA.search(primeros)),
        "extracto": primeros[:400],
    }

    # ── HTML vs JSON (5.3) ─────────────────────────────────────────────
    jf = ctx["mapping"].get(archivo)
    if jf and (ROOT / "data" / "convenios" / jf).exists():
        jdata = json.loads((ROOT / "data" / "convenios" / jf).read_text(encoding="utf-8"))
        j_imp = importes_de(jdata, set())
        h_imp = set()
        for t_ in re.finditer(r"(?is)<table\b.*?</table>", html):
            for m in re.finditer(r"(\d{1,3}(?:\.\d{3})*,\d{2})", strip_tags(t_.group(0))):
                v = a_float(m.group(1))
                if v is not None:
                    h_imp.add(round(v, 2))
        d["html_vs_json"] = {
            "json": jf,
            "importes_json": len(j_imp), "importes_html_tablas": len(h_imp),
            "en_json_no_en_html": sorted(j_imp - h_imp)[:25],
            "en_html_no_en_json": sorted(h_imp - j_imp)[:25],
            "cobertura": round(len(j_imp & h_imp) / len(j_imp), 3) if j_imp else None,
            "_nota": "señal de divergencia, no emparejamiento fila a fila: revisar a mano si la cobertura es baja",
        }
    else:
        d["html_vs_json"] = {"json": None, "_nota": "ficha sin JSON asociado (mantenimiento manual) — métrica 9.4"}

    # ── operación (9.1 · 9.7 · 13.x) ───────────────────────────────────
    fecha_commit, dias = git_fecha(archivo)
    gsc = ctx["gsc"].get("https://salariojusto.es/" + archivo, {})
    d["operacion"] = {
        "ultimo_commit": fecha_commit, "dias_desde_commit": dias,
        "ventana_medicion_abierta": (dias is not None and dias < 21),
        "gsc_28d": gsc,
    }

    # ── frases del cuerpo (para las métricas de corpus) ────────────────
    frases = []
    for t_ in txt_cuerpo:
        for fr in re.split(r"(?<=[\.\!\?])\s+", t_):
            fr = fr.strip()
            if len(fr) >= 60:
                frases.append(norm(fr))
    d["_frases"] = frases
    return d


# ─────────────────────────────────────────────────────────── corpus

def metricas_corpus(fichas):
    """3.1 boilerplate · 3.4 masa exclusiva · 3.5 FAQ clonada · 3.6 titles gemelos · 12.x"""
    df = Counter()
    for d in fichas:
        for fr in set(d["_frases"]):
            df[fr] += 1
    prov = re.compile(r"(?i)\b(madrid|barcelona|valencia|sevilla|bizkaia|gipuzkoa|alava|araba|zaragoza|malaga|granada|cadiz|asturias|cantabria|navarra|murcia|alicante|tarragona|girona|baleares|tenerife|palmas|pontevedra|coruna|valladolid|maresme|catalunya|bilbao|vizcaya)\b")
    faq_df = Counter()
    for d in fichas:
        for f in d["schema"]["faq"]:
            faq_df[prov.sub("X", norm(f["q"]))] += 1
    titles = {d["slug"]: norm(d["seo"]["title"]) for d in fichas}

    for d in fichas:
        fr = d["_frases"]
        compartidas = [f for f in fr if df[f] >= 2]
        exclusivas = [f for f in fr if df[f] == 1]
        d["corpus"] = {
            "frases_cuerpo": len(fr),
            "boilerplate_ratio": round(len(compartidas) / len(fr), 3) if fr else None,   # 3.1
            "frases_exclusivas": len(exclusivas),                                        # 3.4
            "palabras_exclusivas": sum(len(f.split()) for f in exclusivas),
            "frases_compartidas_n": len(compartidas),
            "frases_compartidas_unicas_n": len(set(compartidas)),
            "frases_compartidas_top": [f[:110] for f in sorted(set(compartidas), key=lambda x: -df[x])[:8]],
            "_nota_top": "«top» es una MUESTRA de las %d compartidas, no la lista completa" % len(set(compartidas)),
        }
        clonadas = [f["q"] for f in d["schema"]["faq"] if faq_df[prov.sub("X", norm(f["q"]))] >= 2]
        d["corpus"]["faq_clonadas"] = len(clonadas)                                       # 3.5
        d["corpus"]["faq_clonadas_lista"] = clonadas[:8]
        d["corpus"]["faq_total"] = d["schema"]["faq_n"]
        mio = set(titles[d["slug"]].split())
        gem = []
        for otro, t in titles.items():
            if otro == d["slug"] or not mio:
                continue
            j = len(mio & set(t.split())) / len(mio | set(t.split()))
            if j >= 0.7:
                gem.append({"slug": otro, "jaccard": round(j, 2)})
        d["corpus"]["titles_gemelos"] = sorted(gem, key=lambda x: -x["jaccard"])[:5]      # 3.6

    # 12.2 SMI unificado
    obsoletos = {d["slug"]: d["smi"]["smi_obsoleto_citado"] for d in fichas if d["smi"]["smi_obsoleto_citado"]}
    # enlaces entrantes (6.2) sobre TODO el sitio
    entrantes = defaultdict(list)
    for h in sorted(ROOT.glob("*.html")):
        if h.name.startswith("google") or h.name.startswith("_preview"):
            continue
        txt = h.read_text(encoding="utf-8", errors="replace")
        for m in RE_LINK_INT.finditer(txt):
            entrantes[m.group(1).lstrip("/")].append({"desde": h.name, "anchor": strip_tags(m.group(3))[:80]})
    for d in fichas:
        ent = entrantes.get(d["archivo"], [])
        d["enlaces"]["entrantes_n"] = len(ent)
        d["enlaces"]["entrantes_desde"] = sorted({e["desde"] for e in ent})[:20]
        d["enlaces"]["entrantes_anchors"] = [e["anchor"] for e in ent][:10]
    return {"smi_obsoleto": obsoletos}


# ─────────────────────────────────────────────────────────── hard-fails

def hardfails(d):
    """Solo los deterministas. Los de juicio (5.7, 8.11, 12.1) los marca la capa 1-2."""
    hf = []
    def add(cod, msg):
        hf.append({"codigo": cod, "detalle": msg})

    if d["cifras"]["pct_huerfanas"] > 0.35:
        add("5.1", "%.0f%% de las cifras están en secciones sin referencia a artículo/anexo/boletín (%d de %d)"
            % (d["cifras"]["pct_huerfanas"] * 100, d["cifras"]["huerfanas"], d["cifras"]["n"]))
    if not d["sello"]["presente"]:
        add("5.2", "sin sello 'Verificado contra …'")
    elif d["sello"]["boletin_incorrecto"]:
        add("5.2", "el sello %s — «%s»" % (d["sello"]["boletin_incorrecto"], (d["sello"]["texto"] or "")[:70]))
    lex = d["estado_juridico"]["lexico_incoherente"]
    duros = [x for x in lex if x["motivo"] != "lo llama vigente"]
    blandos = [x for x in lex if x["motivo"] == "lo llama vigente"]
    if duros:
        add("5.4", "convenio DECAÍDO según censo y el texto %s" % "; ".join(sorted({x["motivo"] for x in duros})))
    if blandos:
        add("5.4*", "%d uso(s) de 'vigente' en ficha de convenio decaído — comprobar a qué convenio se refieren"
            % len(blandos))
    if d["smi"]["smi_como_2026_erroneo"]:
        add("12.2", "presenta un SMI obsoleto COMO SI FUERA el de 2026 (real: 17.094 €) — %s"
            % d["smi"]["smi_como_2026_erroneo"][0][:160])
    elif d["smi"]["smi_obsoleto_citado"]:
        add("12.2*", "cita cifras de SMI de años anteriores: %s (verificar si es referencia histórica legítima)"
            % ", ".join(d["smi"]["smi_obsoleto_citado"]))
    if not d["norma"]["quien_audita"]:
        add("2.2", "sin bloque de responsable identificable ('Quién audita esto')")
    if not d["schema"]["tiene_faqpage"] or not d["schema"]["tiene_breadcrumb"] or d["schema"]["json_invalido"]:
        add("2.6", "schema incompleto o inválido: %s%s" % (d["schema"]["tipos"],
            " · JSON inválido" if d["schema"]["json_invalido"] else ""))
    if not d["seo"]["canonical"]:
        add("2.8", "sin canonical")
    if d["seo"]["noindex"] != (d["censo"]["indexable"] is False):
        add("2.8", "noindex=%s contradice censo.indexable=%s" % (d["seo"]["noindex"], d["censo"]["indexable"]))
    if d["censo"]["indexable"] is not False and not d["seo"]["en_sitemap"]:
        add("2.9", "indexable según censo pero fuera del sitemap")
    if d["enlaces"]["rotos"]:
        add("6.7", "%d enlace(s) interno(s) roto(s): %s" % (len(d["enlaces"]["rotos"]),
            ", ".join(r["href"] for r in d["enlaces"]["rotos"][:5])))
    if d["tablas"]["sin_contenedor_scroll"] and d["tablas"]["estrategia_movil"] == "ninguna":
        add("7.1", "%d tabla(s) sin contenedor con scroll y sin reflow a tarjetas → desborda en móvil"
            % d["tablas"]["sin_contenedor_scroll"])
    if d["norma"]["ibm_plex_mono"]:
        add("7.3", "IBM Plex Mono presente (%d)" % d["norma"]["ibm_plex_mono"])
    fl = d["norma"]["footer_legal"]
    if not all(fl.values()):
        add("7.7", "footer legal incompleto: %s" % ", ".join(k for k, v in fl.items() if not v))
    if d["norma"]["autoria_incorrecta"]:
        add("8.10", "aparece 'Telmo Unzueta' (%d)" % d["norma"]["autoria_incorrecta"])
    if d["schema_vs_cuerpo"]["n"]:
        ej = d["schema_vs_cuerpo"]["importes_solo_en_schema"][0]
        add("4.5*", "%d cifra(s) en el JSON-LD que no están en el texto visible (p. ej. %s € en «%s»)"
            % (d["schema_vs_cuerpo"]["n"], ej["cifra"], ej["pregunta"][:60]))
    if d["tablas"]["sin_caption"] or d["tablas"]["sin_scope"]:
        add("11.1*", "tablas no audibles: %d sin scope, %d sin caption (de %d)"
            % (d["tablas"]["sin_scope"], d["tablas"]["sin_caption"], d["tablas"]["n"]))
    if d["tablas"]["verde_en_tablas"]:
        add("7.2*", "%d celda(s) de tabla en verde (norma: salarios en tinta neutra) — clases: %s"
            % (d["tablas"]["verde_en_tablas"], ", ".join(d["tablas"]["clases_verdes_css"][:5])))
    if d["headings"]["saltos_jerarquia"]:
        add("7.5*", "%d salto(s) de nivel en los encabezados" % len(d["headings"]["saltos_jerarquia"]))
    if d["parrafos"]["largos_100"]:
        add("7.4*", "%d bloque(s) de más de 100 palabras" % len(d["parrafos"]["largos_100"]))
    if d["headings"]["h1"] != 1:
        add("7.5*", "h1 = %d (debería ser 1)" % d["headings"]["h1"])
    return hf


# ─────────────────────────────────────────────────────────── main

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--piloto", action="store_true", help="solo las 6 fichas de calibración")
    ap.add_argument("--fecha", default=datetime.now().strftime("%Y-%m-%d"))
    args = ap.parse_args()

    censo = json.loads(CENSO.read_text(encoding="utf-8"))
    fichas_censo = censo["fichas"]   # SIEMPRE las 54: el corpus no se mide contra un subconjunto

    sitemap_raw = SITEMAP.read_text(encoding="utf-8") if SITEMAP.exists() else ""
    ctx = {
        "sitemap": set(re.findall(r"<loc>https?://[^<]*?(/[a-z0-9\-]*\.html)</loc>", sitemap_raw)),
        "sitemap_raw": sitemap_raw,
        "gsc": {},
        "mapping": {},
    }
    ctx["mapping"], mapping_err = cargar_mapping_json()
    if GSC_28D.exists():
        with GSC_28D.open(encoding="utf-8-sig") as fh:
            for row in csv.DictReader(fh):
                url = (row.get("Páginas principales") or "").strip()
                if url:
                    ctx["gsc"][url] = {"clics": row.get("Clics"), "impresiones": row.get("Impresiones"),
                                       "ctr": row.get("CTR"), "posicion": row.get("Posición")}

    out_dir = OUT_BASE / args.fecha / "deterministas"
    out_dir.mkdir(parents=True, exist_ok=True)

    fichas, faltan = [], []
    for row in fichas_censo:
        p = ROOT / row["archivo"]
        if not p.exists():
            faltan.append(row["archivo"])
            continue
        fichas.append(analizar(row["archivo"], row, ctx))

    corpus = metricas_corpus(fichas)

    # El piloto filtra la SALIDA, nunca el cálculo del corpus.
    if args.piloto:
        fichas = [d for d in fichas if d["archivo"] in PILOTO]

    total_hf = 0
    total_av = 0
    for d in fichas:
        todos = hardfails(d)
        d["hardfails_deterministas"] = [h for h in todos if not h["codigo"].endswith("*")]
        d["avisos_deterministas"] = [h for h in todos if h["codigo"].endswith("*")]
        total_hf += len(d["hardfails_deterministas"])
        total_av += len(d["avisos_deterministas"])
        d.pop("_frases", None)
        (out_dir / (d["slug"] + ".json")).write_text(
            json.dumps(d, ensure_ascii=False, indent=1), encoding="utf-8")

    # matriz
    cols = ["slug", "sector", "estado", "palabras_prosa", "ratio_tabla", "boilerplate_ratio",
            "frases_exclusivas", "cifras_n", "pct_huerfanas", "faq_n", "faq_clonadas",
            "entrantes_n", "internos_cuerpo", "a_hermanas", "al_kit", "tablas_n", "sin_th",
            "verde_en_tablas", "parrafos_largos", "conceptos_ausentes", "dias_commit",
            "gsc_clics", "gsc_ctr", "hardfails"]
    mpath = OUT_BASE / args.fecha / "matriz-deterministas.csv"
    with mpath.open("w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh)
        w.writerow(cols)
        for d in sorted(fichas, key=lambda x: x["slug"]):
            w.writerow([
                d["slug"], d["sector"], d["censo"]["estado"], d["texto"]["palabras_prosa"],
                d["texto"]["ratio_tabla"], d["corpus"]["boilerplate_ratio"], d["corpus"]["frases_exclusivas"],
                d["cifras"]["n"], d["cifras"]["pct_huerfanas"], d["schema"]["faq_n"], d["corpus"]["faq_clonadas"],
                d["enlaces"]["entrantes_n"], d["enlaces"]["internos_en_cuerpo"], d["enlaces"]["a_hermanas_mismo_sector"],
                len(d["enlaces"]["al_kit"]), d["tablas"]["n"], d["tablas"]["sin_th"], d["tablas"]["verde_en_tablas"],
                len(d["parrafos"]["largos_100"]), len(d["conceptos_ausentes"]), d["operacion"]["dias_desde_commit"],
                d["operacion"]["gsc_28d"].get("clics", ""), d["operacion"]["gsc_28d"].get("ctr", ""),
                len(d["hardfails_deterministas"]),
            ])

    # informe de hard-fails
    lines = ["# Hard-fails deterministas · %s" % args.fecha, "",
             "Fichas analizadas: **%d**%s" % (len(fichas), " (piloto)" if args.piloto else ""),
             "Hard-fails deterministas: **%d** · avisos a verificar a mano: **%d**" % (total_hf, total_av), "",
             "Un código con `*` es un aviso, no un bloqueo: la regla no puede distinguir sola el caso",
             "legítimo del defecto, y la decisión es humana.", ""]
    if mapping_err:
        lines += ["> Aviso: %s → el cruce HTML↔JSON (5.3) no se ha podido hacer." % mapping_err, ""]
    if faltan:
        lines += ["> Aviso: en el censo pero sin archivo: %s" % ", ".join(faltan), ""]
    por_cod = Counter()
    for d in fichas:
        for h in d["hardfails_deterministas"] + d["avisos_deterministas"]:
            por_cod[h["codigo"]] += 1
    if por_cod:
        lines += ["## Por código", "", "| código | fichas |", "|---|---|"]
        lines += ["| %s | %d |" % (c, n) for c, n in por_cod.most_common()]
        lines.append("")
    lines += ["## Por ficha", ""]
    for d in sorted(fichas, key=lambda x: (-len(x["hardfails_deterministas"]), -len(x["avisos_deterministas"]))):
        hf, av = d["hardfails_deterministas"], d["avisos_deterministas"]
        if not hf and not av:
            continue
        lines.append("### %s — %d hard-fail(s)%s" % (d["slug"], len(hf), ", %d aviso(s)" % len(av) if av else ""))
        lines += ["- **%s** · %s" % (h["codigo"], h["detalle"]) for h in hf]
        lines += ["- *%s* · %s" % (h["codigo"], h["detalle"]) for h in av]
        lines.append("")
    limpias = [d["slug"] for d in fichas if not d["hardfails_deterministas"]]
    if limpias:
        lines += ["## Sin hard-fails deterministas", "", ", ".join(limpias), ""]
    (OUT_BASE / args.fecha / "HARDFAILS-deterministas.md").write_text("\n".join(lines), encoding="utf-8")

    print("Fichas: %d · hard-fails: %d · avisos: %d" % (len(fichas), total_hf, total_av))
    print("→ %s" % out_dir)
    print("→ %s" % mpath)
    print("→ %s" % (OUT_BASE / args.fecha / "HARDFAILS-deterministas.md"))
    if mapping_err:
        print("aviso: %s" % mapping_err)


if __name__ == "__main__":
    sys.exit(main())
