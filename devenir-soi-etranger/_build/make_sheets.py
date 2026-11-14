# -*- coding: utf-8 -*-
"""Build student sheets, grids, method, autocorrection, teacher booklet."""
import re
import subprocess
import sys
from pathlib import Path
from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lessons import LESSONS
from helpers import FOOT, TITLE, LEVEL, dash_ok, POINT_INTRO, POINT_QUOTE, POINT_CREDIT, POINT_SUITE

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "downloads"
OUT.mkdir(exist_ok=True)
BORDEAUX = RGBColor(0x7B, 0x1E, 0x3A)
INK = RGBColor(0x1A, 0x12, 0x14)
GREY = RGBColor(0x66, 0x66, 0x66)


def set_run(run, size=16, bold=False, color=INK, italic=False):
    run.bold = bold
    run.italic = italic
    run.font.size = Pt(size)
    run.font.name = "Calibri"
    run.font.color.rgb = color
    rPr = run._element.get_or_add_rPr()
    rFonts = rPr.get_or_add_rFonts()
    rFonts.set(qn("w:ascii"), "Calibri")
    rFonts.set(qn("w:hAnsi"), "Calibri")
    rFonts.set(qn("w:cs"), "Calibri")


def setup(doc, size=16):
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
    set_run(run, size=11, color=BORDEAUX)
    style = doc.styles["Normal"]
    style.font.name = "Calibri"
    style.font.size = Pt(size)
    style.font.color.rgb = INK


def heading(doc, text, size=22):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(6)
    run = p.add_run(text)
    set_run(run, size=size, bold=True, color=BORDEAUX)
    return p


def para(doc, text, size=16, bold=False, italic=False, space=8):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(space)
    p.paragraph_format.line_spacing = 1.3
    run = p.add_run(text)
    set_run(run, size=size, bold=bold, italic=italic, color=BORDEAUX if bold else INK)
    return p


def lines(doc, n=8):
    for _ in range(n):
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(2)
        run = p.add_run("_" * 70)
        set_run(run, size=16, color=GREY)


def page_break(doc):
    p = doc.add_paragraph()
    run = p.add_run()
    run.add_break(WD_BREAK.PAGE)


def strip_html(s):
    s = s.replace("\xa0", " ")
    s = re.sub(r"<br\s*/?>", "\n", s, flags=re.I)
    s = re.sub(r"</p>", "\n\n", s, flags=re.I)
    s = re.sub(r"</li>", "\n", s, flags=re.I)
    s = re.sub(r"<li[^>]*>", "• ", s, flags=re.I)
    s = re.sub(r"<h[1-6][^>]*>", "\n", s, flags=re.I)
    s = re.sub(r"</h[1-6]>", "\n", s, flags=re.I)
    s = re.sub(r"<[^>]+>", "", s)
    s = s.replace("&nbsp;", " ").replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")
    s = s.replace("« ", "« ").replace(" »", " »")
    s = re.sub(r"\n{3,}", "\n\n", s)
    return s.strip()


def save_docx(doc, stem):
    path = OUT / f"{stem}.docx"
    doc.save(path)
    return path


def convert(stem):
    docx = OUT / f"{stem}.docx"
    for fmt in ("pdf", "odt"):
        subprocess.check_call(
            ["soffice", "--headless", "--convert-to", fmt, "--outdir", str(OUT), str(docx)],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.STDOUT,
        )
    for ext in (".docx", ".pdf", ".odt"):
        p = OUT / f"{stem}{ext}"
        if not p.exists():
            raise SystemExit("missing " + str(p))
        dash_ok("ok")  # no-op check placeholder


