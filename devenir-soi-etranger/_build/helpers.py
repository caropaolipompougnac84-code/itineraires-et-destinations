# -*- coding: utf-8 -*-
"""Shared HTML helpers for the sequence."""
BASE = "/devenir-soi-etranger"
TITLE = "Devenir soi quand on se sent étranger"
LEVEL = "Seconde baccalauréat professionnel"
FOOT = "© 2026 Madame Carole Paoli Pompougnac · CC BY-NC-SA 4.0"
BORDEAUX = "#7B1E3A"

TABS = [
    ("eleves", "Élèves"),
    ("deroule", "Déroulé minuté"),
    ("activites", "Activités langagières"),
    ("evaluation", "Évaluation"),
    ("corrige", "Corrigé et grilles"),
    ("secours", "Sortie de secours"),
    ("gestion", "Gestion de classe"),
    ("fiche-prof", "Fiche prof"),
    ("devoir", "Devoir"),
]

LESSON_NAV = [
    ("", "Accueil"),
    ("s1/", "S1"), ("s2/", "S2"), ("s3/", "S3"), ("s4/", "S4"),
    ("s5/", "S5"), ("s6/", "S6"), ("s7/", "S7"), ("s8/", "S8"),
    ("s9/", "S9"), ("s10/", "S10"), ("s11/", "S11"), ("s12/", "S12"),
    ("s13/", "S13"), ("s14/", "S14"), ("s15/", "S15"), ("s16/", "S16"),
    ("evaluation-formative/", "QCM"),
    ("evaluation-sommative/", "Éval."),
    ("prendre-une-correction/", "Correction"),
    ("downloads/", "Docs"),
]

VIE_NOTE = """
<div class="note-vie-scolaire">
<p>Parce que la séance est à onglets et que la fiche élève s'imprime, un élève en difficulté peut emporter sa feuille et continuer ailleurs, sous la surveillance d'un autre adulte (vie scolaire, CDI, infirmerie).</p>
<p>Cet accueil doit être réglé dès le début de l'année avec la vie scolaire : qui reçoit l'élève, où, et comment le professeur le signale.</p>
</div>
"""

OBJECTIFS_BOX = """
<div class="objectifs" id="mes-objectifs">
<h3>Mes objectifs</h3>
<p>Après chaque correction, j'en tire les conséquences. J'écris un ou deux objectifs concrets, à moi. Par exemple : une règle à revoir sur Projet Voltaire, ou un point de méthode.</p>
<p>Objectif 1 : _______________________________________________</p>
<p>Objectif 2 : _______________________________________________</p>
<p>À la prochaine évaluation, on commence par regarder si je les ai tenus.</p>
</div>
"""

CODES = """
<div class="codes">
<p><strong>O</strong> orthographe</p>
<p><strong>C</strong> conjugaison ou accord (sujet et verbe, groupe nominal)</p>
<p><strong>P</strong> ponctuation</p>
<p><strong>T</strong> temps du récit</p>
<p><strong>H</strong> homophone (a/à, et/est, ces/ses)</p>
<p><strong>V</strong> vocabulaire trop vague</p>
<p><strong>I</strong> idée incomplète, sans justification</p>
<p><strong>HS</strong> hors sujet ou oubli</p>
</div>
"""

def dash_ok(s):
    if "—" in s or "–" in s:
        raise ValueError("long dash found: " + s[max(0,s.find("—")-30):s.find("—")+30] if "—" in s else s[max(0,s.find("–")-30):s.find("–")+30])
    return s

def esc(s):
    return s

def seq_nav(current):
    parts = ['<div class="seq-bar"><nav class="seq-nav" aria-label="Séances">']
    for href, label in LESSON_NAV:
        url = f"{BASE}/{href}" if href else f"{BASE}/"
        on = ' class="on" aria-current="page"' if href == current else ""
        parts.append(f'<a{on} href="{url}">{label}</a>')
    parts.append("</nav></div>")
    return "".join(parts)

def site_nav():
    return f'''<nav class="site-nav" aria-label="Site"><div class="wrap">
<a href="/">Itinéraires et destinations</a>
<a href="/lycee-pro/">Lycée professionnel</a>
<a href="/lycee-pro/lettres.html">Lettres</a>
<a href="{BASE}/">{TITLE}</a>
</div></nav>'''

