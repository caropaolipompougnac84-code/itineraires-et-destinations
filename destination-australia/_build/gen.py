#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Classroom-first rebuild of Head off to Australia."""
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
BASE = "/destination-australia"
TITLE = "Head off to Australia"
FOOT = "© 2026 Madame Carole Paoli Pompougnac · CC BY-NC-SA 4.0"
LEVEL = "Terminale bac pro · Première bac pro (adaptable)"
OG = "https://itineraires-destinations.fr/destination-australia/images/roberts-coogee.jpg"
COVER = "roberts-coogee.jpg"

NAV = [
    ("Accueil", f"{BASE}/"),
    ("S1", f"{BASE}/s1/"), ("S2", f"{BASE}/s2/"), ("S3", f"{BASE}/s3/"),
    ("S4", f"{BASE}/s4/"), ("S5", f"{BASE}/s5/"), ("S6", f"{BASE}/s6/"),
    ("S7", f"{BASE}/s7/"), ("S8", f"{BASE}/s8/"), ("S9", f"{BASE}/s9/"),
    ("S10", f"{BASE}/s10/"), ("S11", f"{BASE}/s11/"), ("S12", f"{BASE}/s12/"),
    ("S13", f"{BASE}/s13/"),
    ("Éval.", f"{BASE}/assessment/"),
    ("Listening", f"{BASE}/#australian-voices"),
    ("Docs", f"{BASE}/downloads/"),
    ("Annexe", f"{BASE}/annexe/"),
]

LISIBLE_HOME = (
    '<p class="lisible-note">Terminale bac pro, aussi adaptable en Première bac pro. '
    "Les objectifs et les activités langagières restent ceux du programme. "
    "La version plus lisible change seulement la mise en page. "
    "Pour un étayage plus léger, en Première ou au quotidien, prenez le parcours ★ : "
    "mêmes tâches, consignes plus guidées, textes plus courts. "
    "Le parcours ★★ reste disponible.</p>"
)
LISIBLE_LESSON = (
    '<p class="lisible-note">Seul l\'étayage change : les objectifs et les activités langagières '
    "restent ceux du programme. La version plus lisible change seulement la mise en page.</p>"
)

def page(out_rel, title, description, current, body, og=OG, lisible="lesson"):
    nav = []
    for label, href in NAV:
        on = " on" if href == current else ""
        ac = ' aria-current="page"' if href == current else ""
        nav.append(f'<a class="{on.strip()}"{ac} href="{href}">{label}</a>')
    html = f'''<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title} · {LEVEL} · Madame Carole Paoli Pompougnac</title>
<meta name="description" content="{description}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Itinéraires et destinations">
<meta property="og:locale" content="fr_FR">
<meta property="og:title" content="{title} · Madame Carole Paoli Pompougnac">
<meta property="og:description" content="{description}">
<meta property="og:url" content="https://itineraires-destinations.fr{current}">
<meta property="og:image" content="{og}">
<meta name="twitter:card" content="summary_large_image">
<meta name="author" content="Madame Carole Paoli Pompougnac">
<link rel="canonical" href="https://itineraires-destinations.fr{current}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&amp;family=Atkinson+Hyperlegible:wght@400;700&amp;display=swap" rel="stylesheet">
<link rel="stylesheet" href="{BASE}/seq.css">
<script src="{BASE}/script.js" defer></script>
</head>
<body>
<a class="skip" href="#main">Aller au contenu</a>
<nav class="site-nav" aria-label="Site"><div class="wrap">
<a href="/">Itinéraires et destinations</a>
<a href="/lycee-pro/">Lycée professionnel</a>
<a href="/lycee-general/">Lycée général et technologique</a>
<a href="{BASE}/">{TITLE}</a>
</div></nav>
<div class="seq-bar"><nav class="seq-nav" aria-label="Séances">{''.join(nav)}</nav></div>
<main id="main">
<p class="switch"><button type="button" data-dys-toggle>Version plus lisible</button></p>
{LISIBLE_HOME if lisible=="home" else LISIBLE_LESSON if lisible=="lesson" else ""}
{body}
</main>
<footer><div class="wrap"><p>{FOOT}</p></div></footer>
</body>
</html>
'''
    dest = ROOT / out_rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(html, encoding="utf-8")
    print("wrote", dest.relative_to(ROOT), dest.stat().st_size)

def fig(src, alt, caption, credit):
    return f'''<figure class="figure">
<img src="{BASE}/images/{src}" alt="{alt}">
<figcaption class="caption">{caption}<br><span class="credit">{credit}</span></figcaption>
</figure>'''

def student(*lines, space=True):
    items = "".join(f"<li>{x}</li>" for x in lines)
    space_html = '<div class="lines" aria-hidden="true"></div>' if space else ""
    return f'''<section class="box-stud">
<h3>For the student</h3>
<ol>{items}</ol>
{space_html}
</section>'''

def prof(timing, *steps, answers=""):
    st = "".join(f"<li>{x}</li>" for x in steps)
    ans = f'<details class="more"><summary>Corrigé</summary>{answers}</details>' if answers else ""
    return f'''<section class="box-prof">
<h3>Pour le professeur</h3>
<p class="timing">{timing}</p>
<ol>{st}</ol>
{ans}
</section>'''

def more(title, inner):
    return f'<details class="more"><summary>Pour en savoir plus · {title}</summary>{inner}</details>'

def reading(title, inner):
    return f'<details class="reading" open><summary>{title}</summary>{inner}</details>'

def trace(text):
    return f'<aside class="trace"><h3>Trace écrite</h3><p>{text}</p></aside>'

def homework(todo, nxt):
    return f'''<section class="homework" id="devoir">
<h3>Travail à la maison</h3>
<p>{todo}</p>
<p class="notice">Court, à rendre par écrit. Correction au début de la séance {nxt}.</p>
<div class="lines" aria-hidden="true"></div>
</section>'''

FIVE = [
    ("CO", "Compréhension de l'oral"),
    ("CE", "Compréhension de l'écrit"),
    ("EE", "Expression écrite"),
    ("EOC", "Expression orale en continu"),
    ("EOI", "Interaction orale"),
]

def cadre(actives, rows, solo, mediation=False):
    """Five official language activities, 52-minute timing, fallback box."""
    lis = []
    for code, name in FIVE:
        active = code in actives
        cls = ' class="on"' if active else ""
        etat = "Travaillée aujourd'hui." if active else "Pas le cœur de cette séance."
        lis.append(
            f"<li{cls}><strong>{code}</strong> · {name}. "
            f'<span class="notice">{etat}</span></li>'
        )
    rows_html = "".join(f"<tr><th>{a}</th><td>{b}</td></tr>" for a, b in rows)
    mediation_html = ""
    if mediation:
        mediation_html = (
            '<p class="mediation-line">Médiation · travaillée aujourd\'hui, '
            "en plus des cinq activités de l'épreuve.</p>\n"
        )
    return (
        '<aside class="cinq-bo" aria-label="Les cinq activités langagières du programme">'
        "<h3>Les cinq activités langagières du programme</h3>"
        '<p class="notice">Les cinq activités langagières du programme de la voie professionnelle '
        "(BO spécial n° 5 du 11 avril 2019). Chacune compte pour un cinquième de l'épreuve.</p>"
        f"<ul>{''.join(lis)}</ul>"
        "</aside>\n"
        + mediation_html
        + '<section class="minutage" aria-label="Minutage de la séance">'
        "<h3>Minutage · 52 minutes</h3>"
        "<table><thead><tr><th>Temps</th><th>Activité</th></tr></thead>"
        f"<tbody>{rows_html}</tbody></table>"
        "</section>\n"
        '<aside class="secours" aria-label="Issue de secours">'
        "<h3>Issue de secours</h3><ul>"
        "<li><strong>La classe s'agite.</strong> On arrête deux minutes, on revient à une tâche courte et orale, chacun dit une phrase, puis on reprend le minutage.</li>"
        "<li><strong>Vous avez fini trop tôt.</strong> On allonge l'oral : un second exemple, une phrase de plus, ou une carte bristol.</li>"
        "<li><strong>Le matériel tombe en panne.</strong> On passe à la fiche papier, au tableau, ou à une dictée de la trace. La séance continue sans écran.</li>"
        "<li><strong>Tempête émotionnelle.</strong> Si un élève met vraiment le bazar, on l'écarte un moment selon le règlement de l'établissement (vie scolaire, autre salle, lieu surveillé), on lui confie une tâche courte liée à la séance ("
        + solo
        + "), puis on le réintègre calmement. Le cours minuté continue pour les autres.</li>"
        "</ul></aside>"
    )

ADAPTER = '''<details class="more" id="adapter-premiere">
<summary>Adapter en Première bac pro</summary>
<ul>
<li>Ne prenez pas les 13 séances d'affilée : choisissez un parcours plus court, par exemple S1 (tableaux), S4 (animaux), S5 (transports et FIFO), S6 (visa), S8 (budget), S12 (Aussie English, vidéo d'Elena), puis l'entretien.</li>
<li>Au budget (S8), guidez davantage le calcul : donnez les figures, faites calculer seulement le reste à vivre, et gardez le calculateur pour une démonstration collective.</li>
<li>Étayez les lectures les plus longues : lisez-les ensemble, ou donnez d'abord le texte court, puis deux questions seulement du texte plus long.</li>
<li>Gardez en priorité les mini-tâches du projet : le sac de Léa (S7), le calculateur (S8), le CV et l'entretien (S9), et la compréhension de l'oral en S12.</li>
<li>Les cinq activités langagières du programme, le minutage et l'issue de secours restent les mêmes. En Première, serrez le minutage et allongez le temps d'étayage, sans enlever ce cadre : c'est lui qui permet de tenir la classe.</li>
</ul>
</details>
'''


