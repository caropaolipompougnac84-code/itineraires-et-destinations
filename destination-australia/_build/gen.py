#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]  # destination-australia
BASE = "/destination-australia"
TITLE = "Heading Off to Australia"
FOOT = "© 2026 Madame Carole Paoli Pompougnac · CC BY-NC-SA 4.0"
LEVEL = "Lycée professionnel, lycée général et technologique · B1, B2"
OG_IMG = "https://itineraires-destinations.fr/destination-australia/images/conder-departure-orient.jpg"

NAV = [
    ("Accueil", f"{BASE}/"),
    ("S1", f"{BASE}/s1/"),
    ("S2", f"{BASE}/s2/"),
    ("S3", f"{BASE}/s3/"),
    ("S4", f"{BASE}/s4/"),
    ("S5", f"{BASE}/s5/"),
    ("S6", f"{BASE}/s6/"),
    ("S7", f"{BASE}/s7/"),
    ("S8", f"{BASE}/s8/"),
    ("S9", f"{BASE}/s9/"),
    ("S10", f"{BASE}/s10/"),
    ("S11", f"{BASE}/s11/"),
    ("S12", f"{BASE}/s12/"),
    ("S13", f"{BASE}/s13/"),
    ("Éval.", f"{BASE}/assessment/"),
    ("Téléchargements", f"{BASE}/downloads/"),
    ("Corrigés", f"{BASE}/teacher/"),
    ("Annexe", f"{BASE}/annexe/"),
]

def page(out_rel, title, description, current, body, og=OG_IMG):
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
<main id="main">
<nav class="seq-nav" aria-label="Séquence">
{''.join(nav)}
</nav>
<p class="switch"><button type="button" data-dys-toggle>Version plus lisible</button></p>
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

def trace(text):
    return f'<aside class="trace"><h3>Trace écrite</h3><p>{text}</p><p>Copiez cette trace dans votre cahier. Gardez un exemple personnel.</p></aside>'

def homework(todo, next_s):
    return f'''<section class="homework" id="devoir">
<h3>Travail à la maison</h3>
<p>{todo}</p>
<p class="notice">Court, à rendre par écrit. La correction se fait au début de la séance {next_s}.</p>
<div class="lines" aria-hidden="true"></div>
</section>'''

def corrige(html):
    return f'<details class="corrige"><summary>Corrigé (pour le professeur)</summary>{html}</details>'

def build_index():
    body = f'''
<p class="kicker">Anglais · {LEVEL}</p>
<h1>{TITLE}</h1>
<p class="exergue">Moving to Australia for at least a year</p>
<p class="lede">You are 19. You have just finished school and you want to live in Australia for <strong>at least one year</strong>. Before you buy your ticket, you must understand the country, prepare your papers, plan your money, find a job and get ready to live with Australians.</p>
{fig("conder-departure-orient.jpg",
     "Charles Conder, Departure of the Orient, Circular Quay, 1888: a steamship leaving Sydney Harbour, with the city and the water in warm colours.",
     "Un départ dans le port de Sydney : le tableau ouvre la séquence, entre voyage, ville et horizon.",
     "Charles Conder, Departure of the Orient, Circular Quay, 1888, huile sur toile, Art Gallery of New South Wales. Domaine public, via Wikimedia Commons.")}

<section class="colleague" id="presentation" lang="fr">
<h2>Présentation de la séquence</h2>
<p class="salut">Chère collègue, cher collègue,</p>
<p>Voici une séquence d'anglais pour le lycée professionnel et pour le lycée général et technologique, aux niveaux B1 et B2. Elle prépare un projet réel : partir en Australie pour au moins un an, le plus souvent avec un visa vacances-travail (Working Holiday, subclass 417), parfois avec un visa étudiant.</p>
<p>Le thème est la mobilité, le travail et la vie quotidienne dans un pays du Commonwealth. La problématique est celle-ci : <strong>Is Australia really the land of opportunity for a young French person?</strong> Les élèves construisent un dossier de candidature complet (lettre, resume, formulaires, visa, budget, contacts), puis passent un entretien téléphonique avec un employeur ou un conseiller d'établissement australien.</p>
<p>Les objectifs sont langagiers et civiques. Les cinq activités du CECRL sont travaillées, ainsi que la médiation. Les élèves apprennent à lire un document officiel, à calculer un budget, à se présenter pour un emploi, et à porter un regard informé sur l'histoire, la société, les risques réels (y compris les animaux qui font peur) et les distances d'un pays-continent.</p>
<p>Ancrage officiel. Voie professionnelle (CAP et bac pro) : programme de langues vivantes, arrêté du 3 avril 2019, BO spécial n° 5 du 11 avril 2019 ; situations de la vie quotidienne, sociale et professionnelle, mobilité, ouverture internationale. Voie générale et technologique : programme d'anglais, BO n° 22 du 29 mai 2025 (arrêté du 5 mai 2025), en vigueur à tous les niveaux du lycée à la rentrée 2026. En seconde, l'axe 6 « Les pays du Commonwealth : héritages, unité, diversité » (obligatoire), et l'objet d'étude « La culture aborigène dans l'Australie contemporaine ». Voie générale : cinq axes sur six par an, dont l'axe 6 ; voie technologique : au moins trois axes, l'axe 6 étant vivement recommandé.</p>
<p>Le déroulé compte 13 séances, plus l'évaluation. Les séances 2 (histoire) et 9 (emploi) peuvent chacune être étendues sur deux heures, comme dans le tableau ci-dessous. Chaque séance comporte une trace écrite dans un encadré, et un travail à la maison court, dont la correction est reprise au début de la séance suivante. Les fiches élèves proposent une activité par page, des consignes courtes et de la place pour écrire. Les corrigés sont rassemblés pour le professeur.</p>
<p>Les chiffres (visa, salaire, taux de change, impôts) ont été revérifiés en novembre 2026 sur les sites officiels australiens. Ils changent souvent : faites-les revérifier par les élèves, c'est un bon exercice. Une ancienne version de la séquence, en huit leçons de B1 pour le bac pro et le CFA, est conservée en <a href="{BASE}/annexe/">annexe</a>.</p>
<p>Bien à vous,<br>Madame Carole Paoli Pompougnac</p>
</section>

<h2>Big question</h2>
<p>Is Australia really the land of opportunity for a young French person?</p>
<h2>Final task</h2>
<p>You build a complete <strong>application file</strong> in an envelope: cover letter, resume, all the forms filled in, visa checklist, budget and contacts. Then you pass a <strong>phone interview</strong> with an Australian employer or school adviser.</p>
<h2>Levels</h2>
<p><span class="star">★ B1</span> Lycée professionnel (and voie technologique): shorter texts, guided tasks.</p>
<p><span class="star">★★ B2</span> Lycée général et technologique: longer texts, more personal and critical answers.</p>
<h2>The five language activities</h2>
<p>CO Listening · CE Reading · EOC Speaking · EOI Interaction · EE Writing. Médiation is also practised.</p>

<h2>Déroulé conseillé (13 séances, plus l'évaluation)</h2>
<table>
<thead><tr><th>Séance</th><th>Page</th><th>Activité dominante</th></tr></thead>
<tbody>
<tr><td>1</td><td><a href="{BASE}/s1/">Overview, Paintings</a></td><td>EOC : réagir aux tableaux, anticiper</td></tr>
<tr><td>2 et 3</td><td><a href="{BASE}/s2/">History</a></td><td>CE, puis EOC (frise)</td></tr>
<tr><td>3 bis</td><td><a href="{BASE}/s3/">Society and Attitude</a></td><td>EOI (situations), CE</td></tr>
<tr><td>4</td><td><a href="{BASE}/s4/">Animals that make some people hesitate</a></td><td>CE (textes ★ et ★★), EOI</td></tr>
<tr><td>5</td><td><a href="{BASE}/s5/">Getting there, getting around</a></td><td>CE, planification d'itinéraire, lien avec l'emploi FIFO</td></tr>
<tr><td>6</td><td><a href="{BASE}/s6/">Visa and Papers</a></td><td>CE, médiation</td></tr>
<tr><td>7</td><td><a href="{BASE}/s7/">Arrival and Customs</a></td><td>CE, EOI (jeu de rôle à la douane)</td></tr>
<tr><td>8</td><td><a href="{BASE}/s8/">Money</a></td><td>CE, calculateur de budget</td></tr>
<tr><td>9</td><td><a href="{BASE}/s9/">Jobs</a></td><td>CE, EE (CV, lettre), EOI (entretien)</td></tr>
<tr><td>10</td><td><a href="{BASE}/s10/">Studying There</a></td><td>CE, médiation</td></tr>
<tr><td>11</td><td><a href="{BASE}/s11/">Who to Contact, Real-life Forms</a></td><td>CE, EE (formulaires, courriel)</td></tr>
<tr><td>12</td><td><a href="{BASE}/s12/">Aussie English</a></td><td>CO</td></tr>
<tr><td>13</td><td><a href="{BASE}/s13/">Living There</a></td><td>EOI (débat)</td></tr>
<tr><td>14</td><td><a href="{BASE}/assessment/">Assessment</a></td><td>Évaluation sommative des cinq activités</td></tr>
</tbody>
</table>
<p>Les séances d'histoire et d'emploi peuvent chacune occuper deux heures si le groupe en a besoin.</p>

<h2>Les cinq activités dans la séquence</h2>
<table>
<thead><tr><th>Activité</th><th>Où</th></tr></thead>
<tbody>
<tr><td>CO</td><td>Aussie English (script lu par le professeur), vidéos</td></tr>
<tr><td>CE</td><td>History, Animals, Transport, Visa and Papers, Jobs, Living There</td></tr>
<tr><td>EOC</td><td>Paintings, frise historique, présentation du projet</td></tr>
<tr><td>EOI</td><td>Entretien d'embauche, débat sur les animaux, débat sur l'intégration</td></tr>
<tr><td>EE</td><td>CV, lettre de motivation, courriel au consulat, planification d'itinéraire</td></tr>
<tr><td>Médiation</td><td>Expliquer en anglais une page française (pvtistes) ou en français une page australienne</td></tr>
</tbody>
</table>

<h2>Cadre officiel</h2>
<h3>Voie professionnelle (CAP et bac pro)</h3>
<ul>
<li>Programme de langues vivantes : arrêté du 3 avril 2019, BO spécial n° 5 du 11 avril 2019.</li>
<li>Les cinq activités langagières du CECRL : compréhension de l'oral, compréhension de l'écrit, expression orale en continu, expression orale en interaction, expression écrite ; la médiation est aussi travaillée.</li>
<li>Ancrage : situations de la vie quotidienne, sociale et professionnelle, mobilité, ouverture internationale.</li>
</ul>
<h3>Voie générale et technologique</h3>
<ul>
<li>Programme d'anglais : BO n° 22 du 29 mai 2025 (arrêté du 5 mai 2025), en vigueur à tous les niveaux du lycée à la rentrée 2026.</li>
<li>Seconde : axe 6 « Les pays du Commonwealth : héritages, unité, diversité » (obligatoire), et l'objet d'étude « La culture aborigène dans l'Australie contemporaine ».</li>
<li>Voie générale : cinq axes sur six par an, dont l'axe 6 ; voie technologique : au moins trois axes, l'axe 6 étant vivement recommandé.</li>
</ul>

<p class="dl"><a href="{BASE}/downloads/">Télécharger les documents</a> (pdf, Word, LibreOffice) · <a href="{BASE}/teacher/">Corrigés pour le professeur</a></p>
'''
    page("index.html", TITLE,
         "Séquence d'anglais Heading Off to Australia, lycée professionnel et lycée général et technologique, B1 et B2. Visa vacances-travail, budget, emploi, transport et vie en Australie. Présentation pour les collègues.",
         f"{BASE}/", body)


