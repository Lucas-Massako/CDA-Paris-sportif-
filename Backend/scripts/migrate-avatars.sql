-- =============================================
-- MIGRATION : Système d'avatars & profil
-- =============================================

-- 1. Table des avatars disponibles
CREATE TABLE IF NOT EXISTS avatars (
    id_avatar        SERIAL PRIMARY KEY,
    nom              VARCHAR(50)  NOT NULL,
    emoji            VARCHAR(10)  NOT NULL,
    couleur          VARCHAR(20)  NOT NULL DEFAULT '#6366f1',
    description      TEXT,
    condition_code   VARCHAR(50)  NOT NULL DEFAULT 'DEFAULT',
    condition_valeur INT          NOT NULL DEFAULT 0
);

-- 2. Seed des 10 avatars
INSERT INTO avatars (nom, emoji, couleur, description, condition_code, condition_valeur) VALUES
  ('Rookie',        '⚽', '#6366f1', 'Avatar de départ. Bienvenue dans Footix !',                    'DEFAULT',       0),
  ('Parieur',       '🎯', '#10b981', 'Tu as placé ton premier pari. L''aventure commence !',         'BETS_1',        1),
  ('Joueur Assidu', '🎲', '#f59e0b', 'Tu as placé 5 paris. Tu prends l''habitude !',                'BETS_5',        5),
  ('Parieur Fou',   '🔥', '#ef4444', 'Tu as placé 20 paris. Rien ne t''arrête !',                   'BETS_20',       20),
  ('Chanceux',      '🍀', '#22c55e', 'Gagner un pari avec une cote supérieure à 3.0.',               'WIN_HIGH_ODDS', 0),
  ('Stratège',      '📊', '#3b82f6', 'Tu es dans le Top 25% du classement.',                         'TOP_25PCT',     0),
  ('Élite',         '🥇', '#eab308', 'Tu es dans le Top 10% du classement.',                         'TOP_10PCT',     0),
  ('Champion',      '👑', '#8b5cf6', 'Tu es numéro 1 du classement. Intouchable !',                  'RANK_1',        0),
  ('Footix',        '😭', '#94a3b8', 'Tu es dans les 20% derniers... Courage, ça va remonter !',     'BOT_20PCT',     0),
  ('Globe-Trotter', '🌍', '#0ea5e9', 'Tu as parié sur la Coupe du Monde 2026. Supporter mondial !', 'WC_BET',        0)
ON CONFLICT DO NOTHING;

-- 3. Colonnes supplémentaires sur utilisateur
ALTER TABLE utilisateur
    ADD COLUMN IF NOT EXISTS id_avatar_actif    INT REFERENCES avatars(id_avatar),
    ADD COLUMN IF NOT EXISTS id_equipe_favorite INT REFERENCES equipe(id_equipe);

-- 4. Table des avatars débloqués par utilisateur
CREATE TABLE IF NOT EXISTS user_avatars (
    id_user     INT NOT NULL,
    id_avatar   INT NOT NULL,
    debloque_le TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (id_user, id_avatar),
    CONSTRAINT fk_ua_user   FOREIGN KEY (id_user)   REFERENCES utilisateur(id_user)   ON DELETE CASCADE,
    CONSTRAINT fk_ua_avatar FOREIGN KEY (id_avatar) REFERENCES avatars(id_avatar) ON DELETE CASCADE
);

-- 5. Débloquer le Rookie (DEFAULT) pour tous les utilisateurs existants
INSERT INTO user_avatars (id_user, id_avatar)
SELECT id_user, 1 FROM utilisateur
ON CONFLICT DO NOTHING;

-- 6. Définir Rookie comme avatar actif pour ceux qui n'en ont pas
UPDATE utilisateur SET id_avatar_actif = 1 WHERE id_avatar_actif IS NULL;
