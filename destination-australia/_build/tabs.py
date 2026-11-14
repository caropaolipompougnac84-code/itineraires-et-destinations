# -*- coding: utf-8 -*-
"""In-lesson tabs for the interactive whiteboard."""
import re

BASE = "/destination-australia"

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

FIVE = [
    ("CO", "Compréhension de l'oral"),
    ("CE", "Compréhension de l'écrit"),
    ("EE", "Expression écrite"),
    ("EOC", "Expression orale en continu"),
    ("EOI", "Interaction orale"),
]

VIE_NOTE = """
<div class="note-vie-scolaire">
<p>Parce que la séance est à onglets et que la fiche élève s'imprime, un élève en difficulté peut emporter sa feuille et continuer ailleurs, sous la surveillance d'un autre adulte (vie scolaire, CDI, infirmerie).</p>
<p>Cet accueil doit être réglé dès le début de l'année avec la vie scolaire : qui reçoit l'élève, où, et comment le professeur le signale.</p>
</div>
"""

GESTION_CORE = """
<div class="box-prof">
<h3>Tempête émotionnelle</h3>
<p>Si un élève traverse une tempête émotionnelle, restez calme. Parlez-lui à part, sans le juger. Proposez un coin plus calme dans la salle, ou une tâche courte sur la fiche de la séance.</p>
<p>Si besoin, prévenez le CPE ou l'infirmière. Le cours continue, simplement, pour les autres.</p>
</div>
""" + VIE_NOTE