def build_s1():
    body = f'''
<p class="kicker">Séance 1 · EOC</p>
<h1>Australia in Paintings</h1>
<p>Look at the paintings. Where are we? When? Who is there, and who is missing?</p>
{fig("fox-landing-cook.jpg","E. Phillips Fox, Landing of Captain Cook at Botany Bay, 1770, painted in 1902: Cook and his men on the shore, Aboriginal people at a distance.","Une arrivée sur la côte, vue par un peintre de 1902 : qui est au centre, qui est sur le côté ?","E. Phillips Fox, Landing of Captain Cook at Botany Bay, 1770, 1902, National Gallery of Victoria. Domaine public, via Wikimedia Commons.")}
{fig("roberts-shearing-rams.jpg","Tom Roberts, Shearing the Rams, 1890: men at work in a woolshed, strong light and physical effort.","Le travail dur, au cœur de l'image nationale du bush et du mateship.","Tom Roberts, Shearing the Rams, 1890, National Gallery of Victoria. Domaine public, via Wikimedia Commons.")}
{fig("mccubbin-down-on-his-luck.jpg","Frederick McCubbin, Down on His Luck, 1889: a lone man sitting by a small fire in the bush, looking down.","Un homme seul, sans travail : la chance n'est pas garantie.","Frederick McCubbin, Down on His Luck, 1889, Art Gallery of Western Australia. Domaine public, via Wikimedia Commons.")}
{fig("streeton-golden-summer.jpg","Arthur Streeton, Golden Summer, Eaglemont, 1889: a wide golden landscape under a bright Australian sky.","La lumière et l'espace : une invitation, et un pays à prendre au sérieux.","Arthur Streeton, Golden Summer, Eaglemont, 1889, National Gallery of Australia. Domaine public, via Wikimedia Commons.")}
<h2>Exercise 1 EOC</h2>
<ol>
<li>★ Describe one painting: in the foreground I can see..., in the background...</li>
<li>★ Which painting shows hard work? Which one shows a lonely man? Which one shows an arrival?</li>
<li>★★ In the Cook painting, the Aboriginal people are far away, on the side. What does this tell us about the painter's point of view?</li>
<li>★★ Which painting would you choose for a poster called "Work in Australia"? Justify.</li>
</ol>
<div class="lines" aria-hidden="true"></div>
<p>Ces peintres appartiennent à l'école de Heidelberg (impressionnisme australien), qui a forgé l'image nationale du bush, du travail et du « mateship ». Le tableau de Phillips Fox, peint pour l'anniversaire de la Fédération, montre le point de vue colonial : les Aborigènes sont marginalisés dans l'image. Bonne transition vers l'onglet History.</p>
<p>Pour l'art aborigène contemporain (Albert Namatjira, Emily Kame Kngwarreye), les œuvres sont encore protégées : montrez-les depuis les sites des musées (National Gallery of Australia) plutôt que de les reproduire.</p>
{trace("In the foreground I can see... In the background... This painting shows... It makes me think that...")}
{homework("Choose one painting. Write 6 to 8 lines: what you see, and what it tells us about Australia. Bring it for the start of séance 2.", "2")}
{corrige("<p>2. Hard work: <i>Shearing the Rams</i>. A lonely man: <i>Down on His Luck</i>. An arrival: the Cook painting (and, on the home page, Conder's ship leaving Circular Quay, which shows the harbour from the other end of the journey).</p><p>3. The painter places the British landing at the centre and the Aboriginal people on the margin: a colonial point of view, painted for the anniversary of Federation.</p><p>4. Réponse personnelle argumentée : <i>Shearing the Rams</i> convient souvent pour le travail collectif ; <i>Down on His Luck</i> peut servir à nuancer l'idée d'un eldorado.</p>")}
'''
    page("s1/index.html", f"{TITLE} · Séance 1 · Paintings",
         "Heading Off to Australia, séance 1 : tableaux de Phillips Fox, Tom Roberts, McCubbin et Streeton.",
         f"{BASE}/s1/", body)

def build_s2():
    body = f'''
<p class="kicker">Séances 2 et 3 · CE, EOC</p>
<h1>A Short History of Australia</h1>
<ul>
<li><strong>At least 65,000 years ago</strong>: Aboriginal and Torres Strait Islander peoples live on the continent. It is one of the oldest living cultures in the world.</li>
<li><strong>1770</strong>: James Cook lands at Botany Bay and claims the east coast for Britain.</li>
<li><strong>26 January 1788</strong>: the First Fleet arrives in Sydney Cove with convicts. Britain starts a penal colony.</li>
<li><strong>1850s</strong>: gold rushes. Thousands of migrants arrive from Europe and China.</li>
<li><strong>1 January 1901</strong>: Federation. Six colonies become the Commonwealth of Australia. The "White Australia" policy limits non-European immigration.</li>
<li><strong>1915</strong>: Gallipoli. The ANZAC soldiers become a national symbol (Anzac Day, 25 April).</li>
<li><strong>1910s to 1970s</strong>: the "Stolen Generations". Many Aboriginal children are taken from their families.</li>
<li><strong>1967</strong>: a referendum allows Aboriginal people to be counted in the census.</li>
<li><strong>1970s</strong>: end of the White Australia policy; multicultural Australia begins.</li>
<li><strong>1992</strong>: the Mabo decision. The High Court rejects the idea of "terra nullius" (land belonging to no one).</li>
<li><strong>13 February 2008</strong>: Prime Minister Kevin Rudd says "Sorry" to the Stolen Generations.</li>
<li><strong>2023</strong>: Australians vote "No" to a referendum on an Indigenous "Voice to Parliament".</li>
</ul>
<h2>Reading CE</h2>
<p>On 26 January every year, many Australians celebrate Australia Day with barbecues, fireworks and flags. But for many Aboriginal people, this date marks the beginning of invasion, the loss of their land and the destruction of their families. Some call it "Invasion Day" or "Survival Day". Every year, there is a debate: should Australia change the date? Today, at public events, speakers often begin with an "Acknowledgement of Country": they recognise the traditional owners of the land where the event takes place. For a young visitor, understanding this debate is a way to respect the people who have lived there for more than 65,000 years.</p>
<ol>
<li>★ What happens on 26 January? Give two examples.</li>
<li>★ Find two other names for this day.</li>
<li>★ What is an "Acknowledgement of Country"?</li>
<li>★★ Why is the date controversial? Explain in your own words.</li>
<li>★★ Do you think Australia should change the date? Give one argument for and one against.</li>
</ol>
<div class="lines" aria-hidden="true"></div>
<h2>Exercise 2 EOC</h2>
<p>Choose three dates in the timeline. Present them to the class in one minute: what happened, and why it still matters today.</p>
<p>Useful words: <i>settlers, convicts, colony, land rights, apology, referendum, to be taken away, to recognise</i>.</p>
<p><a href="https://www.youtube.com/results?search_query=Kevin+Rudd+apology+Stolen+Generations+2008">The 2008 Apology : Kevin Rudd says "Sorry".</a> · <a href="https://www.youtube.com/results?search_query=Acknowledgement+of+Country+explained">Acknowledgement of Country : what it is and why it matters.</a></p>
{trace("26 January is Australia Day for some people, and Invasion Day or Survival Day for others. An Acknowledgement of Country recognises the traditional owners of the land.")}
{homework("Learn three dates from the timeline. For each date, write one sentence: what happened, and why it still matters today. Be ready to say them in séance 3.", "3")}
{corrige('''<p>1. Barbecues, feux d'artifice, drapeaux. 2. « Invasion Day », « Survival Day ». 3. Une phrase qui reconnaît les propriétaires traditionnels de la terre. 4. Le 26 janvier 1788 marque l'arrivée de la First Fleet : pour les Aborigènes, le début de la dépossession. 5. Réponse personnelle argumentée.</p>''')}
'''
    page("s2/index.html", f"{TITLE} · Séances 2 et 3 · History",
         "Heading Off to Australia : une courte histoire de l'Australie, le 26 janvier et l'Acknowledgement of Country.",
         f"{BASE}/s2/", body)

def build_s3():
    body = f'''
<p class="kicker">Séance 3 bis · EOI, CE</p>
<h1>Australian Society: Relaxed, but Demanding</h1>
<p><strong>The image</strong>: "No worries", "She'll be right", barbecues, beaches, first names with everybody, even the boss.</p>
<p><strong>The reality at work</strong>: Australians are relaxed in style, but strict in practice. Employers expect a lot, and quickly.</p>
<ul>
<li><strong>Be on time.</strong> "On time" means five minutes early. Late twice? You may not get a third shift.</li>
<li><strong>Never miss a shift without calling.</strong> A "no-show" is the fastest way to lose a casual job.</li>
<li><strong>Safety rules are not optional.</strong> Hat, boots, sunscreen, water, high-visibility vest: if the rule says so, you do it.</li>
<li><strong>Show initiative.</strong> When you have finished a task, ask "What can I do next?" Standing with your phone is badly seen.</li>
<li><strong>Feedback is direct but friendly.</strong> "Mate, that's not good enough" is not an insult: it is a warning.</li>
<li><strong>Casual work is flexible both ways.</strong> You can leave easily, but you can also lose your hours easily.</li>
</ul>
<h2>Society today</h2>
<ul>
<li><strong>Multicultural</strong>: many Australians were born overseas or have parents born overseas.</li>
<li><strong>Egalitarian</strong>: people do not like showing off. The "tall poppy syndrome" means that people who boast are criticised.</li>
<li><strong>Mateship</strong>: loyalty, helping a friend in trouble, especially in the bush.</li>
<li><strong>Sport and outdoor life</strong>: footy, cricket, surfing, swimming.</li>
<li><strong>Rules everywhere</strong>: alcohol is forbidden in many public places, ID is checked in bars, fines are high, and the sun is dangerous.</li>
<li><strong>Respect for First Nations</strong>: Acknowledgement of Country, sacred sites (do not climb Uluru), Aboriginal art and culture.</li>
</ul>
<h2>What would you do? EOI</h2>
<p>Discuss in pairs, then compare with the class. There is no single answer, but some answers can cost you your job.</p>
<ol>
<li>Your bus is late. Your shift at the café starts in ten minutes.</li>
<li>The farmer says: "Hats on, mate. No hat, no work." It is 7 am and it is not hot yet.</li>
<li>You have finished cleaning the tables. Your manager is busy.</li>
<li>A colleague says: "Nice job today, but you were a bit slow on the coffee." You feel hurt.</li>
<li>At a party, an Australian makes fun of your French accent.</li>
<li>Your French friends from the hostel want to stay together all year. An Australian colleague invites you to a barbecue.</li>
</ol>
<p>Nuancez avec les élèves : ce sont des tendances, pas des vérités sur chaque Australien. L'objectif est d'éviter les malentendus, pas de créer des clichés.</p>
<h2>Are you ready for Australia? CE</h2>
<p>Tick the qualities you have, and give an example from your life (school, internship, sport, family).</p>
<table>
<thead><tr><th>Quality</th><th>Why it matters in Australia</th><th>My example</th></tr></thead>
<tbody>
<tr><td>[ ] Reliable</td><td>Employers give shifts to people they can count on.</td><td></td></tr>
<tr><td>[ ] Adaptable</td><td>New city, new job, new accent, sometimes every two months.</td><td></td></tr>
<tr><td>[ ] Resilient</td><td>Homesickness, rejections, hard physical work.</td><td></td></tr>
<tr><td>[ ] Independent</td><td>Nobody will do the paperwork for you.</td><td></td></tr>
<tr><td>[ ] Humble</td><td>Your French diploma does not make you the boss.</td><td></td></tr>
<tr><td>[ ] Open and curious</td><td>To meet Australians, not only French people.</td><td></td></tr>
<tr><td>[ ] A sense of humour</td><td>Aussie humour is ironic and self-deprecating.</td><td></td></tr>
</tbody>
</table>
<p>★★ Use this table to write the "About me" paragraph of your job application (80 to 120 words).</p>
<div class="lines" aria-hidden="true"></div>
{trace("Australians can be relaxed in style and strict at work. I must be on time, call if I cannot come, follow safety rules and ask: What can I do next?")}
{homework("Write five lines: one quality you already have, with an example from school, a placement or sport, and one quality you want to work on before you leave.", "4")}
{corrige("<p>Pistes : 1. Appeler ou envoyer un message tout de suite, s'excuser, donner une heure d'arrivée. 2. Mettre le chapeau : les règles de sécurité ne se discutent pas. 3. Proposer son aide (« What can I do next? »). 4. Remercier et s'améliorer : c'est un retour normal, pas une attaque. 5. Rire avec lui : l'autodérision (« taking the mickey ») est une marque d'amitié. 6. Accepter : c'est ainsi qu'on s'intègre.</p>")}
'''
    page("s3/index.html", f"{TITLE} · Séance 3 · Society",
         "Heading Off to Australia : la société australienne, détendue en apparence, exigeante au travail.",
         f"{BASE}/s3/", body)

