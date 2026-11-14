# -*- coding: utf-8 -*-
"""Build A4 large-print student sheets and self-assessment grids."""
import re
import subprocess
from pathlib import Path
from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "downloads"
NAVY = RGBColor(0x1A, 0x36, 0x58)
FOOT = "© 2026 Madame Carole Paoli Pompougnac · CC BY-NC-SA 4.0"
TITLE = "Head off to Australia"
LEVEL = "Terminale bac pro et Terminale générale et technologique"
SLUGS = [f"s{i}" for i in range(1, 14)] + ["assessment"]


def set_run(run, size=16, bold=False, color=NAVY, italic=False):
    run.bold = bold
    run.italic = italic
    run.font.size = Pt(size)
    run.font.name = "Calibri"
    run.font.color.rgb = color
    rPr = run._element.get_or_add_rPr()
    rFonts = rPr.get_or_add_rFonts()
    rFonts.set(qn("w:ascii"), "Calibri")
    rFonts.set(qn("w:hAnsi"), "Calibri")
    rFonts.set(qn("w:eastAsia"), "Calibri")
    rFonts.set(qn("w:cs"), "Calibri")


def setup(doc):
    section = doc.sections[0]
    section.page_width = Cm(21.0)
    section.page_height = Cm(29.7)
    section.left_margin = Cm(1.8)
    section.right_margin = Cm(1.8)
    section.top_margin = Cm(1.6)
    section.bottom_margin = Cm(2.0)
    footer = section.footer
    footer.is_linked_to_previous = False
    p = footer.paragraphs[0] if footer.paragraphs else footer.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run(FOOT)
    set_run(run, size=11, color=NAVY)
    style = doc.styles["Normal"]
    style.font.name = "Calibri"
    style.font.size = Pt(16)
    style.font.color.rgb = RGBColor(0x1A, 0x1A, 0x1A)


def heading(doc, text, size=22):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(6)
    run = p.add_run(text)
    set_run(run, size=size, bold=True, color=NAVY)
    return p


def para(doc, text, size=16, bold=False, italic=False):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(8)
    p.paragraph_format.line_spacing = 1.3
    run = p.add_run(text)
    set_run(run, size=size, bold=bold, italic=italic, color=RGBColor(0x1A, 0x1A, 0x1A) if not bold else NAVY)
    return p


def lines(doc, n=8):
    for _ in range(n):
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(2)
        run = p.add_run("_" * 72)
        set_run(run, size=16, color=RGBColor(0x66, 0x66, 0x66))


def strip_html(s):
    s = re.sub(r"<br\s*/?>", "\n", s, flags=re.I)
    s = re.sub(r"</(p|li|h[1-6]|tr|div)>", "\n", s, flags=re.I)
    s = re.sub(r"<li[^>]*>", "• ", s, flags=re.I)
    s = re.sub(r"<[^>]+>", "", s)
    s = s.replace("&nbsp;", " ").replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")
    s = s.replace("&#39;", "'").replace("&quot;", '"')
    s = re.sub(r"[ \t]+\n", "\n", s)
    s = re.sub(r"\n{3,}", "\n\n", s)
    return s.strip()


def extract(slug):
    html = (ROOT / slug / "index.html").read_text(encoding="utf-8")
    h1 = re.search(r"<h1>(.*?)</h1>", html, re.S)
    title = strip_html(h1.group(1) if h1 else slug)
    stud = re.search(r'<section class="box-stud"[^>]*>(.*?)</section>', html, re.S)
    items = []
    if stud:
        items = [strip_html(x) for x in re.findall(r"<li>(.*?)</li>", stud.group(1), re.S)]
    m = re.search(r'<section class="panel[^"]*" id="eleves"[^>]*>', html)
    start = m.end() if m else -1
    end = html.find('<section class="box-stud"', start) if start != -1 else -1
    if start != -1 and end != -1:
        chunk = html[start:end]
    else:
        chunk = ""
    chunk = re.sub(r'<p class="dl[\s\S]*?</p>', "", chunk)
    chunk = re.sub(r'<p class="dl-label">[\s\S]*?</p>', "", chunk)
    chunk = re.sub(r"<h2[^>]*>.*?</h2>", "", chunk, flags=re.S)
    rest_txt = strip_html(chunk)
    corrige = re.search(r'id="corrige"[^>]*>(.*?)id="secours"', html, re.S)
    cblock = corrige.group(1) if corrige else ""
    criteria = [strip_html(c) for c in re.findall(r"<tr><th>\d+</th><td>(.*?)</td>", cblock)]
    uniq = []
    for c in criteria:
        if c not in uniq:
            uniq.append(c)
    homework = re.search(r'<section class="homework"[^>]*>(.*?)</section>', html, re.S)
    hw = strip_html(homework.group(1)) if homework else ""
    return title, items, rest_txt, uniq, hw


