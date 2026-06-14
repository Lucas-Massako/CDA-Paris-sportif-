# CDA Bet — Guide de déploiement Railway + Vercel

## Architecture cible

```
Vercel (Frontend statique)  →  Railway API (Node.js)  →  Railway PostgreSQL
    board.html                    /api/auth                 footix_score
    main.html                     /api/users                (7 tables)
    profile.html                  /api/bets
    admin.html                    /api/matches
    log.html                      /api/admin
```

---

## Étape 1 — Déployer le Backend sur Railway

### 1.1 Créer le projet Railway

1. Va sur **railway.app** → "New Project" → "Deploy from GitHub repo"
2. Sélectionne `Lucas-Massako/CDA-Paris-sportif-`
3. Railway détecte automatiquement le Dockerfile dans `Backend/`
4. Dans les paramètres du service → **Root Directory** : `Backend`

### 1.2 Ajouter PostgreSQL

1. Dans le projet Railway → "+ New" → "Database" → "Add PostgreSQL"
2. Clique sur le service PostgreSQL → onglet **Variables**
3. Copie la valeur de `DATABASE_URL` (format : `postgresql://...`)

### 1.3 Configurer les variables d'environnement du Backend

Dans le service API → onglet **Variables**, ajoute :

| Variable | Valeur |
|---|---|
| `DATABASE_URL` | *(colle la valeur copiée depuis PostgreSQL)* |
| `JWT_SECRET` | `une_chaine_aleatoire_longue_et_secrete_ici` |
| `NODE_ENV` | `production` |

> Railway injecte `PORT` automatiquement — ne pas l'ajouter.

### 1.4 Déployer

Railway déploie automatiquement après la configuration.  
Note l'URL du service → ex : `https://cda-bet-api.up.railway.app`

---

## Étape 2 — Initialiser la base de données

Depuis ton terminal local, avec `psql` installé :

```bash
# Remplace DATABASE_URL par la valeur copiée depuis Railway
export DB="postgresql://postgres:xxxx@monorail.proxy.rlwy.net:XXXX/railway"

# 1. Schéma de base (tables, contraintes, index)
psql $DB -f Backend/scripts/init-db.sql

# 2. Tables avatars + colonnes utilisateur
psql $DB -f Backend/scripts/migrate-avatars.sql

# 3. Équipes nationales (60 pays)
psql $DB -f Backend/scripts/seed-teams.sql

# 4. Clubs européens (92 clubs)
psql $DB -f Backend/scripts/seed-clubs.sql

# 5. Matchs Coupe du Monde 2026 (13 matchs)
psql $DB -f Backend/scripts/seed-wc2026.sql

# 6. Correction équipes nationales
psql $DB -f Backend/scripts/fix-national-teams.sql

# 7. Colonnes cotes persistées
psql $DB -f Backend/scripts/alter-add-cotes.sql

# 8. Correction dates matchs
psql $DB -f Backend/scripts/fix-dates-wc.sql
```

> **Pas psql installé ?** Utilise le panneau "Query" directement dans Railway  
> ou pgAdmin → File → Add Server → colle les infos de connexion Railway.

### Créer le compte admin

```sql
-- Dans le panneau Query de Railway ou via psql :
UPDATE utilisateur SET is_admin = TRUE WHERE email = 'az@footix.com';
```

---

## Étape 3 — Mettre à jour l'URL API dans le Frontend

Dans chaque fichier, remplace `VOTRE_URL.up.railway.app` par l'URL réelle :

```bash
# Remplace en une commande (depuis la racine du projet)
RAILWAY_URL="cda-bet-api.up.railway.app"  # ← ton URL Railway sans https://

sed -i '' "s/VOTRE_URL.up.railway.app/${RAILWAY_URL}/g" \
  Frontend/auth.js \
  Frontend/main.html \
  Frontend/profile.html \
  Frontend/board.html \
  Frontend/admin.html
```

---

## Étape 4 — Déployer le Frontend sur Vercel

### Option A — Interface web (le plus simple)

1. Va sur **vercel.com** → "Add New Project"
2. Importe `Lucas-Massako/CDA-Paris-sportif-`
3. **Root Directory** : `Frontend`
4. Framework Preset : **Other** (pas de build)
5. "Deploy" → Vercel donne une URL genre `cda-bet.vercel.app`

### Option B — CLI Vercel

```bash
npm i -g vercel
cd Frontend
vercel --prod
```

---

## Étape 5 — Vérification finale

1. Ouvre l'URL Vercel dans le navigateur
2. Crée un compte → tu dois recevoir 1000 pts de bankroll
3. Va sur `admin.html` → connecte-toi avec `az@footix.com` / `admin123`
4. Vérifie que les matchs WC 2026 apparaissent avec des cotes

---

## Résumé des URLs en production

| Service | URL |
|---|---|
| Frontend | `https://cda-bet.vercel.app` (ou similaire) |
| API | `https://cda-bet-api.up.railway.app` (ou similaire) |
| BDD Railway | Accessible uniquement depuis l'API |

---

## Dépannage

**L'API répond "503"** → Le build Docker a échoué. Vérifie les logs Railway.

**"Erreur BDD"** → La `DATABASE_URL` n'est pas correctement configurée dans les variables Railway.

**Le frontend appelle `localhost:8000`** → L'URL Railway n'a pas été remplacée (étape 3).

**Admin panel inaccessible** → L'UPDATE is_admin n'a pas été exécuté (étape 2, dernier bloc SQL).