LESSONS = {
    "s1": {
        "eval": "<p>Vers 40 minutes, un contrôle court, à l'oral : chaque élève désigne un tableau et dit une phrase, <i>In the foreground I can see...</i> Notez qui parle déjà seul, et qui a encore besoin d'un début de phrase.</p>",
        "backup": "<p>Si le projecteur manque, ou si la classe n'entre pas dans les tableaux : donnez une photocopie d'un seul tableau, ou décrivez-le à voix haute. 10 minutes de regard, 15 minutes de phrases guidées à l'oral, 15 minutes d'écrit sur la fiche, 8 minutes de mise en commun, 4 minutes pour lancer le devoir.</p>",
        "where": {
            "CO": "Pas travaillée aujourd'hui.",
            "CE": "Pas le cœur de la séance : on observe des images, on ne lit pas un texte suivi.",
            "EE": "Présente, sans être le cœur : 40-48 min, la trace écrite ; 48-52 min, le devoir.",
            "EOC": "Cœur de la séance : 5-40 min, décrire un tableau, puis justifier un choix.",
            "EOI": "Présente un moment, à la mise en commun (25-40 min), quand on réagit aux propositions.",
        },
        "criteria": [
            "L'élève désigne un tableau et dit ce qu'il voit (foreground / background).",
            "L'élève relie le tableau à une idée (work, solitude, arrival).",
            "Les phrases sont claires, même courtes.",
            "Parcours starstar : un mot sur le point de vue du peintre, ou un choix d'affiche justifié.",
        ],
    },
    "s2": {
        "eval": "<p>En fin de lecture, un contrôle court : chaque élève écrit une date et une phrase, sans recopier tout le texte. Ramassez cinq feuilles au hasard, ou circulez.</p>",
        "backup": "<p>Si la lecture suivie bloque : travaillez seulement les trois dates du tableau, à l'oral, une phrase chacune, puis l'Acknowledgement of Country recopié et lu. 52 minutes tiennent avec ce socle, sans le texte long.</p>",
        "where": {
            "CO": "Pas travaillée aujourd'hui.",
            "CE": "Cœur de la séance : 5-25 min, lecture du texte, crayon à la main.",
            "EE": "Présente : 40-48 min, la trace ; 48-52 min, le devoir (trois dates, une phrase).",
            "EOC": "Cœur de la séance aussi : 25-40 min, frise orale, trois dates à présenter.",
            "EOI": "Présente un moment, quand on compare Australia Day et Invasion Day.",
        },
        "criteria": [
            "L'élève relie le 26 janvier à au moins deux noms.",
            "L'élève situe trois dates et dit pourquoi elles comptent encore.",
            "L'élève explique, simplement, ce qu'est un Acknowledgement of Country.",
            "Les phrases sont justes et compréhensibles.",
        ],
    },
    "s3": {
        "eval": "<p>Pendant les jeux de rôle, écoutez deux binômes. Chaque élève doit poser une question et donner une réponse. Notez qui reste muet : on lui donne une phrase à dire, tout de suite.</p>",
        "backup": "<p>Si les jeux de rôle ne partent pas : questionnaire oral collectif (where do most people live, what is the outback, who are the First Nations), puis un message écrit de six lignes à un ami. On tient l'heure sans le théâtre.</p>",
        "where": {
            "CO": "Pas travaillée aujourd'hui.",
            "CE": "Présente légèrement, si un court texte d'appui est lu avant les jeux.",
            "EE": "Cœur de la séance : 35-52 min, trace écrite et message de 8 à 10 lignes.",
            "EOC": "Cœur de la séance : 5-20 min, préparation ; puis présentation du rôle.",
            "EOI": "Cœur de la séance : 20-35 min, jeux de rôle en binômes.",
        },
        "criteria": [
            "L'élève situe où vivent la plupart des Australiens.",
            "L'élève dit une chose juste sur l'outback ou sur les First Nations.",
            "Dans le jeu de rôle, l'élève pose au moins une question et répond.",
            "L'écrit (message) a 8 à 10 lignes, claires.",
        ],
    },
    "s4": {
        "eval": "<p>Après la lecture, un contrôle de 4 minutes : un animal, un chiffre officiel, une règle. L'élève écrit trois lignes, sans le texte sous les yeux.</p>",
        "backup": "<p>Si le débat s'enflamme ou s'enlise : restez sur les faits. Un animal, un chiffre, une règle, à l'écrit, puis une phrase orale : Would this stop you? On laisse l'opinion pour le devoir.</p>",
        "where": {
            "CO": "Pas travaillée aujourd'hui.",
            "CE": "Cœur de la séance : 5-25 min, lecture (animaux, règles, chiffres).",
            "EE": "Présente : 40-52 min, trace et devoir (fait officiel + raison personnelle).",
            "EOC": "Présente, si un élève expose un fait à la classe.",
            "EOI": "Cœur de la séance : 25-40 min, échange en binômes.",
        },
        "criteria": [
            "L'élève cite un animal et un fait officiel (pas une rumeur).",
            "L'élève rappelle une règle de prudence.",
            "L'élève donne un avis personnel, sans effacer les chiffres.",
            "L'échange oral reste calme et compréhensible.",
        ],
    },
    "s5": {
        "eval": "<p>Avant la trace, chaque élève écrit en deux lignes son vol (ville, durée, une escale) et le mot FIFO. Contrôle écrit de 3 minutes.</p>",
        "backup": "<p>Sans carte ni écran : écrivez au tableau les durées et les distances clés. Les élèves construisent un itinéraire sur papier, puis une phrase sur le FIFO. Le calcul d'heures remplace la carte.</p>",
        "where": {
            "CO": "Pas travaillée aujourd'hui.",
            "CE": "Cœur de la séance : 5-25 min, lecture (vol, trains, distances, FIFO).",
            "EE": "Cœur de la séance : 25-52 min, itinéraire écrit, trace, devoir.",
            "EOC": "Présente, si un binôme présente son parcours à voix haute.",
            "EOI": "Présente en binômes, pendant la construction de l'itinéraire.",
        },
        "criteria": [
            "L'élève propose un itinéraire France-Australie réaliste (durée, escale).",
            "L'élève ajoute un trajet intérieur (train, bus ou vol).",
            "L'élève explique FIFO en une phrase juste.",
            "Les chiffres sont recopiés avec soin.",
        ],
    },
    "s6": {
        "eval": "<p>À 30 minutes, contrôle écrit de 4 minutes, sans le tableau : tarif du 417, fonds, âge, une règle. Trois réponses justes suffisent pour valider le palier.</p>",
        "backup": "<p>Si le lien officiel est inaccessible : travaillez uniquement le tableau recopié au préalable. Les élèves relèvent tarif, fonds, âge et une règle, puis expliquent le 417 à un parent, en six lignes. La médiation tient sans écran.</p>",
        "where": {
            "CO": "Pas travaillée aujourd'hui.",
            "CE": "Cœur de la séance : 5-30 min, lecture du tableau des visas.",
            "EE": "Cœur de la séance : 30-52 min, médiation écrite, trace, devoir.",
            "EOC": "Présente, si un élève explique le 417 à voix haute, comme à un parent.",
            "EOI": "Présente légèrement, lors des questions sur le tableau.",
        },
        "criteria": [
            "L'élève identifie le visa 417 et son tarif actuel.",
            "L'élève cite les fonds, l'âge, et une règle à ne pas oublier.",
            "L'élève date sa source (titre de la page officielle).",
            "La médiation (expliquer à un parent) est claire, en français ou en anglais selon la consigne.",
        ],
    },
    "s7": {
        "eval": "<p>Contrôle court : trois objets du sac de Léa. Pour chacun, l'élève dit declare ou no need, en une phrase. Faites-le à l'oral, sur cinq élèves, ou à l'écrit pour toute la classe.</p>",
        "backup": "<p>Si l'activité du sac tombe à plat : dictez huit objets. Les élèves classent : declare / all right / not sure. Mise en commun au tableau, puis la règle When in doubt, declare. On tient l'heure sur papier.</p>",
        "where": {
            "CO": "Pas travaillée aujourd'hui.",
            "CE": "Cœur de la séance : 5-25 min, consignes et listes à lire.",
            "EE": "Cœur de la séance : 40-52 min, trace et liste personnelle à déclarer.",
            "EOC": "Présente, si un élève justifie un objet à la classe.",
            "EOI": "Cœur de la séance : 25-40 min, mise en commun et discussion du barème.",
        },
        "criteria": [
            "L'élève sait ce qu'il faut déclarer dans le sac de Léa (nourriture, bois, espèces).",
            "L'élève applique la règle : When in doubt, declare.",
            "L'élève dresse sa propre liste, avec ce qui se déclare.",
            "Les justifications sont courtes et justes.",
        ],
    },
    "s8": {
        "eval": "<p>Après le calculateur, contrôle de 4 minutes : l'élève recopie le reste à vivre hebdomadaire et dit, en une phrase, si ce budget tient à Sydney. Pas besoin de tout recalculer.</p>",
        "backup": "<p>Si le calculateur ne s'ouvre pas : donnez les figures au tableau (loyer, heures, salaire, change). Les élèves calculent à la main le reste à vivre, puis commentent en six lignes. Même séance, sans écran.</p>",
        "where": {
            "CO": "Pas travaillée aujourd'hui.",
            "CE": "Cœur de la séance : 5-30 min, lecture des résultats et des consignes du calculateur.",
            "EE": "Cœur de la séance : 30-52 min, commentaire écrit, trace, devoir.",
            "EOC": "Présente, si un élève expose son budget à la classe.",
            "EOI": "Présente légèrement, quand on compare Sydney et une ville plus petite.",
        },
        "criteria": [
            "L'élève saisit ou recopie les chiffres justes (change, salaire, loyer).",
            "L'élève lit le reste à vivre et le commente.",
            "L'élève voit ce qui change si les heures ou le loyer bougent.",
            "Le commentaire est clair, avec au moins un chiffre.",
        ],
    },
    "s9": {
        "eval": "<p>Pendant les entretiens, écoutez deux binômes. Les trois questions (Why Australia? Why this job? When can you start?) doivent avoir une réponse, même courte. Notez qui lit ses notes sans lever les yeux.</p>",
        "backup": "<p>Si les entretiens en binômes font trop de bruit : un modèle au tableau, puis rédaction silencieuse du CV et des trois réponses. Deux élèves volontaires passent devant la classe. Le reste prépare à l'écrit.</p>",
        "where": {
            "CO": "Pas travaillée aujourd'hui, sauf à écouter le binôme pendant l'entretien.",
            "CE": "Présente légèrement, si un modèle de CV est lu.",
            "EE": "Cœur de la séance : 5-20 min, CV ; 38-52 min, trace et devoir.",
            "EOC": "Présente : répondre aux trois questions, en continu, pendant 1 à 2 minutes.",
            "EOI": "Cœur de la séance : 20-38 min, entretien téléphonique en binômes.",
        },
        "criteria": [
            "Le CV tient sur une page, lisible, sans invention.",
            "L'élève répond aux trois questions de l'entretien.",
            "L'élève demande de répéter si besoin, poliment.",
            "Le ton convient à un appel professionnel.",
        ],
    },
    "s10": {
        "eval": "<p>Contrôle écrit de 4 minutes : un écart France / Australie, et le tarif du visa 500, avec la source. Une phrase suffit pour l'écart, un chiffre pour le visa.</p>",
        "backup": "<p>Si la comparaison s'éparpille : un tableau à deux colonnes, déjà amorcé. Les élèves n'ajoutent que trois lignes, puis répondent par écrit : work for a year, or study? avec un chiffre officiel.</p>",
        "where": {
            "CO": "Pas travaillée aujourd'hui.",
            "CE": "Cœur de la séance : 5-25 min, comparaison des systèmes et du visa 500.",
            "EE": "Cœur de la séance : 25-52 min, écrit personnel, trace, devoir.",
            "EOC": "Présente, si un élève défend son choix à voix haute.",
            "EOI": "Présente légèrement, lors de la mise en commun des tableaux.",
        },
        "criteria": [
            "L'élève compare un point du système français et du système australien.",
            "L'élève cite le visa 500 et un tarif ou une règle, datés.",
            "L'élève choisit : travailler un an, ou étudier, avec une raison.",
            "L'écrit a un chiffre officiel et des phrases claires.",
        ],
    },
    "s11": {
        "eval": "<p>Contrôle court : le courriel a-t-il un objet, une formule d'ouverture, un fait (où, quand), une question, un nom et un téléphone ? Cochez ces cinq points sur la feuille, en circulant.</p>",
        "backup": "<p>Sans accès aux sites officiels : donnez un titre de page et une date déjà notés. Les élèves remplissent le formulaire d'entraînement sur papier, puis écrivent le courriel (passeport perdu) en six phrases. La séance tient entièrement sur la fiche.</p>",
        "where": {
            "CO": "Pas travaillée aujourd'hui.",
            "CE": "Cœur de la séance : 5-25 min, page officielle, titre, date, formulaire.",
            "EE": "Cœur de la séance : 25-52 min, courriel, trace, devoir.",
            "EOC": "Pas le cœur : pas d'exposé prévu.",
            "EOI": "Présente légèrement, si l'on relit un courriel à deux.",
        },
        "criteria": [
            "L'élève recopie un titre officiel et la date du jour.",
            "Le formulaire d'entraînement est rempli sans ligne vide inutile.",
            "Le courriel a un objet, des faits, une question, une signature.",
            "Les phrases sont courtes et polies.",
        ],
    },
    "s12": {
        "eval": "<p>Après l'écoute, contrôle de 3 minutes : trois mots entendus (par exemple sunnies, arvo, barbie) et une phrase de conseil d'Elena. Sans le script sous les yeux.</p>",
        "backup": "<p>Si la vidéo ne part pas : lisez le script une première fois à voix haute, une deuxième fois en faisant cocher les mots, puis le dialogue en binômes (arvo, servo, brekkie, barbie). Même séance, sans le son.</p>",
        "where": {
            "CO": "Cœur de la séance : 5-22 min, écoute de la vidéo d'Elena, jusqu'à trois fois.",
            "CE": "Présente, si l'on s'appuie ensuite sur le tableau de lexique.",
            "EE": "Présente : 40-52 min, trace et devoir (dialogue de six lignes).",
            "EOC": "Cœur de la séance : une réplique suivie dans le dialogue, ou un rappel de conseil d'Elena.",
            "EOI": "Cœur de la séance : 22-40 min, dialogue en binômes.",
        },
        "criteria": [
            "L'élève reconnaît au moins trois mots d'argot entendus.",
            "L'élève reformule un conseil d'Elena (drapeaux, crème, sunnies).",
            "L'élève joue un court dialogue avec un camarade.",
            "Le devoir reprend six mots, dans un échange compréhensible.",
        ],
    },
    "s13": {
        "eval": "<p>Pendant le débat, chaque élève doit poser un chiffre officiel et une conclusion personnelle. Notez, sur une liste, qui a cité une source, et qui a parlé sans chiffre.</p>",
        "backup": "<p>Si le débat est trop vif ou trop pauvre : chacun écrit d'abord 8 lignes, un chiffre, une source, une conclusion. Puis quatre volontaires lisent. Le devoir (12 à 15 lignes) reste le fil vers l'évaluation.</p>",
        "where": {
            "CO": "Présente, à l'écoute des camarades pendant le débat.",
            "CE": "Présente, si un coût est lu sur un site sérieux (5-18 min).",
            "EE": "Cœur de la séance : 40-52 min, trace et devoir de 12 à 15 lignes.",
            "EOC": "Présente : un tour de parole de deux minutes, préparé.",
            "EOI": "Cœur de la séance : 18-40 min, débat.",
        },
        "criteria": [
            "L'élève apporte un coût ou un fait, avec une source sérieuse.",
            "L'élève répond à la question : land of opportunity, yes or no, with a reason.",
            "L'élève écoute et réagit à un camarade, sans couper.",
            "Le devoir a 12 à 15 lignes, un chiffre, une conclusion claire.",
        ],
    },
    "assessment": {
        "eval": "<p>Le contrôle du jour, c'est la tâche elle-même : dossier complet, puis entretien. Avant de commencer, vérifiez les six pièces du dossier. Pendant l'entretien, cochez les critères de la grille, sans commentaire à voix haute devant les autres.</p>",
        "backup": "<p>Si un élève n'a pas son dossier, ou si le temps manque pour tous les oraux : l'élève remet ce qu'il a, passe un entretien plus court (trois questions), et termine le dossier pour le cours suivant, sous accord noté. Les autres préparent silencieusement, sur la fiche, les réponses et la relecture.</p>",
        "where": {
            "CO": "Présente : comprendre les questions de l'entretien, demander de répéter si besoin.",
            "CE": "Présente : relire son dossier pendant que les camarades passent.",
            "EE": "Cœur de la séance : le dossier (lettre, CV, notes, budget).",
            "EOC": "Cœur de la séance : l'exposé court, ou les réponses en continu.",
            "EOI": "Cœur de la séance : l'entretien téléphonique, 3 à 4 minutes (ou format situation B).",
        },
        "criteria": [
            "Le dossier comporte les six pièces demandées.",
            "L'élève utilise au moins un chiffre officiel.",
            "L'entretien est compréhensible, poli, en phrases complètes.",
            "Parcours star ou starstar respecté (durée et nombre de questions).",
        ],
    },
}


