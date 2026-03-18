# CDA-Paris-sportif-
# 🏆 FootixScore - Projet CDA

FootixScore est une application Fullstack de suivi de scores sportifs et de paris entre amis, développée dans le cadre de la validation du titre **Concepteur Développeur d'Applications (CDA)**.

## 📌 1. État des lieux du projet (Sprint 1)

### ✅ Ce qui est opérationnel :
* **Infrastructure (Docker) :** Orchestration complète via `docker-compose`.
    * **Backend :** API Node.js/Express sur le port `8000`.
    * **Database :** PostgreSQL 15 sur le port `5432`.
    * **Admin UI :** pgAdmin 4 sur le port `5050` pour la gestion visuelle.
* **Base de Données :** * Modélisation relationnelle terminée (via Looping).
    * Script d'initialisation `init-db.sql` présent.
* **Backend (API) :**
    * Connexion au Pool PostgreSQL configurée.
    * Architecture modulaire en place (`/routes`, `/controllers`).
    * Route `POST /api/auth/register` créée et testée (communication OK).
* **Frontend :**
    * Interface de connexion/inscription en HTML5 et Tailwind CSS (`log.html`).
    * Logique de client JavaScript (`auth.js`) utilisant `fetch` pour parler à l'API.

### ⏳ Ce qu'il reste à faire (Prochaines étapes) :
1.  **Sécurité :** Implémenter le hachage des mots de passe avec `bcrypt` (ne jamais stocker en clair).
2.  **BDD Réelle :** Remplacer le message de test par une véritable requête SQL `INSERT` dans la table `utilisateur`.
3.  **Authentification :** Créer la route `/login` et mettre en place les tokens **JWT** (JSON Web Tokens).
4.  **Frontend Dynamique :** Migration vers **React** prévue pour le Sprint 2.

---

## 🚀 2. Comment lancer le projet

### Prérequis
* **Docker Desktop** installé et lancé.
* **Git** pour cloner le dépôt.

### Installation et démarrage
1.  **Cloner le projet :**
    ```bash
    git clone [https://github.com/Lucas-Massako/CDA-Paris-sportif-.git](https://github.com/Lucas-Massako/CDA-Paris-sportif-.git)
    cd CDA-Paris-sportif-
    ```

2.  **Lancer les containers :**
    À la racine du projet, exécute la commande suivante :
    ```bash
    docker-compose up --build
    ```

3.  **Vérifier que tout fonctionne :**
    * **API :** Rends-toi sur [http://localhost:8000](http://localhost:8000) (doit afficher le status "en ligne").
    * **Interface de gestion BDD :** [http://localhost:5050](http://localhost:5050) (pgAdmin).
    * **Application :** Ouvre le fichier `Frontend/log.html` dans ton navigateur.

---

## 📂 3. Arborescence technique
```text
.
├── Backend/
│   ├── controllers/     # Logique métier (traitement des données)
│   ├── routes/          # Définition des points d'entrée API
│   ├── scripts/         # SQL d'initialisation
│   ├── index.js         # Point d'entrée du serveur Express
│   └── Dockerfile       # Image Docker de l'API
├── Frontend/
│   ├── log.html         # Page de login / register
│   ├── auth.js          # Logique JS (appels API)
│   └── stylelog.css     # Design
├── docker-compose.yml   # Orchestration des services
└── README.md            # Documentation du projet