def build_s4():
    body = f'''
<p class="kicker">Séance 4 · CE, EOI</p>
<h1>Animals that make some people hesitate</h1>
<p>Snakes, spiders, crocodiles, box jellyfish, sharks: these animals have a terrifying reputation. For some students, and for some families, this fear is enough to stop the project. Before you decide, look at the facts, and at the advice given in Australia itself.</p>
{fig("nourlangie-rock-art.jpg",
     "Aboriginal rock painting in the Anbangbang Shelter, Kakadu: a hunter and a kangaroo, in red, yellow and white ochre on the rock.",
     "Sur cette paroi, les animaux font partie du savoir du pays, pas seulement d'une peur de carte postale. La suite de la séance compare la réputation et le risque réel.",
     "Peinture rupestre, abri d'Anbangbang, Burrunggui (Nourlangie Rock), parc national de Kakadu, Territoire du Nord. Photographie d'Ianperegian, 4 juillet 2009, CC BY-SA 4.0, via Wikimedia Commons. Cette image appartient au patrimoine culturel des peuples Bininj de cette terre.")}

<h2>Reading ★ B1</h2>
<p>Australia is famous for dangerous animals. The fear is easy to understand. The numbers, however, are often smaller than people think.</p>
<p>Each year in Australia, between 1 and 4 people die from snake bites, according to <a href="https://www.healthdirect.gov.au/accidents-and-injuries/bites-and-stings/snake-bites">healthdirect</a>, the official government health site. There is antivenom, and hospitals know what to do. If someone is bitten, you call 000, keep the person still, and put on a pressure bandage. You do not wash, cut or suck the wound, and you do not try to catch the snake.</p>
<p>Most spider bites are not dangerous. A bite from a funnel-web or another big black spider is a medical emergency: call 000. A redback bite is usually very painful, but <a href="https://www.healthdirect.gov.au/accidents-and-injuries/bites-and-stings/spider-bites">healthdirect</a> says it is not life-threatening.</p>
<p>Crocodiles live in the north (Queensland, the Northern Territory, the north of Western Australia). In "Croc Country", no natural waterway is ever completely safe. The official advice is simple: obey the signs, stay away from the water's edge, never swim in a place that is not a designated safe area, and never feed a crocodile. (<a href="https://www.qld.gov.au/emergency/safety/recreation/dangerous-marine">Queensland Government</a>)</p>
<p>Box jellyfish and other marine stingers are a higher risk in tropical waters in the warmer months (often November to May). Swim at patrolled beaches, between the flags, and inside the stinger nets when they are there. If someone is stung, call 000 and pour vinegar on the sting.</p>
<p>For sharks, the same beach rule applies: swim between the red-and-yellow flags, not at dawn or dusk, and not in murky water.</p>
<p>Millions of people live, work and travel in Australia every year. With a few clear rules, the animals that frighten us do not have to stop the journey.</p>
<ol>
<li>★ How many people die from snake bites in Australia each year, according to healthdirect?</li>
<li>★ What must you do, and what must you not do, after a snake bite?</li>
<li>★ Where do saltwater crocodiles live? Give one safety rule.</li>
<li>★ When is the risk of box jellyfish higher, and where should you swim?</li>
</ol>
<div class="lines" aria-hidden="true"></div>

<h2>Reading ★★ B2</h2>
<p>The reputation is stronger than the risk, but the risk is not zero. That is the honest position.</p>
<p>The Queensland Government notes that, Australia-wide, snakes and sharks are each responsible for the deaths of just less than three people a year, "making them just slightly more dangerous than bees and wasps." To put this in perspective, it adds that over 1,300 people were killed in road accidents in Australia in 2025. (<a href="https://www.qld.gov.au/environment/plants-animals/animals/living-with/staying-safe-around-wildlife">Staying safe around wildlife</a>)</p>
<p>A 2023 comparison, used in the Queensland Parliament, gives a sense of scale: accidental falls 4,105 deaths, drowning 204, sharks 5, snakes 2, saltwater crocodiles 1.</p>
<p>Crocodile attacks do happen, mostly when people go into the water, fish from the bank or swim at night in known habitat. Box jellyfish venom can act very fast: official pages tell swimmers never to enter a closed beach, and to use stinger nets or a full-body suit in the north. Funnel-web antivenom exists; so does redback antivenom. The first reflex is still 000.</p>
<p>Two other risks kill more visitors than any snake: the sun, and the ocean itself (rips, not only sharks). Long empty roads, fatigue and animals on the bitumen are part of the same picture: Australia is beautiful, and it is not a theme park.</p>
<p>Aboriginal rock paintings, like the hunter and the kangaroo at Anbangbang in Kakadu, remind us that people have lived with these animals for tens of thousands of years. Respect for Country, and for local knowledge, is also a safety rule.</p>
<p>So the question is not "Are there dangerous animals?" The question is: <strong>Would this stop you from going?</strong> What would you need to know, and to do, to go anyway?</p>
<ol>
<li>★★ Compare the risk from snakes or sharks with the risk from the roads, in your own words.</li>
<li>★★ Why do official sites insist on flags, nets and signs, if deaths are rare?</li>
<li>★★ Would this stop you from going? Give a reasoned answer, with one fact from the texts.</li>
</ol>
<div class="lines" aria-hidden="true"></div>

<h2>Discussion EOI</h2>
<p>In pairs, then as a class: "Would this stop you from going?" One student is worried (or plays a worried parent). The other answers with facts and with safety advice, not with jokes. Useful phrases: <i>I understand why you're afraid, but..., According to..., The official advice is..., I would still go if..., I would not go because...</i></p>
{trace("Some Australian animals can kill, but deaths are rare. I call 000, I follow official advice, I swim between the flags, and I stay away from the water in Croc Country. The sun and the roads are serious risks too.")}
{homework("Write 8 to 10 lines to a worried parent: three official facts, two safety rules, and your decision (I would go / I would not go) with one reason. Bring it for séance 5.", "5")}
{corrige('''<p>★ 1. Entre 1 et 4 par an (healthdirect). 2. Appeler le 000, ne pas bouger la personne, poser un bandage compressif ; ne pas laver, couper, sucer la plaie, ni attraper le serpent. 3. Dans le nord (Queensland, Territoire du Nord, nord de l'Australie-Occidentale) ; par exemple rester loin du bord de l'eau, respecter les panneaux, ne nager que dans une zone indiquée comme sûre. 4. Surtout de novembre à mai dans les eaux tropicales ; nager entre les drapeaux, dans les filets antimédues s'il y en a.</p>
<p>★★ 1. Les routes tuent beaucoup plus (plus de 1 300 morts en 2025, contre moins de trois par an pour les serpents ou les requins, d'après le gouvernement du Queensland). 2. Parce que le risque n'est pas nul, que certains venins agissent très vite, et que les règles (drapeaux, filets, panneaux) réduisent encore un risque déjà faible. 3. Réponse personnelle, appuyée sur un fait du texte.</p>
<p>Sources : healthdirect (snake bites, spider bites) ; Queensland Government, Dangerous marine life et Staying safe around wildlife ; chiffres 2023 cités au Parlement du Queensland.</p>''')}
'''
    page("s4/index.html", f"{TITLE} · Séance 4 · Animals",
         "Heading Off to Australia : les animaux qui font peur, le risque réel et les consignes officielles.",
         f"{BASE}/s4/", body, og="https://itineraires-destinations.fr/destination-australia/images/nourlangie-rock-art.jpg")

def build_s5():
    body = f'''
<p class="kicker">Séance 5 · CE, EE, EOC</p>
<h1>Getting there, getting around</h1>
<p>France is far away, and Australia is a continent. This séance looks at the flight from France, at trains, buses, cars and domestic flights, and at the small (and not so small) planes that take mine workers from their home town to a remote site and back: fly-in fly-out, or FIFO.</p>
{fig("streeton-fires-on.jpg",
     "Arthur Streeton, Fire's on, 1891: a railway cutting in the Blue Mountains, workers and a burst of smoke or steam in a steep golden landscape.",
     "Percer la montagne pour faire passer le train : l'Australie s'est construite aussi par la voie ferrée, dans un pays aux distances immenses.",
     "Arthur Streeton, Fire's on, 1891, Art Gallery of New South Wales. Domaine public, via Wikimedia Commons.")}

<h2>Reading ★ B1</h2>
<p><strong>The flight from France.</strong> There is no regular direct flight from Paris to Sydney. You usually change planes once, for example in Dubai, Doha, Singapore, Hong Kong or Bangkok. The great-circle distance is about 17,000 kilometres. Door to door, the journey often lasts about 22 to 24 hours, including the stopover. Airlines publish slightly different times, so check before you book. The Department of Home Affairs also says: do not book your flights until your visa has been granted. In mid-November, Sydney is about ten hours ahead of Paris (the difference is 9 or 10 hours during the year, as your text on living there already notes).</p>
<p><strong>A huge country.</strong> Once you land, the distances start again. By road, Sydney to Melbourne is about 880 kilometres (almost a full day's drive). Sydney to Perth is about 3,900 kilometres. Adelaide to Darwin is about 3,000 kilometres. Many backpackers take a long-distance bus, or a cheap domestic flight, rather than a car at the beginning.</p>
<p><strong>Trains.</strong> Two famous trains cross the continent. The Ghan runs between Adelaide and Darwin, 2,979 km, in about 48 hours (three days, two nights on the 2026 timetable). The Indian Pacific runs between Sydney and Perth, 4,352 km, in about 68 hours (four days, three nights). They are beautiful journeys, and they are expensive: they are not the usual way to go to a farm job. (<a href="https://www.greattrains.com.au/the-ghan-indian-pacific-faqs">Journey Beyond, official distances and times</a>)</p>
<p><strong>On the road.</strong> Australians drive on the left. In the outback you meet "road trains" (very long trucks), animals on the road, and driver fatigue. Plan your rest, take water, and do not treat a seven-hour drive as a short hop.</p>
<ol>
<li>★ Is there a direct flight from Paris to Sydney? How long does the journey usually take?</li>
<li>★ Give the distance, in kilometres, of The Ghan and of the Indian Pacific.</li>
<li>★ Name two ways a backpacker can travel between big cities besides a tourist train.</li>
</ol>
<div class="lines" aria-hidden="true"></div>

<h2>Reading ★★ B2: FIFO, a job that flies</h2>
<p>In the mining regions, especially in the Pilbara in Western Australia, many workers do not live next to the mine. They <strong>fly in and fly out</strong> (FIFO). They leave a hub, often Perth, on a company flight, work a "swing" of long shifts on site, then fly home for a block of rest.</p>
<p>The Western Australian Department of Transport explains that the resources industry mostly uses <strong>closed charter</strong> flights: they are not regular public flights, and they often go straight to a private airstrip at the mine. A company such as Fortescue describes typical rosters: 8 days on and 6 days off, 2 weeks on and 1 week off, or a week on and a week off. Shifts are often 12 or 12.5 hours. The employer usually organises, and pays for, the flight from the hub to the site, and camp and meals are often included. Getting to Perth itself is usually the worker's own cost.</p>
<p><strong>Pros:</strong> wages are often high; food and a bed on site are typically provided; you get a real block of time at home between swings.</p>
<p><strong>Cons:</strong> the hours are long; the site is isolated; you are far from friends and family; fatigue and mental health have been raised in official and health reviews. It is not a holiday with a salary.</p>
<p><strong>And a working holiday visa?</strong> Some camp jobs (kitchen, cleaning, stores) are advertised, and some travellers do work in the resources sector. Many FIFO roles, however, need experience, safety tickets and a more stable visa. The Working Holiday visa also limits work with the same employer (usually six months, with some exemptions: always check <a href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/work-holiday-417">Home Affairs</a>, condition 8547). Never pay a doubtful "agent" for a job. This séance prepares the link with <a href="{BASE}/s9/">Finding a Job</a>: FIFO is one option to know, not the first door for everybody.</p>
<ol>
<li>★★ What does FIFO mean, and where is it especially common?</li>
<li>★★ Give one advantage and one disadvantage of FIFO work.</li>
<li>★★ Why is FIFO not automatically a good first job for a 417 visa holder?</li>
</ol>
<div class="lines" aria-hidden="true"></div>

<h2>Task: plan a route EE EOC</h2>
<p>★ Plan Léa's first three weeks: she lands in Sydney, she has a hostel for four nights, then she wants to pick fruit in a regional area. Choose a means of transport for each step, and give a reason (time, cost, safety).</p>
<p>★★ Add a later choice: a cheap flight to Perth, then either a bus up the coast or a possible FIFO camp job. Write 80 to 120 words: your route, one risk (distance, money, or isolation), and one official piece of advice (visa, flights, or road safety).</p>
{trace("The flight from France takes about 22 to 24 hours, with one stopover. Australia is a continent: I may use a bus, a domestic flight or, later, a long train. FIFO means flying to a remote mine for a block of work, then flying home.")}
{homework("Draw or write Léa's route for the first three weeks (places, transport, one reason for each choice). Be ready to present it in one minute at the start of séance 6.", "6")}
{corrige('''<p>★ 1. Non, pas de vol direct régulier Paris-Sydney ; le trajet dure souvent 22 à 24 heures, avec une escale (Dubaï, Doha, Singapour, Hong Kong, Bangkok...). 2. The Ghan : 2 979 km (Adélaïde-Darwin, environ 48 h). Indian Pacific : 4 352 km (Sydney-Perth, environ 68 h). 3. Autocar longue distance, vol intérieur, parfois covoiturage ou voiture (conduite à gauche, prudence).</p>
<p>★★ 1. Fly-in fly-out : aller travailler sur un site isolé par avion (souvent un vol charter depuis Perth, dans le Pilbara), puis rentrer pour un temps de repos. 2. Avantage : salaire, repas et camp souvent pris en charge, vrai temps chez soi. Inconvénient : horaires lourds, isolement, fatigue, éloignement des proches. 3. Beaucoup de postes demandent de l'expérience et des habilitations ; le visa 417 limite en général le travail chez le même employeur à six mois (vérifier les exemptions) ; ce n'est pas le premier emploi le plus accessible.</p>
<p>Sources : compagnies aériennes et comparateurs de durées (pas de vol direct Paris-Sydney, environ 22 à 24 h) ; distance à vol d'oiseau environ 17 000 km ; Journey Beyond / Great Trains (The Ghan, Indian Pacific) ; Department of Transport of Western Australia (vols charter FIFO) ; Fortescue, FIFO at Fortescue (rosters et durées de poste) ; Home Affairs, visa 417, condition 8547. Les élèves vérifient les horaires et les prix du jour.</p>''')}
'''
    page("s5/index.html", f"{TITLE} · Séance 5 · Transport",
         "Heading Off to Australia : le vol depuis la France, les trains, les distances, et le travail FIFO.",
         f"{BASE}/s5/", body, og="https://itineraires-destinations.fr/destination-australia/images/streeton-fires-on.jpg")

def build_s6():
    body = f'''