def build_index():
    lessons = [
        ("S1", "Paintings", f"{BASE}/s1/", "Look, speak"),
        ("S2", "History", f"{BASE}/s2/", "Read, present"),
        ("S3", "Society", f"{BASE}/s3/", "Role-play"),
        ("S4", "Animals", f"{BASE}/s4/", "Read, discuss"),
        ("S5", "Transport, FIFO", f"{BASE}/s5/", "Plan a route"),
        ("S6", "Visa", f"{BASE}/s6/", "Choose, check"),
        ("S7", "Customs", f"{BASE}/s7/", "Lea's bag"),
        ("S8", "Money", f"{BASE}/s8/", "Calculator"),
        ("S9", "Jobs", f"{BASE}/s9/", "Resume, interview"),
        ("S10", "Studying", f"{BASE}/s10/", "Compare systems"),
        ("S11", "Contacts, forms", f"{BASE}/s11/", "Write, fill in"),
        ("S12", "Aussie English", f"{BASE}/s12/", "Listen"),
        ("S13", "Living there", f"{BASE}/s13/", "Debate"),
        ("Éval.", "Final task", f"{BASE}/assessment/", "File + interview"),
    ]
    grid = "".join(
        f'<a href="{href}"><strong>{num}</strong>{title}<br><span class="notice">{act}</span></a>'
        for num, title, href, act in lessons
    )
    body = f'''
<p class="kicker">Anglais · {LEVEL}</p>
<h1>{TITLE}</h1>
<p class="exergue">Moving to Australia for at least a year</p>
<div class="hero">
{fig(COVER,
     "Tom Roberts, Holiday sketch at Coogee, 1888: a bright beach, turquoise sea, and people enjoying the shore.",
     "Une plage australienne, lumineuse et accueillante : le départ vers un autre rythme de vie.",
     "Tom Roberts, Holiday sketch at Coogee, 1888, Art Gallery of New South Wales. Domaine public, via Wikimedia Commons.")}
</div>

<div class="grid">
<article class="card"><h3>Scenario</h3><p>You are 19. You want to live in Australia for at least one year.</p><p>Before you buy your ticket, you prepare papers, money, a job and daily life.</p></article>
<article class="card"><h3>Big question</h3><p>Is Australia really the land of opportunity for a young French person?</p></article>
<article class="card"><h3>Final task</h3><p>You build an application file: letter, resume, forms, visa, budget, contacts.</p><p>Then you pass a phone interview.</p></article>
</div>
<article class="card card-wide" id="niveaux">
<h3>Niveaux</h3>
<p>Terminale bac pro, aussi adaptable en Première bac pro. Les objectifs et les activités langagières restent ceux du programme. La version plus lisible change seulement la mise en page. Pour un étayage plus léger, en Première ou au quotidien, prenez le parcours ★ : mêmes tâches, consignes plus guidées, textes plus courts. Le parcours ★★ reste disponible.</p>
</article>

<h2>The 13 lessons, then the test</h2>
<p>Click a card. Each lesson starts with the activity.</p>
<nav class="lessons" aria-label="Les séances">{grid}</nav>

<p class="dl">
<a href="{BASE}/downloads/">Téléchargements</a>
<a class="sec" href="{BASE}/teacher/">Corrigés</a>
<a class="sec" href="{BASE}/annexe/">Ancienne version</a>
</p>


<section class="voices" id="australian-voices" lang="fr">
<h2>Listening: Australian voices</h2>
<p class="voices-chip">Terminale bac pro (LVA : B1+) · Première générale et technologique (B1 possible)</p>
<p class="voices-modulaire">Chaque vidéo et sa fiche s’utilisent seules ou ensemble, dans l’ordre que vous choisissez, selon votre classe.</p>
<p class="voices-dl">
<a href="{BASE}/downloads/fiches-eleves-australian-voices.pdf">Fiches élèves (PDF)</a>
<a class="sec" href="{BASE}/downloads/fiches-eleves-australian-voices.docx">Word</a>
<a class="sec" href="{BASE}/downloads/fiches-eleves-australian-voices.odt">LibreOffice</a>
</p>
<article class="voice-card" id="voice-sam">
<h3>Sam. A café supervisor in Melbourne</h3>
<video controls preload="metadata" playsinline controlslist="nodownload" title="Sam. A café supervisor in Melbourne">
<source src="{BASE}/videos/sam.mp4" type="video/mp4">
Cette vidéo peut être téléchargée ici : <a href="{BASE}/videos/sam.mp4">Sam</a>.
</video>
<details>
<summary>Afficher le script</summary>
<p class="script">G'day, I'm Sam. I run the morning shift at a café in Melbourne. If you apply, I'll ask about your experience, your Working Holiday visa, and your availability. Casual work includes casual loading, instead of paid leave. Ask which award applies, what the weekend rates are, and whether this role needs a Victorian RSA.</p>
</details>
<p class="downloads">Fiche élève : <a href="{BASE}/downloads/fiches-eleves-australian-voices.pdf">PDF</a> · <a href="{BASE}/downloads/fiches-eleves-australian-voices.docx">Word</a> · <a href="{BASE}/downloads/fiches-eleves-australian-voices.odt">LibreOffice</a>.</p>
</article>
<article class="voice-card" id="voice-malik">
<h3>Malik. A hostel receptionist in Sydney</h3>
<video controls preload="metadata" playsinline controlslist="nodownload" title="Malik. A hostel receptionist in Sydney">
<source src="{BASE}/videos/malik.mp4" type="video/mp4">
Cette vidéo peut être téléchargée ici : <a href="{BASE}/videos/malik.mp4">Malik</a>.
</video>
<details>
<summary>Afficher le script</summary>
<p class="script">Hi, how's it going? I'm Malik, and I work on reception at a hostel near Central Station. Book one or two weeks first, then look for a longer place. In your first days, do the Big Four: a local SIM or eSIM, a bank account, your TFN on the official ATO page, and private insurance. If you're unsure at the airport, ask an officer.</p>
</details>
<p class="downloads">Fiche élève : <a href="{BASE}/downloads/fiches-eleves-australian-voices.pdf">PDF</a> · <a href="{BASE}/downloads/fiches-eleves-australian-voices.docx">Word</a> · <a href="{BASE}/downloads/fiches-eleves-australian-voices.odt">LibreOffice</a>.</p>
</article>
<article class="voice-card" id="voice-jordan">
<h3>Jordan. A packing-shed supervisor near Mildura</h3>
<video controls preload="metadata" playsinline controlslist="nodownload" title="Jordan. A packing-shed supervisor near Mildura">
<source src="{BASE}/videos/jordan.mp4" type="video/mp4">
Cette vidéo peut être téléchargée ici : <a href="{BASE}/videos/jordan.mp4">Jordan</a>.
</video>
<details>
<summary>Afficher le script</summary>
<p class="script">Hello, I'm Jordan. I supervise packing here near Mildura. If you want this work to count as specified work, check first. Not every farm job, location or day automatically qualifies for a second visa. The usual rule is three months, normally at least 88 calendar days of eligible full-time-equivalent work. Keep your payslips, and check the industry, the postcode and the official counting rules before you accept a job.</p>
</details>
<p class="downloads">Fiche élève : <a href="{BASE}/downloads/fiches-eleves-australian-voices.pdf">PDF</a> · <a href="{BASE}/downloads/fiches-eleves-australian-voices.docx">Word</a> · <a href="{BASE}/downloads/fiches-eleves-australian-voices.odt">LibreOffice</a>.</p>
</article>
<article class="voice-card" id="voice-elena">
<h3>Elena. A neighbour at a patrolled beach in Sydney</h3>
<video controls preload="metadata" playsinline controlslist="nodownload" title="Elena. A neighbour at a patrolled beach in Sydney">
<source src="{BASE}/videos/elena.mp4" type="video/mp4">
Cette vidéo peut être téléchargée ici : <a href="{BASE}/videos/elena.mp4">Elena</a>.
</video>
<details>
<summary>Afficher le script</summary>
<p class="script">G'day, I'm Elena. Put on your sunnies and some sunscreen, and swim between the red and yellow flags. Follow the lifeguards, and check the local warnings, because conditions change. On Saturday arvo, some of my mates are organising a barbie in the park. You're welcome to come, and to bring something to share. How's it going so far?</p>
</details>
<p class="downloads">Fiche élève : <a href="{BASE}/downloads/fiches-eleves-australian-voices.pdf">PDF</a> · <a href="{BASE}/downloads/fiches-eleves-australian-voices.docx">Word</a> · <a href="{BASE}/downloads/fiches-eleves-australian-voices.odt">LibreOffice</a>.</p>
</article>
<aside class="voices-teacher">
<h3>Pour le professeur</h3>
<p>Le corrigé se télécharge à part, il n’est pas sur la fiche élève.</p>
<p class="voices-dl">
<a href="{BASE}/downloads/corriges-australian-voices.pdf">Corrigé (PDF)</a>
<a class="sec" href="{BASE}/downloads/corriges-australian-voices.docx">Word</a>
<a class="sec" href="{BASE}/downloads/corriges-australian-voices.odt">LibreOffice</a>
</p>
</aside>
</section>


{more("Présentation pour les collègues", f'''
<p>Chère collègue, cher collègue,</p>
<p>Séquence d'anglais pour la Terminale bac pro, adaptable en Première bac pro.</p>
<p>Projet : un an en Australie, le plus souvent avec un visa vacances-travail 417, parfois un visa étudiant.</p>
<p>Chaque séance affiche les cinq activités langagières du programme, un minutage de 52 minutes et une issue de secours. Les cinq activités langagières et la médiation sont travaillées. Chaque séance a une trace écrite et un devoir court, corrigé à la séance suivante.</p>
<p>Deux passages ajoutés au texte de départ : les animaux qui font peur, et les transports, y compris le fly-in fly-out (FIFO).</p>
<p>Chiffres revérifiés en novembre 2026 sur les sites officiels. Faites-les revérifier par les élèves.</p>
<p>L'ancienne version en huit leçons est en <a href="{BASE}/annexe/">annexe</a>.</p>
<p>Bien à vous,<br>Madame Carole Paoli Pompougnac</p>
''')}
<section class="cadre-officiel" id="cadre-officiel" aria-label="Cadre officiel">
<h2>Cadre officiel</h2>
<p>Voie professionnelle, Terminale et Première bac pro. Programme : arrêté du 3 avril 2019, BO spécial n° 5 du 11 avril 2019. Deux contextes, non limitatifs : la vie quotidienne, personnelle, sociale et citoyenne ; la vie professionnelle. La mobilité entre dans ces contextes. Les cinq activités langagières sont la compréhension de l'oral, la compréhension de l'écrit, l'expression écrite, l'expression orale en continu et l'expression orale en interaction. La médiation figure aussi dans le programme, en plus de ces cinq activités. Épreuve (arrêté du 17 juin 2020, BO n° 30 du 23 juillet 2020, annexe V) : chaque activité compte pour un cinquième de la note. CCF en terminale : situation A (compréhension de l'oral, de l'écrit et expression écrite, 1 heure au maximum, 12 points) et situation B (expression orale en continu puis interaction, 10 minutes, 8 points). Niveaux attendus à l'examen : B1+ en langue vivante A, A2+ en langue vivante B. Niveaux visés en fin d'études : B2 en langue vivante A, B1 en langue vivante B.</p>
<p>La rubrique Listening: Australian voices peut aussi servir en Première générale et technologique (compréhension de l'oral). En Terminale bac pro, langue vivante A, le niveau visé pour cette écoute est B1+.</p>
</section>
{ADAPTER}
'''
    page("index.html", TITLE,
         "Head off to Australia : séquence d'anglais prête à l'emploi, Terminale bac pro et Première bac pro (adaptable).",
         f"{BASE}/", body, lisible="home")

