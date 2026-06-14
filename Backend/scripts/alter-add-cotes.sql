-- Migration : cotes persistées pour les matchs
-- Colonnes sur la table match (WC 2026 + matchs locaux)
ALTER TABLE match
    ADD COLUMN IF NOT EXISTS cote_1 DECIMAL(5,2) DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS cote_n DECIMAL(5,2) DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS cote_2 DECIMAL(5,2) DEFAULT NULL;

-- Table séparée pour les matchs TheSportsDB (id_external de l'API)
CREATE TABLE IF NOT EXISTS cotes_externes (
    id_external  VARCHAR(100) PRIMARY KEY,
    cote_1       DECIMAL(5,2) NOT NULL,
    cote_n       DECIMAL(5,2) NOT NULL,
    cote_2       DECIMAL(5,2) NOT NULL,
    created_at   TIMESTAMP DEFAULT NOW()
);