<p class="kicker">Séance 6 · CE, médiation</p>
<h1>Visa and Papers</h1>
<h2>Which visa for which project?</h2>
<table>
<thead><tr><th>Visa</th><th>For whom?</th><th>Can you work?</th></tr></thead>
<tbody>
<tr><td><strong>eVisitor (subclass 651)</strong></td><td>Tourists from the European Union, short stays</td><td>No</td></tr>
<tr><td><strong>Working Holiday (subclass 417)</strong></td><td>Young French people aged 18 to 35: travel and work</td><td>Yes</td></tr>
<tr><td><strong>Student visa (subclass 500)</strong></td><td>Students enrolled in an Australian course</td><td>Yes, limited hours</td></tr>
<tr><td><strong>Skills in Demand (subclass 482)</strong></td><td>Qualified workers sponsored by an Australian employer</td><td>Yes, for that employer</td></tr>
</tbody>
</table>
<h2>Exercise: which visa? CE</h2>
<ol>
<li>Inès, 22, wants to pick fruit and travel for a year.</li>
<li>Hugo, 45, wants to visit his cousin in Perth for three weeks.</li>
<li>Sarah, 19, has a place in a hospitality course in Brisbane.</li>
<li>Karim, 28, is an electrician. A Sydney company wants to hire him for four years.</li>
</ol>
<p>Les conditions changent souvent : faites vérifier sur le site du Department of Home Affairs.</p>
<h2>The Working Holiday visa (subclass 417)</h2>
<ul>
<li><strong>Who?</strong> French citizens aged 18 to 35 when they apply.</li>
<li><strong>How long?</strong> 12 months. You can get a 2nd and a 3rd year if you do "specified work" in regional Australia (3 months for the 2nd visa, 6 months for the 3rd).</li>
<li><strong>Work?</strong> Yes, but maximum 6 months with the same employer (check current exemptions, including some work in remote resources, on the official page).</li>
<li><strong>Study?</strong> Up to 4 months.</li>
<li><strong>Cost?</strong> AUD 840 for a first visa (since 1 July 2026).</li>
<li><strong>Money?</strong> About AUD 5,000 in savings, plus a return ticket or the money to buy one.</li>
<li><strong>Where?</strong> Online, on the Department of Home Affairs website, with an ImmiAccount. No English test is required.</li>
</ul>
<p><a href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/work-holiday-417">immi.homeaffairs.gov.au: Working Holiday visa 417</a> · <a href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/fees-and-charges">Current visa pricing</a></p>
<h2>Your checklist before you leave</h2>
<table>
<thead><tr><th>Document</th><th>Why?</th></tr></thead>
<tbody>
<tr><td>Passport</td><td>Valid for your whole stay. In France it costs about €86 and can take weeks: apply early.</td></tr>
<tr><td>Visa grant letter</td><td>Your visa is electronic, linked to your passport. Keep a copy.</td></tr>
<tr><td>Health insurance</td><td>French social security does not cover you in Australia, and medical care is very expensive. Buy a "working holiday" insurance before you leave (about €430 to €450 a year).</td></tr>
<tr><td>Vaccination record</td><td>Take your <i>carnet de santé</i> or international vaccination certificate, and your prescriptions in English.</td></tr>
<tr><td>Driving licence</td><td>Take your French licence and an official translation (NAATI translator).</td></tr>
<tr><td>Bank statements</td><td>To prove you have enough money.</td></tr>
<tr><td>CV in English</td><td>Australians say "resume".</td></tr>
</tbody>
</table>
<h2>It is not a holiday: it is an expatriation</h2>
<p>You leave France for at least one year, maybe more. In French administration, you become a "Français établi hors de France".</p>
<table>
<thead><tr><th>In France, before you leave</th><th>Why?</th></tr></thead>
<tbody>
<tr><td>Register on the <i>registre des Français établis hors de France</i> (online, without a fee)</td><td>Recommended for stays over 6 months: the consulate can help you, and you can vote from Australia.</td></tr>
<tr><td>Ask the <i>CFE</i> (Caisse des Français de l'Étranger) or a private insurer</td><td>To keep health cover; French social security stops when you leave.</td></tr>
<tr><td>Tell the tax office, your bank, France Travail and your phone company</td><td>Change of address, end of contracts, taxes for the year you leave.</td></tr>
<tr><td>Scan all your documents (passport, diplomas, licence, vaccinations)</td><td>Keep them online, in case you lose the originals.</td></tr>
<tr><td>Think about the future: staying longer?</td><td>A second and third Working Holiday visa, a Student visa, or an employer-sponsored visa (Skills in Demand, subclass 482).</td></tr>
</tbody>
</table>
<p>Ce tableau permet de travailler la médiation : les démarches françaises se font en français, mais l'élève doit pouvoir les expliquer en anglais à un employeur ou un colocataire australien.</p>
<h2>When you arrive</h2>
<ol>
<li>Get an Australian SIM card.</li>
<li>Open a bank account.</li>
<li>Apply for a Tax File Number (TFN) with the Australian Taxation Office: without it, you pay more tax.</li>
<li>Register with the French consulate (recommended, and it does not require a fee).</li>
</ol>
<h2>Exercise 3 CE Médiation</h2>
<ol>
<li>★ True or false? a) You can apply at 36. b) The first visa lasts 12 months. c) You may work for the same employer for a whole year, without checking the rules. d) You need an English test.</li>
<li>★ Put the steps in order: buy insurance, get a TFN, apply for the visa, renew your passport, buy the ticket.</li>
<li>★★ Your cousin only speaks French. Explain to him, in French, the five conditions of the visa.</li>
<li>★★ Médiation : read a French page of pvtistes.net and explain one piece of advice in English to an Australian friend.</li>
</ol>
<div class="lines" aria-hidden="true"></div>
<p>Le billet d'avion se prend après l'obtention du visa. Les délais de traitement varient : faire consulter la page officielle du visa 417. Home Affairs indique que le délai moyen est actuellement de l'ordre de trois mois : ne pas réserver avant l'octroi du visa.</p>
{trace("The Working Holiday visa 417 is for French citizens aged 18 to 35. It lasts 12 months, costs AUD 840 for a first visa, and I need about AUD 5,000 plus a return ticket. I apply online, then I buy the plane ticket.")}
{homework("Copy the visa checklist into your file. Tick what you already have, and circle what you would still need. Bring it for séance 7.", "7")}
{corrige("<p>Which visa: 1. Working Holiday 417. 2. eVisitor 651. 3. Student 500. 4. Skills in Demand 482 (avec reconnaissance de son diplôme).</p><p>Exercise 3: 1. a) Faux (35 ans maximum au moment de la demande). b) Vrai. c) Faux (en règle générale 6 mois chez le même employeur, sauf exemption à vérifier). d) Faux. 2. Renouveler le passeport, demander le visa, prendre l'assurance, acheter le billet, demander le TFN à l'arrivée.</p>")}
'''
    page("s6/index.html", f"{TITLE} · Séance 6 · Visa",
         "Heading Off to Australia : visa Working Holiday 417, liste de documents et démarches.",
         f"{BASE}/s6/", body)

def build_s7():
    body = f'''
<p class="kicker">Séance 7 · CE, EOI</p>
<h1>Arrival: Customs and Biosecurity</h1>
<p>Australia protects its farms and its unique wildlife. What seems ordinary in a suitcase can be a serious problem at the border.</p>
<ul>
<li><strong>Food, plants, seeds, wood, animal products</strong>: you must declare them, even a sandwich from the plane or a jar of homemade jam.</li>
<li><strong>Muddy shoes, hiking or camping equipment</strong>: declare them.</li>
<li><strong>Medicines</strong>: declare them, with your prescription in English.</li>
<li><strong>Duty-free allowance</strong> (adults): 2.25 litres of alcohol, 25 cigarettes, and AUD 900 of goods bought abroad.</li>
<li><strong>Cash</strong>: AUD 10,000 or more must be declared.</li>
<li><strong>If you do not declare</strong> and the officers find it: an on-the-spot fine of thousands of dollars, and in serious cases your visa can be cancelled.</li>
</ul>
<p>The golden rule: <strong>Unsure? Declare it, or bin it.</strong> Declaring does not cost you anything. Bins are waiting for you before the biosecurity area.</p>
<p>Sources : <a href="https://www.abf.gov.au/entering-and-leaving-australia/can-you-bring-it-in/categories/duty-free">Australian Border Force, duty free</a>. Cash of AUD 10,000 or more must be declared (Incoming Passenger Card).</p>
<h2>Exercise: what's in Léa's bag? CE EOI</h2>
<p>Léa's suitcase: a camembert, two packets of instant noodles, her walking boots (used last week in the Pyrenees), paracetamol, a bottle of perfume (€80), a wooden souvenir box, AUD 1,200 in cash, a bottle of wine.</p>
<ol>
<li>★ Make two lists: "Declare" and "No need to declare".</li>
<li>★ Role-play at the airport. Officer: "Do you have any food with you?" Léa answers honestly.</li>
<li>★★ Explain to a French friend, in English, why Australia is so strict. Use: <i>to protect, pests, diseases, farms, unique wildlife</i>.</li>
</ol>
<div class="lines" aria-hidden="true"></div>
<p>Montrez les vidéos de l'émission <i>Border Security: Australia's Front Line</i> (extraits sur YouTube) : les élèves adorent et le vocabulaire est très concret.</p>
<p><a href="https://www.youtube.com/results?search_query=Border+Security+Australia+food+declare">Border Security: Australia's Front Line : real scenes at Australian airports.</a> · <a href="https://www.abf.gov.au/entering-and-leaving-australia/crossing-the-border/at-the-border/incoming-passenger-card-%28ipc%29">Australian Border Force : Incoming Passenger Card</a></p>
{trace("Unsure? Declare it, or bin it. I must declare food, plants, wood, dirty shoes and medicines. Adults may bring 2.25 litres of alcohol, 25 cigarettes and AUD 900 of goods. Cash of AUD 10,000 or more must be declared.")}
{homework("Write the two lists for Léa's bag (Declare / No need to declare), with a short reason for each item. We correct them at the start of séance 8.", "8")}
{corrige("<p>À déclarer : le camembert, les nouilles (aliments), les chaussures de randonnée boueuses, le paracétamol (médicament, avec ordonnance), la boîte en bois. Pas besoin : le parfum (sous 900 AUD), l'argent (sous 10 000 AUD), une bouteille de vin (sous 2,25 litres).</p>")}
'''
    page("s7/index.html", f"{TITLE} · Séance 7 · Customs",
         "Heading Off to Australia : douane, biosécurité et franchise, avec le jeu de rôle de Léa.",
         f"{BASE}/s7/", body)

def build_s8():
    body = f'''
<p class="kicker">Séance 8 · CE, calculateur</p>
<h1>Money Matters</h1>
<p><strong>The Australian dollar (AUD)</strong></p>
<p>In November 2026, <strong>€1 = about AUD 1.62</strong>, so <strong>AUD 1 = about €0.62</strong>. The Banque de France rate on 13 November 2026 was 1.6288. We keep "about 1.62" for the classroom calculations. Ask students to check the rate of the day (Banque de France, or their bank): it moves every day.</p>
<p><strong>Minimum wage</strong> (from 1 July 2026): AUD 26.44 an hour, or AUD 1,004.90 a week for 38 hours. Casual workers get at least 25% more (about AUD 33 an hour), because they have no paid holidays. (<a href="https://www.fairwork.gov.au/about-us/workplace-laws/annual-wage-review/annual-wage-review-2026">Fair Work Ombudsman</a>; casual loading: <a href="https://www.fwc.gov.au/work-conditions/minimum-wages-and-conditions/national-minimum-wage">Fair Work Commission</a>)</p>
<p><strong>Life is expensive</strong>, especially rent in Sydney and Melbourne. Many backpackers share a room in a hostel or a flat ("share house").</p>
<p>Working holiday makers are taxed at 15% on the first AUD 45,000 (income year 2026-27). (<a href="https://www.ato.gov.au/tax-rates-and-codes/tax-rates-working-holiday-makers">Australian Taxation Office</a>)</p>

