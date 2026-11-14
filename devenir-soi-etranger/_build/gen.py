# -*- coding: utf-8 -*-
"""Generate the tabbed sequence pages. Do not push."""
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent))
from helpers import (
    BASE, TITLE, LEVEL, FOOT,
    head, footer, site_nav, seq_nav, lesson_tabs,
    timing_table, five_al, grids, gestion_panel, secours_panel,
    figure, dl_eleve, VIE_NOTE, OBJECTIFS_BOX, CODES, dash_ok,
)

ROOT = Path(__file__).resolve().parents[1]


def wrap(title, desc, url_path, current_nav, inner, image="velazquez-juan-de-pareja.jpg"):
    html = (
        head(title, desc, url_path, image)
        + "<body>\n"
        + '<a class="skip" href="#main">Aller au contenu</a>\n'
        + site_nav()
        + seq_nav(current_nav)
        + '<main id="main">\n'
        + '<p class="switch"><button type="button" data-dys-toggle>Version plus lisible</button></p>\n'
        + '<p class="lisible-note">Seconde baccalauréat professionnel. Les objectifs restent ceux du programme. La version plus lisible change seulement la mise en page.</p>\n'
        + inner
        + "\n</main>\n"
        + footer()
    )
    dash_ok(html)
    return html


def write(rel, html):
    path = ROOT / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(html, encoding="utf-8")
    print("wrote", path.relative_to(ROOT), "chars", len(html))


def render_lesson(L):
    slug = L["slug"]
    img = L.get("image")
    fig = ""
    if img:
        fig = figure(img, L["alt"], L["caption"], L["credit"])
    eleves = f'''<section class="panel is-active" id="eleves" role="tabpanel" aria-labelledby="titre-eleves" data-tab="eleves"><h2 id="titre-eleves">Élèves</h2>
{dl_eleve(slug)}
{fig}
{L["eleves"]}
</section>'''
    deroule = f'''<section class="panel" id="deroule" role="tabpanel" aria-labelledby="titre-deroule" data-tab="deroule"><h2 id="titre-deroule">Déroulé minuté</h2>
<p>Séance de 52 minutes, minute par minute. On s'y tient, pour qu'il n'y ait pas de temps mort.</p>
{timing_table(L["timing"])}
</section>'''
    activites = f'''<section class="panel" id="activites" role="tabpanel" aria-labelledby="titre-activites" data-tab="activites"><h2 id="titre-activites">Activités langagières</h2>
{five_al(L["where"])}
</section>'''
    evaluation = f'''<section class="panel" id="evaluation" role="tabpanel" aria-labelledby="titre-evaluation" data-tab="evaluation"><h2 id="titre-evaluation">Évaluation</h2>
<p>Un contrôle court, à presque chaque séance, pour voir ce qui est acquis, sans en faire un examen.</p>
<p><strong>On commence par les objectifs.</strong> Les élèves rouvrent la fiche « Mes objectifs » remplie après la correction précédente. En deux minutes, chacun coche : tenu, en cours, ou à reprendre. Puis seulement on lance l'évaluation du jour.</p>
{L["eval"]}
<p>Après le contrôle, on reprend la fiche d'autocorrection : lire le corrigé, comparer, coder les erreurs, réécrire, noter ce qu'il faut retenir, puis <strong>en tirer les conséquences</strong> en écrivant un ou deux objectifs personnels.</p>
<p class="dl-label">Fiche d'autocorrection et méthode « Savoir prendre une correction » :</p>
<p class="dl fiche-dl"><a href="{BASE}/downloads/fiche-autocorrection.pdf">Autocorrection PDF</a>
<a class="sec" href="{BASE}/downloads/savoir-prendre-une-correction.pdf">Méthode PDF</a>
<a class="sec" href="{BASE}/prendre-une-correction/">La méthode, en page</a></p>
</section>'''
    corrige = f'''<section class="panel" id="corrige" role="tabpanel" aria-labelledby="titre-corrige" data-tab="corrige"><h2 id="titre-corrige">Corrigé et grilles</h2>
<div class="box-prof"><h3>Corrigé</h3>
{L["corrige"]}
</div>
{grids(L["criteria"], slug)}
{OBJECTIFS_BOX}
</section>'''
    secours = secours_panel(L["backup"], L["storm"])
    gestion = gestion_panel(L["storm"])
    prof = f'''<section class="panel" id="fiche-prof" role="tabpanel" aria-labelledby="titre-fiche-prof" data-tab="fiche-prof"><h2 id="titre-fiche-prof">Fiche prof</h2>
<section class="box-prof">
<h3>Pour le professeur</h3>
{L["prof"]}
</section></section>'''
    devoir = f'''<section class="panel" id="devoir" role="tabpanel" aria-labelledby="titre-devoir" data-tab="devoir"><h2 id="titre-devoir">Devoir</h2>
<section class="homework">
<h3>Travail à la maison</h3>
{L["devoir"]}
<div class="lines" aria-hidden="true"></div>
</section></section>'''
    inner = (
        f'<p class="kicker">{L["kicker"]}</p>\n'
        f'<h1>{L["title"]}</h1>\n'
        + lesson_tabs()
        + eleves + deroule + activites + evaluation + corrige + secours + gestion + prof + devoir
    )
    page_title = f"{TITLE} · {L['num']}"
    html = wrap(page_title, L["desc"], f"{BASE}/{L['nav']}", L["nav"], inner, L.get("og") or L.get("image") or "velazquez-juan-de-pareja.jpg")
    write(f"{L['slug']}/index.html" if L['slug'] not in ('evaluation-formative','evaluation-sommative','prendre-une-correction') else f"{L['slug']}/index.html", html)