def head(title, desc, url, image="velazquez-juan-de-pareja.jpg"):
    img = f"https://itineraires-destinations.fr{BASE}/images/{image}"
    can = f"https://itineraires-destinations.fr{url}"
    return f'''<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title} · {LEVEL} · Madame Carole Paoli Pompougnac</title>
<meta name="description" content="{desc}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Itinéraires et destinations">
<meta property="og:locale" content="fr_FR">
<meta property="og:title" content="{title} · Madame Carole Paoli Pompougnac">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{can}">
<meta property="og:image" content="{img}">
<meta name="twitter:card" content="summary_large_image">
<meta name="author" content="Madame Carole Paoli Pompougnac">
<link rel="canonical" href="{can}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&amp;family=Atkinson+Hyperlegible:wght@400;700&amp;display=swap" rel="stylesheet">
<link rel="stylesheet" href="{BASE}/seq.css">
<script src="{BASE}/script.js" defer></script>
</head>'''

def footer():
    return f'''<footer><div class="wrap"><p>{FOOT}</p></div></footer>
</body>
</html>'''

def lesson_tabs():
    links = []
    for i, (tid, label) in enumerate(TABS):
        sel = "true" if i == 0 else "false"
        tab = "0" if i == 0 else "-1"
        cur = "true" if i == 0 else "false"
        links.append(
            f'<a href="#{tid}" id="tab-{tid}" role="tab" aria-controls="{tid}" aria-selected="{sel}" tabindex="{tab}" aria-current="{cur}">{label}</a>'
        )
    return (
        '<nav class="lesson-tabs" aria-label="Étapes de la séance">'
        '<div class="row" role="tablist" id="lesson-tablist">'
        + "".join(links)
        + '</div></nav>'
        '<p class="nojs-note">Sans JavaScript, toutes les étapes restent visibles à la suite.</p>'
    )

def timing_table(rows):
    body = "".join(f"<tr><th>{a}</th><td>{b}</td></tr>" for a, b in rows)
    return (
        '<section class="minutage" aria-label="Minutage de la séance">'
        "<h3>Minutage · 52 minutes</h3>"
        "<table><thead><tr><th>Temps</th><th>Activité</th></tr></thead>"
        f"<tbody>{body}</tbody></table></section>"
    )

def five_al(where):
    """Four official competences + study of language (BO français)."""
    order = [
        ("D1", "Échange oral", "Maîtriser l'échange oral : écouter, réagir, s'exprimer."),
        ("D2", "Échange écrit", "Maîtriser l'échange écrit : lire, analyser, écrire."),
        ("D3", "Lecture", "Devenir un lecteur compétent et critique."),
        ("D4", "Se construire", "Confronter des connaissances et des expériences pour se construire."),
        ("D5", "Langue", "Étude de la langue : connaissance et maîtrise de la langue."),
    ]
    default = "Pas le cœur de la séance aujourd'hui."
    bits = []
    for k, short, lab in order:
        bits.append("<li><strong>%s</strong> · %s %s</li>" % (short, lab, where.get(k, default)))
    notice = (
        "Le programme de français (BO spécial n° 5 du 11 avril 2019) fixe quatre compétences, "
        "plus l'étude de la langue. Dans chaque séance de 52 minutes, on voit aussi où l'on écoute "
        "un texte lu à voix haute, où l'on lit, où l'on écrit, où l'on parle seul et où l'on échange."
    )
    return (
        '<aside class="cinq-bo" aria-label="Compétences du programme de français">'
        "<h3>Les compétences du programme de français</h3>"
        '<p class="notice">' + notice + "</p>"
        "<ul>" + "".join(bits) + "</ul></aside>"
    )