def fiche_eleve(L):
    doc = Document()
    setup(doc, 16)
    heading(doc, TITLE, 20)
    para(doc, LEVEL, 14, italic=True)
    heading(doc, L["num"] + " · " + L["title"], 22)
    para(doc, "Nom : ________________________    Classe : ________    Date : ________", 14)
    # split eleves into chunks by section or h3
    raw = L["eleves"]
    # drop download-only bits already not in eleves
    text_blocks = re.split(r"(?i)<section[^>]*>|<h3>", raw)
    parts = []
    for b in text_blocks:
        t = strip_html(b)
        if t:
            parts.append(t)
    if not parts:
        parts = [strip_html(raw)]
    # first block on page 1, then one activity per page
    first = True
    for i, part in enumerate(parts):
        if not first:
            page_break(doc)
            heading(doc, L["num"] + " · " + L["title"], 18)
            para(doc, "Nom : ________________________", 14)
        first = False
        # limit very long blocks
        chunk = part
        for para_text in chunk.split("\n\n"):
            para_text = para_text.strip()
            if not para_text:
                continue
            is_title = len(para_text) < 80 and not para_text.startswith("•") and not para_text[0:1].isdigit()
            para(doc, para_text, 16, bold=is_title and not para_text.startswith("«") and not para_text.startswith("C'est") and not para_text.startswith("Je ") and not para_text.startswith("Dans ") and not para_text.startswith("Un jour") and not para_text.startswith("Les habitants") and not para_text.startswith("Or,"))
        # writing space
        if i > 0 or "Pour l'élève" in part or "Étape" in part or "Exercice" in part or "Grille" in part:
            lines(doc, 10)
        else:
            lines(doc, 4)
    # homework page
    page_break(doc)
    heading(doc, "Devoir à la maison", 20)
    para(doc, strip_html(L["devoir"]), 16)
    lines(doc, 10)
    para(doc, "Rappel : après une correction, je remplis « Mes objectifs », et je les relis au début de la séance suivante.", 14, italic=True)
    return save_docx(doc, L["slug"] + "-fiche-eleve")


def grille_eleve(L):
    doc = Document()
    setup(doc, 16)
    heading(doc, TITLE, 20)
    para(doc, LEVEL, 14, italic=True)
    heading(doc, "Grille élève · " + L["num"] + " · " + L["title"], 20)
    para(doc, "Nom : ________________________    Date : ________", 14)
    para(doc, "Cochez vous-même, honnêtement. Relisez « Mes objectifs » de la correction précédente avant de commencer.", 16)
    table = doc.add_table(rows=1, cols=4)
    table.style = "Table Grid"
    hdr = table.rows[0].cells
    for i, lab in enumerate(["n°", "Critère", "Pas encore", "Presque / Oui"]):
        hdr[i].text = ""
        p = hdr[i].paragraphs[0]
        run = p.add_run(["n°", "Critère", "Pas encore", "Presque / Oui"][i])
        set_run(run, 14, bold=True, color=BORDEAUX)
    for i, c in enumerate(L["criteria"], 1):
        row = table.add_row().cells
        row[0].text = str(i)
        row[1].text = c
        row[2].text = "☐"
        row[3].text = "☐  ☐"
    para(doc, "Une chose que je réussis :", 16, bold=True)
    lines(doc, 2)
    para(doc, "Une chose à retravailler :", 16, bold=True)
    lines(doc, 2)
    heading(doc, "Mes objectifs", 18)
    para(doc, "J'en tire les conséquences. Un ou deux objectifs concrets (une règle à revoir sur Projet Voltaire, ou un point de méthode). À la prochaine évaluation, on commence par les vérifier.", 16)
    para(doc, "Objectif 1 : ________________________________________________", 16)
    para(doc, "Objectif 2 : ________________________________________________", 16)
    para(doc, "Tenus ?  ☐ oui    ☐ en cours    ☐ à reprendre", 16)
    return save_docx(doc, L["slug"] + "-grille-eleve")