def build_s1():
    body = f'''
<p class="kicker">Séance 1 · EOC</p>
<h1>Look at the paintings</h1>
{cadre(["EOC"], [
    ("0-5 min", "Accueil, consigne, regard silencieux des quatre tableaux (une minute)."),
    ("5-25 min", "Description guidée (foreground / background), puis questions sur le travail, la solitude, l'arrivée."),
    ("25-40 min", "Mise en commun. Pour les plus à l'aise : point de vue colonial, choix d'une affiche."),
    ("40-48 min", "Trace écrite."),
    ("48-52 min", "Devoir : six à huit lignes sur un tableau, à ramasser séance 2."),
], "décris un tableau en cinq phrases")}
{fig("fox-landing-cook.jpg","E. Phillips Fox, Landing of Captain Cook at Botany Bay, 1770, painted in 1902.","Arrival. Who is at the centre? Who is on the side?","E. Phillips Fox, Landing of Captain Cook at Botany Bay, 1770, 1902, National Gallery of Victoria. Domaine public.")}
{fig("roberts-shearing-rams.jpg","Tom Roberts, Shearing the Rams, 1890: men at work in a woolshed.","Hard work.","Tom Roberts, Shearing the Rams, 1890, National Gallery of Victoria. Domaine public.")}
{fig("mccubbin-down-on-his-luck.jpg","Frederick McCubbin, Down on His Luck, 1889: a lone man by a small fire.","A lonely man, out of work.","Frederick McCubbin, Down on His Luck, 1889, Art Gallery of Western Australia. Domaine public.")}
{fig("streeton-golden-summer.jpg","Arthur Streeton, Golden Summer, Eaglemont, 1889: a wide golden landscape.","Light and space.","Arthur Streeton, Golden Summer, Eaglemont, 1889, National Gallery of Australia. Domaine public.")}

{student(
    "Choose one painting.",
    "Say what you see: in the foreground..., in the background...",
    "Which painting shows hard work? Which one shows a lonely man? Which one shows an arrival?",
    "★★ In the Cook painting, Aboriginal people are far away, on the side. What does this tell us about the painter's point of view?",
    "★★ Which painting would you choose for a poster called \"Work in Australia\"? Give one reason.",
)}
{prof("15 à 20 minutes. EOC, puis mise en commun.",
    "Projetez les quatre tableaux. Laissez d'abord regarder en silence (une minute).",
    "★ : description guidée (foreground / background).",
    "★★ : point de vue colonial dans le tableau de Fox, puis choix argumenté d'une affiche.",
    "Huit minutes de devoir : six à huit lignes sur un tableau, à ramener séance 2.",
    answers="<p>Work: <i>Shearing the Rams</i>. Lonely man: <i>Down on His Luck</i>. Arrival: Fox (Cook). Fox places Aboriginal people on the margin: a colonial point of view, painted for the anniversary of Federation.</p>"
)}
{trace("In the foreground I can see... In the background... This painting shows...")}
{homework("Choose one painting. Write 6 to 8 lines: what you see, and what it tells us about Australia.", "2")}
{more("Repères pour la classe", "<p>Ces peintres appartiennent à l'école de Heidelberg. Pour l'art aborigène contemporain (Namatjira, Kngwarreye), montrez les œuvres depuis les sites des musées, sans les reproduire : elles sont encore protégées.</p>")}
'''
    page("s1/index.html", f"{TITLE} · Séance 1",
         "Head off to Australia, séance 1 : regarder et parler à partir de quatre tableaux.",
         f"{BASE}/s1/", body)

def build_s2():
    body = f'''
<p class="kicker">Séance 2 · CE, EOC</p>
<h1>26 January: one date, two names</h1>
{cadre(["CE", "EOC"], [
    ("0-5 min", "Accueil et rappel du devoir."),
    ("5-25 min", "Lecture du texte, crayon à la main, questions guidées."),
    ("25-40 min", "Frise orale : trois dates, une phrase chacune."),
    ("40-48 min", "Trace écrite : Acknowledgement of Country."),
    ("48-52 min", "Devoir : trois dates, une phrase chacune."),
], "recopie trois dates de la frise et une phrase pour chacune")}
{reading("Read this text (CE)", '''
<p>On 26 January every year, many Australians celebrate Australia Day with barbecues, fireworks and flags.</p>
<p>But for many Aboriginal people, this date marks the beginning of invasion, the loss of their land and the destruction of their families. Some call it "Invasion Day" or "Survival Day".</p>
<p>Today, speakers often begin with an "Acknowledgement of Country": they recognise the traditional owners of the land. For a young visitor, understanding this debate is a way to respect the people who have lived there for more than 65,000 years.</p>
''')}
{student(
    "Read the text once, then again with a pencil.",
    "★ What happens on 26 January? Give two examples.",
    "★ Find two other names for this day.",
    "★ What is an Acknowledgement of Country?",
    "★★ Why is the date controversial? Write three lines in your own words.",
    "★★ Give one argument for changing the date, and one against.",
)}
{prof("20 minutes de CE, puis 10 minutes d'EOC (frise).",
    "Lecture silencieuse, puis questions ★ / ★★ selon les groupes.",
    "EOC : chaque élève choisit trois dates de la frise (volet ci-dessous) et les présente en une minute.",
    "Mots utiles : settlers, convicts, colony, land rights, apology, referendum.",
    answers="<p>1. Barbecues, fireworks, flags. 2. Invasion Day, Survival Day. 3. A statement that recognises the traditional owners of the land. 4. 26 January 1788: arrival of the First Fleet, beginning of dispossession. 5. Réponse personnelle.</p>"
)}
{more("Frise historique (à projeter ou à photocopier)", '''
<ul>
<li>At least 65,000 years ago: Aboriginal and Torres Strait Islander peoples live on the continent.</li>
<li>1770: Cook lands at Botany Bay and claims the east coast for Britain.</li>
<li>26 January 1788: the First Fleet arrives in Sydney Cove with convicts.</li>
<li>1850s: gold rushes. Migrants from Europe and China.</li>
<li>1 January 1901: Federation. The "White Australia" policy begins.</li>
<li>1915: Gallipoli. Anzac Day, 25 April.</li>
<li>1910s to 1970s: the Stolen Generations.</li>
<li>1967: referendum, Aboriginal people counted in the census.</li>
<li>1970s: end of the White Australia policy.</li>
<li>1992: the Mabo decision. The High Court rejects "terra nullius".</li>
<li>13 February 2008: Kevin Rudd says "Sorry".</li>
<li>2023: Australians vote "No" to a Voice to Parliament.</li>
</ul>
<p><a href="https://www.youtube.com/results?search_query=Kevin+Rudd+apology+Stolen+Generations+2008">The 2008 Apology</a> · <a href="https://www.youtube.com/results?search_query=Acknowledgement+of+Country+explained">Acknowledgement of Country</a></p>
''')}
{trace("26 January is Australia Day for some people, and Invasion Day or Survival Day for others.")}
{homework("Learn three dates from the timeline. For each one, write one sentence: what happened, and why it still matters today.", "3")}
'''
    page("s2/index.html", f"{TITLE} · Séance 2",
         "Head off to Australia, séance 2 : le 26 janvier et une courte frise historique.",
         f"{BASE}/s2/", body)