def slang_card_html():
    return (
        '<article class="card" id="aussie-slang-guide">'
        "<h3>Aussie slang guide</h3>"
        "<p>Guide d'argot australien, pour un séjour de travail. Public : Terminale bac pro "
        "et Terminale générale et technologique, adultes de 18 ans et plus. Les fichiers seront "
        "ajoutés quand la page du guide sera publiée.</p>"
        '<p class="notice">Teacher\'s choice: feel free to leave out any item. Nothing here is compulsory.</p>'
        '<p class="dl">'
        f'<a href="{BASE}/aussie-slang/aussie-slang-guide.pdf">PDF</a>'
        f'<a class="sec" href="{BASE}/aussie-slang/aussie-slang-guide.docx">Word</a>'
        f'<a class="sec" href="{BASE}/aussie-slang/aussie-slang-guide.odt">LibreOffice</a>'
        "</p></article>\n"
    )


def _cut(html, pattern):
    m = re.search(pattern, html, flags=re.S)
    if not m:
        return html, ""
    return html[: m.start()] + html[m.end() :], m.group(0)


def _first(html, *patterns):
    for pat in patterns:
        m = re.search(pat, html, flags=re.S)
        if m:
            return m
    return None


def _downloads(slug, kind):
    stem = f"{slug}-{kind}-eleve"
    return (
        '<p class="dl fiche-dl">'
        f'<a href="{BASE}/downloads/{stem}.pdf">PDF</a>'
        f'<a class="sec" href="{BASE}/downloads/{stem}.docx">Word</a>'
        f'<a class="sec" href="{BASE}/downloads/{stem}.odt">LibreOffice</a>'
        "</p>"
    )


