# 🏆 CDA Bet (ex-FootixScore) - Projet CDA

CDA Bet est une application Fullstack de pronostics sportifs entre amis (sans argent réel, basée sur un système de points), développée dans le cadre de la validation du titre **Concepteur Développeur d'Applications (CDA)**.

---

## 🔌 1. Architecture Hybride et API Utilisées

Pour répondre aux besoins métiers sans avoir à maintenir une base de données sportive colossale, le projet repose sur une **architecture hybride** combinant une API propriétaire et l'agrégation d'API tierces (approche orientée micro-services) :

### 🛡️ API Interne Propriétaire (Node.js / Express / PostgreSQL)
C'est le moteur de l'application, hébergé dans nos conteneurs Docker.
* **Rôle :** Gérer la logique métier critique et la sécurité.
* **Pourquoi ?** Pour avoir un contrôle total sur les données sensibles : authentification des utilisateurs (JWT), sécurité des mots de passe (Bcrypt), et enregistrement des soldes de points et des pronostics dans notre propre base de données.

### 🌍 API Externes Tierces (Agrégation de données)
Pour l'affichage du Dashboard interactif, le Front-end consomme deux API distinctes afin de séparer les responsabilités :

1. **The Odds API**
   * **Rôle :** Fournir les prochains matchs programmés et les **cotes réelles** des bookmakers du marché (1, N, 2).
   * **Pourquoi ?** C'est une API spécialisée dans les marchés de paris. Elle permet d'avoir des données de cotes en temps réel, indispensables pour le système de pronostics.
2. **TheSportsDB** *(via clé de test publique)*
   * **Rôle :** Fournir les statistiques sportives pures (derniers résultats des matchs terminés et classement actuel des championnats).
   * **Pourquoi ?** *The Odds API* ne connaissant pas le classement des clubs (elle ne gère que les cotes), l'intégration de *TheSportsDB* vient combler ce vide. Le Front-End fusionne ces deux sources via `Promise.all()` pour offrir une interface utilisateur riche et unifiée.

---

## 📌 2. État des lieux du projet (Sprint Actuel)

### ✅ Ce qui est opérationnel :
* **Infrastructure (Docker) :** Orchestration complète via `docker-compose`.
    * **Backend :** API Node.js/Express (port `8000`).
    * **Database :** PostgreSQL 15 (port `5432`).
    * **Admin UI :** pgAdmin 4 (port `5050`).
* **Base de Données :** Modélisation relationnelle terminée et script `init-db.sql` fonctionnel.
* **Sécurité & Authentification :**
    * Hachage des mots de passe avec `bcrypt`.
    * Connexion sécurisée avec génération de **tokens JWT**.
    * Persistance de la session côté client (LocalStorage) et Middleware de protection des routes Front.
* **Frontend (Vanilla JS / TailwindCSS) :**
    * Interface de connexion/inscription (`log.html`).
    * Dashboard dynamique (`main.html`) intégrant les API externes et le filtrage par championnat.

### ⏳ Ce qu'il reste à faire (Prochaines étapes) :
1. **Logique Métier (Back) :** Créer la route protégée (Middleware Auth) pour enregistrer un pronostic dans la table `paris`.
2. **Interactivité (Front) :** Rendre les cotes du Dashboard cliquables pour remplir le "Panier de pronostics".
3. **Leaderboard :** Mettre en place la page de classement général des joueurs en fonction de leurs points gagnés.

---

## 🚀 3. Comment lancer le projet

### Prérequis
* **Docker Desktop** installé et lancé.
* **Git** pour cloner le dépôt.

### Installation et démarrage
1. **Cloner le projet :**
   ```bash
   git clone [https://github.com/Lucas-Massako/CDA-Paris-sportif-.git](https://github.com/Lucas-Massako/CDA-Paris-sportif-.git)
   cd CDA-Paris-sportif-


   Lancer les containers :
À la racine du projet, exécute la commande suivante :

Bash
docker-compose up --build

Vérifier que tout fonctionne :

API : http://localhost:8000 (doit afficher le status "en ligne").

Base de données : http://localhost:5050 (pgAdmin).

Application : Ouvre le fichier Frontend/log.html dans ton navigateur pour démarrer.

Arborecense 
.
├── Backend/
│   ├── controllers/     # Logique métier (traitement des requêtes)
│   ├── routes/          # Définition des endpoints REST
│   ├── scripts/         # SQL d'initialisation de la BDD
│   ├── index.js         # Point d'entrée du serveur Express
│   └── Dockerfile       # Image Docker de l'API
├── Frontend/
│   ├── log.html         # Page d'authentification
│   ├── main.html        # Dashboard principal (Cotes, Matchs, Classement)
│   ├── auth.js          # Logique JS (Sécurité, Sessions, Appels API)
│   └── style*.css       # Feuilles de style personnalisées
├── docker-compose.yml   # Orchestration des services Docker
└── README.md            # Documentation du projet