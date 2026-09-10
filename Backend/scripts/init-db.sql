-- =====================================================
-- SCRIPT D'INITIALISATION - BASE DE DONNÉES FOOTIX_SCORE
-- =====================================================
-- Auteur      : Projet CDA — Footix
-- Description : Création du schéma complet (7 tables),
--               contraintes, index, vue et données de référence.
--               Consolide le schéma initial + les migrations
--               (avatars, cotes persistées) en un seul script.
-- =====================================================

-- Suppression des tables si elles existent déjà (réinitialisation complète)
-- (inclut les tables héritées de la conception initiale, retirées du modèle final)
DROP TABLE IF EXISTS statut_footix   CASCADE;
DROP TABLE IF EXISTS assiduite       CASCADE;
DROP TABLE IF EXISTS preference      CASCADE;
DROP TABLE IF EXISTS fait_historique CASCADE;
DROP TABLE IF EXISTS sport           CASCADE;
DROP TABLE IF EXISTS user_avatars    CASCADE;
DROP TABLE IF EXISTS parii           CASCADE;
DROP TABLE IF EXISTS cotes_externes  CASCADE;
DROP TABLE IF EXISTS match           CASCADE;
DROP TABLE IF EXISTS utilisateur     CASCADE;
DROP TABLE IF EXISTS avatars         CASCADE;
DROP TABLE IF EXISTS equipe          CASCADE;

-- =====================================================
-- TABLE 1 : EQUIPE
-- =====================================================
CREATE TABLE equipe (
    id_equipe SERIAL PRIMARY KEY,
    nom       VARCHAR(100) NOT NULL,
    pays      VARCHAR(50)  NOT NULL, -- sert aussi de catégorie de filtrage (championnat)
    id_api    VARCHAR(50)  UNIQUE,   -- identifiant API externe (TheSportsDB)

    CONSTRAINT unique_equipe_pays UNIQUE (nom, pays)
);

CREATE INDEX idx_equipe_pays ON equipe(pays);

-- =====================================================
-- TABLE 2 : AVATARS (gamification — 10 avatars conditionnels)
-- =====================================================
CREATE TABLE avatars (
    id_avatar        SERIAL PRIMARY KEY,
    nom              VARCHAR(50)  NOT NULL,
    emoji            VARCHAR(10)  NOT NULL,
    couleur          VARCHAR(20)  NOT NULL DEFAULT '#6366f1',
    description      TEXT,
    condition_code   VARCHAR(50)  NOT NULL DEFAULT 'DEFAULT',
    condition_valeur INT          NOT NULL DEFAULT 0
);