def _where_html(info):
    lis = []
    for code, name in FIVE:
        place = info["where"].get(code, "Pas travaillée aujourd'hui.")
        lis.append(f"<li><strong>{code}</strong> · {name}. {place}</li>")
    return (
        '<aside class="cinq-bo" aria-label="Les cinq activités langagières du programme">'
        "<h3>Les cinq activités langagières du programme</h3>"
        '<p class="notice">Les cinq activités langagières du programme (BO spécial n° 5 du 11 avril 2019). '
        "Chacune compte pour un cinquième de l'épreuve. Voici où elles se situent dans cette séance de 52 minutes.</p>"
        f"<ul>{''.join(lis)}</ul></aside>"
    )


def _grids_html(info):
    rows_p, rows_e = [], []
    for i, crit in enumerate(info["criteria"], 1):
        crit = crit.replace("starstar", "★★").replace("star ", "★ ")
        rows_p.append(
            f"<tr><th>{i}</th><td>{crit}</td><td>Non acquis</td><td>En cours</td><td>Acquis</td></tr>"
        )
        rows_e.append(
            f"<tr><th>{i}</th><td>{crit}</td><td>Pas encore</td><td>Presque</td><td>Oui</td></tr>"
        )
    prof = (
        '<div class="grille grille-prof"><h3>Grille professeur</h3>'
        "<p>Cochez une colonne par critère. Un mot suffit en marge, pas un roman.</p>"
        "<table><thead><tr><th>n°</th><th>Critère</th><th>Non acquis</th>"
        "<th>En cours</th><th>Acquis</th></tr></thead>"
        f"<tbody>{''.join(rows_p)}</tbody></table></div>"
    )
    eleve = (
        '<div class="grille grille-eleve"><h3>Grille élève</h3>'
        "<p>Cochez vous-même, honnêtement. Cette grille se télécharge et se photocopie.</p>"
        "<table><thead><tr><th>n°</th><th>Critère</th><th>Pas encore</th>"
        "<th>Presque</th><th>Oui</th></tr></thead>"
        f"<tbody>{''.join(rows_e)}</tbody></table>"
        '<p class="notice">Une chose que je réussis : _______________________________</p>'
        '<p class="notice">Une chose à retravailler : _______________________________</p>'
        "</div>"
    )
    return prof, eleve


