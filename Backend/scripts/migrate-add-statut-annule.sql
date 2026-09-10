-- =====================================================
-- MIGRATION : statut ANNULE pour les paris
-- =====================================================
-- Un match reporté, annulé ou abandonné ne peut être ni gagné
-- ni perdu : la mise est remboursée et le ticket passe à ANNULE.
--
-- Migration rétrocompatible : elle ne fait qu'élargir la contrainte.
-- L'ancienne version du code, qui n'écrit jamais 'ANNULE', continue
-- de fonctionner sans modification.
-- =====================================================

BEGIN;

ALTER TABLE parii DROP CONSTRAINT IF EXISTS check_statut_valid;
ALTER TABLE parii ADD  CONSTRAINT check_statut_valid
    CHECK (statut IN ('EN_COURS', 'GAGNE', 'PERDU', 'ANNULE'));

COMMIT;