def methode_doc():
    doc = Document()
    setup(doc, 16)
    heading(doc, TITLE, 20)
    heading(doc, "Savoir prendre une correction, et en tirer les conséquences", 22)
    para(doc, "On apprend cette méthode dès la séance 2. On la réutilise après chaque contrôle.", 16)
    heading(doc, "Les étapes", 18)
    steps = [
        "Lire le corrigé jusqu'au bout, tranquillement, avant de corriger.",
        "Comparer avec sa copie, question par question, ou phrase par phrase.",
        "Marquer les erreurs avec un code, sans tout recouvrir : deux priorités de langue, une priorité de sens.",
        "Réécrire la phrase ou la réponse corrigée, dans une autre couleur, ou juste en dessous.",
        "Noter ce qu'il faut retenir : une règle, un mot, un réflexe de méthode.",
        "En tirer les conséquences : écrire un ou deux objectifs concrets dans « Mes objectifs ». À l'évaluation suivante, on commence par les vérifier.",
    ]
    for i, s in enumerate(steps, 1):
        para(doc, f"{i}. {s}", 16)
    heading(doc, "Le code", 18)
    for line in [
        "O : orthographe",
        "C : conjugaison ou accord (sujet et verbe, groupe nominal)",
        "P : ponctuation",
        "T : temps du récit",
        "H : homophone (a/à, et/est, ces/ses)",
        "V : vocabulaire trop vague",
        "I : idée incomplète, sans justification",
        "HS : hors sujet ou oubli",
    ]:
        para(doc, line, 16)
    heading(doc, "Liste de relecture (elle compte)", 18)
    for line in [
        "☐ Chaque phrase a une majuscule et une fin claire.",
        "☐ J'ai relié chaque verbe à son sujet, et vérifié les accords.",
        "☐ J'ai contrôlé a/à, et/est, ces/ses, quand ces mots apparaissent.",
        "☐ Les temps du récit sont cohérents (passé pour les faits, présent pour le je narrant).",
        "☐ J'ai remplacé au moins un mot trop vague, si besoin.",
        "☐ J'ai indiqué en marge un exemple que j'ai vraiment corrigé.",
    ]:
        para(doc, line, 16)
    heading(doc, "Mes objectifs", 18)
    para(doc, "Objectif 1 : ________________________________________________", 16)
    para(doc, "Objectif 2 : ________________________________________________", 16)
    return save_docx(doc, "savoir-prendre-une-correction")


def auto_doc():
    doc = Document()
    setup(doc, 16)
    heading(doc, TITLE, 20)
    heading(doc, "Fiche d'autocorrection", 22)
    para(doc, "Nom : ________________________    Séance ou évaluation : ________    Date : ________", 14)
    para(doc, "Je lis le corrigé jusqu'au bout. Je compare. Je code. Je réécris. Je retiens. J'en tire les conséquences.", 16)
    table = doc.add_table(rows=1, cols=4)
    table.style = "Table Grid"
    for i, lab in enumerate(["Question ou phrase", "Code", "Ma correction", "Ce que je retiens"]):
        p = table.rows[0].cells[i].paragraphs[0]
        run = p.add_run(lab)
        set_run(run, 13, bold=True, color=BORDEAUX)
    for _ in range(8):
        row = table.add_row().cells
        for c in row:
            c.text = " "
    heading(doc, "Mes objectifs", 18)
    para(doc, "Un ou deux objectifs concrets (une règle à revoir sur Projet Voltaire, ou un point de méthode).", 16)
    para(doc, "Objectif 1 : ________________________________________________", 16)
    para(doc, "Objectif 2 : ________________________________________________", 16)
    para(doc, "À la prochaine évaluation, on commence par vérifier ces objectifs.", 16, italic=True)
    para(doc, "Tenus ?  ☐ oui    ☐ en cours    ☐ à reprendre", 16)
    return save_docx(doc, "fiche-autocorrection")