def wrap_lesson(body, slug):
    info = LESSONS[slug]
    html = body
    html, cinq = _cut(html, r'<aside class="cinq-bo"[^>]*>.*?</aside>')
    html, minutage = _cut(html, r'<section class="minutage"[^>]*>.*?</section>')
    html, secours = _cut(html, r'<aside class="secours"[^>]*>.*?</aside>')
    html, stud = _cut(html, r'<section class="box-stud"[^>]*>.*?</section>')
    html, prof = _cut(html, r'<section class="box-prof"[^>]*>.*?</section>')
    html, devoir = _cut(html, r'<section class="homework"[^>]*>.*?</section>')

    teacher_extra = []
    while True:
        new, block = _cut(html, r'<details class="more"[^>]*>.*?</details>')
        if not block:
            break
        html = new
        teacher_extra.append(block)

    header = ""
    m = _first(html, r'(<p class="kicker">.*?</p>\s*<h1>.*?</h1>)', r"(<h1>.*?</h1>)")
    if m:
        header = m.group(1)
        html = html[: m.start()] + html[m.end() :]

    html, mediation = _cut(html, r'<p class="mediation-line"[^>]*>.*?</p>')
    leftover_eleves = html.strip()
    answers = ""
    m_ans = re.search(
        r'<details class="more"><summary>Corrigé</summary>(.*?)</details>',
        prof,
        flags=re.S,
    )
    if m_ans:
        answers = m_ans.group(1).strip()

    prof_grid, eleve_grid = _grids_html(info)

    panels = {
        "eleves": (
            '<h2 id="titre-eleves">Élèves</h2>'
            '<p class="dl-label">Fiche élève, à imprimer ou à photocopier (PDF, Word, LibreOffice) :</p>'
            + _downloads(slug, "fiche")
            + leftover_eleves
            + stud
        ),
        "deroule": (
            '<h2 id="titre-deroule">Déroulé minuté</h2>'
            "<p>Séance de 52 minutes, minute par minute. On s'y tient, pour qu'il n'y ait pas de temps mort.</p>"
            + (minutage or "<p>Le minutage de cette séance n'a pas été trouvé.</p>")
        ),
        "activites": (
            '<h2 id="titre-activites">Activités langagières</h2>'
            + _where_html(info)
            + mediation
        ),
        "evaluation": (
            '<h2 id="titre-evaluation">Évaluation</h2>'
            "<p>Un contrôle court, à chaque séance, pour voir ce qui est acquis, sans en faire un examen.</p>"
            + info["eval"]
        ),
        "corrige": (
            '<h2 id="titre-corrige">Corrigé et grilles</h2>'
            '<div class="box-prof"><h3>Corrigé</h3>'
            + (answers or "<p>Les réponses sont personnelles. On retient un fait juste et une phrase claire.</p>")
            + "</div>"
            + prof_grid
            + eleve_grid
            + '<p class="dl-label">Grille élève, à imprimer ou à photocopier :</p>'
            + _downloads(slug, "grille")
        ),
        "secours": (
            '<h2 id="titre-secours">Sortie de secours</h2>'
            "<h3>Si le plan prévu ne tient pas</h3>"
            + info["backup"]
            + (secours or "")
            + "<h3>Continuer ailleurs, sur la fiche</h3>"
            + VIE_NOTE
        ),
        "gestion": (
            '<h2 id="titre-gestion">Gestion de classe</h2>'
            + GESTION_CORE
            + "<p>La tâche courte, si l'élève reste un moment à l'écart ou part avec sa fiche, est liée à cette séance. Elle est déjà indiquée dans la sortie de secours.</p>"
        ),
        "fiche-prof": (
            '<h2 id="titre-fiche-prof">Fiche prof</h2>'
            + prof
            + "".join(teacher_extra)
        ),
        "devoir": (
            '<h2 id="titre-devoir">Devoir</h2>'
            + (devoir or "<p>Pas de devoir spécifique au-delà de la tâche du jour.</p>")
        ),
    }

    buttons = []
    for i, (tid, label) in enumerate(TABS):
        sel = ' aria-selected="true" tabindex="0"' if i == 0 else ' aria-selected="false" tabindex="-1"'
        cur = ' aria-current="true"' if i == 0 else ""
        buttons.append(
            f'<a href="#{tid}" id="tab-{tid}" role="tab" aria-controls="{tid}"{sel}{cur}>{label}</a>'
        )
    nav = (
        '<nav class="lesson-tabs" aria-label="Étapes de la séance">'
        '<div class="row" role="tablist" id="lesson-tablist">'
        + "".join(buttons)
        + "</div></nav>"
        '<p class="nojs-note">Sans JavaScript, toutes les étapes restent visibles à la suite.</p>'
    )
    sections = []
    for tid, label in TABS:
        active = " is-active" if tid == "eleves" else ""
        sections.append(
            f'<section class="panel{active}" id="{tid}" role="tabpanel" '
            f'aria-labelledby="titre-{tid}" data-tab="{tid}">{panels[tid]}</section>'
        )
    return header + "\n" + nav + "\n" + "\n".join(sections) + "\n"