<h2>Budget calculator CE</h2>
<p><strong>Change the numbers and see if your project works.</strong></p>
<form class="calc" id="budget-calc" action="#" onsubmit="return false;">
<div class="calc-grid">
<div><label for="rate">Exchange rate: AUD for €1</label><input id="rate" type="number" step="0.01" value="1.62"></div>
<div><label for="savings">Your savings (€)</label><input id="savings" type="number" step="1" value="4000"></div>
<div><label for="flight">Return flight (€)</label><input id="flight" type="number" step="1" value="1400"></div>
<div><label for="visa">Visa (AUD)</label><input id="visa" type="number" step="1" value="840"></div>
<div><label for="insurance">Health insurance, 1 year (€)</label><input id="insurance" type="number" step="1" value="440"></div>
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
<div><label for="wage">Hourly wage (AUD)</label><input id="wage" type="number" step="0.01" value="33"></div>
<div><label for="hours">Hours a week</label><input id="hours" type="number" step="1" value="30"></div>
<div><label for="tax">Tax rate (%)</label><input id="tax" type="number" step="0.1" value="15"></div>
<div><label for="weeksWait">Weeks before your first job</label><input id="weeksWait" type="number" step="1" value="2"></div>
</div>
<div class="calc-out" id="calc-results" aria-live="polite"></div>
</form>
<p>Valeurs par défaut : taux Banque de France de novembre 2026 (environ 1,62), salaire minimum casual (26,44 AUD plus 25 %), taux d'imposition de 15 % pour les working holiday makers sur la première tranche de revenus. Demandez aux élèves de trouver eux-mêmes le prix d'un vol, d'une auberge et du panier de courses : c'est là que l'exercice devient concret.</p>

<h2>Exercise 4: plan your budget CE</h2>
<ol>
<li>★ Convert into euros: the visa (AUD 840) and the savings you need (AUD 5,000).</li>
<li>★ You work 30 hours a week as a casual at AUD 33 an hour. How much do you earn in a week, before tax?</li>
<li>★ Your hostel costs AUD 250 a week, food AUD 120, transport AUD 50. How much is left?</li>
<li>★★ Write a short budget for your first month in Australia, with your savings, your costs and your first salary. Is AUD 5,000 enough?</li>
</ol>
<div class="lines" aria-hidden="true"></div>
<p>Useful words: <i>wage, salary, payslip, rent, bond (deposit), tax, to save, to earn, to afford, exchange rate, bank transfer, casual job, full-time, part-time</i>.</p>
{trace("€1 is about AUD 1.62. The minimum wage is AUD 26.44 an hour, or about AUD 33 for a casual. Working holiday makers pay 15% tax on the first AUD 45,000. I must plan for the weeks before my first pay.")}
{homework("Using the calculator (or a page of calculations), convert AUD 840 and AUD 5,000 into euros, and write whether AUD 5,000 would be enough for your first month. We check the figures in séance 9.", "9")}
{corrige("<p>1. 840 ÷ 1,62 ≈ 520 € ; 5 000 ÷ 1,62 ≈ 3 090 €. 2. 30 × 33 = 990 AUD. 3. 990 − 420 = 570 AUD (avant impôts). 4. Réponse personnelle : valoriser la prise en compte du logement, de la caution (bond), du temps avant le premier salaire.</p>")}
'''
    page("s8/index.html", f"{TITLE} · Séance 8 · Money",
         "Heading Off to Australia : dollar australien, salaire minimum, impôts et calculateur de budget.",
         f"{BASE}/s8/", body)

def build_s9():
    body = f'''
<p class="kicker">Séance 9 · CE, EE, EOI</p>
<h1>Finding a Job</h1>
<p>Many first jobs are in hospitality, farms, tourism and care. Some travellers later look at camp work or FIFO (see <a href="{BASE}/s5/">Getting there, getting around</a>). Whatever the job, you need a clear resume, a short letter, and a ready answer in an interview.</p>
<ul>
<li><strong>Hospitality</strong>: cafés, restaurants, hotels, kitchens.</li>
<li><strong>Farms</strong>: fruit picking, packing, horticulture (often "specified work" for a second visa year).</li>
<li><strong>Tourism</strong>: hotels, tours, ski resorts. Speaking French is an advantage with European tourists.</li>
<li><strong>Care and services</strong>, if you have the right certificates and English.</li>
</ul>
<h2>Reading: a job ad CE</h2>
<div class="form-practice">
<p><strong>Kitchen hand, Salt and Sun Café, Byron Bay</strong></p>
<p>Busy beachside café looking for an energetic kitchen hand. Casual position, 25 to 35 hours a week, weekends essential. AUD 33 to 35 per hour. Experience in a professional kitchen is a plus. French speakers welcome! Must have working rights in Australia. Start ASAP. Send your resume to jobs@saltandsun.example</p>
</div>
<ol>
<li>★ What is the job, and where is it?</li>
<li>★ How many hours, and when must you be available?</li>
<li>★ What is essential for the visa?</li>
<li>★★ What can you offer if you are a bac pro student? Use your placements (PFMP).</li>
</ol>
<p>L'annonce et l'adresse sont fictives.</p>
<h2>Writing EE</h2>
<p>Write a short cover letter (★ 80 words, ★★ 150 words) and your resume in Australian style.</p>
<h3>Model resume (Australian style)</h3>
<div class="form-practice">
<p><strong>Léa MARTIN</strong> | Mobile: +33 6 00 00 00 00 | lea.martin@email.example | Working Holiday visa holder (subclass 417)</p>
<p><strong>Profile</strong><br>Reliable vocational student in cookery, used to a busy kitchen. I can start in two weeks. I hold a Working Holiday visa.</p>
<p><strong>Experience</strong><br>Kitchen assistant, Restaurant Le Moulin, 8-week placement. I prepared vegetables, cleaned the kitchen and plated 80 lunches a day. Casual barista, weekends, 6 months: coffee, till, opening the shop.</p>
<p><strong>Education</strong><br>Baccalauréat professionnel Cuisine (equivalent to Year 12), 2026, France.</p>
<p><strong>Skills and languages</strong><br>Food hygiene, teamwork, till. French: native. English: intermediate, level B1 (CEFR). Spanish: basic (A2).</p>
<p><strong>Interests</strong><br>Rugby: I have played in a club for 6 years (wing), team spirit and fitness. Surfing, cooking for friends.</p>
<p><strong>Referees</strong><br>Mr Paul Durand, Head Chef, Restaurant Le Moulin, +33 5 00 00 00 00<br>Ms Anne Petit, vocational teacher, +33 5 00 00 00 00</p>
</div>
<h3>Tips for your resume</h3>
<p>Australian employers are not very formal about resumes. What they want is <strong>a concrete profile</strong>: what can you actually do, when can you start, and who can say you are reliable? Many jobs start with a <strong>trial shift</strong>: you work a few hours and the boss decides on the spot. Keep your resume to one page, with facts, not big words.</p>
<ul>
<li><strong>Be concrete</strong>: not "I am motivated" but "I cooked 80 lunches a day during my placement".</li>
<li><strong>Your school level</strong>: give the French name of your diploma and its Australian equivalent ("equivalent to Year 12"). Mention your work placements: Australian employers love experience.</li>
<li><strong>Your English level</strong>: be honest. Use the CEFR (A2, B1, B2) or a test score if you have one (IELTS, TOEIC).</li>
<li><strong>Your sport</strong>: put it in a good place! Rugby, football, surfing or swimming show team spirit, fitness and reliability. Rugby is a passion in Australia (the Wallabies, rugby league in New South Wales and Queensland): it is a great way to start a conversation and to join a local club.</li>
<li>No photo, no date of birth, no marital status. Two referees: Australian employers often call them.</li>
<li>Print a few copies and hand them in yourself, with a smile: in cafés and on farms, it often works better than email.</li>
</ul>
<p>Les coordonnées du modèle sont fictives. Faites remplacer chaque rubrique par les vraies informations de l'élève : diplôme préparé, stages (PFMP), niveau CECRL estimé avec le professeur, sport pratiqué.</p>
<h2>Interaction: the job interview EOI</h2>
<p>In pairs: one student is the café manager, the other is the candidate. Then swap.</p>
<ul>
<li>Tell me about yourself.</li>
<li>Have you ever worked in a kitchen?</li>
<li>Can you work weekends?</li>
<li>How long are you staying in Australia?</li>
<li>Do you have any questions for me?</li>
</ul>
{trace("My resume is one page, with facts, no photo. I give my diploma and its equivalent (Year 12), my placements, my English level and two referees. A trial shift is common. I can also explain what FIFO is, if I am asked about later plans.")}
{homework("Rewrite the model resume with your own (or invented but consistent) information: diploma, placement, English level, sport, two referees. Bring a printed or handwritten page for séance 10.", "10")}
{corrige("<p>1. Plongeur / commis de cuisine, dans un café de Byron Bay. 2. De 25 à 35 heures ; les week-ends. 3. Avoir un visa qui autorise à travailler (le visa 417). 4. Expérience en cuisine professionnelle, stages (PFMP), français apprécié. L'annonce et l'adresse sont fictives.</p>")}
'''
    page("s9/index.html", f"{TITLE} · Séance 9 · Jobs",
         "Heading Off to Australia : offres d'emploi, resume australien et entretien.",
         f"{BASE}/s9/", body)

def build_s10():
    body = f'''
<p class="kicker">Séance 10 · CE, médiation</p>
<h1>Studying in Australia</h1>
<h2>The school system</h2>
<table>
<thead><tr><th>Australia</th><th>Age</th><th>France</th></tr></thead>
<tbody>
<tr><td>Preschool / kindergarten</td><td>3 to 5</td><td>École maternelle</td></tr>
<tr><td>Primary school: Foundation (also called Prep or Kindergarten) to Year 6</td><td>5 to 12</td><td>CP to 6e</td></tr>
<tr><td>Secondary school: Years 7 to 10</td><td>12 to 16</td><td>5e to 2de</td></tr>
<tr><td>Senior secondary: Years 11 and 12, with a state certificate and an ATAR score</td><td>16 to 18</td><td>1re and Terminale, baccalauréat</td></tr>
</tbody>
</table>
<p>The school year starts in late January or early February and ends in December: summer holidays are at Christmas!</p>
<h2>After school: tertiary education</h2>
<ul>
<li><strong>VET</strong> (Vocational Education and Training): practical courses taught by <strong>TAFE</strong> institutes and private colleges, in IT, business, hospitality, construction, care... A TAFE diploma can lead to university.</li>
<li><strong>University</strong>: Bachelor's degrees (usually 3 years), then Master's and PhD. Australian students enter with their <strong>ATAR</strong>, a ranking from 0 to 99.95.</li>
<li>Careful: in Australia, <strong>"college"</strong> often means a TAFE or a private college, not a university.</li>
<li>International students pay full fees: tuition is expensive.</li>
</ul>
<h2>The Student visa (subclass 500)</h2>
<ul>
<li>First, a place in a registered course and a <strong>Confirmation of Enrolment (CoE)</strong>.</li>
<li>Proof of English (IELTS, PTE or another approved test), depending on the course.</li>
<li>Proof of money for tuition, travel and living costs.</li>
<li><strong>OSHC</strong> (Overseas Student Health Cover): compulsory health insurance for the whole stay.</li>
<li>The <strong>Genuine Student</strong> requirement: you explain why you chose this course and how it fits your plans.</li>
<li>Work: up to 48 hours per fortnight during the course, more during the holidays.</li>
<li>Fee: AUD 2,500 since July 2026. (<a href="https://www.studyaustralia.gov.au/en/Agent-Hub/agent-news-index/student-visa-application-charge-increase">Study Australia</a>, official announcement of the increase from AUD 2,000 to AUD 2,500 on 1 July 2026.)</li>
</ul>
<h2>Exercises CE Médiation</h2>
<ol>
<li>★ Your little sister is in CM2. Which year is she in Australia? And you?</li>
<li>★ What does TAFE mean? Give an example of a course that matches your bac pro.</li>
<li>★ Why do Australian students go to the beach in January?</li>
<li>★★ Compare the ATAR and Parcoursup in five lines.</li>
<li>★★ Write the answer to the Genuine Student question: "Why did you choose this course in Australia, and how will it help your future career?" (100 words)</li>
</ol>
<div class="lines" aria-hidden="true"></div>
<p>Le projet de la séquence est un séjour d'au moins un an : visa Working Holiday de 12 mois (prolongeable) ou visa étudiant pour toute la durée de la formation.</p>
{trace("In Australia, Year 12 is like Terminale. TAFE means Technical and Further Education. A Student visa 500 needs a CoE, proof of money, OSHC and a Genuine Student statement. The visa fee is AUD 2,500 since July 2026.")}
{homework("Answer questions 1 to 3 in full sentences, and write five lines to compare ATAR and Parcoursup (★★) or a short list of TAFE courses that match your diploma (★). Correction at the start of séance 11.", "11")}
{corrige("<p>1. Le CM2 correspond environ à Year 5 ou 6 selon les États ; un élève de terminale correspond à Year 12. 2. Technical and Further Education : formations professionnelles (cuisine, hôtellerie, mécanique, aide à la personne...). 3. Ce sont les grandes vacances d'été. 4. L'ATAR est un classement, Parcoursup une plateforme de vœux ; tous deux servent à l'entrée dans le supérieur.</p>")}
'''
    page("s10/index.html", f"{TITLE} · Séance 10 · Studying",
         "Heading Off to Australia : système scolaire, TAFE, ATAR et visa étudiant 500.",
         f"{BASE}/s10/", body)

def build_s11():
    body = f'''