def grids(criteria, slug):
    rows_p, rows_e = [], []
    for i, c in enumerate(criteria, 1):
        rows_p.append(f"<tr><th>{i}</th><td>{c}</td><td>Non acquis</td><td>En cours</td><td>Acquis</td></tr>")
        rows_e.append(f"<tr><th>{i}</th><td>{c}</td><td>Pas encore</td><td>Presque</td><td>Oui</td></tr>")
    prof = (
        '<div class="grille grille-prof"><h3>Grille professeur</h3>'
        "<p>Cochez une colonne par critère. Un mot suffit en marge.</p>"
        "<table><thead><tr><th>n°</th><th>Critère</th><th>Non acquis</th><th>En cours</th><th>Acquis</th></tr></thead>"
        f"<tbody>{''.join(rows_p)}</tbody></table></div>"
    )
    eleve = (
        '<div class="grille grille-eleve"><h3>Grille élève</h3>'
        "<p>Cochez vous-même, honnêtement. Cette grille se télécharge et se photocopie.</p>"
        "<table><thead><tr><th>n°</th><th>Critère</th><th>Pas encore</th><th>Presque</th><th>Oui</th></tr></thead>"
        f"<tbody>{''.join(rows_e)}</tbody></table>"
        "<p class=\"notice\">Une chose que je réussis : _______________________________</p>"
        "<p class=\"notice\">Une chose à retravailler : _______________________________</p></div>"
        '<p class="dl-label">Grille élève, à imprimer ou à photocopier :</p>'
        f'<p class="dl fiche-dl"><a href="{BASE}/downloads/{slug}-grille-eleve.pdf">PDF</a>'
        f'<a class="sec" href="{BASE}/downloads/{slug}-grille-eleve.docx">Word</a>'
        f'<a class="sec" href="{BASE}/downloads/{slug}-grille-eleve.odt">LibreOffice</a></p>'
    )
    return prof + eleve

def gestion_panel(storm_task):
    return f'''<section class="panel" id="gestion" role="tabpanel" aria-labelledby="titre-gestion" data-tab="gestion"><h2 id="titre-gestion">Gestion de classe</h2>
<div class="box-prof">
<h3>Tempête émotionnelle</h3>
<p>Si un élève traverse une tempête émotionnelle, restez calme. Parlez-lui à part, sans le juger. Proposez un coin plus calme dans la salle, ou une tâche courte sur la fiche de la séance.</p>
<p>{storm_task}</p>
<p>Si besoin, prévenez le CPE ou l'infirmière. Le cours continue, simplement, pour les autres.</p>
</div>
{VIE_NOTE}
<p>La tâche courte, si l'élève reste un moment à l'écart ou part avec sa fiche, est liée à cette séance. Elle est déjà indiquée dans la sortie de secours.</p></section>'''

def secours_panel(backup, storm_task):
    return f'''<section class="panel" id="secours" role="tabpanel" aria-labelledby="titre-secours" data-tab="secours"><h2 id="titre-secours">Sortie de secours</h2>
<h3>Si le plan prévu ne tient pas</h3>
<p>{backup}</p>
<aside class="secours" aria-label="Issue de secours"><h3>Issue de secours</h3>
<ul>
<li><strong>La classe s'agite.</strong> On arrête deux minutes, on revient à une tâche courte et orale : chacun dit une phrase, puis on reprend le minutage.</li>
<li><strong>Vous avez fini trop tôt.</strong> On allonge l'oral : un second exemple, une phrase de plus, ou une carte bristol.</li>
<li><strong>Le matériel tombe en panne.</strong> On passe à la fiche papier, au tableau, ou à une dictée de la trace. La séance continue sans écran.</li>
<li><strong>Tempête émotionnelle.</strong> Restez calme, parlez à part, sans juger. Proposez un coin plus calme, ou la fiche à emporter, sous la surveillance d'un autre adulte (voir l'onglet Gestion de classe). Tâche courte liée à la séance : {storm_task} Puis on le réintègre calmement. Le cours minuté continue pour les autres.</li>
</ul></aside>
<h3>Continuer ailleurs, sur la fiche</h3>
{VIE_NOTE}
</section>'''

def figure(src, alt, caption, credit):
    return (
        f'<figure class="figure"><img src="{BASE}/images/{src}" alt="{alt}">'
        f'<figcaption class="caption">{caption}<br><span class="credit">{credit}</span></figcaption></figure>'
    )

def dl_eleve(slug, label="Fiche élève, à imprimer ou à photocopier (PDF, Word, LibreOffice) :"):
    return (
        f'<p class="dl-label">{label}</p>'
        f'<p class="dl fiche-dl"><a href="{BASE}/downloads/{slug}-fiche-eleve.pdf">PDF</a>'
        f'<a class="sec" href="{BASE}/downloads/{slug}-fiche-eleve.docx">Word</a>'
        f'<a class="sec" href="{BASE}/downloads/{slug}-fiche-eleve.odt">LibreOffice</a></p>'
    )