def build_fiche(slug, title, items, rest, hw):
    doc = Document()
    setup(doc)
    heading(doc, TITLE, 22)
    para(doc, LEVEL, 13, italic=True)
    label = "Évaluation" if slug == "assessment" else "Séance " + slug[1:]
    heading(doc, f"{label} · {title}", 18)
    para(doc, "Nom : ______________________    Classe : ________    Date : ________", 14)
    if rest:
        # keep it short: first 1200 chars of leftover, but skip pure image remnants
        text = re.sub(r"\n+", "\n", rest).strip()
        if len(text) > 1200:
            text = text[:1200].rsplit(" ", 1)[0] + "..."
        if text:
            para(doc, text, 14)
    heading(doc, "Your work", 16)
    if items:
        for it in items:
            p = doc.add_paragraph(style="List Number")
            p.clear()
            run = p.add_run(it)
            set_run(run, size=16)
            p.paragraph_format.space_after = Pt(6)
    lines(doc, 8)
    if hw:
        heading(doc, "Homework", 16)
        para(doc, hw, 16)
        lines(doc, 5)
    path = OUT / f"{slug}-fiche-eleve.docx"
    doc.save(path)
    return path


def build_grille(slug, title, criteria):
    doc = Document()
    setup(doc)
    heading(doc, TITLE, 22)
    para(doc, LEVEL, 13, italic=True)
    label = "Évaluation" if slug == "assessment" else "Séance " + slug[1:]
    heading(doc, f"{label} · Grille élève · {title}", 18)
    para(doc, "Nom : ______________________    Classe : ________    Date : ________", 14)
    para(doc, "Cochez vous-même, honnêtement. Une copie pour vous, une copie pour le professeur si besoin.", 14)
    table = doc.add_table(rows=1, cols=4)
    table.style = "Table Grid"
    hdr = ["Critère", "Pas encore", "Presque", "Oui"]
    for i, h in enumerate(hdr):
        cell = table.rows[0].cells[i]
        cell.text = ""
        run = cell.paragraphs[0].add_run(h)
        set_run(run, size=13, bold=True, color=NAVY)
    for crit in criteria or ["La tâche du jour est faite.", "Les phrases sont claires."]:
        row = table.add_row().cells
        row[0].text = ""
        run = row[0].paragraphs[0].add_run(crit)
        set_run(run, size=13, color=RGBColor(0x1A, 0x1A, 0x1A))
        for j in range(1, 4):
            row[j].text = ""
            run = row[j].paragraphs[0].add_run("☐")
            set_run(run, size=16)
    doc.add_paragraph()
    para(doc, "Une chose que je réussis :", 16, bold=True)
    lines(doc, 2)
    para(doc, "Une chose à retravailler :", 16, bold=True)
    lines(doc, 2)
    path = OUT / f"{slug}-grille-eleve.docx"
    doc.save(path)
    return path


def convert(paths):
    # soffice to pdf and odt
    cmd = [
        "soffice",
        "--headless",
        "--nologo",
        "--nolockcheck",
        "--convert-to",
        "pdf:writer_pdf_Export",
        "--outdir",
        str(OUT),
    ] + [str(p) for p in paths]
    subprocess.check_call(cmd)
    cmd[-4] = "odt"
    # --convert-to odt
    cmd[cmd.index("pdf:writer_pdf_Export")] = "odt"
    subprocess.check_call(cmd)


def main():
    OUT.mkdir(exist_ok=True)
    created = []
    for slug in SLUGS:
        title, items, rest, crit, hw = extract(slug)
        print(slug, "items", len(items), "crit", len(crit), "title", title)
        created.append(build_fiche(slug, title, items, rest, hw))
        created.append(build_grille(slug, title, crit))
    convert(created)
    print("wrote", len(created) * 3, "files")


if __name__ == "__main__":
    main()