<p class="kicker">Séance 11 · CE, EE</p>
<h1>Who to Contact: Real Addresses</h1>
<h2>Before you leave (in France)</h2>
<p><strong>Australian Embassy in France</strong><br>4 rue Jean Rey, 75015 Paris (métro Bir-Hakeim, RER C Champ de Mars-Tour Eiffel)<br>Phone: +33 1 40 59 33 00<br><a href="https://france.embassy.gov.au/">france.embassy.gov.au</a></p>
<p><strong>Visa application</strong>: online only, on the Department of Home Affairs website (ImmiAccount).<br><a href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/work-holiday-417">immi.homeaffairs.gov.au: Working Holiday visa 417</a></p>
<p><strong>Ariane and travel advice</strong>: <a href="https://www.diplomatie.gouv.fr/fr/information-par-pays/australie/dernieres-minutes-et-alertes">diplomatie.gouv.fr</a></p>
<h2>In Australia: French representations</h2>
<p><strong>Embassy of France</strong><br>6 Perth Avenue, Yarralumla ACT 2600 (Canberra)<br>Phone: +61 2 6216 0100<br><a href="https://au.ambafrance.org/">au.ambafrance.org</a></p>
<p><strong>Consulate General of France in Sydney</strong> (passports, registration, emergencies)<br>Level 26, St Martins Tower, 31 Market Street, Sydney NSW 2000<br>Open to the public Monday to Friday, 9 am to 12.30 pm, by appointment.</p>
<p><strong>Consulate General of France in Melbourne</strong><br>Level 9, 5 Queens Road, Melbourne VIC 3004</p>
<h2>In Australia: official help</h2>
<p><strong>Australian Taxation Office (ATO)</strong>: Tax File Number, tax, super. <a href="https://www.ato.gov.au/">ato.gov.au</a></p>
<p><strong>Fair Work Ombudsman</strong>: your pay and your rights at work, help if you are underpaid, without a fee. <a href="https://www.fairwork.gov.au/">fairwork.gov.au</a></p>
<p><strong>Emergency</strong>: 000 (police, fire, ambulance).</p>
<h2>Youth hostels (first nights)</h2>
<table>
<thead><tr><th>City</th><th>Hostel</th><th>Address</th></tr></thead>
<tbody>
<tr><td>Sydney</td><td>YHA Sydney Harbour</td><td>110 Cumberland Street, The Rocks NSW 2000 (+61 2 8272 0900)</td></tr>
<tr><td>Sydney</td><td>YHA Sydney Central</td><td>11 Rawson Place, corner of Pitt Street, opposite Central Station, Sydney NSW 2000</td></tr>
<tr><td>Sydney</td><td>Wake Up! Sydney</td><td>509 Pitt Street, Sydney NSW 2000</td></tr>
<tr><td>Sydney (beach)</td><td>Wake Up! Bondi Beach</td><td>110 Campbell Parade, Bondi Beach</td></tr>
<tr><td>Melbourne</td><td>YHA Melbourne Central</td><td>562 Flinders Street, Melbourne VIC 3000 (+61 3 9621 2523)</td></tr>
<tr><td>Brisbane</td><td>Brisbane City YHA</td><td>392 Upper Roma Street, Brisbane QLD 4000 (+61 7 3236 1004)</td></tr>
</tbody>
</table>
<p><a href="https://www.yha.com.au/">yha.com.au</a>: the YHA network has hostels all over Australia. The YHA membership card gives discounts.</p>
<h2>French-speaking communities and mutual help</h2>
<p><strong>Alliance Française de Melbourne</strong><br>51 Grey Street, St Kilda VIC 3182 (+61 3 9525 3463), also an office in the city centre: Level 13, 55 Swanston Street.<br><a href="https://www.afmelbourne.com.au/">afmelbourne.com.au</a></p>
<p><strong>Alliance Française de Sydney</strong>: <a href="https://www.afsydney.com.au/">afsydney.com.au</a>. There are about thirty Alliances Françaises in Australia (Brisbane, Perth, Adelaide, Canberra...).</p>
<p><strong>Melbourne Accueil</strong>: an association that welcomes French speakers in Melbourne.</p>
<p><strong>Facebook groups</strong>: "Les Français à Melbourne - Australie", "Familles françaises à Melbourne", and similar groups for Sydney, Brisbane and Perth.</p>
<p><strong>pvtistes.net</strong>: the French community of working holiday makers, with a guide and a forum: <a href="https://pvtistes.net/">pvtistes.net</a></p>
<p><strong>Careful</strong>: a French group is a safety net, not a bubble. The aim is to meet Australians too.</p>
<h2>Exercises CE EE</h2>
<ol>
<li>★ Your passport is stolen in Sydney. Where do you go? Write the address.</li>
<li>★ You land in Brisbane at 11 pm. Which hostel do you book? Find its phone number.</li>
<li>★ Write an email to the consulate (60 to 80 words) to make an appointment for a new passport.</li>
<li>★★ Your employer pays you AUD 18 an hour. Write to the Fair Work Ombudsman to explain the problem and ask for help (120 words).</li>
</ol>
<div class="lines" aria-hidden="true"></div>

<h2>Real-life Forms</h2>
<p>These practice forms follow the real ones. Fill them in for Léa, then for yourself. The official links are under each form.</p>
<p class="notice">PRACTICE FORM for the classroom. This is not an official document.</p>
<h3>1. Incoming Passenger Card</h3>
<div class="form-practice">
<p>Family name <span class="slot"></span> Given names <span class="slot"></span></p>
<p>Passport number <span class="slot"></span> Flight number or name of ship <span class="slot"></span></p>
<p>Intended address in Australia <span class="slot"></span></p>
<p>Do you intend to live in Australia for the next 12 months?</p>
<p><strong>Are you bringing into Australia:</strong></p>
<table>
<tbody>
<tr><td>Goods that may be prohibited or subject to restrictions, such as medicines, steroids, firearms, weapons or illicit drugs?</td><td>Yes  No</td></tr>
<tr><td>More than 2.25 litres of alcohol, or more than 25 cigarettes or 25 g of tobacco?</td><td>Yes  No</td></tr>
<tr><td>Goods obtained overseas or bought duty-free with a combined total price of more than AUD 900?</td><td>Yes  No</td></tr>
<tr><td>Goods or samples for business or commercial use?</td><td>Yes  No</td></tr>
<tr><td>AUD 10,000 or more in Australian or foreign currency?</td><td>Yes  No</td></tr>
<tr><td>Meat, poultry, fish, seafood, eggs, dairy, fruit, vegetables, or any other food?</td><td>Yes  No</td></tr>
<tr><td>Grains, seeds, bulbs, straw, nuts, plants, parts of plants, traditional medicines or herbs, wooden articles?</td><td>Yes  No</td></tr>
<tr><td>Animals, parts of animals, animal products including equipment, pet food, eggs, biologicals, specimens, birds, fish, insects, shells, bee products?</td><td>Yes  No</td></tr>
<tr><td>Soil, items with soil attached, or used in freshwater areas, such as sports, recreational or camping equipment, or shoes?</td><td>Yes  No</td></tr>
</tbody>
</table>
<p>In the past 30 days, have you been in contact with farms, farm animals, wilderness areas or freshwater streams or lakes? Signature and date</p>
</div>
<p><a href="https://www.abf.gov.au/entering-and-leaving-australia/crossing-the-border/at-the-border/incoming-passenger-card-%28ipc%29">Official Incoming Passenger Card : Australian Border Force.</a></p>
<p class="notice">PRACTICE FORM for the classroom. This is not an official document.</p>
<h3>2. Tax file number declaration (Section A, for your employer)</h3>
<div class="form-practice">
<ol>
<li>What is your tax file number (TFN)?</li>
<li>Title</li>
<li>Surname or family name · First given name</li>
<li>Date of birth</li>
<li>Your home address in Australia</li>
<li>Your email address</li>
<li>On what basis are you paid?</li>
<li>Are you an Australian resident for tax purposes or a working holiday maker?</li>
<li>Do you want to claim the tax-free threshold from this payer? Signature and date</li>
</ol>
</div>
<p><a href="https://www.ato.gov.au/forms-and-instructions/tfn-declaration">Official TFN declaration : Australian Taxation Office (NAT 3092).</a></p>
<p>Question 8 : un titulaire du visa 417 coche « Working holiday maker » ; un taux d'imposition spécifique s'applique. Sans TFN, l'employeur prélève un impôt beaucoup plus élevé. Le TFN se demande en ligne, sans frais, une fois en Australie.</p>
<p class="notice">PRACTICE FORM for the classroom. This is not an official document.</p>
<h3>3. New employee details (café or farm)</h3>
<div class="form-practice">
<p>Full name · Mobile number · Visa type and expiry date · Start date</p>
<p><strong>Bank details</strong> Account name · BSB (6 digits) · Account number</p>
<p><strong>Superannuation</strong> Super fund name · Member number</p>
<p><strong>Emergency contact</strong> Name · Relationship · Phone (with country code)</p>
<p>Certificates (RSA, White Card, first aid...)</p>
</div>
<p class="notice">PRACTICE FORM for the classroom. This is not an official document.</p>
<h3>4. Hostel check-in</h3>
<div class="form-practice">
<p>Name · Nationality · Passport number · Arrival date · Number of nights · Room type</p>
<p>[ ] I have read the house rules (no alcohol in the rooms, quiet time after 10 pm, kitchen closes at 10 pm).</p>
</div>
<p class="notice">PRACTICE FORM for the classroom. This is not an official document.</p>
<h3>5. Rental application (share house)</h3>
<div class="form-practice">
<p>Property address · Weekly rent offered (AUD) · Move-in date · Length of stay</p>
<p>Current employment and weekly income · Two references (name, phone, relationship)</p>
<p>Tell the housemates about yourself (3 lines)</p>
<div class="lines" aria-hidden="true"></div>
</div>
<h2>Form exercises CE EE</h2>
<ol>
<li>★ Fill in the Incoming Passenger Card for Léa (see Arrival and Customs).</li>
<li>★ Find in form 3 the Australian words for: <i>RIB, mutuelle retraite, personne à prévenir</i>.</li>
<li>★★ Form 5: write the three lines for the housemates. Make yourself sound reliable, clean and friendly.</li>
<li>★★ Médiation: explain to your parents, in French, what a BSB and a super fund are.</li>
</ol>
{trace("If my passport is stolen in Sydney, I go to the Consulate General of France, Level 26, St Martins Tower, 31 Market Street. I can also write to the Fair Work Ombudsman if I am underpaid. I fill in practice forms, never with my real personal data in class.")}
{homework("Write the 60-to-80-word email to the Sydney consulate to ask for an appointment (a stolen passport). We read two emails at the start of séance 12.", "12")}
{corrige("<p>1. Consulat général de France à Sydney, Level 26, St Martins Tower, 31 Market Street. 2. Brisbane City YHA, +61 7 3236 1004. 4. Le salaire minimum est de 26,44 AUD de l'heure, plus 25 % pour un casual : 18 AUD est illégal. Adresses vérifiées en novembre 2026 ; les auberges peuvent changer, faites-les revérifier.</p><p>Formulaires 2. RIB : bank details (BSB et account number) ; caisse de retraite : super fund ; personne à prévenir : emergency contact. Ces formulaires sont des reproductions pédagogiques, signalées comme telles : n'y faites jamais saisir de vraies données personnelles.</p>")}
'''
    page("s11/index.html", f"{TITLE} · Séance 11 · Contacts and forms",
         "Heading Off to Australia : adresses utiles et formulaires de la vie réelle.",
         f"{BASE}/s11/", body)

def build_s12():
    body = f'''