def prof_doc():
    doc = Document()
    setup(doc, 16)
    heading(doc, TITLE, 22)
    para(doc, LEVEL + " · Objet d'étude : Devenir soi, écritures autobiographiques", 16, italic=True)
    heading(doc, "Point de départ", 18)
    para(doc, POINT_INTRO, 16)
    para(doc, "« " + POINT_QUOTE + " »", 16, italic=True)
    para(doc, POINT_CREDIT, 14, italic=True)
    para(doc, POINT_SUITE, 16)
    para(doc, "BO spécial n° 5 du 11 avril 2019. 18 séances de 52 minutes. Œuvre : Jules Vallès, L'Enfant (1879). Groupement : Montaigne, Rousseau, Montesquieu, et quatre voix du manuel.", 16)
    heading(doc, "Parti pris", 18)
    para(doc, "Le sentiment d'être étranger est pris au sens large. Personne n'est obligé de raconter un souvenir douloureux. On peut inventer. Les textes de migration ou de milieu sont lus de façon neutre, sans prendre parti.", 16)
    heading(doc, "Méthode de correction", 18)
    para(doc, "Dès la séance 2 : lire le corrigé, comparer, coder, réécrire, retenir, en tirer les conséquences (Mes objectifs). L'évaluation suivante commence par la vérification de ces objectifs. Deux priorités de langue, une priorité de sens. Liste de relecture qui compte.", 16)
    heading(doc, "Projet Voltaire", 18)
    para(doc, "« Les Fondamentaux Campus » pour reprendre les bases ; « Supérieur » si les bases sont plus solides. Ne pas inventer un numéro de module. Priorités : phrase et ponctuation, accords, imparfait et passé composé, homophones. Si l'accès numérique manque, l'entraînement se fait sur la fiche papier.", 16)
    heading(doc, "Vie scolaire et tempête émotionnelle", 18)
    para(doc, "Un élève peut emporter la fiche et continuer ailleurs, sous la surveillance d'un autre adulte, prévu dès le début de l'année. En cas de tempête : parler bas, ne pas demander d'explication devant les autres, proposer une tâche courte ou un cadre inventé, ne pas laisser l'élève seul sans relais. Phrase possible : « Tu peux arrêter ce sujet. Voici une autre manière de faire le même travail. Nous n'avons pas besoin de connaître ton histoire pour t'aider à continuer. »", 16)
    heading(doc, "L'incipit de L'Enfant", 18)
    para(doc, "Le chapitre « Ma mère » est violent. Il n'est pas le texte du jour des séances 7 et 8. On entre dans l'œuvre par la dédicace, Robinson, et « La Toilette ». L'incipit peut se lire plus tard, préparé, avec une sortie de secours.", 16)
    heading(doc, "Les 18 séances, en une ligne", 18)
    for L in LESSONS:
        para(doc, L["num"] + " · " + L["title"] + " · " + L["desc"], 15)
        prof = strip_html(L["prof"])
        if prof:
            para(doc, prof, 14)
        para(doc, "Devoir : " + strip_html(L["devoir"]), 14, italic=True)
    heading(doc, "Images et sources", 18)
    para(doc, "Juan de Pareja (Velázquez, 1650, MET) remplace un portrait parfois proposé sur le même thème, mais qui montrait une poitrine nue. La question reste celle du regard et du nom. Rembrandt, 1659, National Gallery of Art, Washington. Van Gogh, Autoportrait, 1887, Art Institute of Chicago. Courbet, Portrait de Vallès, XIXe siècle. Egg, Les Compagnes de voyage, 1862, Birmingham. Fantin-Latour, La Liseuse, 1861, musée d'Orsay. Velázquez, Les Ménines, 1656, Prado. Toutes ces images sont dans le domaine public, téléchargées dans le dossier de la séquence, et ne sont pas réemployées depuis une autre page du site.", 15)
    para(doc, "Citations vérifiées : Montaigne, « Au lecteur », édition Musart 1847, Wikisource ; « Des cannibales », I, 31, exemplaire de Bordeaux, orthographe modernisée. Montesquieu, lettre 30, édition Laboulaye 1875, Wikisource. Rousseau, Confessions, livre I, édition Launette 1889, Wikisource. Vallès, L'Enfant, édition Charpentier 1889, Wikisource (dédicace, « Le Lycée », « La Toilette »).", 15)
    return save_docx(doc, "fiche-prof-sequence")


def main():
    stems = []
    for L in LESSONS:
        fiche_eleve(L)
        stems.append(L["slug"] + "-fiche-eleve")
        grille_eleve(L)
        stems.append(L["slug"] + "-grille-eleve")
        print("docx", L["slug"])
    methode_doc(); stems.append("savoir-prendre-une-correction")
    auto_doc(); stems.append("fiche-autocorrection")
    prof_doc(); stems.append("fiche-prof-sequence")
    print("converting", len(stems), "documents")
    # batch convert
    for stem in stems:
        convert(stem)
        print("ok", stem)
    print("sheets done")


if __name__ == "__main__":
    main()