from lessons import LESSONS, RITUAL_IN, MONTAIGNE_LECTEUR  # noqa: F401
from helpers import OBJECTIFS_BOX, CODES, VIE_NOTE, figure, BASE, TITLE


def accueil():
    cards = []
    labels = [
        ("s1/", "S1", "Un regard, un nom"),
        ("s2/", "S2", "Comment peut-on être Persan ?"),
        ("s3/", "S3", "C'est moi que je peins"),
        ("s4/", "S4", "Chacun appelle barbarie…"),
        ("s5/", "S5", "Au moins je suis autre"),
        ("s6/", "S6", "Je ne suis pas comme…"),
        ("s7/", "S7", "Un livre dans une fente"),
        ("s8/", "S8", "Les douleurs sourdes de l'exil"),
        ("s9/", "S9", "Quatre façons de se sentir étranger"),
        ("s10/", "S10", "Ce que l'on perd, ce que l'on gagne"),
        ("s11/", "S11", "Le je qui raconte, le je raconté"),
        ("s12/", "S12", "Les formes et les mots de soi"),
        ("s13/", "S13", "Chercher et organiser"),
        ("s14/", "S14", "Écrire, relire, échanger"),
        ("s15/", "S15", "Préparer l'oral"),
        ("s16/", "S16", "Présenter son tableau"),
        ("evaluation-formative/", "QCM", "Évaluation formative"),
        ("evaluation-sommative/", "Éval.", "Évaluation sommative"),
    ]
    for href, k, t in labels:
        cards.append(f'<a href="{BASE}/{href}"><strong>{k}</strong>{t}</a>')
    inner = f'''
<p class="kicker">Lettres · Seconde baccalauréat professionnel</p>
<h1>{TITLE}</h1>
<p class="exergue">Comment devient-on soi-même quand on se sent étranger, ailleurs ou même parmi les siens ?</p>
{figure("velazquez-juan-de-pareja.jpg",
    "Diego Velázquez, Portrait de Juan de Pareja, 1650 : un homme en habit sombre, col de dentelle, nous regarde.",
    "Il nous regarde. Il a un nom : Juan de Pareja.",
    "Diego Velázquez, Portrait de Juan de Pareja, 1650, Metropolitan Museum of Art, New York. Domaine public.")}

<h2>Le fil de la séquence</h2>
<p>On peut se sentir étranger de mille façons : en arrivant dans un nouveau pays, une nouvelle ville, un nouveau lycée, en stage, ou même dans sa propre famille quand on change.</p>
<p>Les écrivains qui racontent leur vie ont souvent connu ce sentiment. Ils nous montrent que ce décalage peut devenir une force : c'est parfois en se sentant différent que l'on découvre qui l'on est.</p>
<p>Dans ce travail, personne n'est obligé de raconter un souvenir douloureux ni de révéler sa vie privée. On peut transformer une situation, déplacer les faits ou inventer un personnage. Ce sont la lecture, l'écriture, la langue et la réflexion qui sont évaluées, jamais l'intimité.</p>

<div class="grid">
<div class="card">
<h3>Programme</h3>
<p>Objet d'étude « Devenir soi : écritures autobiographiques », BO spécial n° 5 du 11 avril 2019 (arrêté du 3 avril 2019).</p>
<p>Les deux axes sont travaillés à égalité : l'exploration de soi, et la construction de soi dans le rapport aux autres.</p>
</div>
<div class="card">
<h3>Œuvre et groupement</h3>
<p>Œuvre intégrale : Jules Vallès, <i>L'Enfant</i> (1879), roman autobiographique.</p>
<p>Groupement : Montaigne, Rousseau, Montesquieu, puis quatre voix du manuel (Camara Laye, Azouz Begag, Kim Thúy, Annie Ernaux).</p>
</div>
<div class="card">
<h3>Durée</h3>
<p>Dix-huit séances de 52 minutes, minute par minute. Cela correspond au brouillon de quinze heures, et tient en six semaines à raison de trois créneaux par semaine, durée maximale indiquée par le programme. Si l'établissement n'a que deux créneaux, on allonge un peu le calendrier, sans dépasser le cadre prévu localement.</p>
</div>
</div>

<h2>Les séances</h2>
<div class="lessons">
{''.join(cards)}
</div>
<p><a href="{BASE}/prendre-une-correction/">Savoir prendre une correction, et en tirer les conséquences</a> · <a href="{BASE}/downloads/">Toutes les fiches, à télécharger</a></p>

<h2>Objectifs pour les élèves</h2>
<ul>
<li>Découvrir des écritures de soi variées, du XVIe siècle à aujourd'hui.</li>
<li>Comprendre comment le regard des autres et le changement de lieu participent à la construction de soi.</li>
<li>Savoir reconnaître le pacte autobiographique, le « je » qui raconte et le « je » raconté.</li>
<li>Écrire un court récit de soi, le relire, et en parler à l'oral, sans obligation de tout livrer.</li>
</ul>

<h2>Compétences du programme</h2>
<p>Le programme de français fixe quatre compétences, plus l'étude de la langue : maîtriser l'échange oral ; maîtriser l'échange écrit ; devenir un lecteur compétent et critique ; confronter des connaissances et des expériences pour se construire ; connaître et maîtriser la langue. Chaque séance indique où elles se situent dans les 52 minutes. On y voit aussi l'écoute d'un texte lu à voix haute, la lecture, l'écriture, l'oral en continu et l'échange.</p>

<h2>Évaluations, langue, devoirs</h2>
<p>Presque chaque séance a un contrôle court (flash), plus un QCM formatif et une évaluation sommative (compréhension et écriture). Dès la séance 2, on apprend à prendre une correction : lire le corrigé, comparer, coder les erreurs, réécrire, noter ce qu'il faut retenir, puis en tirer les conséquences (un ou deux objectifs personnels). L'évaluation suivante commence par la vérification de ces objectifs.</p>
<p>La langue est travaillée dans les textes et dans les écrits des élèves : courtes dictées, liste de relecture qui compte dans l'appréciation, et entraînement ciblé sur Projet Voltaire (« Les Fondamentaux Campus » pour reprendre les bases, « Supérieur » si les bases sont plus solides). Priorités de la séquence : phrase et ponctuation, accords, imparfait et passé composé, homophones. On n'invente pas un numéro de module : on s'appuie sur l'offre de l'établissement. Si l'accès numérique manque, l'entraînement se fait sur la fiche papier.</p>
<p>Chaque séance a un devoir à la maison, une sortie de secours, et une tâche courte pour une tempête émotionnelle.</p>

<div class="note-vie-scolaire">
<p>Parce que la séance est à onglets et que la fiche élève s'imprime, un élève en difficulté peut emporter sa feuille et continuer ailleurs, sous la surveillance d'un autre adulte (vie scolaire, CDI, infirmerie). Cet accueil doit être réglé dès le début de l'année avec la vie scolaire : qui reçoit l'élève, où, et comment le professeur le signale.</p>
</div>

<h2>Lecture cursive possible</h2>
<p>L'Enfant noir (Camara Laye), Le Gone du Chaâba (Azouz Begag), Ru (Kim Thúy), La Place (Annie Ernaux), Petit Pays (Gaël Faye, roman inspiré de sa vie). Ces œuvres sont protégées : on les lit en livre, ou dans le manuel, dans les limites autorisées.</p>

<details class="more">
<summary>Notions du programme, à retenir simplement</summary>
<p>Connaissance de soi : émotions, intime, forces et faiblesses, estime de soi, auteur et narrateur. Images de soi : construction de l'identité, projets, représentations. Découverte de l'autre : altérité, privé et public, personne et personnage. On les rencontre dans les textes, sans en faire une liste à réciter seule.</p>
</details>

<details class="more">
<summary>Pour le professeur · parti pris et prudence</summary>
<p>Le sentiment d'être étranger est pris au sens large : origine, déménagement, milieu, entrée dans le monde professionnel. Cela permet à chacun de se reconnaître, sans avoir à exposer son histoire familiale.</p>
<p>Les textes qui parlent de migration, d'exil ou de milieu social sont lus comme des œuvres, de façon neutre, sans prendre parti. On ne demande à personne de « représenter » un groupe.</p>
<p>L'incipit de L'Enfant (chapitre « Ma mère ») est très dur : il n'est pas le texte du jour des séances 7 et 8. On entre dans l'œuvre par la dédicace, Robinson, et « La Toilette ». L'incipit peut se lire plus tard, avec une préparation et une sortie de secours.</p>
<p>Phrase possible, en cas de tempête émotionnelle : « Tu peux arrêter ce sujet. Voici une autre manière de faire le même travail. Nous n'avons pas besoin de connaître ton histoire pour t'aider à continuer. »</p>
</details>
'''
    html = wrap(
        TITLE,
        "Devenir soi quand on se sent étranger : séquence de lettres, Seconde baccalauréat professionnel, objet d'étude écritures autobiographiques.",
        f"{BASE}/",
        "",
        inner,
    )
    write("index.html", html)


