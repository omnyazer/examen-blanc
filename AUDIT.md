# Audit des dependances

## Commandes executees

- `npm audit` dans `backend`
- `npm audit fix` dans `backend`
- `npm audit` dans `frontend`
- `npm audit fix` dans `frontend`

## Resultat backend

`npm audit fix` a mis a jour des dependances transitoires. Il reste 3 vulnerabilites moderees liees a `qs`, via `body-parser` et `express`.

Une nouvelle passe non forcee ne corrige pas davantage. Le projet reste fonctionnel et les tests backend passent.

## Resultat frontend

`npm audit fix` a reduit le nombre de vulnerabilites. Il reste des vulnerabilites liees principalement a `react-scripts` et a ses dependances de build/test.

Certaines corrections demandent `npm audit fix --force`, mais npm annonce des changements cassants, notamment vers `react-scripts@0.0.0` ou une migration majeure de `react-router-dom`.

## Decision

La commande `npm audit fix --force` n'a pas ete utilisee afin de ne pas casser le projet avant le deploiement. Les vulnerabilites restantes doivent etre traitees dans une phase de migration controlee, par exemple en remplacant Create React App par Vite ou en mettant a jour l'outillage frontend.