def build_s3():
    body = f'''
<p class="kicker">Séance 3 · EE, EOC, EOI</p>
<h1>Who lives in Australia today?</h1>
{cadre(["EE", "EOC", "EOI"], [
    ("0-5 min", "Accueil et consigne des jeux de rôle."),
    ("5-20 min", "Préparation en binômes : où vivent les gens, l'outback, les First Nations."),
    ("20-35 min", "Jeux de rôle, puis mise en commun."),
    ("35-47 min", "Trace écrite."),
    ("47-52 min", "Devoir : message de 8 à 10 lignes à un ami en France."),
], "écris cinq phrases sur qui vit en Australie aujourd'hui")}
{student(
    "Work in pairs. Student A is a newcomer. Student B is an Australian friend.",
    "Ask and answer: Where do most people live? Why? What is the outback?",
    "Name two challenges for First Nations people today.",
    "★★ Explain why climate change is a serious issue in Australia. Give two examples.",
    "Write 5 sentences in your notebook after the dialogue.",
)}
{prof("15 minutes de préparation, 10 minutes de jeux de rôle, 10 minutes de traces.",
    "Donnez les faits du volet « Pour en savoir plus » après une première tentative, pas avant.",
    "Rappel : presque 90 % des habitants vivent près des côtes, surtout à l'est et au sud-est.",
    "Chiffres à faire vérifier : recensement 2021, Bureau of Meteorology, healthdirect.",
    answers="<p>Most people live on the east and south-east coasts (Sydney, Melbourne, Brisbane). The centre is very dry. Challenges: health, housing, education, land rights, the Stolen Generations. Climate: bushfires, drought, floods, the Great Barrier Reef.</p>"
)}
{more("Faits pour le jeu de rôle", '''
<ul>
<li>About 26 million people, almost 90% on the coasts. Cities: Sydney, Melbourne, Brisbane, Perth, Adelaide, Canberra, Darwin, Hobart.</li>
<li>The outback is the vast, dry inland.</li>
<li>First Nations peoples have lived there for more than 65,000 years. They still face inequalities in health, housing, education and land rights.</li>
<li>Climate: bushfires, droughts, floods. The Great Barrier Reef is under pressure.</li>
</ul>
''')}
{trace("Most Australians live on the coast. The outback is huge and dry. First Nations history is still part of daily life.")}
{homework("Write a short message (8 to 10 lines) to a friend in France: three things about Australian society that surprise you.", "4")}
'''
    page("s3/index.html", f"{TITLE} · Séance 3",
         "Head off to Australia, séance 3 : qui vit en Australie aujourd'hui.",
         f"{BASE}/s3/", body)

def build_s4():
    body = f'''
<p class="kicker">Séance 4 · CE, EOI</p>
<h1>Animals that scare some people</h1>
{cadre(["CE", "EOI"], [
    ("0-5 min", "Accueil, consigne, distribution des textes."),
    ("5-25 min", "Lecture : quatre animaux, deux règles officielles, comparaison des chiffres."),
    ("25-40 min", "Échange oral en binômes : ces animaux vous empêcheraient-ils de partir ?"),
    ("40-48 min", "Trace écrite."),
    ("48-52 min", "Devoir : 8 à 10 lignes, un fait officiel et une raison personnelle."),
], "recopie deux règles de sécurité officielles et le nom de quatre animaux")}
{fig("nourlangie-rock-art.jpg",
     "Aboriginal rock art at Nourlangie, Kakadu: a hunter and a kangaroo painted on stone.",
     "Un chasseur et un kangourou, peints sur la roche à Kakadu. Les animaux font partie du pays depuis très longtemps.",
     "Photo Ianperegian, Anbangbang / Burrunggui (Nourlangie), Kakadu, 4 juillet 2009, CC BY-SA 4.0, via Wikimedia Commons.")}

{reading("★ · Read this text", '''
<p>Many people think of Australia as a dangerous country because of its animals: snakes, spiders, crocodiles, sharks and jellyfish. Films and social media often show only the scary side.</p>
<p>Official health advice gives a calmer picture. In Australia, only about one to four people die from snake bites each year. Shark attacks and crocodile attacks are also rare. Far more people die on the roads.</p>
<p>You can still stay safe. Never walk in long grass in bare feet. Do not put your hands into holes. In the north, respect Croc Country signs. In Queensland, in stinger season (November to May), swim between the flags and wear a stinger suit if needed. If a snake bites you, call 000, keep still, and use a pressure bandage. Do not wash, cut or suck the wound.</p>
''')}
{reading("★★ B2 · A closer look at the figures", '''
<p>Healthdirect Australia says there are about 3,000 snake bites a year, but only one to four deaths. Funnel-web spiders are a medical emergency; redback bites are usually not life-threatening if treated. In Queensland, snakes and sharks each cause fewer than three deaths a year, while more than 1,300 people died on Australian roads in 2025.</p>
<p>A 2023 comparison presented to the Australian Parliament is useful in class: in one recent year, 4,105 people died from falls, 204 from drowning, 5 from shark attacks, 2 from snakes and 1 from a crocodile. The reputation is stronger than the official risk. Still, fear is real, and some young people may decide not to go.</p>
<p>Sources to check in class: healthdirect.gov.au, Queensland Government, the Bureau of Infrastructure and Transport Research Economics.</p>
''')}
{student(
    "Read your level text.",
    "List four animals that scare some visitors.",
    "Find two official safety rules.",
    "Compare animal deaths and road deaths. What do you notice?",
    "EOI, 2 minutes: Would this stop you from going? Give one reason yes, or one reason no.",
)}
{prof("20 minutes de CE, 10 minutes d'EOI en binômes, 5 minutes de traces.",
    "Commencez par l'image, puis le texte du niveau, puis la discussion.",
    "Le but n'est pas de rassurer à tout prix, ni d'effrayer : donner des faits, puis laisser chacun répondre.",
    "Faites revérifier les chiffres sur healthdirect et le site du Queensland.",
    answers="<p>Animals often named: snakes, spiders, crocodiles, sharks, jellyfish. Rules: shoes in long grass, no hands in holes, Croc Country signs, swim between the flags, call 000, pressure bandage, do not wash or suck the bite. Road deaths are far higher than animal deaths. The last question is personal.</p>"
)}
{trace("Some animals in Australia can be dangerous, but official figures show that deaths are rare. You stay safer if you follow local rules. Fear can still stop some people from going.")}
{homework("Write 8 to 10 lines: Would these animals stop you from going to Australia? Use one official fact and one personal reason.", "5")}
{more("Chiffres et gestes officiels", "<p>Morsures de serpent : 1 à 4 décès par an (healthdirect). Premiers secours : 000, bandage compressif, ne pas laver, couper ou sucer la plaie. Funnel-web : urgence. Queensland : « Croc Country », saison des méduses novembre à mai, nager entre les drapeaux. Routes : plus de 1 300 décès en 2025, bien plus que requins ou serpents.</p>")}
'''
    page("s4/index.html", f"{TITLE} · Séance 4",
         "Head off to Australia, séance 4 : les animaux qui font peur, faits officiels et discussion.",
         f"{BASE}/s4/", body)

def build_s5():
    body = f'''
<p class="kicker">Séance 5 · CE, EE</p>
<h1>Getting there, getting around, FIFO</h1>
{cadre(["CE", "EE"], [
    ("0-5 min", "Accueil et consigne."),
    ("5-25 min", "Lecture : vol, trains, distances, fly-in fly-out (FIFO)."),
    ("25-42 min", "Parcours en binômes : un itinéraire France-Australie, un trajet intérieur, une phrase sur le FIFO."),
    ("42-48 min", "Trace écrite."),
    ("48-52 min", "Devoir : 8 à 10 lignes sur l'itinéraire, plus une phrase sur le FIFO."),
], "écris ce que signifie FIFO et le temps de vol depuis la France")}
{fig("streeton-fires-on.jpg",
     "Arthur Streeton, Fire's On, 1891: workers and a cutting in a blue Australian landscape.",
     "Creuser, relier, traverser un pays immense : le travail et les distances.",
     "Arthur Streeton, Fire's On, 1891, Art Gallery of New South Wales. Domaine public.")}

{reading("★ · Read this text", '''
<p>There is no regular direct flight from Paris to Sydney. The trip is about 17,000 kilometres. With one stop, it usually takes 22 to 24 hours. Book your ticket only after your visa is granted. Home Affairs often needs about three months to process a Working Holiday visa.</p>
<p>Australia is a huge country. People use domestic flights, long-distance coaches, cars, and two famous trains: The Ghan (Adelaide to Darwin, 2,979 km, about 48 hours) and the Indian Pacific (Sydney to Perth, 4,352 km, about 68 hours).</p>
<p>In the mining regions, especially in the Pilbara in Western Australia, many workers are FIFO: fly-in fly-out. Small planes, often charter flights from Perth, take them to the mine for a roster such as 8 days on and 6 days off, or 2 weeks on and 1 week off. Shifts can last 12 to 12.5 hours.</p>
''')}
{reading("★★ B2 · FIFO and the Working Holiday visa", '''
<p>FIFO can pay well, and you go home between rosters. It can also be hard: long shifts, isolation, heat, and time away from friends. A first Working Holiday visa (subclass 417) does not automatically open a FIFO job. Mines often want experience and safety tickets. Condition 8547 usually limits work with the same employer to six months, unless an exemption applies. Check the official page before you apply.</p>
''')}
{student(
    "How long is the flight from France, and why is there usually a stop?",
    "Name two ways to travel across Australia, and give one distance or time.",
    "What does FIFO mean? Where is it common?",
    "★★ Would you accept a FIFO job? Give one advantage and one drawback.",
    "Plan a simple route: city of arrival, one trip inland or to another city, one way to come back.",
)}
{prof("20 minutes de CE, 15 minutes de parcours en binômes.",
    "Projetez l'image, puis un plan de l'Australie (sans le recopier : un fond de carte libre ou le tableau).",
    "Terme exact : fly-in fly-out, souvent abrégé FIFO. Pas « Fly and Fly Out » dans les documents élèves.",
    "Le visa 417 n'est pas un ticket automatique pour les mines. Condition 8547 : en général 6 mois chez le même employeur.",
    answers="<p>About 17,000 km, usually 22 to 24 hours, one stop; no regular direct Paris-Sydney flight. Ghan: 2,979 km, about 48 h. Indian Pacific: 4,352 km, about 68 h. FIFO: workers fly to the mine and home again, often from Perth to the Pilbara. Advantage: pay, time off. Drawback: isolation, long shifts. Last task is personal.</p>"
)}
{trace("The flight is long. Australia is huge, so people fly, drive or take trains such as The Ghan. FIFO means fly-in fly-out: workers fly to the mine, then home again.")}
{homework("Write 8 to 10 lines: your route from France to one Australian city, then one trip inside the country. Add one sentence about FIFO.", "6")}
{more("Chiffres à revérifier", "<p>Paris-Sydney : environ 17 000 km, 22 à 24 h, une escale. Traitement du visa : souvent 3 mois, ne pas réserver avant l'accord. The Ghan : 2 979 km, environ 48 h. Indian Pacific : 4 352 km, environ 68 h (Journey Beyond). FIFO : Pilbara, charters souvent depuis Perth, cycles 8/6 ou 2/1, postes de 12 à 12,5 h (Fortescue, WA Transport).</p>")}
'''
    page("s5/index.html", f"{TITLE} · Séance 5",
         "Head off to Australia, séance 5 : le vol, les distances et le fly-in fly-out.",
         f"{BASE}/s5/", body)