-- =====================================================
-- TABLE 3 : UTILISATEUR
-- =====================================================
CREATE TABLE utilisateur (
    id_user            SERIAL PRIMARY KEY,
    nom                VARCHAR(100) NOT NULL,
    email              VARCHAR(255) UNIQUE NOT NULL,
    motdepasse         VARCHAR(255) NOT NULL, -- hash bcrypt (10 rounds), jamais en clair
    bankroll           INT NOT NULL DEFAULT 1000 CHECK (bankroll >= 0),
    dateinscription    TIMESTAMP DEFAULT NOW(),
    is_admin           BOOLEAN DEFAULT FALSE,
    dernier_bonus      DATE DEFAULT NULL, -- recharge automatique : 1 bonus max / jour
    id_avatar_actif    INT REFERENCES avatars(id_avatar),
    id_equipe_favorite INT REFERENCES equipe(id_equipe),

    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_utilisateur_email ON utilisateur(email);

-- =====================================================
-- TABLE 4 : MATCH
-- =====================================================
CREATE TABLE match (
    id_match           SERIAL PRIMARY KEY,
    id_equipedomicile  INTEGER NOT NULL,
    id_equipeexterieur INTEGER NOT NULL,
    dateheure          TIMESTAMP NOT NULL,
    scorefinal         VARCHAR(20) DEFAULT NULL,     -- NULL = match non résolu
    id_external        VARCHAR(100) UNIQUE,          -- identifiant TheSportsDB (résolution auto)
    cote_1             DECIMAL(5,2) DEFAULT NULL,    -- cotes persistées (équité entre joueurs)
    cote_n             DECIMAL(5,2) DEFAULT NULL,
    cote_2             DECIMAL(5,2) DEFAULT NULL,

    CONSTRAINT fk_match_domicile  FOREIGN KEY (id_equipedomicile)  REFERENCES equipe(id_equipe) ON DELETE CASCADE,
    CONSTRAINT fk_match_exterieur FOREIGN KEY (id_equipeexterieur) REFERENCES equipe(id_equipe) ON DELETE CASCADE,
    CONSTRAINT check_different_teams CHECK (id_equipedomicile <> id_equipeexterieur)
);

CREATE INDEX idx_match_date ON match(dateheure);

-- =====================================================
-- TABLE 5 : PARII (paris des utilisateurs)
-- =====================================================
CREATE TABLE parii (
    id_user   INTEGER NOT NULL,
    id_match  INTEGER NOT NULL,
    pronostic INTEGER NOT NULL,                      -- 0 = Nul, 1 = Domicile, 2 = Extérieur
    mise      INTEGER NOT NULL DEFAULT 10 CHECK (mise > 0),
    cote      DECIMAL(5,2) NOT NULL DEFAULT 1.00,    -- cote figée au moment du pari
    statut    VARCHAR(20) NOT NULL DEFAULT 'EN_COURS',
    estfootix BOOLEAN DEFAULT FALSE,
    datepari  TIMESTAMP DEFAULT NOW(),

    PRIMARY KEY (id_user, id_match),                 -- règle métier : 1 pari par match et par joueur

    CONSTRAINT fk_pari_user  FOREIGN KEY (id_user)  REFERENCES utilisateur(id_user) ON DELETE CASCADE,
    CONSTRAINT fk_pari_match FOREIGN KEY (id_match) REFERENCES match(id_match)      ON DELETE CASCADE,
    CONSTRAINT check_pronostic_valid CHECK (pronostic IN (0, 1, 2)),
    -- ANNULE : match reporté ou annulé, mise remboursée
    CONSTRAINT check_statut_valid    CHECK (statut IN ('EN_COURS', 'GAGNE', 'PERDU', 'ANNULE'))
);

-- =====================================================
-- TABLE 6 : USER_AVATARS (jonction N,N — avatars débloqués)
-- =====================================================
CREATE TABLE user_avatars (
    id_user     INT NOT NULL,
    id_avatar   INT NOT NULL,
    debloque_le TIMESTAMP DEFAULT NOW(),

    PRIMARY KEY (id_user, id_avatar),

    CONSTRAINT fk_ua_user   FOREIGN KEY (id_user)   REFERENCES utilisateur(id_user) ON DELETE CASCADE,
    CONSTRAINT fk_ua_avatar FOREIGN KEY (id_avatar) REFERENCES avatars(id_avatar)   ON DELETE CASCADE
);

-- =====================================================
-- TABLE 7 : COTES_EXTERNES (cache des cotes persistées
--           pour les matchs des championnats TheSportsDB)
-- =====================================================
CREATE TABLE cotes_externes (
    id_external VARCHAR(100) PRIMARY KEY,
    cote_1      DECIMAL(5,2) NOT NULL,
    cote_n      DECIMAL(5,2) NOT NULL,
    cote_2      DECIMAL(5,2) NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- DONNÉES DE RÉFÉRENCE : les 10 avatars conditionnels
-- =====================================================
INSERT INTO avatars (nom, emoji, couleur, description, condition_code, condition_valeur) VALUES
  ('Rookie',        '⚽', '#6366f1', 'Avatar de départ. Bienvenue dans Footix !',                   'DEFAULT',       0),
  ('Parieur',       '🎯', '#10b981', 'Tu as placé ton premier pari. L''aventure commence !',        'BETS_1',        1),
  ('Joueur Assidu', '🎲', '#f59e0b', 'Tu as placé 5 paris. Tu prends l''habitude !',                'BETS_5',        5),
  ('Parieur Fou',   '🔥', '#ef4444', 'Tu as placé 20 paris. Rien ne t''arrête !',                   'BETS_20',       20),
  ('Chanceux',      '🍀', '#22c55e', 'Gagner un pari avec une cote supérieure à 3.0.',              'WIN_HIGH_ODDS', 0),
  ('Stratège',      '📊', '#3b82f6', 'Tu es dans le Top 25% du classement.',                        'TOP_25PCT',     0),
  ('Élite',         '🥇', '#eab308', 'Tu es dans le Top 10% du classement.',                        'TOP_10PCT',     0),
  ('Champion',      '👑', '#8b5cf6', 'Tu es numéro 1 du classement. Intouchable !',                 'RANK_1',        0),
  ('Footix',        '😭', '#94a3b8', 'Tu es dans les 20% derniers... Courage, ça va remonter !',    'BOT_20PCT',     0),
  ('Globe-Trotter', '🌍', '#0ea5e9', 'Tu as parié sur la Coupe du Monde 2026. Supporter mondial !', 'WC_BET',        0)
ON CONFLICT DO NOTHING;

-- =====================================================
-- VUE : classement hebdomadaire (taux de réussite des paris)
-- =====================================================
CREATE OR REPLACE VIEW v_classement_hebdo AS
SELECT
    u.id_user,
    u.nom,
    COUNT(p.id_match) AS totalparis,
    SUM(CASE
        WHEN m.scorefinal IS NOT NULL AND
             ((p.pronostic = 1 AND SPLIT_PART(m.scorefinal, '-', 1)::INT > SPLIT_PART(m.scorefinal, '-', 2)::INT) OR
              (p.pronostic = 2 AND SPLIT_PART(m.scorefinal, '-', 2)::INT > SPLIT_PART(m.scorefinal, '-', 1)::INT))
        THEN 1 ELSE 0
    END) AS parisgagnes,
    ROUND(
        (SUM(CASE
            WHEN m.scorefinal IS NOT NULL AND
                 ((p.pronostic = 1 AND SPLIT_PART(m.scorefinal, '-', 1)::INT > SPLIT_PART(m.scorefinal, '-', 2)::INT) OR
                  (p.pronostic = 2 AND SPLIT_PART(m.scorefinal, '-', 2)::INT > SPLIT_PART(m.scorefinal, '-', 1)::INT))
            THEN 1 ELSE 0
        END)::DECIMAL / NULLIF(COUNT(p.id_match), 0) * 100),
        2
    ) AS tauxreussite
FROM utilisateur u
LEFT JOIN parii p ON u.id_user = p.id_user
LEFT JOIN match m ON p.id_match = m.id_match
WHERE m.dateheure >= NOW() - INTERVAL '7 days'
GROUP BY u.id_user, u.nom
ORDER BY tauxreussite DESC;

-- =====================================================
-- PROMOTION D'UN ADMINISTRATEUR
-- =====================================================
-- Après inscription via l'application, promouvoir un compte :
-- UPDATE utilisateur SET is_admin = TRUE WHERE email = 'admin@footix.fr';

-- =====================================================
-- FIN DU SCRIPT
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Base de données footix_score initialisée avec succès !';
    RAISE NOTICE '📊 Tables créées : 7 (utilisateur, equipe, match, parii, avatars, user_avatars, cotes_externes)';
    RAISE NOTICE '🏆 Données de référence : 10 avatars conditionnels';
    RAISE NOTICE '📈 Vue : v_classement_hebdo';
END $$;
