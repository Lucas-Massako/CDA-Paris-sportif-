-- 1. Migrer les matchs des doublons "International" vers les IDs corrects (clubs)
UPDATE match SET id_equipedomicile = 38 WHERE id_equipedomicile = 1;  -- PSG International -> PSG Ligue 1
UPDATE match SET id_equipeexterieur = 38 WHERE id_equipeexterieur = 1;
UPDATE match SET id_equipedomicile = 39 WHERE id_equipedomicile = 2;  -- OM International -> OM Ligue 1
UPDATE match SET id_equipeexterieur = 39 WHERE id_equipeexterieur = 2;
UPDATE match SET id_equipedomicile = 77 WHERE id_equipedomicile = 3;  -- FC Barcelone
UPDATE match SET id_equipeexterieur = 77 WHERE id_equipeexterieur = 3;
UPDATE match SET id_equipedomicile = 76 WHERE id_equipedomicile = 4;  -- Real Madrid
UPDATE match SET id_equipeexterieur = 76 WHERE id_equipeexterieur = 4;
UPDATE match SET id_equipedomicile = 60 WHERE id_equipedomicile = 5;  -- Manchester United
UPDATE match SET id_equipeexterieur = 60 WHERE id_equipeexterieur = 5;

-- 2. Migrer les matchs NBA vers une catégorie neutre (on garde les IDs, on change juste pays)
UPDATE equipe SET pays = 'Autre' WHERE id_equipe IN (7, 8);  -- Lakers, Warriors

-- 3. Corriger Liverpool FC -> Premier League
UPDATE equipe SET pays = 'Premier League', nom = 'Liverpool FC' WHERE id_equipe = 6;

-- 4. Supprimer les doublons International des clubs (maintenant que les matchs sont migrés)
DELETE FROM equipe WHERE id_equipe IN (1, 2, 3, 4, 5);

-- 5. Corriger les noms avec accents manquants
UPDATE equipe SET nom = 'Brésil'           WHERE nom = 'Bresil'          AND pays = 'International';
UPDATE equipe SET nom = 'Sénégal'          WHERE nom = 'Senegal'         AND pays = 'International';
UPDATE equipe SET nom = 'Équateur'         WHERE nom = 'Equateur'        AND pays = 'International';
UPDATE equipe SET nom = 'États-Unis'       WHERE nom = 'Etats-Unis'      AND pays = 'International';
UPDATE equipe SET nom = 'Corée du Sud'     WHERE nom = 'Coree du Sud'    AND pays = 'International';
UPDATE equipe SET nom = 'Panamá'           WHERE nom = 'Panama'          AND pays = 'International';
UPDATE equipe SET nom = 'Jamaïque'         WHERE nom = 'Jamaique'        AND pays = 'International';

-- 6. Ajouter les nations manquantes du top 50 FIFA/ELO
INSERT INTO equipe (nom, pays) VALUES
('Italie',              'International'),
('Algérie',             'International'),
('Égypte',              'International'),
('Norvège',             'International'),
('Ukraine',             'International'),
('Côte d''Ivoire',      'International'),
('Russie',              'International'),
('Pays de Galles',      'International'),
('Suède',               'International'),
('République tchèque',  'International'),
('Paraguay',            'International'),
('Hongrie',             'International'),
('Écosse',              'International'),
('Serbie',              'International'),
('Cameroun',            'International'),
('RD Congo',            'International'),
('Tunisie',             'International'),
('Slovaquie',           'International'),
('Grèce',               'International'),
('Venezuela',           'International'),
('Pérou',               'International'),
('Danemark',            'International'),
('Turquie',             'International'),
('Autriche',            'International'),
('Iran',                'International'),
('Nigeria',             'International'),
('Islande',             'International'),
('Arabie Saoudite',     'International'),
('Chili',               'International'),
('Costa Rica',          'International'),
('Slovénie',            'International'),
('Jordanie',            'International')
ON CONFLICT (nom, pays) DO NOTHING;