def build_s6():
    body = f'''
<p class="kicker">Séance 6 · CE, EE</p>
<h1>Which visa?</h1>
{cadre(["CE", "EE"], [
    ("0-5 min", "Accueil, tableau des visas au tableau."),
    ("5-30 min", "Lecture du tableau, questions sur le 417 (tarif, fonds, âge, billet)."),
    ("30-42 min", "Médiation : expliquer le 417 à un parent, en six lignes."),
    ("42-48 min", "Trace écrite."),
    ("48-52 min", "Devoir : recopier le titre officiel, la date, le tarif, les fonds, l'âge et une règle."),
], "recopie le prix du visa 417, l'âge et une règle à ne pas oublier", mediation=True)}
<table>
<thead><tr><th>Visa</th><th>Who</th><th>Key facts (Nov. 2026)</th></tr></thead>
<tbody>
<tr><td>417 Working Holiday</td><td>18-35 (France: check the official list)</td><td>AUD 840 since 1 July 2026. Funds: about AUD 5,000 plus a return ticket. Usually 6 months with the same employer (condition 8547).</td></tr>
<tr><td>651 eVisitor</td><td>Short tourism or business</td><td>Short stay. Not for a year of work.</td></tr>
<tr><td>500 Student</td><td>If you enrol in a course</td><td>Fee AUD 2,500 since 1 July 2026.</td></tr>
<tr><td>482 Temporary Skill Shortage</td><td>If a skilled job is offered</td><td>Employer-sponsored. Not the usual first step at 19.</td></tr>
</tbody>
</table>
{student(
    "Look at the table. Which visa is for a year of work and travel?",
    "How much is the 417 visa in Australian dollars? About how much is that in euros, if €1 = AUD 1.62?",
    "What money must you show, besides the visa fee?",
    "When should you buy your plane ticket? Why?",
    "★★ Read condition 8547. Why does it matter if you hope to work in a mine?",
)}
{prof("25 minutes. Tableau d'abord, puis questions, puis médiation : expliquer le 417 à un parent en français, 6 lignes.",
    "Les élèves revérifient sur immi.homeaffairs.gov.au. L'âge 18-35 pour la France est à confirmer sur la page officielle (tableau parfois chargé en JavaScript).",
    "Ne pas réserver le vol avant l'accord du visa (délai souvent d'environ 3 mois).",
    answers="<p>417. Fee: AUD 840, about €520 at 1.62. Funds: about AUD 5,000 plus a return ticket. Buy the ticket after the visa is granted. 8547 usually limits work with one employer to 6 months, which can clash with some FIFO contracts unless an exemption applies.</p>"
)}
{trace("For a year of work and travel, the usual visa is the 417 Working Holiday visa. Check the fee, your age, your funds, and condition 8547 on the official website.")}
{homework("Copy the official 417 page title and today's date. Write 6 lines: fee, funds, age, and one rule you must not forget.", "7")}
{more("Liens officiels", '''
<ul>
<li><a href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/work-holiday-417">Working Holiday 417</a></li>
<li><a href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/fees-and-charges/current-visa-pricing">Current visa pricing</a></li>
<li><a href="https://www.studyaustralia.gov.au/">Study Australia</a> (student visa 500)</li>
</ul>
''')}
'''
    page("s6/index.html", f"{TITLE} · Séance 6",
         "Head off to Australia, séance 6 : choisir et vérifier un visa.",
         f"{BASE}/s6/", body)

def build_s7():
    body = f'''
<p class="kicker">Séance 7 · CE, EE, EOI</p>
<h1>Lea's bag at customs</h1>
{cadre(["CE", "EE", "EOI"], [
    ("0-5 min", "Accueil et sac de Léa."),
    ("5-25 min", "Activité : que déclarer, ce qui pose problème, When in doubt..."),
    ("25-40 min", "Mise en commun et barème."),
    ("40-48 min", "Trace écrite."),
    ("48-52 min", "Devoir : liste de 8 objets pour son propre sac, avec ce qu'il faut déclarer."),
], "dresse la liste de ce que Léa doit déclarer, en cinq lignes", mediation=True)}
<table>
<thead><tr><th>What</th><th>Rule (check ABF)</th></tr></thead>
<tbody>
<tr><td>Alcohol</td><td>Duty-free allowance: 2.25 litres.</td></tr>
<tr><td>Cigarettes</td><td>25 cigarettes.</td></tr>
<tr><td>Other goods</td><td>AUD 900.</td></tr>
<tr><td>Cash</td><td>Declare AUD 10,000 or more.</td></tr>
<tr><td>Food, plants, animal products</td><td>Declare them. When in doubt, declare.</td></tr>
</tbody>
</table>
{student(
    "Léa packed: a ham sandwich, two litres of wine, a wooden spoon from home, and AUD 11,000 in cash.",
    "What must she declare? What can be a problem?",
    "Complete this sentence: When in doubt, ...",
    "Does declaring cost money? Answer in one sentence.",
    "★★ Write 5 lines to Léa, in English, before she boards the plane.",
)}
{prof("20 minutes. Activité d'abord, barème ensuite.",
    "Insistez : déclarer ne coûte rien. Cacher un produit alimentaire peut coûter cher.",
    "Sources : Australian Border Force. Faites revérifier les seuils.",
    answers="<p>Declare: the sandwich (food), the wooden spoon (wood), the cash (over 10,000). The wine is under 2.25 L if it is her only alcohol, but she should still be ready to show it. When in doubt, declare. Declaring does not cost you anything.</p>"
)}
{trace("At the border, declare food, plants, animal products, wood, and cash of AUD 10,000 or more. When in doubt, declare. Declaring does not cost you anything.")}
{homework("Make a checklist of 8 items for your own bag. Tick what you must declare.", "8")}
{more("Site officiel", '<p><a href="https://www.abf.gov.au/entering-and-leaving-australia/going-through-border-control/what-can-i-bring">Australian Border Force · What can I bring?</a></p>')}
'''
    page("s7/index.html", f"{TITLE} · Séance 7",
         "Head off to Australia, séance 7 : le sac de Léa à la douane.",
         f"{BASE}/s7/", body)

def build_s8():
    body = f'''
<p class="kicker">Séance 8 · CE, EE</p>
<h1>Money, wages, a simple budget</h1>
{cadre(["CE", "EE"], [
    ("0-5 min", "Accueil, ouverture du calculateur (ou figures au tableau)."),
    ("5-30 min", "Saisie des chiffres, lecture des résultats, copie de quatre nombres."),
    ("30-42 min", "Commentaire : ce budget suffit-il à Sydney ou en ville plus petite ?"),
    ("42-48 min", "Trace écrite."),
    ("48-52 min", "Devoir : recalculer avec 25 heures, puis un loyer à 400 AUD."),
], "recopie quatre chiffres du calculateur : coût du départ, salaire, reste, réserve")}
<p>Use the calculator. Figures are from November 2026. Always check again on official sites.</p>
<form class="calc" id="budget-calc" action="#" onsubmit="return false;">
<p><strong>Before you leave</strong></p>
<div class="calc-grid">
<div><label for="rate">AUD for €1</label><input id="rate" type="number" step="0.01" value="1.62"></div>
<div><label for="savings">Savings (€)</label><input id="savings" type="number" step="1" value="4000"></div>
<div><label for="flight">Return flight (€)</label><input id="flight" type="number" step="1" value="1400"></div>
<div><label for="visa">Visa (AUD)</label><input id="visa" type="number" step="1" value="840"></div>
<div><label for="insurance">Insurance, 1 year (€)</label><input id="insurance" type="number" step="1" value="440"></div>
<div><label for="passport">Passport (€)</label><input id="passport" type="number" step="1" value="86"></div>
</div>
<p><strong>In Australia, every week (AUD)</strong></p>
<div class="calc-grid">
<div><label for="rent">Rent</label><input id="rent" type="number" step="1" value="250"></div>
<div><label for="food">Food</label><input id="food" type="number" step="1" value="120"></div>
<div><label for="transport">Transport</label><input id="transport" type="number" step="1" value="50"></div>
<div><label for="phone">Phone and going out</label><input id="phone" type="number" step="1" value="40"></div>
</div>
<p><strong>Your job</strong></p>
<div class="calc-grid">
<div><label for="wage">Wage (AUD / hour)</label><input id="wage" type="number" step="0.01" value="33"></div>
<div><label for="hours">Hours a week</label><input id="hours" type="number" step="1" value="30"></div>
<div><label for="tax">Tax (%)</label><input id="tax" type="number" step="0.1" value="15"></div>
<div><label for="weeksWait">Weeks before first job</label><input id="weeksWait" type="number" step="1" value="2"></div>
</div>
<div class="calc-out" id="calc-results" aria-live="polite"></div>
</form>
{student(
    "Enter your own figures, or keep the ones already there.",
    "Read the results: cost of leaving, weekly pay after tax, money left each week, and money left after the first weeks without a job.",
    "Copy four numbers into your notebook.",
    "★★ Is this budget enough for a first month in Sydney or in a smaller town? Write 5 lines.",
)}
{prof("25 minutes. Calculatrice d'abord, commentaire ensuite.",
    "Taux retenu en classe : 1 € ≈ AUD 1,62 (Banque de France, 13 novembre 2026 : 1,6288). Salaire minimum : AUD 26,44 / heure depuis le 1er juillet 2026, soit environ 33 en casual (+25 %). Impôt WHM : 15 % sur les premiers AUD 45 000 (ATO).",
    "Les élèves doivent dire d'où vient chaque chiffre.",
    answers="<p>With the default figures: visa AUD 840 ≈ €519. Leaving costs (flight, visa, insurance, passport) are shown in euros and AUD. 30 h × 33 AUD = 990, minus 15% tax ≈ 842 AUD a week. Weekly costs 250+120+50+40=460. Left after costs ≈ 382 AUD. Savings of €4,000 may be under the official AUD 5,000 guidance: check Home Affairs. Tight in a big city if rent rises.</p>"
)}
{trace("Change euros into Australian dollars before you leave. Check the official minimum wage, tax, and your rent. A casual job does not always cover a big city.")}
{homework("Recalculate with 25 hours a week, then with rent at AUD 400. Write 6 lines: what changes for you?", "9")}
{more("Sources", '''
<ul>
<li><a href="https://www.fairwork.gov.au/starting-employment/minimum-wages">Fair Work Ombudsman · minimum wages</a></li>
<li><a href="https://www.banque-france.fr/fr/taux-de-change">Banque de France · taux de change</a></li>
<li><a href="https://www.ato.gov.au/">Australian Taxation Office</a></li>
</ul>
''')}
'''
    page("s8/index.html", f"{TITLE} · Séance 8",
         "Head off to Australia, séance 8 : argent, salaire et calculateur de budget.",
         f"{BASE}/s8/", body)

