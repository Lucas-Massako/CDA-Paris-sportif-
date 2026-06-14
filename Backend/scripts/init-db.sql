-- =====================================================
-- SCRIPT D'INITIALISATION - BASE DE DONNÉES FOOTIXSCORE
-- =====================================================
-- Auteur: Projet CDA
-- Date: 2026-02-12
-- Description: Création des tables, contraintes et données de test
-- =====================================================

-- Suppression des tables si elles existent déjà (pour réinitialisation)
DROP TABLE IF EXISTS STATUT_FOOTIX CASCADE;
DROP TABLE IF EXISTS ASSIDUITE CASCADE;
DROP TABLE IF EXISTS PARII CASCADE;
DROP TABLE IF EXISTS PREFERENCE CASCADE;
DROP TABLE IF EXISTS FAIT_HISTORIQUE CASCADE;
DROP TABLE IF EXISTS MATCH CASCADE;
DROP TABLE IF EXISTS EQUIPE CASCADE;
DROP TABLE IF EXISTS SPORT CASCADE;
DROP TABLE IF EXISTS UTILISATEUR CASCADE;

-- =====================================================
-- TABLE: UTILISATEUR
-- =====================================================
CREATE TABLE UTILISATEUR (
    ID_User SERIAL PRIMARY KEY,
    Nom VARCHAR(100) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    MotDePasse VARCHAR(255) NOT NULL,
    Bankroll INT NOT NULL DEFAULT 1000 CHECK (Bankroll >= 0),
    DateInscription TIMESTAMP DEFAULT NOW(),

    CONSTRAINT email_format CHECK (Email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Index pour recherche rapide par email
CREATE INDEX idx_utilisateur_email ON UTILISATEUR(Email);

-- =====================================================
-- TABLE: SPORT
-- =====================================================
CREATE TABLE SPORT (
    ID_Sport SERIAL PRIMARY KEY,
    Nom VARCHAR(50) NOT NULL UNIQUE
);

-- =====================================================
-- TABLE: EQUIPE
-- =====================================================
CREATE TABLE EQUIPE (
    ID_Equipe SERIAL PRIMARY KEY,
    Nom VARCHAR(100) NOT NULL,
    Pays VARCHAR(50) NOT NULL,
    ID_API VARCHAR(50) UNIQUE, -- ID de l'API externe (API-Football, etc.)
    
    -- Contrainte unique pour éviter les doublons
    CONSTRAINT unique_equipe_pays UNIQUE (Nom, Pays)
);

-- Index pour recherche rapide par pays
CREATE INDEX idx_equipe_pays ON EQUIPE(Pays);

-- =====================================================
-- TABLE: MATCH
-- =====================================================
CREATE TABLE MATCH (
    ID_Match SERIAL PRIMARY KEY,
    ID_Sport INTEGER NOT NULL,
    ID_EquipeDomicile INTEGER NOT NULL,
    ID_EquipeExterieur INTEGER NOT NULL,
    DateHeure TIMESTAMP NOT NULL,
    ScoreFinal VARCHAR(20) DEFAULT NULL,
    ID_External VARCHAR(100) UNIQUE,

    CONSTRAINT fk_match_sport FOREIGN KEY (ID_Sport) REFERENCES SPORT(ID_Sport) ON DELETE CASCADE,
    CONSTRAINT fk_match_domicile FOREIGN KEY (ID_EquipeDomicile) REFERENCES EQUIPE(ID_Equipe) ON DELETE CASCADE,
    CONSTRAINT fk_match_exterieur FOREIGN KEY (ID_EquipeExterieur) REFERENCES EQUIPE(ID_Equipe) ON DELETE CASCADE,
    CONSTRAINT check_different_teams CHECK (ID_EquipeDomicile <> ID_EquipeExterieur)
);

-- Index pour recherche par date (performance pour filtres)
CREATE INDEX idx_match_date ON MATCH(DateHeure);

-- =====================================================
-- TABLE: PREFERENCE (Équipes/Sports favoris)
-- =====================================================
CREATE TABLE PREFERENCE (
    ID_Pref SERIAL PRIMARY KEY,
    ID_User INTEGER NOT NULL,
    ID_Equipe INTEGER, -- Nullable: peut suivre un sport sans équipe précise
    ID_Sport INTEGER,  -- Nullable: peut suivre une équipe sans filtre sport
    
    -- Clés étrangères
    CONSTRAINT fk_pref_user FOREIGN KEY (ID_User) REFERENCES UTILISATEUR(ID_User) ON DELETE CASCADE,
    CONSTRAINT fk_pref_equipe FOREIGN KEY (ID_Equipe) REFERENCES EQUIPE(ID_Equipe) ON DELETE CASCADE,
    CONSTRAINT fk_pref_sport FOREIGN KEY (ID_Sport) REFERENCES SPORT(ID_Sport) ON DELETE CASCADE,
    
    -- Contrainte: au moins un champ (Equipe OU Sport) doit être rempli
    CONSTRAINT check_pref_not_empty CHECK (ID_Equipe IS NOT NULL OR ID_Sport IS NOT NULL),
    
    -- Éviter les doublons de préférences
    CONSTRAINT unique_user_preference UNIQUE (ID_User, ID_Equipe, ID_Sport)
);

-- =====================================================
-- TABLE: PARII (Paris des utilisateurs)
-- =====================================================
CREATE TABLE PARII (
    ID_User INTEGER NOT NULL,
    ID_Match INTEGER NOT NULL,
    Pronostic INTEGER NOT NULL, -- 0 = Nul, 1 = Victoire Domicile, 2 = Victoire Extérieur
    Mise INTEGER NOT NULL DEFAULT 10 CHECK (Mise > 0),
    Cote DECIMAL(5,2) NOT NULL DEFAULT 1.00,
    Statut VARCHAR(20) NOT NULL DEFAULT 'EN_COURS', -- EN_COURS, GAGNE, PERDU
    EstFootix BOOLEAN DEFAULT FALSE,
    DatePari TIMESTAMP DEFAULT NOW(),

    PRIMARY KEY (ID_User, ID_Match),

    CONSTRAINT fk_pari_user FOREIGN KEY (ID_User) REFERENCES UTILISATEUR(ID_User) ON DELETE CASCADE,
    CONSTRAINT fk_pari_match FOREIGN KEY (ID_Match) REFERENCES MATCH(ID_Match) ON DELETE CASCADE,
    CONSTRAINT check_pronostic_valid CHECK (Pronostic IN (0, 1, 2)),
    CONSTRAINT check_statut_valid CHECK (Statut IN ('EN_COURS', 'GAGNE', 'PERDU'))
);

-- =====================================================
-- TABLE: ASSIDUITE (Matchs visionnés)
-- =====================================================
CREATE TABLE ASSIDUITE (
    ID_Assiduite SERIAL PRIMARY KEY,
    ID_User INTEGER NOT NULL,
    ID_Match INTEGER NOT NULL,
    EstVu BOOLEAN DEFAULT TRUE,
    DateVisionnage TIMESTAMP DEFAULT NOW(),
    
    -- Clés étrangères
    CONSTRAINT fk_assiduite_user FOREIGN KEY (ID_User) REFERENCES UTILISATEUR(ID_User) ON DELETE CASCADE,
    CONSTRAINT fk_assiduite_match FOREIGN KEY (ID_Match) REFERENCES MATCH(ID_Match) ON DELETE CASCADE,
    
    -- Contrainte: un utilisateur ne peut marquer un match vu qu'une fois
    CONSTRAINT unique_user_match_view UNIQUE (ID_User, ID_Match)
);

-- =====================================================
-- TABLE: STATUT_FOOTIX (Historique des titres)
-- =====================================================
CREATE TABLE STATUT_FOOTIX (
    ID_Statut SERIAL PRIMARY KEY,
    ID_User INTEGER NOT NULL,
    ID_Match INTEGER NOT NULL, -- Match de référence pour la semaine
    TitreObtenu VARCHAR(50) NOT NULL, -- "Footix", "Brique", "Pénalix"
    DateObtention TIMESTAMP DEFAULT NOW(),
    
    -- Clés étrangères
    CONSTRAINT fk_statut_user FOREIGN KEY (ID_User) REFERENCES UTILISATEUR(ID_User) ON DELETE CASCADE,
    CONSTRAINT fk_statut_match FOREIGN KEY (ID_Match) REFERENCES MATCH(ID_Match) ON DELETE CASCADE,
    
    -- Contrainte: titres autorisés
    CONSTRAINT check_titre_valid CHECK (TitreObtenu IN ('Footix', 'Brique', 'Pénalix', 'Champion', 'Expert'))
);

-- Index pour recherche rapide des derniers statuts
CREATE INDEX idx_statut_user_date ON STATUT_FOOTIX(ID_User, DateObtention DESC);

-- =====================================================
-- TABLE: FAIT_HISTORIQUE ("On This Date")
-- =====================================================
CREATE TABLE FAIT_HISTORIQUE (
    ID_Fait SERIAL PRIMARY KEY,
    ID_Equipe INTEGER NOT NULL,
    Jour INTEGER NOT NULL,
    Mois INTEGER NOT NULL,
    Description TEXT NOT NULL,
    
    -- Clés étrangères
    CONSTRAINT fk_fait_equipe FOREIGN KEY (ID_Equipe) REFERENCES EQUIPE(ID_Equipe) ON DELETE CASCADE,
    
    -- Contraintes métier: jour et mois valides
    CONSTRAINT check_jour_valid CHECK (Jour BETWEEN 1 AND 31),
    CONSTRAINT check_mois_valid CHECK (Mois BETWEEN 1 AND 12)
);

-- Index composite pour recherche par date (optimisation "On This Date")
CREATE INDEX idx_fait_date ON FAIT_HISTORIQUE(Mois, Jour);

-- =====================================================
-- DONNÉES DE TEST
-- =====================================================

-- Insertion des sports
INSERT INTO SPORT (Nom) VALUES 
    ('Football'),
    ('Basketball'),
    ('Rugby');

-- Insertion d'équipes
INSERT INTO EQUIPE (Nom, Pays, ID_API) VALUES 
    ('Paris Saint-Germain', 'France', 'psg-api-85'),
    ('Olympique de Marseille', 'France', 'om-api-81'),
    ('FC Barcelone', 'Espagne', 'fcb-api-529'),
    ('Real Madrid', 'Espagne', 'rm-api-541'),
    ('Manchester United', 'Angleterre', 'manu-api-33'),
    ('Liverpool FC', 'Angleterre', 'lfc-api-40'),
    ('Los Angeles Lakers', 'USA', 'lal-nba-14'),
    ('Golden State Warriors', 'USA', 'gsw-nba-9');

-- Insertion d'un utilisateur test (mot de passe: "Test1234!")
-- Hash bcrypt pour "Test1234!" : $2b$10$YourHashHere (à générer avec bcrypt)
INSERT INTO UTILISATEUR (Nom, Email, MotDePasse, Bankroll) VALUES
    ('Jean Dupont', 'jean.dupont@test.fr', '$2b$10$rQj7fZQk9Y6nZ8xZ9Z8Z9u', 1000),
    ('Marie Martin', 'marie.martin@test.fr', '$2b$10$rQj7fZQk9Y6nZ8xZ9Z8Z9u', 1000),
    ('Ahmed Ben', 'ahmed.ben@test.fr', '$2b$10$rQj7fZQk9Y6nZ8xZ9Z8Z9u', 1000);

-- Insertion de matchs à venir
INSERT INTO MATCH (ID_Sport, ID_EquipeDomicile, ID_EquipeExterieur, DateHeure, ScoreFinal) VALUES 
    (1, 1, 2, '2026-02-15 21:00:00', NULL), -- PSG vs OM (à venir)
    (1, 3, 4, '2026-02-16 20:30:00', NULL), -- Barça vs Real (à venir)
    (1, 5, 6, '2026-02-17 18:00:00', NULL), -- Man United vs Liverpool (à venir)
    (2, 7, 8, '2026-02-14 02:30:00', NULL), -- Lakers vs Warriors (à venir)
    (1, 1, 3, '2026-02-10 21:00:00', '2-1'); -- PSG vs Barça (terminé)

-- Insertion de préférences utilisateur
INSERT INTO PREFERENCE (ID_User, ID_Equipe, ID_Sport) VALUES 
    (1, 1, 1), -- Jean suit le PSG (Football)
    (1, 7, 2), -- Jean suit les Lakers (Basketball)
    (2, 2, 1), -- Marie suit l'OM (Football)
    (3, 3, NULL); -- Ahmed suit le Barça (tous sports)

-- Insertion de paris
INSERT INTO PARII (ID_User, ID_Match, Pronostic, Mise, Cote, Statut, EstFootix) VALUES
    (1, 1, 1, 100, 1.85, 'EN_COURS', FALSE),
    (2, 1, 2, 50,  2.10, 'EN_COURS', FALSE),
    (3, 2, 1, 200, 1.60, 'EN_COURS', FALSE);

-- Insertion d'assiduité
INSERT INTO ASSIDUITE (ID_User, ID_Match, EstVu) VALUES 
    (1, 5, TRUE), -- Jean a vu PSG vs Barça
    (2, 5, TRUE); -- Marie a vu PSG vs Barça

-- Insertion de faits historiques
INSERT INTO FAIT_HISTORIQUE (ID_Equipe, Jour, Mois, Description) VALUES 
    (1, 12, 2, 'Le PSG remporte sa première Ligue des Champions en 2026 !'),
    (3, 25, 5, 'Le FC Barcelone gagne la Ligue des Champions 2015 contre la Juventus'),
    (5, 26, 5, 'Manchester United remporte la finale de la Ligue des Champions 1999 dans les arrêts de jeu');

-- =====================================================
-- VUES UTILES (BONUS)
-- =====================================================

-- Vue: Classement hebdomadaire (taux de réussite)
CREATE OR REPLACE VIEW v_classement_hebdo AS
SELECT 
    u.ID_User,
    u.Nom,
    COUNT(p.ID_Match) AS TotalParis,
    SUM(CASE 
        WHEN m.ScoreFinal IS NOT NULL AND 
             ((p.Pronostic = 1 AND SPLIT_PART(m.ScoreFinal, '-', 1)::INT > SPLIT_PART(m.ScoreFinal, '-', 2)::INT) OR
              (p.Pronostic = 2 AND SPLIT_PART(m.ScoreFinal, '-', 2)::INT > SPLIT_PART(m.ScoreFinal, '-', 1)::INT))
        THEN 1 ELSE 0 
    END) AS ParisGagnes,
    ROUND(
        (SUM(CASE 
            WHEN m.ScoreFinal IS NOT NULL AND 
                 ((p.Pronostic = 1 AND SPLIT_PART(m.ScoreFinal, '-', 1)::INT > SPLIT_PART(m.ScoreFinal, '-', 2)::INT) OR
                  (p.Pronostic = 2 AND SPLIT_PART(m.ScoreFinal, '-', 2)::INT > SPLIT_PART(m.ScoreFinal, '-', 1)::INT))
            THEN 1 ELSE 0 
        END)::DECIMAL / NULLIF(COUNT(p.ID_Match), 0) * 100),
        2
    ) AS TauxReussite
FROM UTILISATEUR u
LEFT JOIN PARII p ON u.ID_User = p.ID_User
LEFT JOIN MATCH m ON p.ID_Match = m.ID_Match
WHERE m.DateHeure >= NOW() - INTERVAL '7 days'
GROUP BY u.ID_User, u.Nom
ORDER BY TauxReussite DESC;

-- Vue: Compteur d'assiduité par utilisateur
CREATE OR REPLACE VIEW v_assiduite_utilisateur AS
SELECT 
    u.ID_User,
    u.Nom,
    COUNT(a.ID_Match) AS MatchsVus
FROM UTILISATEUR u
LEFT JOIN ASSIDUITE a ON u.ID_User = a.ID_User
GROUP BY u.ID_User, u.Nom
ORDER BY MatchsVus DESC;

-- =====================================================
-- FIN DU SCRIPT
-- =====================================================

-- Affichage de confirmation
DO $$
BEGIN
    RAISE NOTICE '✅ Base de données FootixScore initialisée avec succès !';
    RAISE NOTICE '📊 Tables créées: 9';
    RAISE NOTICE '🏆 Données de test: Insérées';
    RAISE NOTICE '📈 Vues utiles: 2 (v_classement_hebdo, v_assiduite_utilisateur)';
END $$;