def methode():
    inner = f'''
<p class="kicker">Méthode · à reprendre à chaque évaluation</p>
<h1>Savoir prendre une correction, et en tirer les conséquences</h1>
<p>On apprend cette méthode dès la séance 2. On la réutilise après chaque contrôle, le QCM et la sommative.</p>
<section class="box-stud">
<h3>Les étapes, dans l'ordre</h3>
<ol>
<li><strong>Lire le corrigé jusqu'au bout</strong>, tranquillement, avant de corriger.</li>
<li><strong>Comparer</strong> avec sa copie, question par question, ou phrase par phrase.</li>
<li><strong>Marquer les erreurs avec un code</strong>, sans tout recouvrir : deux priorités de langue, une priorité de sens, suffisent souvent.</li>
<li><strong>Réécrire</strong> la phrase ou la réponse corrigée, dans une autre couleur, ou juste en dessous.</li>
<li><strong>Noter ce qu'il faut retenir</strong> : une règle, un mot, un réflexe de méthode.</li>
<li><strong>En tirer les conséquences.</strong> J'écris un ou deux objectifs concrets, à moi, dans la case « Mes objectifs ». Par exemple : une règle à revoir sur Projet Voltaire, ou un point de méthode (citer, justifier, relire les temps). À l'évaluation suivante, on commence par vérifier si je les ai tenus.</li>
</ol>
</section>
<h2>Le code</h2>
{CODES}
<p>On n'invente pas un code à chaque fois. On s'y tient, pour que la copie reste lisible.</p>
{OBJECTIFS_BOX}
<h2>La liste de relecture, qui compte</h2>
<p>Avant de rendre un écrit, je coche, et je laisse un exemple vraiment corrigé en marge. Une case cochée sans exemple n'est pas une preuve. Cette liste entre dans l'appréciation, et dans un point de la note d'écriture à la sommative.</p>
<ul>
<li>☐ Chaque phrase a une majuscule et une fin claire.</li>
<li>☐ J'ai relié chaque verbe à son sujet, et vérifié les accords.</li>
<li>☐ J'ai contrôlé a/à, et/est, ces/ses, quand ces mots apparaissent.</li>
<li>☐ Les temps du récit sont cohérents (passé pour les faits, présent pour le je narrant).</li>
<li>☐ J'ai remplacé au moins un mot trop vague, si besoin.</li>
<li>☐ J'ai indiqué en marge un exemple que j'ai vraiment corrigé.</li>
</ul>
<p class="dl-label">Fiches à imprimer :</p>
<p class="dl fiche-dl">
<a href="{BASE}/downloads/savoir-prendre-une-correction.pdf">Méthode PDF</a>
<a class="sec" href="{BASE}/downloads/savoir-prendre-une-correction.docx">Word</a>
<a class="sec" href="{BASE}/downloads/savoir-prendre-une-correction.odt">LibreOffice</a>
<a href="{BASE}/downloads/fiche-autocorrection.pdf">Autocorrection PDF</a>
<a class="sec" href="{BASE}/downloads/fiche-autocorrection.docx">Word</a>
<a class="sec" href="{BASE}/downloads/fiche-autocorrection.odt">LibreOffice</a>
</p>
{VIE_NOTE}
'''
    html = wrap(
        f"{TITLE} · Savoir prendre une correction",
        "Méthode pour lire un corrigé, coder les erreurs, réécrire, et en tirer les conséquences.",
        f"{BASE}/prendre-une-correction/",
        "prendre-une-correction/",
        inner,
        "fantin-latour-liseuse.jpg",
    )
    write("prendre-une-correction/index.html", html)