def build_s9():
    body = f'''
<p class="kicker">Séance 9 · EE, EOI</p>
<h1>Jobs, resume, interview</h1>
{cadre(["EE", "EOI"], [
    ("0-5 min", "Accueil et choix du métier."),
    ("5-20 min", "Rédaction du CV d'une page."),
    ("20-38 min", "Entretien téléphonique en binômes, deux minutes, trois questions."),
    ("38-47 min", "Trace écrite : why this job, when you can start."),
    ("47-52 min", "Devoir : finir le CV et préparer les trois réponses."),
], "écris cinq lignes : pourquoi ce travail, et quand tu peux commencer")}
{student(
    "Choose one job: café, farm, hotel, warehouse, or (★★) a FIFO mine role.",
    "Write a one-page resume: name, contacts, skills, two experiences, availability.",
    "Write 5 lines: why this job, and when you can start.",
    "In pairs, act the phone interview: 3 questions, 3 answers, two minutes.",
    "★★ Add one safety ticket or one limit of visa condition 8547 if you chose FIFO.",
)}
{prof("15 minutes de CV, 15 minutes d'entretien en binômes.",
    "Rappel : le visa 417 n'ouvre pas tout seul un poste FIFO. Les mines demandent souvent de l'expérience et des habilitations.",
    "Questions types : Why Australia? When can you start? Have you worked in a team? What would you do if you were late?",
    answers="<p>Look for a clear layout, action verbs, and honest dates. Interview: short answers, repeat the question if needed, thank the person at the end.</p>"
)}
{trace("A short, clear resume helps. In the interview, answer in full sentences and give one example.")}
{homework("Finish your resume at home. Write the answers to these three questions: Why Australia? Why this job? When can you start?", "10")}
'''
    page("s9/index.html", f"{TITLE} · Séance 9",
         "Head off to Australia, séance 9 : emplois, CV et entretien.",
         f"{BASE}/s9/", body)

def build_s10():
    body = f'''
<p class="kicker">Séance 10 · CE, EE</p>
<h1>Studying in Australia</h1>
{cadre(["CE", "EE"], [
    ("0-5 min", "Accueil et tableau France / Australie."),
    ("5-25 min", "Comparaison : années scolaires, cursus, frais, visa 500."),
    ("25-40 min", "Écrit : travailler un an, ou étudier ?"),
    ("40-47 min", "Trace écrite."),
    ("47-52 min", "Devoir : 8 lignes, un chiffre officiel."),
], "recopie le tarif du visa 500 et une différence entre la France et l'Australie")}
{student(
    "Complete the table in your notebook: France / Australia, for school years, a typical tertiary course, and fees.",
    "If you chose a student visa 500, what is the fee in AUD (November 2026)?",
    "★★ Would you rather work for a year, or study? Give two reasons.",
)}
{prof("20 minutes de comparaison, 10 minutes d'écrit.",
    "Faites chercher « Study Australia » et le coût du visa 500 (AUD 2 500 depuis le 1er juillet 2026).",
    "Ne donnez pas un cours sur tout le système : un tableau suffit.",
    answers="<p>Student visa 500 fee: AUD 2,500 from 1 July 2026 (Study Australia). The comparison table and the last choice are personal, but should use two clear criteria (cost, time, language, work rights).</p>"
)}
{more("Repères courts", '''
<ul>
<li>School years run from January or February to December.</li>
<li>TAFE and universities have their own calendars and fees.</li>
<li>A student visa is not the same as a Working Holiday visa: check work rights and cost on official pages.</li>
</ul>
''')}
{trace("If you want to study, check the course, the dates, the fees, and visa 500 on official sites. It is not the same path as a Working Holiday year.")}
{homework("Write 8 lines: work for a year, or study? Use one official figure.", "11")}
'''
    page("s10/index.html", f"{TITLE} · Séance 10",
         "Head off to Australia, séance 10 : étudier en Australie.",
         f"{BASE}/s10/", body)

def build_s11():
    body = f'''
<p class="kicker">Séance 11 · CE, EE</p>
<h1>Who to contact, and how to fill in a form</h1>
{cadre(["CE", "EE"], [
    ("0-5 min", "Accueil, ouverture d'un lien officiel."),
    ("5-25 min", "Copie du titre et de la date, formulaire d'entraînement."),
    ("25-42 min", "Courriel à l'ambassade (passeport perdu) ; pour les plus à l'aise, courriel à Fair Work."),
    ("42-48 min", "Trace écrite."),
    ("48-52 min", "Devoir : reprendre le courriel en six phrases courtes."),
], "recopie le titre exact d'une page officielle et la date du jour", mediation=True)}
<ul>
<li><a href="https://www.diplomatie.gouv.fr/fr/information-par-pays/australie/dernieres-minutes-et-alertes">France Diplomatie · Australie</a></li>
<li><a href="https://au.ambafrance.org/">Ambassade de France en Australie</a></li>
<li><a href="https://immi.homeaffairs.gov.au/">Department of Home Affairs</a></li>
<li><a href="https://www.fairwork.gov.au/">Fair Work Ombudsman</a> (wages and rights at work)</li>
<li><a href="https://www.healthdirect.gov.au/">healthdirect</a></li>
</ul>
<div class="form-practice" aria-label="Practice form">
<p><strong>Practice form</strong> (do not send this page)</p>
<p>Family name</p><div class="slot"></div>
<p>Given names</p><div class="slot"></div>
<p>Date of birth (DD/MM/YYYY)</p><div class="slot"></div>
<p>Passport number</p><div class="slot"></div>
<p>Visa type and number</p><div class="slot"></div>
<p>Address in Australia</p><div class="slot"></div>
<p>Emergency contact in France</p><div class="slot"></div>
</div>
{student(
    "Open one official link. Copy the exact title of the page and today's date.",
    "Fill in the practice form with invented but realistic details.",
    "Write a short email (8 lines) to the embassy: you have lost your passport. Ask what to do.",
    "★★ Add a second email to Fair Work: your boss paid you less than the minimum wage.",
)}
{prof("25 minutes. Formulaires d'abord, courriels ensuite.",
    "Vérifiez que les liens s'ouvrent. Si une page officielle change, notez-le avec la classe.",
    "Modèle de courriel : objet clair, politesse, faits, question, coordonnées.",
    answers="<p>Email: clear subject (Lost passport / Underpayment), polite opening, facts (where, when), a direct question, name and phone number. Do not send personal data from the classroom form to a real service.</p>"
)}
{trace("Keep official contacts at hand. On a form, write clearly, use the date format asked, and check every box before you send.")}
{homework("Write the embassy email again, this time in 6 short sentences, no drafts left on the desk.", "12")}
'''
    page("s11/index.html", f"{TITLE} · Séance 11",
         "Head off to Australia, séance 11 : contacts officiels et formulaires.",
         f"{BASE}/s11/", body)

def build_s12():
    body = f'''
<p class="kicker">Séance 12 · CO, EOC, EOI</p>
<h1>Aussie English</h1>
{cadre(["CO", "EOC", "EOI"], [
    ("0-5 min", "Accueil et lexique au tableau (y compris sunnies, barbie, mates)."),
    ("5-22 min", "Écoute de la vidéo d'Elena (une voisine à une plage surveillée, Sydney). Trois écoutes possibles, mots cochés."),
    ("22-40 min", "Dialogue en binômes (arvo, servo, brekkie, barbie)."),
    ("40-47 min", "Trace écrite."),
    ("47-52 min", "Devoir : six mots, dialogue de six lignes au café."),
], "apprends six mots du tableau et écris un mini-dialogue de quatre répliques")}
<table>
<thead><tr><th>You may hear</th><th>It often means</th></tr></thead>
<tbody>
<tr><td>G'day</td><td>Hello</td></tr>
<tr><td>Arvo</td><td>Afternoon</td></tr>
<tr><td>Brekkie</td><td>Breakfast</td></tr>
<tr><td>Servo</td><td>Service station</td></tr>
<tr><td>Bottle-o</td><td>Bottle shop</td></tr>
<tr><td>Maccas</td><td>McDonald's</td></tr>
<tr><td>Uni</td><td>University</td></tr>
<tr><td>No worries</td><td>That's fine / you're welcome</td></tr>
<tr><td>Fair dinkum</td><td>Genuine, true</td></tr>
<tr><td>TA</td><td>Thank you</td></tr>
<tr><td>Sunnies</td><td>Sunglasses</td></tr>
<tr><td>Barbie</td><td>Barbecue</td></tr>
<tr><td>Mates</td><td>Friends</td></tr>
</tbody>
</table>
<article class="voice-card" id="voice-elena-s12">
<h3>Listen: Elena. A neighbour at a patrolled beach in Sydney</h3>
<video controls preload="metadata" playsinline controlslist="nodownload" title="Elena. A neighbour at a patrolled beach in Sydney">
<source src="{BASE}/videos/elena.mp4" type="video/mp4">
Cette vidéo peut être téléchargée ici : <a href="{BASE}/videos/elena.mp4">Elena</a>.
</video>
<p class="notice">This video is one of the Australian voices. You may listen three times. The other voices stay on the home page, in Listening.</p>
</article>
{student(
    "Watch Elena's video. You may listen three times.",
    "Tick the words you hear: G'day, sunnies, arvo, barbie, mates, How's it going.",
    "In pairs, say this dialogue: meeting at 3 pm, going to the servo, then brekkie tomorrow.",
    "★★ Write 4 lines in Aussie English, then rewrite them in standard English.",
)}
{prof("15 minutes d'écoute de la vidéo d'Elena, 15 minutes de dialogue.",
    "La vidéo d'Elena (environ 23 secondes) est dans cette séance : c'est une des Australian voices. Les trois autres restent sur la page d'accueil, à Listening.",
    "Première écoute sans script, puis avec le script si besoin, puis sans. Le tableau n'est pas un cours de slang : 8 à 10 mots suffisent.",
    answers="<p>Elena says: G'day, sunnies, sunscreen, swim between the red and yellow flags, Saturday arvo, mates, barbie, How's it going so far? Sample dialogue: G'day, see you this arvo at the servo. No worries. Let's have brekkie tomorrow before uni.</p>"
)}
{trace("Australian English uses short, friendly words. You can still answer in standard English, and people will understand you.")}
{homework("Learn 6 words from the table. Write a 6-line dialogue at a café.", "13")}
'''
    page("s12/index.html", f"{TITLE} · Séance 12",
         "Head off to Australia, séance 12 : Aussie English.",
         f"{BASE}/s12/", body)

