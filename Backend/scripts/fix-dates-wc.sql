-- Correction des dates (juin 11 = jeudi, pas juin 12)
-- et ajout des matchs d'ouverture du jeudi 11 juin

-- Match d'ouverture : Mexique vs Jamaïque (Estadio Azteca, 20h)
INSERT INTO EQUIPE (Nom, Pays, ID_API) VALUES ('Jamaique', 'Jamaique', 'nat-jamaica')
ON CONFLICT (Nom, Pays) DO NOTHING;

INSERT INTO MATCH (ID_Sport, ID_EquipeDomicile, ID_EquipeExterieur, DateHeure, ID_External)
VALUES (
  1,
  (SELECT ID_Equipe FROM EQUIPE WHERE ID_API = 'nat-mexico'),
  (SELECT ID_Equipe FROM EQUIPE WHERE Nom = 'Jamaique'),
  '2026-06-11 20:00:00',
  'wc2026-open-mex-jam'
) ON CONFLICT (ID_External) DO NOTHING;

-- Groupe A : USA vs Panama (SoFi Stadium, 22h)
INSERT INTO MATCH (ID_Sport, ID_EquipeDomicile, ID_EquipeExterieur, DateHeure, ID_External)
VALUES (
  1,
  (SELECT ID_Equipe FROM EQUIPE WHERE ID_API = 'nat-usa'),
  (SELECT ID_Equipe FROM EQUIPE WHERE ID_API = 'nat-panama'),
  '2026-06-11 22:00:00',
  'wc2026-gA-usa-pan'
) ON CONFLICT (ID_External) DO NOTHING;

-- Groupe C : Canada vs Maroc (BMO Field, Toronto, 19h)
INSERT INTO MATCH (ID_Sport, ID_EquipeDomicile, ID_EquipeExterieur, DateHeure, ID_External)
VALUES (
  1,
  (SELECT ID_Equipe FROM EQUIPE WHERE ID_API = 'nat-canada'),
  (SELECT ID_Equipe FROM EQUIPE WHERE ID_API = 'nat-morocco'),
  '2026-06-11 19:00:00',
  'wc2026-gC-can-mar'
) ON CONFLICT (ID_External) DO NOTHING;

-- Mettre à jour les dates existantes : vendredi 12 juin → correction horaires
UPDATE MATCH SET DateHeure = '2026-06-12 19:00:00' WHERE ID_External = 'wc2026-gA-usa-bol';
UPDATE MATCH SET DateHeure = '2026-06-12 22:00:00' WHERE ID_External = 'wc2026-gB-mex-ecu';
UPDATE MATCH SET DateHeure = '2026-06-13 02:00:00' WHERE ID_External = 'wc2026-gC-can-hon';
