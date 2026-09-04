# Deploiement

## Architecture cible

- Frontend React : service statique Render ou image Docker frontend.
- Backend Node.js/Express : service web Render expose sur `/api`.
- Base de donnees : MongoDB Atlas ou service MongoDB managé.
- HTTPS : certificat fourni automatiquement par Render sur le domaine Render ou le domaine personnalise.
- DNS : enregistrement CNAME du sous-domaine vers l'URL Render si un nom de domaine est utilise.

## Variables d'environnement

Backend :

- `MONGO_URI` : chaine de connexion MongoDB.
- `JWT_SECRET` : secret long et aleatoire utilise pour signer les tokens.
- `FRONTEND_URL` : URL publique du frontend.
- `PORT` : port fourni par l'hebergeur, avec `5000` en local.

Frontend :

- `REACT_APP_API_URL` : URL publique de l'API backend, terminee par `/api`.

## CI/CD

Le script `deploy.sh` montre les etapes d'un pipeline :

- installer les dependances backend ;
- lancer les tests backend ;
- installer les dependances frontend ;
- construire le frontend ;
- construire les images Docker.

Sur Render, le deploiement peut etre automatise depuis un depot Git : chaque push declenche l'installation, le build et le redeploiement du service.

## Preparation Render

Le fichier `render.yaml` decrit deux services :

- `exam-practice-api` : backend Node.js, avec verification de sante sur `/api/health`.
- `exam-practice-frontend` : frontend React servi comme site statique.

Variables a renseigner dans Render :

- `MONGO_URI` : URI MongoDB Atlas ou autre MongoDB managé.
- `FRONTEND_URL` : URL publique du frontend Render.
- `REACT_APP_API_URL` : URL publique du backend Render terminee par `/api`.

Apres creation des deux services, il faut mettre a jour `FRONTEND_URL` et `REACT_APP_API_URL` avec les vraies URLs Render, puis redeployer.

## Logging

Le backend utilise un logger JSON simple avec un niveau (`info` ou `error`) et un timestamp. Ce format est lisible dans les logs Render et peut etre envoye plus tard vers un outil centralise.

## Monitoring et alertes

La route `GET /api/health` permet de verifier que l'API repond.

Alertes recommandees :

- API indisponible si `/api/health` ne repond plus.
- Latence elevee si le temps de reponse depasse 500 ms pendant plusieurs minutes.
- Taux d'erreur eleve si les reponses `5xx` depassent 5% des requetes.

## Securite production

- Ne pas versionner le fichier `.env`.
- Utiliser un `JWT_SECRET` robuste et different de l'environnement local.
- Restreindre `FRONTEND_URL` a l'URL publique du frontend.
- Utiliser HTTPS pour toutes les communications navigateur/API.
- Garder les dependances a jour avec `npm audit`.
