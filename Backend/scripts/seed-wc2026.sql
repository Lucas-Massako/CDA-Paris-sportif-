-- Vérification que les équipes sont bien là
DO $$
DECLARE
  v_france       INTEGER;
  v_nireland     INTEGER;
  v_usa          INTEGER;
  v_mexico       INTEGER;
  v_canada       INTEGER;
  v_bolivia      INTEGER;
  v_ecuador      INTEGER;
  v_honduras     INTEGER;
  v_germany      INTEGER;
  v_japan        INTEGER;
  v_spain        INTEGER;
  v_morocco      INTEGER;
  v_portugal     INTEGER;
  v_uruguay      INTEGER;
  v_france2      INTEGER;
  v_colombia     INTEGER;
  v_brazil       INTEGER;
  v_southkorea   INTEGER;
  v_argentina    INTEGER;
  v_panama       INTEGER;
  v_england      INTEGER;
  v_senegal      INTEGER;
  v_netherlands  INTEGER;
  v_australia    INTEGER;
  v_belgium      INTEGER;
  v_poland       INTEGER;
BEGIN

  SELECT ID_Equipe INTO v_france      FROM EQUIPE WHERE ID_API='nat-france';
  SELECT ID_Equipe INTO v_nireland    FROM EQUIPE WHERE ID_API='nat-nireland';
  SELECT ID_Equipe INTO v_usa         FROM EQUIPE WHERE ID_API='nat-usa';
  SELECT ID_Equipe INTO v_mexico      FROM EQUIPE WHERE ID_API='nat-mexico';
  SELECT ID_Equipe INTO v_canada      FROM EQUIPE WHERE ID_API='nat-canada';
  SELECT ID_Equipe INTO v_bolivia     FROM EQUIPE WHERE ID_API='nat-bolivia';
  SELECT ID_Equipe INTO v_ecuador     FROM EQUIPE WHERE ID_API='nat-ecuador';
  SELECT ID_Equipe INTO v_honduras    FROM EQUIPE WHERE ID_API='nat-honduras';
  SELECT ID_Equipe INTO v_germany     FROM EQUIPE WHERE ID_API='nat-germany';
  SELECT ID_Equipe INTO v_japan       FROM EQUIPE WHERE ID_API='nat-japan';
  SELECT ID_Equipe INTO v_spain       FROM EQUIPE WHERE ID_API='nat-spain';
  SELECT ID_Equipe INTO v_morocco     FROM EQUIPE WHERE ID_API='nat-morocco';
  SELECT ID_Equipe INTO v_portugal    FROM EQUIPE WHERE ID_API='nat-portugal';
  SELECT ID_Equipe INTO v_uruguay     FROM EQUIPE WHERE ID_API='nat-uruguay';
  SELECT ID_Equipe INTO v_colombia    FROM EQUIPE WHERE ID_API='nat-colombia';
  SELECT ID_Equipe INTO v_brazil      FROM EQUIPE WHERE ID_API='nat-brazil';
  SELECT ID_Equipe INTO v_southkorea  FROM EQUIPE WHERE ID_API='nat-southkorea';
  SELECT ID_Equipe INTO v_argentina   FROM EQUIPE WHERE ID_API='nat-argentina';
  SELECT ID_Equipe INTO v_panama      FROM EQUIPE WHERE ID_API='nat-panama';
  SELECT ID_Equipe INTO v_england     FROM EQUIPE WHERE ID_API='nat-england';
  SELECT ID_Equipe INTO v_senegal     FROM EQUIPE WHERE ID_API='nat-senegal';
  SELECT ID_Equipe INTO v_netherlands FROM EQUIPE WHERE ID_API='nat-netherlands';
  SELECT ID_Equipe INTO v_australia   FROM EQUIPE WHERE ID_API='nat-australia';
  SELECT ID_Equipe INTO v_belgium     FROM EQUIPE WHERE ID_API='nat-belgium';
  SELECT ID_Equipe INTO v_poland      FROM EQUIPE WHERE ID_API='nat-poland';

  RAISE NOTICE 'France=% NordIrl=% USA=% Mexique=% Canada=%', v_france, v_nireland, v_usa, v_mexico, v_canada;

  -- France 2-1 Irlande du Nord (joué ce soir - ne s'affiche pas dans "à parier")
  IF v_france IS NOT NULL AND v_nireland IS NOT NULL THEN
    INSERT INTO MATCH (ID_Sport,ID_EquipeDomicile,ID_EquipeExterieur,DateHeure,ScoreFinal,ID_External)
    VALUES (1,v_france,v_nireland,'2026-06-09 21:00:00','2-1','nl-2026-fra-nir')
    ON CONFLICT (ID_External) DO NOTHING;
    RAISE NOTICE 'France-NordIrl inséré';
  END IF;

  -- JEUDI 12 JUIN
  IF v_usa IS NOT NULL AND v_bolivia IS NOT NULL THEN
    INSERT INTO MATCH (ID_Sport,ID_EquipeDomicile,ID_EquipeExterieur,DateHeure,ID_External)
    VALUES (1,v_usa,v_bolivia,'2026-06-12 18:00:00','wc2026-gA-usa-bol')
    ON CONFLICT (ID_External) DO NOTHING;
  END IF;

  IF v_mexico IS NOT NULL AND v_ecuador IS NOT NULL THEN
    INSERT INTO MATCH (ID_Sport,ID_EquipeDomicile,ID_EquipeExterieur,DateHeure,ID_External)
    VALUES (1,v_mexico,v_ecuador,'2026-06-12 21:00:00','wc2026-gB-mex-ecu')
    ON CONFLICT (ID_External) DO NOTHING;
  END IF;

  IF v_canada IS NOT NULL AND v_honduras IS NOT NULL THEN
    INSERT INTO MATCH (ID_Sport,ID_EquipeDomicile,ID_EquipeExterieur,DateHeure,ID_External)
    VALUES (1,v_canada,v_honduras,'2026-06-13 00:00:00','wc2026-gC-can-hon')
    ON CONFLICT (ID_External) DO NOTHING;
  END IF;

  -- VENDREDI 13 JUIN
  IF v_germany IS NOT NULL AND v_japan IS NOT NULL THEN
    INSERT INTO MATCH (ID_Sport,ID_EquipeDomicile,ID_EquipeExterieur,DateHeure,ID_External)
    VALUES (1,v_germany,v_japan,'2026-06-13 18:00:00','wc2026-gE-ger-jpn')
    ON CONFLICT (ID_External) DO NOTHING;
  END IF;

  IF v_spain IS NOT NULL AND v_morocco IS NOT NULL THEN
    INSERT INTO MATCH (ID_Sport,ID_EquipeDomicile,ID_EquipeExterieur,DateHeure,ID_External)
    VALUES (1,v_spain,v_morocco,'2026-06-13 21:00:00','wc2026-gF-esp-mar')
    ON CONFLICT (ID_External) DO NOTHING;
  END IF;

  IF v_portugal IS NOT NULL AND v_uruguay IS NOT NULL THEN
    INSERT INTO MATCH (ID_Sport,ID_EquipeDomicile,ID_EquipeExterieur,DateHeure,ID_External)
    VALUES (1,v_portugal,v_uruguay,'2026-06-14 00:00:00','wc2026-gG-por-uru')
    ON CONFLICT (ID_External) DO NOTHING;
  END IF;

  -- SAMEDI 14 JUIN
  IF v_france IS NOT NULL AND v_colombia IS NOT NULL THEN
    INSERT INTO MATCH (ID_Sport,ID_EquipeDomicile,ID_EquipeExterieur,DateHeure,ID_External)
    VALUES (1,v_france,v_colombia,'2026-06-14 21:00:00','wc2026-gH-fra-col')
    ON CONFLICT (ID_External) DO NOTHING;
  END IF;

  IF v_brazil IS NOT NULL AND v_southkorea IS NOT NULL THEN
    INSERT INTO MATCH (ID_Sport,ID_EquipeDomicile,ID_EquipeExterieur,DateHeure,ID_External)
    VALUES (1,v_brazil,v_southkorea,'2026-06-14 18:00:00','wc2026-gI-bra-kor')
    ON CONFLICT (ID_External) DO NOTHING;
  END IF;

  IF v_argentina IS NOT NULL AND v_panama IS NOT NULL THEN
    INSERT INTO MATCH (ID_Sport,ID_EquipeDomicile,ID_EquipeExterieur,DateHeure,ID_External)
    VALUES (1,v_argentina,v_panama,'2026-06-15 00:00:00','wc2026-gJ-arg-pan')
    ON CONFLICT (ID_External) DO NOTHING;
  END IF;

  -- DIMANCHE 15 JUIN
  IF v_england IS NOT NULL AND v_senegal IS NOT NULL THEN
    INSERT INTO MATCH (ID_Sport,ID_EquipeDomicile,ID_EquipeExterieur,DateHeure,ID_External)
    VALUES (1,v_england,v_senegal,'2026-06-15 21:00:00','wc2026-gK-eng-sen')
    ON CONFLICT (ID_External) DO NOTHING;
  END IF;

  IF v_netherlands IS NOT NULL AND v_australia IS NOT NULL THEN
    INSERT INTO MATCH (ID_Sport,ID_EquipeDomicile,ID_EquipeExterieur,DateHeure,ID_External)
    VALUES (1,v_netherlands,v_australia,'2026-06-15 18:00:00','wc2026-gL-ned-aus')
    ON CONFLICT (ID_External) DO NOTHING;
  END IF;

  IF v_belgium IS NOT NULL AND v_poland IS NOT NULL THEN
    INSERT INTO MATCH (ID_Sport,ID_EquipeDomicile,ID_EquipeExterieur,DateHeure,ID_External)
    VALUES (1,v_belgium,v_poland,'2026-06-16 00:00:00','wc2026-gD-bel-pol')
    ON CONFLICT (ID_External) DO NOTHING;
  END IF;

  RAISE NOTICE 'Seed terminé.';
END $$;
