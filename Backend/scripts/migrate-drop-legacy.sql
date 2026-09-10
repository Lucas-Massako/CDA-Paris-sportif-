-- =====================================================
-- MIGRATION : suppression des tables héritées de la
-- conception initiale, non utilisées par l'application.
-- Le modèle physique final compte 7 tables :
-- utilisateur, equipe, match, parii, avatars,
-- user_avatars, cotes_externes.
-- =====================================================

BEGIN;

-- Vue dépendante de la table assiduite
DROP VIEW IF EXISTS v_assiduite_utilisateur;

-- Tables héritées jamais exploitées par le backend
DROP TABLE IF EXISTS statut_footix   CASCADE;
DROP TABLE IF EXISTS assiduite       CASCADE;
DROP TABLE IF EXISTS preference      CASCADE;
DROP TABLE IF EXISTS fait_historique CASCADE;

-- La colonne match.id_sport (et sa FK) n'a plus d'usage :
-- l'application ne gère que le football
ALTER TABLE match DROP COLUMN IF EXISTS id_sport CASCADE;
DROP TABLE IF EXISTS sport CASCADE;

COMMIT;