def build_s13():
    body = f'''
<p class="kicker">Séance 13 · EOI, EE</p>
<h1>Living there: rent, health, the big question</h1>
{cadre(["EOI", "EE"], [
    ("0-5 min", "Accueil et consignes du débat."),
    ("5-18 min", "Préparation : un coût trouvé sur un site sérieux, avec la source."),
    ("18-40 min", "Débat de deux minutes : l'Australie est-elle vraiment le pays des opportunités ?"),
    ("40-48 min", "Trace écrite."),
    ("48-52 min", "Devoir : 12 à 15 lignes, à apporter pour l'évaluation."),
], "écris cinq lignes : un argument pour, un argument contre, et ton avis")}
{student(
    "In groups of three, share one cost (rent, food, or a doctor's visit) that you found on an official or serious site. Give the source.",
    "Prepare a 2-minute debate: Is Australia really the land of opportunity for a young French person?",
    "Give one argument yes, one argument no, and your own answer.",
    "Use at least one figure from a previous lesson (visa, wage, flight, or safety).",
)}
{prof("15 minutes de préparation, 20 minutes de débat, 5 minutes de traces.",
    "Rappeler le fil de la séquence : argent, visa, distances, peur des animaux, travail, y compris FIFO.",
    "Noter l'usage des chiffres et la clarté, pas seulement l'opinion.",
    answers="<p>There is no single right answer. A strong turn uses one official figure, one personal criterion, and a clear conclusion.</p>"
)}
{trace("Opportunity depends on your visa, your money, your job, and what you can accept (distance, fear, isolation). Official figures help you decide.")}
{homework("Write 12 to 15 lines: your answer to the big question. Bring it to the assessment lesson.", "d'évaluation")}
'''
    page("s13/index.html", f"{TITLE} · Séance 13",
         "Head off to Australia, séance 13 : vivre là-bas et la question finale.",
         f"{BASE}/s13/", body)

def build_assessment():
    body = f'''
<p class="kicker">Évaluation</p>
<h1>Your file and your phone interview</h1>
{cadre(["EOI", "EE", "EOC"], [
    ("0-8 min", "Remise des dossiers, vérification de la composition."),
    ("8-50 min", "Entretiens individuels (3 à 4 minutes). Le reste de la classe prépare silencieusement les réponses, puis relit le dossier."),
    ("50-52 min", "Rappel : dossier complet, une figure officielle au moins une fois."),
], "prépare par écrit tes réponses aux trois questions de l'entretien")}
<p>Le dossier et l'entretien ci-dessous sont la tâche de fin de séquence. Ils constituent un entraînement utile à la situation B du CCF, mais ce n'est pas le CCF lui-même.</p>
<h2>Tâche de fin de séquence</h2>
<p>You hand in a file. Then you pass a short phone interview.</p>
<div class="grid">
<article class="card"><h3>The file</h3>
<ul>
<li>Letter of motivation (one page)</li>
<li>Resume (one page)</li>
<li>Practice forms, filled in</li>
<li>Visa notes (type, fee, funds, one rule)</li>
<li>A budget (use the calculator)</li>
<li>Two official contacts</li>
</ul></article>
<article class="card"><h3>The interview</h3>
<p>★ parcours guidé : 5 minutes, 4 questions.</p>
<p>★★ parcours plus ouvert : 8 minutes, 6 questions, including one on FIFO or on animals and safety. This track may aim at B2, the level targeted at the end of studies in langue vivante A.</p>
<p>Phone or classroom, standing away from notes.</p>
<p class="notice">En Terminale, langue vivante A, le niveau attendu à l'examen est B1+, et non B1. Langue vivante B : A2+.</p>
</article>
</div>
{student(
    "Check that every document is in the file.",
    "Write your name, class and track (★ or ★★) on the first page.",
    "In the interview, answer in full sentences. If you do not understand, ask: Could you repeat, please?",
    "Use one official figure at least once.",
)}
{prof("Remise des dossiers en début d'heure, puis entretiens individuels.",
    "Cinq grilles sont dans les téléchargements et sur la page des corrigés : dossier, lettre, CV, entretien, langue.",
    "Critères : tâche réussie, clarté, chiffres justes, politesse, langue. En Terminale, langue vivante A, le niveau attendu à l'examen est B1+, et non B1. Langue vivante B : A2+.",
    answers="<p>Grilles : voir la page Corrigés et les fichiers dans Téléchargements. Pas de barème surprise : montrez les critères avant l'épreuve. Le dossier et l'entretien entraînent à la situation B, sans la remplacer.</p>"
)}
<h2>Entraînement au format de l'épreuve</h2>
<p>Ces deux situations suivent l'annexe V de l'arrêté du 17 juin 2020 (BO n° 30 du 23 juillet 2020). Elles peuvent se faire après la tâche de fin de séquence, ou à la place d'une partie de celle-ci.</p>
<div class="grid">
<article class="card"><h3>Situation B · oral, 10 minutes</h3>
<p>Expression orale en continu, puis interaction. Niveau attendu : B1+ en langue vivante A, A2+ en langue vivante B.</p>
<p>5 minutes d'exposé sur le projet : une année en Australie (visa, budget, travail, vie quotidienne). Puis 5 minutes d'interaction avec le professeur.</p>
</article>
<article class="card"><h3>Situation A · 1 heure au maximum</h3>
<p>Compréhension de l'oral, compréhension de l'écrit et expression écrite. Niveau attendu : B1+ en langue vivante A, A2+ en langue vivante B.</p>
<p>Document oral d'une durée maximale de 1 minute 30 (vous pouvez prendre une des vidéos Australian voices : Elena, Sam, Malik ou Jordan, chacune dure moins de 30 secondes). Trois écoutes, puis un compte rendu en français.</p>
<p>Ensuite, un écrit de 100 à 120 mots : l'élève choisit entre deux sujets, l'un relevant de la vie quotidienne, personnelle, sociale et citoyenne, l'autre de la vie professionnelle.</p>
</article>
</div>
<p class="dl">
<a href="{BASE}/downloads/">Fiches et grilles</a>
<a class="sec" href="{BASE}/teacher/">Corrigés</a>
</p>
'''
    page("assessment/index.html", f"{TITLE} · Évaluation",
         "Head off to Australia : dossier et entretien téléphonique.",
         f"{BASE}/assessment/", body)

def build_teacher():
    body = f'''
<p class="kicker">Pour le professeur</p>
<h1>Corrigés et grilles</h1>
<p>Les corrigés courts sont aussi dans chaque séance, sous « Corrigé », dans l'encadré bleu.</p>
<table>
<thead><tr><th>Séance</th><th>Points à retenir</th></tr></thead>
<tbody>
<tr><td>1</td><td>Work: Roberts. Lonely man: McCubbin. Arrival: Fox. Margin of Aboriginal figures: colonial point of view.</td></tr>
<tr><td>2</td><td>26 January: Australia Day / Invasion Day or Survival Day. Acknowledgement of Country.</td></tr>
<tr><td>3</td><td>Most people on the coasts. Outback dry. First Nations issues still present.</td></tr>
<tr><td>4</td><td>Fear is real; official deaths are rare. 000, pressure bandage. Roads far more deadly.</td></tr>
<tr><td>5</td><td>22 to 24 h, one stop. Ghan 2,979 km. FIFO = fly-in fly-out. 417 is not an automatic mine job.</td></tr>
<tr><td>6</td><td>417: AUD 840, funds about 5,000, condition 8547. Ticket after the visa.</td></tr>
<tr><td>7</td><td>Declare food, wood, cash of 10,000+. Declaring does not cost you anything.</td></tr>
<tr><td>8</td><td>€1 ≈ AUD 1.62. NMW 26.44; casual about 33. Tax 15% on first 45,000.</td></tr>
<tr><td>9 to 13</td><td>Answers are personal, but must use official figures and clear sentences.</td></tr>
</tbody>
</table>
{more("Cinq grilles de l'oral et du dossier (résumé)", '''
<p>1. Dossier complet (6 pièces). 2. Lettre : objet, structure, ton. 3. CV : clarté, honnêteté. 4. Entretien : compréhension, réponses, politesse. 5. Langue : en Terminale, langue vivante A, le niveau attendu à l'examen est B1+ (et non B1) ; langue vivante B : A2+. Le parcours ★★ peut viser le B2, objectif de fin d'études en langue vivante A.</p>
<p>Le dossier et l'entretien sont une tâche de fin de séquence, utile pour s'entraîner à la situation B, mais ce n'est pas le CCF lui-même. Les grilles détaillées sont dans les fichiers à télécharger, en gros caractères.</p>
''')}
<p class="dl">
<a href="{BASE}/downloads/heading-off-to-australia-corriges.pdf">Corrigés (PDF)</a>
<a class="sec" href="{BASE}/downloads/heading-off-to-australia-corriges.docx">Word</a>
<a class="sec" href="{BASE}/downloads/heading-off-to-australia-corriges.odt">LibreOffice</a>
</p>
'''
    page("teacher/index.html", f"{TITLE} · Corrigés",
         "Corrigés et grilles pour Head off to Australia.",
         f"{BASE}/teacher/", body)

