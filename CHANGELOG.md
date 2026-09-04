# Changelog

## 2026-09-04 - Corrections bugs et securite

### Bugs corriges

- Ajout d'un lien vers la page d'inscription dans le header.
- Protection de la route frontend `/tasks` pour rediriger vers `/login` si l'utilisateur n'est pas connecte.
- Masquage du lien "Mes Taches" quand l'utilisateur n'est pas connecte.
- Affichage des erreurs sur les formulaires de connexion, d'inscription et d'ajout de tache.
- Validation du titre des taches cote frontend avant envoi a l'API.
- Mise a jour immediate de la liste apres ajout, suppression ou modification d'une tache.
- Ajout de l'action permettant de marquer une tache comme terminee ou de la rouvrir.
- Gestion du token expire avec redirection vers la page de connexion.
- Desactivation des boutons pendant les requetes pour eviter les doubles soumissions.
- Affichage d'un message quand l'utilisateur n'a aucune tache.

### Failles de securite corrigees

- Ajout d'un controle d'appartenance sur les routes `PUT /api/tasks/:id` et `DELETE /api/tasks/:id`.
- Validation et nettoyage des champs `title` et `description` des taches avant enregistrement.
- Validation des identifiants MongoDB sur les routes de modification et suppression de tache.
- Renforcement de la politique de mot de passe : 12 caracteres minimum, majuscule, minuscule, chiffre et caractere special.
- Validation du format du nom d'utilisateur : lettres et chiffres uniquement, entre 3 et 50 caracteres.
- Limitation des tentatives sur les routes d'authentification pour reduire le risque de brute force.
- Restriction CORS a l'URL frontend configuree.
- Limitation de la taille des requetes JSON a `10kb`.
- Verification des variables d'environnement critiques au demarrage du backend.
- Ajout d'une route `GET /api/health` pour faciliter les controles de sante en production.
- Masquage des details techniques des erreurs serveur dans les reponses API.

### Tests et verification

- Ajout de tests backend avec `node:test`.
- Verification automatique de la politique de mot de passe.
- Verification automatique du format de nom d'utilisateur.
- Verification automatique des identifiants MongoDB invalides.
- Verification automatique du nettoyage des champs de tache.
- Execution du build frontend avec succes.

### Documentation et deploiement

- Documentation d'une route API backend avec un commentaire de documentation.
- Documentation d'un composant React avec un commentaire de documentation.
- Ajout d'un logger backend au format JSON.
- Ajout des fichiers Docker pour le backend et le frontend.
- Ajout d'un `docker-compose.yml` avec frontend, backend et MongoDB.
- Ajout d'un script `deploy.sh` pour decrire les etapes CI/CD.
- Ajout d'un document `DEPLOYMENT.md` pour l'architecture, HTTPS, DNS, monitoring et variables d'environnement.
- Ajout d'un fichier `render.yaml` pour preparer un deploiement Render.
- Ajout d'un fichier `AUDIT.md` pour tracer l'audit des dependances et les vulnerabilites restantes.
- Execution de `npm audit fix` sans `--force` sur le backend et le frontend.
