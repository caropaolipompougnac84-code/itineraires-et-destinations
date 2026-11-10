# Catalogue — resources.json

## Ajouter une ressource

Chaque entrée dans `resources` :

```json
{
  "id": "lp-anglais-1re-back-from-placement",
  "title": "Anglais · 1re Bac pro · Back from placement",
  "summary": "Court résumé de la séquence (1–2 phrases).",
  "section": "lycee-pro",
  "subject": "anglais",
  "level": "1re",
  "levelLabel": "1re Bac pro",
  "collection": "lp-anglais",
  "themes": ["travail", "oral"],
  "duration": "2 h",
  "materials": "Vidéoprojecteur, fiches élève",
  "url": "https://…",
  "facebookUrl": "https://www.facebook.com/…",
  "date": "2026-10-04"
}
```

## Sections / subjects / levels

| section | subject | levels |
|---------|---------|--------|
| lycee-pro | anglais, lettres | cap, 2de, 1re, tle (+ bac pour coin Bac lettres) |
| lycee-general | anglais, lettres | 2de, 1re, tle, spe (anglais) ; tle-option (option littérature) |
| cfa | anglais, lettres | cap, bacpro, bp |

## Déduplication

Clé : `title + section + subject + level` (insensible à la casse). Les doublons sont ignorés au chargement.

## Titres harmonisés

Format éditeur : `[Matière] · [Niveau] · [Titre de séquence]`