def build_downloads():
    body = f'''
<p class="kicker">Documents</p>
<h1>Téléchargements</h1>
<p>Trois formats pour chaque fichier : PDF, Word et LibreOffice. Présentation professeur en 16 points.</p>
<div class="grid">
<article class="card"><h3>Présentation pour les collègues</h3>
<p class="dl">
<a href="{BASE}/downloads/presentation-heading-off-to-australia.pdf">PDF</a>
<a class="sec" href="{BASE}/downloads/presentation-heading-off-to-australia.docx">Word</a>
<a class="sec" href="{BASE}/downloads/presentation-heading-off-to-australia.odt">LibreOffice</a>
</p></article>
<article class="card"><h3>Fiches élèves</h3>
<p class="dl">
<a href="{BASE}/downloads/heading-off-to-australia-fiches-eleves.pdf">PDF</a>
<a class="sec" href="{BASE}/downloads/heading-off-to-australia-fiches-eleves.docx">Word</a>
<a class="sec" href="{BASE}/downloads/heading-off-to-australia-fiches-eleves.odt">LibreOffice</a>
</p></article>
<article class="card"><h3>Corrigés et grilles</h3>
<p class="dl">
<a href="{BASE}/downloads/heading-off-to-australia-corriges.pdf">PDF</a>
<a class="sec" href="{BASE}/downloads/heading-off-to-australia-corriges.docx">Word</a>
<a class="sec" href="{BASE}/downloads/heading-off-to-australia-corriges.odt">LibreOffice</a>
</p></article>
<article class="card"><h3>Listening: Australian voices · fiches élèves</h3>
<p class="voices-chip">Terminale bac pro (LVA : B1+) · Première générale et technologique (B1 possible)</p>
<p class="dl">
<a href="{BASE}/downloads/fiches-eleves-australian-voices.pdf">PDF</a>
<a class="sec" href="{BASE}/downloads/fiches-eleves-australian-voices.docx">Word</a>
<a class="sec" href="{BASE}/downloads/fiches-eleves-australian-voices.odt">LibreOffice</a>
</p></article>
<article class="card"><h3>Listening: Australian voices · corrigé (professeur)</h3>
<p class="dl">
<a href="{BASE}/downloads/corriges-australian-voices.pdf">PDF</a>
<a class="sec" href="{BASE}/downloads/corriges-australian-voices.docx">Word</a>
<a class="sec" href="{BASE}/downloads/corriges-australian-voices.odt">LibreOffice</a>
</p></article>
</div>
<p><a href="{BASE}/annexe/">Ancienne version en annexe</a></p>
'''
    page("downloads/index.html", f"{TITLE} · Téléchargements",
         "Téléchargements de la séquence Head off to Australia.",
         f"{BASE}/downloads/", body)

def patch_listings():
    old_title = "Anglais · Lycée professionnel, lycée général et technologique · Head off to Australia"
    new_title = "Anglais · Terminale bac pro · Première bac pro · Head off to Australia"
    old_meta = "Lycée professionnel, lycée général et technologique · B1, B2"
    new_meta = "Terminale bac pro · Première bac pro (adaptable)"
    old_sum = "Un an en Australie : visa vacances-travail, budget, emploi, transports et vie quotidienne. Treize séances de B1 et B2, plus l'évaluation, avec une présentation pour les collègues."
    new_sum = "Un an en Australie : visa vacances-travail, budget, emploi, transports et vie quotidienne. Treize séances pour la Terminale bac pro, adaptables en Première bac pro, plus l'évaluation."
    for rel in ("../index.html", "../lycee-pro/index.html", "../lycee-general/index.html"):
        p = (ROOT / rel).resolve()
        if not p.exists():
            continue
        txt = p.read_text(encoding="utf-8")
        txt = txt.replace("conder-departure-orient.jpg", COVER)
        txt = txt.replace("Charles Conder, Holiday sketch at Coogee", "Tom Roberts, Holiday sketch at Coogee")
        txt = txt.replace("Charles Conder, Departure of the Orient, Circular Quay, 1888.", "Tom Roberts, Holiday sketch at Coogee, 1888.")
        txt = txt.replace("Departure of the Orient, Circular Quay", "Holiday sketch at Coogee")
        if p.name and "lycee-general" in str(p):
            start = txt.find(old_title)
            if start != -1:
                art = txt.rfind("<article", 0, start)
                end = txt.find("</article>", start)
                if art != -1 and end != -1:
                    txt = txt[:art] + txt[end + len("</article>"):]
                    print("removed LGT card")
        else:
            txt = txt.replace(old_title, new_title)
            txt = txt.replace(old_meta, new_meta)
            txt = txt.replace(old_sum, new_sum)
        p.write_text(txt, encoding="utf-8")
        print("patched listing", p)
    res = (ROOT.parent / "data/resources.json").resolve()
    if not res.exists():
        res = Path("/workspace/site-down-under/data/resources.json")
    data = json.loads(res.read_text(encoding="utf-8"))
    changed = False
    def walk(o):
        nonlocal changed
        if isinstance(o, dict):
            if o.get("id") == "lp-anglais-destination-australia":
                o["title"] = new_title
                o["summary"] = new_sum
                o["level"] = ["1re", "tle"]
                o["levelLabel"] = new_meta
                o["section"] = "lycee-pro"
                changed = True
            for v in o.values():
                walk(v)
        elif isinstance(o, list):
            for v in o:
                walk(v)
    walk(data)
    if changed:
        res.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print("patched resources.json")


def build_dys():
    """Accessible typography copies at /destination-australia/dys/, same objectives."""
    import re
    src_pages = (
        ["index.html", "assessment/index.html", "teacher/index.html", "downloads/index.html"]
        + [f"s{i}/index.html" for i in range(1, 14)]
    )
    protect_re = re.compile(
        r"/destination-australia/(?:seq\.css|script\.js|images/|videos/|annexe/|downloads/[^\"'\s]+)"
    )

    def rewrite(html: str) -> str:
        held = []

        def keep(m):
            held.append(m.group(0))
            return f"@@P{len(held)-1}@@"

        html = protect_re.sub(keep, html)
        html = html.replace("/destination-australia/", "/destination-australia/dys/")
        for i, val in enumerate(held):
            html = html.replace(f"@@P{i}@@", val)
        html = html.replace("<body>", '<body class="dys">', 1)
        # Point the typography button back to the standard pages as well
        html = html.replace(
            '<p class="switch"><button type="button" data-dys-toggle>Version plus lisible</button></p>',
            '<p class="switch"><button type="button" data-dys-toggle>Version plus lisible</button> '
            '<a class="back-standard" href="STD">Mise en page habituelle</a></p>',
            1,
        )
        return html

    for rel in src_pages:
        src = ROOT / rel
        html = src.read_text(encoding="utf-8")
        html = rewrite(html)
        std = f"{BASE}/" if rel == "index.html" else f"{BASE}/{rel[:-10]}/" if rel.endswith("/index.html") else f"{BASE}/{rel}"
        # rel 's1/index.html' -> /destination-australia/s1/
        if rel == "index.html":
            std = f"{BASE}/"
        elif rel.endswith("/index.html"):
            std = f"{BASE}/{rel[:-len('index.html')]}"
        else:
            std = f"{BASE}/{rel}"
        html = html.replace('href="STD"', f'href="{std}"', 1)
        dest = ROOT / "dys" / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(html, encoding="utf-8")
        print("wrote", dest.relative_to(ROOT), dest.stat().st_size)


def update_sitemap():
    sm = ROOT.parent / "sitemap.xml"
    text = sm.read_text(encoding="utf-8")
    start = text.find("  <url><loc>https://itineraires-destinations.fr/destination-australia/</loc>")
    end = text.find("  <url><loc>https://itineraires-destinations.fr/deux-deesses/</loc>")
    if start < 0 or end < 0:
        raise SystemExit("sitemap australia block not found")
    today = "2026-11-14"
    urls = [
        "https://itineraires-destinations.fr/destination-australia/",
        "https://itineraires-destinations.fr/destination-australia/assessment/",
        "https://itineraires-destinations.fr/destination-australia/downloads/",
        "https://itineraires-destinations.fr/destination-australia/teacher/",
    ]
    urls += [f"https://itineraires-destinations.fr/destination-australia/s{i}/" for i in range(1, 14)]
    urls += [
        "https://itineraires-destinations.fr/destination-australia/dys/",
        "https://itineraires-destinations.fr/destination-australia/dys/assessment/",
        "https://itineraires-destinations.fr/destination-australia/dys/downloads/",
        "https://itineraires-destinations.fr/destination-australia/dys/teacher/",
    ]
    urls += [f"https://itineraires-destinations.fr/destination-australia/dys/s{i}/" for i in range(1, 14)]
    block = "".join(
        f"  <url><loc>{u}</loc><lastmod>{today}</lastmod></url>\n" for u in urls
    )
    sm.write_text(text[:start] + block + text[end:], encoding="utf-8")
    print("updated sitemap.xml", len(urls), "australia urls")


def main():
    build_index()
    build_s1(); build_s2(); build_s3(); build_s4(); build_s5()
    build_s6(); build_s7(); build_s8(); build_s9(); build_s10()
    build_s11(); build_s12(); build_s13()
    build_assessment(); build_teacher(); build_downloads()
    build_dys()
    update_sitemap()
    patch_listings()
    print("done")

if __name__ == "__main__":
    main()