def downloads_page():
    rows = []
    names = [
        ("s1", "Séance 1 · Un regard, un nom"),
        ("s2", "Séance 2 · Comment peut-on être Persan ?"),
        ("s3", "Séance 3 · C'est moi que je peins"),
        ("s4", "Séance 4 · Chacun appelle barbarie…"),
        ("s5", "Séance 5 · Au moins je suis autre"),
        ("s6", "Séance 6 · Je ne suis pas comme…"),
        ("s7", "Séance 7 · Un livre dans une fente"),
        ("s8", "Séance 8 · Les douleurs sourdes de l'exil"),
        ("s9", "Séance 9 · Quatre façons de se sentir étranger"),
        ("s10", "Séance 10 · Ce que l'on perd, ce que l'on gagne"),
        ("s11", "Séance 11 · Le je qui raconte, le je raconté"),
        ("s12", "Séance 12 · Les formes et les mots de soi"),
        ("s13", "Séance 13 · Chercher et organiser"),
        ("s14", "Séance 14 · Écrire, relire, échanger"),
        ("s15", "Séance 15 · Préparer l'oral"),
        ("s16", "Séance 16 · Présenter son tableau"),
        ("evaluation-formative", "Évaluation formative · QCM"),
        ("evaluation-sommative", "Évaluation sommative"),
    ]
    blocks = []
    for slug, title in names:
        blocks.append(f'''<div class="card"><h3>{title}</h3>
<p class="dl-label">Fiche élève</p>
<p class="dl"><a href="{BASE}/downloads/{slug}-fiche-eleve.pdf">PDF</a>
<a class="sec" href="{BASE}/downloads/{slug}-fiche-eleve.docx">Word</a>
<a class="sec" href="{BASE}/downloads/{slug}-fiche-eleve.odt">LibreOffice</a></p>
<p class="dl-label">Grille élève</p>
<p class="dl"><a href="{BASE}/downloads/{slug}-grille-eleve.pdf">PDF</a>
<a class="sec" href="{BASE}/downloads/{slug}-grille-eleve.docx">Word</a>
<a class="sec" href="{BASE}/downloads/{slug}-grille-eleve.odt">LibreOffice</a></p>
</div>''')
    inner = f'''
<p class="kicker">Documents</p>
<h1>Fiches et grilles à télécharger</h1>
<p>Chaque séance a une fiche élève et une grille, en PDF, Word et LibreOffice. Une activité par page, des consignes courtes, de la place pour écrire. Grandes lettres, pour être lues facilement au tableau ou sur papier.</p>
<p class="dl-label">Méthode et autocorrection, à réutiliser toute la séquence</p>
<p class="dl">
<a href="{BASE}/downloads/savoir-prendre-une-correction.pdf">Méthode PDF</a>
<a class="sec" href="{BASE}/downloads/savoir-prendre-une-correction.docx">Word</a>
<a class="sec" href="{BASE}/downloads/savoir-prendre-une-correction.odt">LibreOffice</a>
<a href="{BASE}/downloads/fiche-autocorrection.pdf">Autocorrection PDF</a>
<a class="sec" href="{BASE}/downloads/fiche-autocorrection.docx">Word</a>
<a class="sec" href="{BASE}/downloads/fiche-autocorrection.odt">LibreOffice</a>
</p>
<p class="dl-label">Fiche professeur de la séquence</p>
<p class="dl">
<a href="{BASE}/downloads/fiche-prof-sequence.pdf">PDF</a>
<a class="sec" href="{BASE}/downloads/fiche-prof-sequence.docx">Word</a>
<a class="sec" href="{BASE}/downloads/fiche-prof-sequence.odt">LibreOffice</a>
</p>
<div class="grid">
{''.join(blocks)}
</div>
'''
    html = wrap(
        f"{TITLE} · Documents",
        "Fiches élèves, grilles, méthode de correction et fiche professeur, en PDF, Word et LibreOffice.",
        f"{BASE}/downloads/",
        "downloads/",
        inner,
    )
    write("downloads/index.html", html)


def main():
    accueil()
    methode()
    downloads_page()
    for L in LESSONS:
        render_lesson(L)
    print("done", len(LESSONS), "lessons")


if __name__ == "__main__":
    main()