<p class="kicker">Séance 12 · CO</p>
<h1>Speak like an Aussie</h1>
<table>
<thead><tr><th>Aussie</th><th>Meaning</th><th>Aussie</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td>G'day, mate!</td><td>Hello, friend!</td><td>arvo</td><td>afternoon</td></tr>
<tr><td>brekkie</td><td>breakfast</td><td>barbie</td><td>barbecue</td></tr>
<tr><td>servo</td><td>petrol station</td><td>bottle-o</td><td>alcohol shop</td></tr>
<tr><td>ute</td><td>pick-up truck</td><td>thongs</td><td>flip-flops</td></tr>
<tr><td>sunnies</td><td>sunglasses</td><td>esky</td><td>cool box</td></tr>
<tr><td>Maccas</td><td>McDonald's</td><td>heaps</td><td>a lot, very</td></tr>
<tr><td>No worries</td><td>No problem</td><td>She'll be right</td><td>Everything will be OK</td></tr>
<tr><td>fair dinkum</td><td>true, genuine</td><td>reckon</td><td>think</td></tr>
</tbody>
</table>
<p><strong>Pronunciation</strong>: Australians often shorten words and end them in "-o" or "-ie" (arvo, brekkie). "Day" can sound like "die".</p>
<h2>Listening CO</h2>
<p>Your teacher reads a message from Jake, an Australian, to Léa, a French backpacker. Listen and answer.</p>
<ol>
<li>★ When and where do they meet?</li>
<li>★ What must Léa bring? (three things)</li>
<li>★ What can she find at the servo?</li>
<li>★★ Rewrite the message in standard English.</li>
</ol>
<div class="form-practice">
<p><strong>Script à lire (deux fois, avec l'accent si possible)</strong></p>
<p>"G'day Léa! Fancy a barbie this arvo at Bondi? We're meeting at four near the surf club. Bring your thongs, your sunnies and heaps of sunscreen, mate, it's gonna be a scorcher. I'll bring the esky with drinks. If you're hungry before, there's a servo on the corner with snacks. No worries if you're late, she'll be right! Cheers, Jake."</p>
</div>
<p><a href="https://www.youtube.com/results?search_query=Australian+slang+explained">Australian slang : short videos that explain Aussie words.</a> · <a href="https://www.youtube.com/results?search_query=Australian+accent+vs+British+accent">Australian accent : compare with British and American English.</a></p>
{trace("G'day, arvo, barbie, thongs, sunnies, esky, servo, no worries, she'll be right. I can listen for these words and say them in standard English.")}
{homework("Learn eight Aussie words from the table. Write a four-line message to a friend, using at least five of them, then write the same message in standard English. We listen again and correct in séance 13.", "13")}
{corrige('''<p>1. Cet après-midi, à quatre heures, près du club de surf de Bondi. 2. Tongs, lunettes de soleil, beaucoup de crème solaire. 3. Des en-cas. 4. "Hello Léa! Would you like a barbecue this afternoon at Bondi? We are meeting at four near the surf club. Bring your flip-flops, your sunglasses and a lot of sunscreen, it's going to be extremely hot. I'll bring the cool box with drinks. If you're hungry before, there's a petrol station on the corner with snacks. It's all right if you're late, everything will be fine! Best wishes, Jake."</p>''')}
'''
    page("s12/index.html", f"{TITLE} · Séance 12 · Aussie English",
         "Heading Off to Australia : l'anglais australien, écoute et script.",
         f"{BASE}/s12/", body)

def build_s13():
    body = f'''
<p class="kicker">Séance 13 · CE, EOI</p>
<h1>Living in Australia: Is It Easy?</h1>
<p><strong>The good side</strong></p>
<p>Nature, beaches, sun, a relaxed lifestyle, good wages, a multicultural society where about one person in three was born overseas, and the famous "mateship" (loyalty between friends).</p>
<p><strong>The difficult side</strong></p>
<ul>
<li><strong>Homesickness and distance</strong>: France is 24 hours by plane; there is a 9 to 10 hour time difference. (See also <a href="{BASE}/s5/">the flight and the distances</a>.)</li>
<li><strong>Loneliness</strong>: it takes time to make Australian friends, and many backpackers only meet other French people.</li>
<li><strong>Cost of living</strong>: rent and food are expensive in big cities.</li>
<li><strong>Exploitation</strong>: some employers underpay backpackers, especially on farms.</li>
<li><strong>Scams</strong>: fake job ads, fake flats asking for a deposit.</li>
<li><strong>Nature</strong>: strong sun, heat, bushfires, the ocean (swim between the flags), long empty roads. The animals that frighten some people are discussed in <a href="{BASE}/s4/">séance 4</a>: the official rules matter more than the myth.</li>
<li><strong>Culture</strong>: respecting Aboriginal cultures and sacred sites, understanding humour and indirect politeness.</li>
</ul>
<h2>Reading: Tom's blog CE</h2>
<p>"My first month in Perth was hard. I didn't understand the accent, I missed my family and I spent too much money. I only hung out with French guys from my hostel. Then I got a job on a farm near Margaret River. The work was tough, 5 am starts in the heat, but the farmer, Sue, was great. She taught me to drive a ute and invited me to her family barbie. That's when I really discovered Australia. My advice? Leave your comfort zone, speak English, even badly, and say yes to invitations."</p>
<ol>
<li>★ List three problems Tom had at the beginning.</li>
<li>★ What changed his experience?</li>
<li>★★ Explain his advice and say if you agree.</li>
</ol>
<div class="lines" aria-hidden="true"></div>
<h2>Debate EOI</h2>
<p>"A year in Australia: a dream or a mistake?"</p>
<p>Two groups prepare three arguments each, with examples from the sequence. Useful phrases: <i>I agree / I disagree because..., On the one hand... on the other hand..., In my opinion..., That's a good point, but...</i></p>
<p><a href="https://www.youtube.com/results?search_query=working+holiday+Australia+first+week+vlog">Backpackers' vlogs : first weeks in Australia (choose one and check it first).</a></p>
{trace("A year in Australia can be a chance and a test: distance, money, work and culture. I can use facts from history, society, animals, transport and money to answer the big question: is it the land of opportunity for me?")}
{homework("Write your 'Why Australia?' paragraph (★ 60 words, ★★ 120 words), with one fact about history, one about society, and one personal reason. This paragraph goes into the application file. We start the assessment from this text.", "d'évaluation")}
{corrige("<p>1. Il ne comprenait pas l'accent, il avait le mal du pays, il dépensait trop et ne voyait que des Français. 2. Le travail à la ferme et l'accueil de Sue, la fermière. 3. Sortir de sa zone de confort, parler anglais, accepter les invitations. Réponse personnelle pour l'accord.</p>")}
'''
    page("s13/index.html", f"{TITLE} · Séance 13 · Living there",
         "Heading Off to Australia : vivre sur place, le blog de Tom et le débat final.",
         f"{BASE}/s13/", body)

def build_assessment():
    body = f'''
<p class="kicker">Évaluation sommative</p>
<h1>Final Task and Assessment</h1>
<h2>Final task: your application file</h2>
<p>You want to leave for Australia, to work or to study. You prepare a complete file, as if you were sending it to an Australian employer or school. Everything goes into one envelope (or one folder), in this order:</p>
<ol>
<li><strong>A cover letter</strong>: who you are, what you want to do, and above all <strong>why Australia</strong>.</li>
<li><strong>Your resume</strong> (Australian style: no photo, two referees).</li>
<li><strong>All the forms filled in</strong>: Incoming Passenger Card, TFN declaration, new employee details or student information, rental application (Real-life Forms).</li>
<li><strong>Your visa checklist</strong>: which visa, the documents, the cost.</li>
<li><strong>Your budget</strong>, printed from the calculator.</li>
<li><strong>Your contact list</strong>: consulate, first hostel, community group, Fair Work.</li>
</ol>
<p>Then you present your project in a phone interview with an Australian employer or school adviser.</p>
<h2>Why Australia? The key paragraph</h2>
<p>Australians are very proud of their country, its nature, its sports and its way of life. An employer wants to know that you chose Australia for real reasons, not only for the beaches. Show that you know the country and respect it.</p>
<p>Write your "Why Australia?" paragraph (★ 60 words, ★★ 120 words). Use at least one fact about history, one about society, and one personal reason.</p>
<p>Avoid: <i>"Because it's always sunny."</i> Prefer: <i>"I want to work in a country that values hard work and outdoor life, and to learn from the oldest living culture in the world."</i></p>
<h2>Assessment grid: the application file /20</h2>
<table>
<thead><tr><th>Criterion</th><th>Points</th></tr></thead>
<tbody>
<tr><td>The file is complete and in order (letter, resume, forms, checklist, budget, contacts)</td><td>/4</td></tr>
<tr><td>Forms filled in correctly and consistently (same name, dates, visa)</td><td>/4</td></tr>
<tr><td>Cover letter: format, clear purpose, motivation</td><td>/4</td></tr>
<tr><td>"Why Australia?": precise knowledge of the country, respectful and personal</td><td>/4</td></tr>
<tr><td>Language: grammar, vocabulary of work, money and travel</td><td>/4</td></tr>
</tbody>
</table>
<p>On peut faire réellement constituer l'enveloppe : documents imprimés, signés, classés. Le contrôle de cohérence (même nom, mêmes dates, même visa partout) est très formateur : c'est exactement ce que vérifient les services d'immigration et les employeurs.</p>
<h2>Summative tests: one per language activity</h2>
<table>
<thead><tr><th>Activity</th><th>Task</th><th>Level ★ / ★★</th></tr></thead>
<tbody>
<tr><td>CO</td><td>Listen to a voicemail from a hostel (read by the teacher) and fill in a form: dates, price, address, rules.</td><td>★ form / ★★ form and summary</td></tr>
<tr><td>CE</td><td>Read a job ad and an article on working conditions; answer questions.</td><td>★ guided / ★★ open questions</td></tr>
<tr><td>EE</td><td>Write your application email for a job of your choice.</td><td>★ 80 words / ★★ 150 words</td></tr>
<tr><td>EOC</td><td>Present your project: where, why, which job, your budget (2 minutes).</td><td>★ 1 to 2 min / ★★ 3 min</td></tr>
<tr><td>EOI</td><td>Phone job interview with the teacher.</td><td>★ 3 min / ★★ 5 min</td></tr>
</tbody>
</table>
<div class="form-practice">
<p><strong>Script CO (message de l'auberge)</strong> : "Hi, this is Mel from Sunny Days Hostel in Cairns. I'm calling about your booking. You're with us from the 3rd to the 17th of March, in a six-bed dorm, at 38 dollars a night. Check-in is after 2 pm. The address is 14 Esplanade, next to the lagoon. No alcohol in the rooms, and quiet time after 10 pm. Call me back on 0400 123 456. Cheers!"</p>
</div>
<p class="notice">Réponses : 3 au 17 mars, dortoir de six lits, 38 AUD la nuit, arrivée après 14 h, 14 Esplanade, pas d'alcool dans les chambres, silence après 22 h.</p>
<h2>Assessment grid: speaking (EOC) /20</h2>
<table>
<thead><tr><th>Criterion</th><th>A2</th><th>B1</th><th>B2</th></tr></thead>
<tbody>
<tr><td>Task (content: project, job, budget)</td><td>1 to 2: a few simple facts</td><td>3 to 4: clear, complete project</td><td>5: detailed, justified project</td></tr>
<tr><td>Organisation</td><td>1 to 2: list of ideas</td><td>3 to 4: linked ideas (first, then, because)</td><td>5: clear structure, examples</td></tr>
<tr><td>Language (grammar, vocabulary of the sequence)</td><td>1 to 2: basic, many errors</td><td>3 to 4: correct, useful vocabulary</td><td>5: varied and precise</td></tr>
<tr><td>Pronunciation and fluency</td><td>1 to 2: hesitant</td><td>3 to 4: understandable, few pauses</td><td>5: fluent, natural</td></tr>
</tbody>
</table>
<h2>Assessment grid: interaction (EOI) /20</h2>
<table>
<thead><tr><th>Criterion</th><th>A2</th><th>B1</th><th>B2</th></tr></thead>
<tbody>
<tr><td>Answers the questions</td><td>1 to 2: short answers</td><td>3 to 4: develops answers</td><td>5: convincing answers</td></tr>
<tr><td>Interacts (asks, reacts, reformulates)</td><td>1 to 2: needs help</td><td>3 to 4: asks and reacts</td><td>5: leads the conversation</td></tr>
<tr><td>Language</td><td>1 to 2: basic</td><td>3 to 4: correct</td><td>5: varied, polite register</td></tr>
<tr><td>Fluency</td><td>1 to 2: many pauses</td><td>3 to 4: regular</td><td>5: spontaneous</td></tr>
</tbody>
</table>
<h2>Assessment grid: writing (EE) /20</h2>
<table>
<thead><tr><th>Criterion</th><th>Points</th></tr></thead>
<tbody>
<tr><td>Respects the task (email format, greeting, purpose, length)</td><td>/5</td></tr>
<tr><td>Content (experience, motivation, availability)</td><td>/5</td></tr>
<tr><td>Organisation and link words</td><td>/4</td></tr>
<tr><td>Grammar and spelling</td><td>/3</td></tr>
<tr><td>Vocabulary of work and travel</td><td>/3</td></tr>
</tbody>
</table>
<h2>Assessment grid: listening and reading (CO, CE) /20</h2>
<table>
<thead><tr><th>Level reached</th><th>The student...</th><th>Points</th></tr></thead>
<tbody>
<tr><td>A1</td><td>finds a few isolated words or numbers</td><td>2 to 5</td></tr>
<tr><td>A2</td><td>finds the main information (dates, price, place)</td><td>6 to 10</td></tr>
<tr><td>B1</td><td>understands the main points and some details</td><td>11 to 15</td></tr>
<tr><td>B2</td><td>understands details, opinions and implicit meaning</td><td>16 to 20</td></tr>
</tbody>
</table>
<p>Ces grilles s'inspirent des descripteurs du CECRL, sur lesquels s'appuient les programmes. Pour un examen, utilisez les grilles officielles de l'épreuve de votre filière.</p>
{trace("My file must be complete, consistent and personal: letter, resume, forms, visa, budget, contacts, and a 'Why Australia?' paragraph that shows I know the country.")}
'''
    page("assessment/index.html", f"{TITLE} · Assessment",
         "Heading Off to Australia : tâche finale, dossier de candidature et cinq grilles d'évaluation.",
         f"{BASE}/assessment/", body)

def build_teacher():
    body = f'''
<p class="kicker">Pour le professeur</p>
<h1>Corrigés et repères</h1>
<p>Les corrigés figurent aussi, séance par séance, sous un volet « Corrigé (pour le professeur) ». Cette page les rassemble, avec les chiffres revérifiés en novembre 2026 et les sources.</p>
<h2>Chiffres revérifiés (novembre 2026)</h2>
<ul>
<li>Visa 417, premier visa : AUD 840 depuis le 1er juillet 2026. <a href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/fees-and-charges">Home Affairs, visa pricing</a>. Migration Regulations 1994, item 1225, en vigueur au 1er juillet 2026.</li>
<li>Âge pour les citoyens français : 18 à 35 ans au moment de la demande (arrangement de longue date entre la France et l'Australie). Faire vérifier sur la page officielle du visa 417, car l'âge dépend du passeport.</li>
<li>Fonds : environ AUD 5 000, plus un billet retour ou de quoi l'acheter. <a href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/work-holiday-417">Home Affairs, visa 417</a>.</li>
<li>Salaire minimum national depuis le 1er juillet 2026 : AUD 26,44 de l'heure, ou AUD 1 004,90 pour 38 heures. Majoration casual d'au moins 25 % (environ AUD 33). <a href="https://www.fairwork.gov.au/about-us/workplace-laws/annual-wage-review/annual-wage-review-2026">Fair Work Ombudsman</a> ; <a href="https://www.fwc.gov.au/work-conditions/minimum-wages-and-conditions/national-minimum-wage">Fair Work Commission</a>.</li>
<li>Taux de change : le 13 novembre 2026, la Banque de France donnait 1 € = 1,6288 AUD. La séquence conserve « environ 1,62 » pour les calculs en classe.</li>
<li>Impôt working holiday maker, 2026-27 : 15 % sur la première tranche (jusqu'à AUD 45 000). <a href="https://www.ato.gov.au/tax-rates-and-codes/tax-rates-working-holiday-makers">ATO</a>.</li>
<li>Visa étudiant 500 : AUD 2 500 depuis le 1er juillet 2026 (contre 2 000 auparavant). <a href="https://www.studyaustralia.gov.au/en/Agent-Hub/agent-news-index/student-visa-application-charge-increase">Study Australia</a>.</li>
<li>Franchise : 2,25 litres d'alcool, 25 cigarettes, AUD 900 de marchandises. <a href="https://www.abf.gov.au/entering-and-leaving-australia/can-you-bring-it-in/categories/duty-free">ABF</a>. Espèces : déclarer AUD 10 000 ou plus.</li>
</ul>
<h2>Corrigés par séance</h2>
<p>Séance 1. Hard work: <i>Shearing the Rams</i>. A lonely man: <i>Down on His Luck</i>. An arrival: Fox, Cook at Botany Bay. The Cook painting places Aboriginal people on the margin: a colonial point of view.</p>
<p>Séance 2. 26 January: barbecues, fireworks, flags. Other names: Invasion Day, Survival Day. Acknowledgement of Country: a statement that recognises the traditional owners of the land.</p>
<p>Séance 3. Pistes de discussion : appeler si l'on est en retard ; porter le chapeau ; demander « What can I do next? » ; remercier pour un retour direct ; accepter l'autodérision ; dire oui à une invitation australienne.</p>
<p>Séance 4. Serpents : 1 à 4 morts par an (healthdirect). Premier geste : 000, immobiliser, bandage compressif. Crocodiles : nord de l'Australie, rester loin de l'eau. Méduses : saison plus risquée novembre-mai, nager entre les drapeaux. Les routes tuent beaucoup plus que les requins ou les serpents (gouvernement du Queensland).</p>
<p>Séance 5. Pas de vol direct régulier Paris-Sydney ; environ 22 à 24 heures, une escale, environ 17 000 km. The Ghan : 2 979 km, environ 48 h. Indian Pacific : 4 352 km, environ 68 h. FIFO : vols vers un site minier isolé, souvent depuis Perth ; salaires élevés, isolement et longues journées ; pas automatiquement un premier emploi pour un visa 417.</p>
<p>Séance 6. 1. 417. 2. 651. 3. 500. 4. 482. Vrai-faux : a faux, b vrai, c faux, d faux. Ordre : passeport, visa, assurance, billet, TFN à l'arrivée.</p>
<p>Séance 7. À déclarer : camembert, nouilles, chaussures de randonnée, paracétamol, boîte en bois. Pas besoin : parfum, 1 200 AUD, une bouteille de vin.</p>
<p>Séance 8. 840 ÷ 1,62 ≈ 520 € ; 5 000 ÷ 1,62 ≈ 3 090 €. 30 × 33 = 990 AUD. 990 − 420 = 570 AUD (avant impôts).</p>
<p>Séance 9. Kitchen hand à Byron Bay, 25 à 35 heures, week-ends, droits de travailler (visa 417). Stages et français : atouts.</p>
<p>Séance 10. CM2 ≈ Year 5 ou 6 ; terminale ≈ Year 12. TAFE : Technical and Further Education. Janvier : grandes vacances d'été.</p>
<p>Séance 11. Passeport volé : consulat de Sydney, Level 26, St Martins Tower, 31 Market Street. Brisbane City YHA, +61 7 3236 1004. 18 AUD de l'heure est illégal. BSB et account number = RIB ; super fund = caisse de retraite ; emergency contact = personne à prévenir.</p>
<p>Séance 12. Rendez-vous cet après-midi à 16 h près du club de surf de Bondi ; tongs, lunettes, beaucoup de crème solaire ; en-cas à la station-service.</p>
<p>Séance 13. Tom : accent, mal du pays, argent, bulle française. Ce qui change : la ferme et Sue. Conseil : sortir de sa zone de confort, parler anglais, accepter les invitations.</p>
<p>Évaluation CO (auberge) : 3 au 17 mars, dortoir de six lits, 38 AUD, arrivée après 14 h, 14 Esplanade, pas d'alcool dans les chambres, silence après 22 h.</p>
<h2>Sources</h2>
<ul>
<li>Department of Home Affairs, Working Holiday visa (subclass 417) and visa pricing.</li>
<li>Fair Work Ombudsman and Fair Work Commission, minimum wages from 1 July 2026.</li>
<li>Banque de France, daily exchange rates, 13 November 2026.</li>
<li>Australian Taxation Office, working holiday maker tax rates and TFN declaration (NAT 3092).</li>
<li>Study Australia, Student visa application charge from 1 July 2026.</li>
<li>Australian Border Force, duty-free concessions and Incoming Passenger Card.</li>
<li>healthdirect, snake bites and spider bites ; Queensland Government, dangerous marine life and staying safe around wildlife.</li>
<li>Journey Beyond / Great Trains, The Ghan and the Indian Pacific.</li>
<li>Western Australian Department of Transport, closed charter / FIFO flights ; Fortescue, FIFO rosters.</li>
<li>France Diplomatie, Ambassade d'Australie, YHA Australia, Alliance Française de Melbourne.</li>
<li>BO spécial n° 5 du 11 avril 2019 (voie professionnelle) ; BO n° 22 du 29 mai 2025 (lycée général et technologique).</li>
</ul>
<p class="dl"><a href="{BASE}/downloads/">Télécharger la présentation et les fiches</a></p>
'''
    page("teacher/index.html", f"{TITLE} · Corrigés",
         "Corrigés et chiffres officiels de la séquence Heading Off to Australia.",
         f"{BASE}/teacher/", body)

def build_downloads():
    body = f'''
<p class="kicker">Documents</p>
<h1>Téléchargements</h1>
<p>Tous les fichiers sont en pdf, Word et LibreOffice. La présentation pour les collègues est composée en corps 16 ou davantage, pour une lecture confortable.</p>
<ul class="dl">
<li>Présentation pour les collègues : <a href="presentation-heading-off-to-australia.pdf">pdf</a> · <a href="presentation-heading-off-to-australia.docx">Word</a> · <a href="presentation-heading-off-to-australia.odt">LibreOffice</a></li>
<li>Fiches élèves (une activité par page) : <a href="heading-off-to-australia-fiches-eleves.pdf">pdf</a> · <a href="heading-off-to-australia-fiches-eleves.docx">Word</a> · <a href="heading-off-to-australia-fiches-eleves.odt">LibreOffice</a></li>
<li>Corrigés pour le professeur : <a href="heading-off-to-australia-corriges.pdf">pdf</a> · <a href="heading-off-to-australia-corriges.docx">Word</a> · <a href="heading-off-to-australia-corriges.odt">LibreOffice</a></li>
</ul>
<p>L'ancienne version en huit leçons (bac pro / CFA, B1) reste disponible dans l'<a href="{BASE}/annexe/">annexe</a>, avec ses fiches et ses photographies.</p>
'''
    page("downloads/index.html", f"{TITLE} · Téléchargements",
         "Téléchargements pdf, Word et LibreOffice de Heading Off to Australia.",
         f"{BASE}/downloads/", body)

def build_annexe_intro():
    # Write a new index in annexe that points to the preserved old sequence.
    # The old index is already in annexe/index.html - we should rename it and add a wrapper.
    old = ROOT / "annexe" / "index.html"
    if old.exists() and not (ROOT / "annexe" / "ancienne-version.html").exists():
        text = old.read_text(encoding="utf-8")
        text = text.replace('href="/destination-australia/s', 'href="/destination-australia/annexe/s')
        text = text.replace('href="/destination-australia/assessment/', 'href="/destination-australia/annexe/assessment/')
        text = text.replace('href="/destination-australia/downloads/', 'href="/destination-australia/annexe/downloads/')
        text = text.replace('href="/destination-australia/flashcards/', 'href="/destination-australia/annexe/flashcards/')
        text = text.replace('href="/destination-australia/dys/', 'href="/destination-australia/annexe/dys/')
        text = text.replace('href="/destination-australia/img/', 'href="/destination-australia/annexe/img/')
        text = text.replace('src="/destination-australia/img/', 'src="/destination-australia/annexe/img/')
        text = text.replace('src="/destination-australia/script.js"', 'src="/destination-australia/annexe/script.js"')
        (ROOT / "annexe" / "ancienne-version.html").write_text(text, encoding="utf-8")
        # also patch inner pages' links? optional later
    body = f'''
<p class="kicker">Annexe</p>
<h1>L'ancienne version, conservée</h1>
<p>Avant cette refonte, la page <cite>Destination Australia</cite> proposait huit leçons de B1, conçues pour le baccalauréat professionnel et le CFA, sur le projet d'un PVT, le budget et l'emploi. Cette version n'a pas été effacée. Elle reste consultable ici, avec ses photographies, ses fiches et ses flashcards, pour tout ce qui peut encore servir en classe.</p>
<p>La séquence actuelle, <a href="{BASE}/">Heading Off to Australia</a>, reprend le même projet (un an en Australie) et l'enrichit : présentation pour les collègues, textes de Carole, séances sur les animaux et sur les transports (y compris le FIFO), calculateur de budget, formulaires et grilles d'évaluation.</p>
<p>Le tableau <i>Coming South</i> de Tom Roberts, qui ouvrait l'ancienne version, reste dans cette annexe. Il n'est plus utilisé comme image principale de la nouvelle séquence.</p>
<p><a href="{BASE}/annexe/ancienne-version.html">Ouvrir l'ancienne séquence (huit leçons)</a></p>
'''
    page("annexe/index.html", f"{TITLE} · Annexe",
         "Ancienne version de Destination Australia, conservée en annexe.",
         f"{BASE}/annexe/", body)

def main():
    build_index()
    build_s1(); build_s2(); build_s3(); build_s4(); build_s5()
    build_s6(); build_s7(); build_s8(); build_s9(); build_s10()
    build_s11(); build_s12(); build_s13()
    build_assessment(); build_teacher(); build_downloads(); build_annexe_intro()
    print("ALL PAGES OK")

if __name__ == "__main__":
    main()
