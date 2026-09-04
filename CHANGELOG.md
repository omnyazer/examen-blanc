# Changelog

## 2026-09-04 - Corrections et deploiement

### Corrections fonctionnelles

- Amelioration de la navigation entre connexion, inscription et page des taches.
- Ajout de validations sur les formulaires et de messages d'erreur plus clairs.
- Mise a jour de l'affichage apres ajout, modification ou suppression d'une tache.

### Securite

- Protection des routes avec authentification JWT.
- Verification qu'un utilisateur ne peut modifier ou supprimer que ses propres taches.
- Renforcement des regles de mot de passe et de nom d'utilisateur.
- Validation et nettoyage des donnees envoyees a l'API.
- Restriction du CORS et limitation des tentatives de connexion.

### Tests et documentation

- Ajout de tests backend automatises.
- Verification du build frontend.
- Documentation d'une route API et d'un composant React.
- Ajout d'un fichier d'audit des dependances.

### Deploiement

- Ajout des fichiers Docker, du `docker-compose.yml` et d'un script de deploiement.
- Ajout d'une documentation de deploiement avec Render et MongoDB Atlas.
- Deploiement du frontend, du backend et connexion a MongoDB Atlas.
