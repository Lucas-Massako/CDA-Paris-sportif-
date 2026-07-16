const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.author = 'Lucas Massako';
pres.title = 'CDA Bet — Présentation Epitech';

const C = {
  dark:     '0F172A',
  navy:     '1A2B5E',
  blue:     '2563EB',
  blueL:    '60A5FA',
  green:    '22C55E',
  greenDk:  '16A34A',
  white:    'FFFFFF',
  light:    'F8FAFC',
  lightGr:  'E2E8F0',
  textDk:   '1E293B',
  textMut:  '64748B',
  codeBg:   '1E293B',
  codeFg:   'CBD5E1',
  codeKw:   '93C5FD',
  codeFn:   '86EFAC',
  codeStr:  'FCD34D',
  codeCm:   '475569',
};

const makeShadow = () => ({
  type: "outer", color: "000000", blur: 8, offset: 3, angle: 45, opacity: 0.14
});

// ======================================================
// SLIDE 1 — TITRE
// ======================================================
{
  const s = pres.addSlide();
  s.background = { color: C.dark };

  // Top stripe
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.07,
    fill: { color: C.green }, line: { color: C.green }
  });

  // Main title
  s.addText('CDA BET', {
    x: 0.8, y: 1.1, w: 7, h: 1.5,
    fontSize: 80, bold: true, color: C.white, fontFace: 'Calibri',
    align: 'left', margin: 0
  });

  // Separator line
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 2.65, w: 3.2, h: 0.06,
    fill: { color: C.green }, line: { color: C.green }
  });

  // Subtitle
  s.addText('Application de Pronostics Sportifs Fullstack', {
    x: 0.8, y: 2.8, w: 7.5, h: 0.5,
    fontSize: 18, color: '94A3B8', fontFace: 'Calibri', align: 'left', margin: 0
  });

  // Author info
  s.addText([
    { text: 'Lucas Massako', options: { bold: true, breakLine: true } },
    { text: 'Titre RNCP Niveau 6 — Concepteur Développeur d\'Applications', options: { breakLine: true } },
    { text: 'Epitech · Promotion 2026', options: {} }
  ], {
    x: 0.8, y: 3.5, w: 6.5, h: 1.5,
    fontSize: 13, color: '64748B', fontFace: 'Calibri', align: 'left', margin: 0
  });

  // Football circle decoration
  s.addShape(pres.shapes.OVAL, {
    x: 7.6, y: 1.0, w: 2.1, h: 2.1,
    fill: { color: C.green, transparency: 88 },
    line: { color: C.green, width: 1.5 }
  });
  s.addText('⚽', {
    x: 7.6, y: 1.3, w: 2.1, h: 1.5,
    fontSize: 58, align: 'center', valign: 'middle', margin: 0
  });

  // Tech tags
  const tags = ['Node.js', 'PostgreSQL', 'Docker', 'JWT'];
  tags.forEach((tag, i) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.8 + i * 1.55, y: 4.85, w: 1.35, h: 0.38,
      fill: { color: '1E293B' }, line: { color: C.blue }, rectRadius: 0.08
    });
    s.addText(tag, {
      x: 0.8 + i * 1.55, y: 4.85, w: 1.35, h: 0.38,
      fontSize: 10, color: C.blueL, bold: true, fontFace: 'Calibri',
      align: 'center', valign: 'middle', margin: 0
    });
  });

  s.addNotes('Se présenter. Présenter CDA Bet. Poser la problématique centrale : comment construire une app de pronostics sans maintenir une base de données sportive complète ?');
}

// ======================================================
// SLIDE 2 — INTRO & PROBLÉMATIQUE
// ======================================================
{
  const s = pres.addSlide();
  s.background = { color: C.light };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.72,
    fill: { color: C.navy }, line: { color: C.navy }
  });
  s.addText('Introduction & Problématique', {
    x: 0.4, y: 0, w: 8.8, h: 0.72,
    fontSize: 21, bold: true, color: C.white, fontFace: 'Calibri',
    align: 'left', valign: 'middle', margin: 0
  });
  s.addText('01', {
    x: 9.1, y: 0, w: 0.7, h: 0.72,
    fontSize: 13, color: C.green, bold: true, fontFace: 'Calibri',
    align: 'right', valign: 'middle', margin: 0
  });

  // Left card — Problème
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.4, y: 0.95, w: 4.3, h: 4.2,
    fill: { color: C.white }, line: { color: C.lightGr }, rectRadius: 0.12,
    shadow: makeShadow()
  });
  s.addText('PROBLÈME', {
    x: 0.7, y: 1.1, w: 3.7, h: 0.32,
    fontSize: 9, bold: true, color: C.blue, fontFace: 'Calibri',
    charSpacing: 3, margin: 0
  });
  s.addText([
    { text: 'Parier entre amis sur les matchs', options: { bullet: true, breakLine: true } },
    { text: 'Sans argent réel — système de points', options: { bullet: true, breakLine: true } },
    { text: 'Données sportives temps réel indispensables', options: { bullet: true, breakLine: true } },
    { text: 'Maintenir une BDD sportive = énorme coût', options: { bullet: true, breakLine: true } },
    { text: 'Comment agréger les données sans tout stocker ?', options: { bullet: true } }
  ], {
    x: 0.7, y: 1.5, w: 3.8, h: 3.4,
    fontSize: 13, color: C.textDk, fontFace: 'Calibri', margin: 0
  });

  // Right card — Solution
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 5.3, y: 0.95, w: 4.3, h: 4.2,
    fill: { color: C.navy }, line: { color: C.navy }, rectRadius: 0.12,
    shadow: makeShadow()
  });
  s.addText('SOLUTION', {
    x: 5.6, y: 1.1, w: 3.7, h: 0.32,
    fontSize: 9, bold: true, color: C.green, fontFace: 'Calibri',
    charSpacing: 3, margin: 0
  });
  s.addText([
    { text: 'Architecture Hybride', options: { bullet: true, breakLine: true } },
    { text: 'API propriétaire → logique métier + BDD', options: { bullet: true, breakLine: true } },
    { text: 'The Odds API → cotes bookmakers', options: { bullet: true, breakLine: true } },
    { text: 'TheSportsDB → résultats & classements', options: { bullet: true, breakLine: true } },
    { text: 'Promise.all() → fusion côté client', options: { bullet: true } }
  ], {
    x: 5.6, y: 1.5, w: 3.8, h: 3.4,
    fontSize: 13, color: C.white, fontFace: 'Calibri', margin: 0
  });

  s.addNotes('Insister sur la solution hybride : notre API = sécurité + données utilisateur. Les APIs tierces = données sportives. Zéro duplication inutile.');
}

// ======================================================
// SLIDE 3 — STACK TECHNIQUE
// ======================================================
{
  const s = pres.addSlide();
  s.background = { color: C.light };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.72,
    fill: { color: C.navy }, line: { color: C.navy }
  });
  s.addText('Stack Technique & Choix d\'Architecture', {
    x: 0.4, y: 0, w: 8.8, h: 0.72,
    fontSize: 21, bold: true, color: C.white, fontFace: 'Calibri',
    align: 'left', valign: 'middle', margin: 0
  });
  s.addText('02', {
    x: 9.1, y: 0, w: 0.7, h: 0.72,
    fontSize: 13, color: C.green, bold: true, fontFace: 'Calibri',
    align: 'right', valign: 'middle', margin: 0
  });

  const cards = [
    { emoji: '🌐', label: 'Frontend',      tech: 'Vanilla JS\nTailwindCSS · HTML5',                 color: C.blue    },
    { emoji: '⚙️', label: 'Backend',       tech: 'Node.js / Express.js\nAPI REST',                   color: '7C3AED'  },
    { emoji: '🗄️', label: 'Base de Données',tech: 'PostgreSQL 15\n9 tables · Contraintes ACID',      color: C.greenDk },
    { emoji: '🔐', label: 'Sécurité',      tech: 'JWT Tokens · bcrypt\nRate Limiting',               color: 'DC2626'  },
    { emoji: '🐳', label: 'Infrastructure', tech: 'Docker + docker-compose\n3 services orchestrés',   color: '0891B2'  },
    { emoji: '🌍', label: 'APIs Externes', tech: 'The Odds API\nTheSportsDB · Promise.all()',         color: 'D97706'  },
  ];

  const cW = 2.92, cH = 1.75;
  const sX = 0.42, gap = 0.16;
  const rows = [1.0, 2.9];

  cards.forEach((card, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = sX + col * (cW + gap);
    const y = rows[row];

    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y, w: cW, h: cH,
      fill: { color: C.white }, line: { color: C.lightGr }, rectRadius: 0.1,
      shadow: makeShadow()
    });
    // Icon circle
    s.addShape(pres.shapes.OVAL, {
      x: x + 0.18, y: y + 0.18, w: 0.5, h: 0.5,
      fill: { color: card.color }, line: { color: card.color }
    });
    s.addText(card.emoji, {
      x: x + 0.18, y: y + 0.18, w: 0.5, h: 0.5,
      fontSize: 18, align: 'center', valign: 'middle', margin: 0
    });
    s.addText(card.label, {
      x: x + 0.78, y: y + 0.18, w: cW - 0.95, h: 0.5,
      fontSize: 12, bold: true, color: C.textDk, fontFace: 'Calibri',
      valign: 'middle', margin: 0
    });
    s.addText(card.tech, {
      x: x + 0.18, y: y + 0.82, w: cW - 0.36, h: 0.82,
      fontSize: 11, color: C.textMut, fontFace: 'Calibri', margin: 0
    });
  });

  s.addNotes('Justifier les choix : Vanilla JS = maîtriser le DOM sans abstraction. PostgreSQL = données relationnelles fortes. Docker = reproductibilité totale. bcrypt = standard hachage.');
}

// ======================================================
// SLIDE 4 — ARCHITECTURE BDD
// ======================================================
{
  const s = pres.addSlide();
  s.background = { color: C.light };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.72,
    fill: { color: C.navy }, line: { color: C.navy }
  });
  s.addText('Architecture BDD — Modélisation Relationnelle', {
    x: 0.4, y: 0, w: 8.8, h: 0.72,
    fontSize: 21, bold: true, color: C.white, fontFace: 'Calibri',
    align: 'left', valign: 'middle', margin: 0
  });
  s.addText('03', {
    x: 9.1, y: 0, w: 0.7, h: 0.72,
    fontSize: 13, color: C.green, bold: true, fontFace: 'Calibri',
    align: 'right', valign: 'middle', margin: 0
  });

  // Left — table list
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.4, y: 0.9, w: 3.85, h: 4.3,
    fill: { color: C.white }, line: { color: C.lightGr }, rectRadius: 0.1,
    shadow: makeShadow()
  });
  s.addText('9 TABLES', {
    x: 0.68, y: 1.05, w: 3.3, h: 0.32,
    fontSize: 9, bold: true, color: C.blue, fontFace: 'Calibri',
    charSpacing: 3, margin: 0
  });
  const tables = ['UTILISATEUR', 'MATCH', 'EQUIPE', 'SPORT', 'PARII ★', 'PREFERENCE', 'ASSIDUITE', 'STATUT_FOOTIX', 'FAIT_HISTORIQUE'];
  tables.forEach((t, i) => {
    const rowY = 1.46 + i * 0.34;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.62, y: rowY, w: 3.38, h: 0.3,
      fill: { color: i % 2 === 0 ? 'F1F5F9' : C.white },
      line: { color: 'E5E7EB' }, rectRadius: 0.04
    });
    s.addText(t, {
      x: 0.75, y: rowY + 0.02, w: 3.12, h: 0.26,
      fontSize: 10, color: t.includes('★') ? C.blue : C.textDk,
      bold: t.includes('★'), fontFace: 'Courier New', margin: 0
    });
  });

  // Right — code block
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 4.55, y: 0.9, w: 5.05, h: 4.3,
    fill: { color: C.codeBg }, line: { color: '334155' }, rectRadius: 0.1,
    shadow: makeShadow()
  });
  s.addText('CONTRAINTES CLÉS — init-db.sql', {
    x: 4.8, y: 1.05, w: 4.55, h: 0.3,
    fontSize: 9, bold: true, color: C.green, fontFace: 'Calibri',
    charSpacing: 2, margin: 0
  });

  s.addText([
    { text: 'CREATE TABLE', options: { color: C.codeKw } },
    { text: ' PARII (\n', options: { color: C.codeFg } },
    { text: '  ID_User   INTEGER ', options: { color: C.codeFg } },
    { text: 'NOT NULL', options: { color: C.codeKw } },
    { text: ',\n', options: { color: C.codeFg } },
    { text: '  ID_Match  INTEGER ', options: { color: C.codeFg } },
    { text: 'NOT NULL', options: { color: C.codeKw } },
    { text: ',\n', options: { color: C.codeFg } },
    { text: '  Pronostic ', options: { color: C.codeFg } },
    { text: 'INT', options: { color: C.codeKw } },
    { text: ' NOT NULL\n', options: { color: C.codeFg } },
    { text: '    CHECK', options: { color: C.codeKw } },
    { text: ' (Pronostic ', options: { color: C.codeFg } },
    { text: 'IN', options: { color: C.codeKw } },
    { text: ' (0,1,2)),\n', options: { color: C.codeStr } },
    { text: '  Mise      ', options: { color: C.codeFg } },
    { text: 'INT', options: { color: C.codeKw } },
    { text: ' CHECK (Mise > 0),\n', options: { color: C.codeFg } },
    { text: '  Statut    ', options: { color: C.codeFg } },
    { text: 'VARCHAR', options: { color: C.codeKw } },
    { text: '\n    CHECK (Statut ', options: { color: C.codeFg } },
    { text: 'IN', options: { color: C.codeKw } },
    { text: '\n', options: { color: C.codeFg } },
    { text: "      ('EN_COURS','GAGNE','PERDU')),\n", options: { color: C.codeStr } },
    { text: '\n  -- ', options: { color: C.codeCm } },
    { text: 'Un seul pari par match par joueur !\n', options: { color: C.codeCm, italic: true } },
    { text: '  PRIMARY KEY', options: { color: C.codeKw, bold: true } },
    { text: ' (ID_User, ID_Match)\n', options: { color: C.codeStr, bold: true } },
    { text: ');\n', options: { color: C.codeFg } },
    { text: '\n-- 2 vues SQL utiles\n', options: { color: C.codeCm, italic: true } },
    { text: 'CREATE VIEW', options: { color: C.codeKw } },
    { text: ' v_classement_hebdo ...\n', options: { color: C.codeFg } },
    { text: 'CREATE VIEW', options: { color: C.codeKw } },
    { text: ' v_assiduite_utilisateur ...', options: { color: C.codeFg } },
  ], {
    x: 4.8, y: 1.42, w: 4.55, h: 3.6,
    fontSize: 9.5, fontFace: 'Courier New', margin: 0, valign: 'top'
  });

  s.addNotes('Insister : PRIMARY KEY composite = doublon impossible au niveau BDD même si le code a un bug. Les CHECKs sont des règles métier inscrites dans le schéma SQL, pas juste dans le code applicatif.');
}

// ======================================================
// SLIDE 5 — CODE : TRANSACTION PARI
// ======================================================
{
  const s = pres.addSlide();
  s.background = { color: C.dark };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.72,
    fill: { color: C.blue }, line: { color: C.blue }
  });
  s.addText('Logique Métier — Transaction Atomique  (betController.js)', {
    x: 0.4, y: 0, w: 8.8, h: 0.72,
    fontSize: 19, bold: true, color: C.white, fontFace: 'Calibri',
    align: 'left', valign: 'middle', margin: 0
  });
  s.addText('04', {
    x: 9.1, y: 0, w: 0.7, h: 0.72,
    fontSize: 13, color: C.green, bold: true, fontFace: 'Calibri',
    align: 'right', valign: 'middle', margin: 0
  });

  // Code block
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.4, y: 0.88, w: 6.0, h: 4.42,
    fill: { color: C.codeBg }, line: { color: '334155' }, rectRadius: 0.1
  });

  s.addText([
    { text: '// 1. Ouvrir la transaction\n', options: { color: C.codeCm, italic: true } },
    { text: 'await', options: { color: C.codeKw } },
    { text: ' client.', options: { color: C.codeFg } },
    { text: 'query', options: { color: C.codeFn } },
    { text: "('BEGIN');\n\n", options: { color: C.codeStr } },

    { text: '// 2. Verrouiller la ligne (anti race-condition)\n', options: { color: C.codeCm, italic: true } },
    { text: 'const', options: { color: C.codeKw } },
    { text: ' userRow = ', options: { color: C.codeFg } },
    { text: 'await', options: { color: C.codeKw } },
    { text: ' client.', options: { color: C.codeFg } },
    { text: 'query', options: { color: C.codeFn } },
    { text: '(\n', options: { color: C.codeFg } },
    { text: "  'SELECT bankroll FROM utilisateur\n", options: { color: C.codeStr } },
    { text: "   WHERE id_user = $1 FOR UPDATE'\n", options: { color: C.codeStr } },
    { text: ');\n\n', options: { color: C.codeFg } },

    { text: '// 3. Vérifier le solde\n', options: { color: C.codeCm, italic: true } },
    { text: 'if', options: { color: C.codeKw } },
    { text: ' (bankroll < miseInt) {\n', options: { color: C.codeFg } },
    { text: '  await', options: { color: C.codeKw } },
    { text: ' client.', options: { color: C.codeFg } },
    { text: 'query', options: { color: C.codeFn } },
    { text: "('ROLLBACK');\n", options: { color: C.codeStr } },
    { text: '  return', options: { color: C.codeKw } },
    { text: ' res.', options: { color: C.codeFg } },
    { text: 'status', options: { color: C.codeFn } },
    { text: '(400)', options: { color: 'F9A8D4' } },
    { text: '.json({ message: ', options: { color: C.codeFg } },
    { text: "'Solde insuffisant'" , options: { color: C.codeStr } },
    { text: ' });\n}\n\n', options: { color: C.codeFg } },

    { text: '// 4. Anti-doublon\n', options: { color: C.codeCm, italic: true } },
    { text: 'const', options: { color: C.codeKw } },
    { text: ' dup = ', options: { color: C.codeFg } },
    { text: 'await', options: { color: C.codeKw } },
    { text: ' client.', options: { color: C.codeFg } },
    { text: 'query', options: { color: C.codeFn } },
    { text: '(\n', options: { color: C.codeFg } },
    { text: "  'SELECT 1 FROM parii\n", options: { color: C.codeStr } },
    { text: "   WHERE id_user=$1 AND id_match=$2'\n", options: { color: C.codeStr } },
    { text: ');\n', options: { color: C.codeFg } },
    { text: 'if', options: { color: C.codeKw } },
    { text: ' (dup.rows.length > 0) → ', options: { color: C.codeFg } },
    { text: '409 Conflict\n\n', options: { color: 'F9A8D4' } },

    { text: '// 5. Débiter + Insérer + Valider\n', options: { color: C.codeCm, italic: true } },
    { text: 'await', options: { color: C.codeKw } },
    { text: ' client.', options: { color: C.codeFg } },
    { text: 'query', options: { color: C.codeFn } },
    { text: "('UPDATE utilisateur SET bankroll ...');\n", options: { color: C.codeStr } },
    { text: 'await', options: { color: C.codeKw } },
    { text: ' client.', options: { color: C.codeFg } },
    { text: 'query', options: { color: C.codeFn } },
    { text: "('INSERT INTO parii ...');\n", options: { color: C.codeStr } },
    { text: 'await', options: { color: C.codeKw } },
    { text: ' client.', options: { color: C.codeFg } },
    { text: 'query', options: { color: C.codeFn } },
    { text: "('COMMIT');", options: { color: C.codeStr } },
  ], {
    x: 0.56, y: 0.98, w: 5.7, h: 4.22,
    fontSize: 9.5, fontFace: 'Courier New', margin: 0, valign: 'top'
  });

  // Right — step annotations
  const steps = [
    { n: '1', title: 'BEGIN',        desc: 'Démarre la transaction SQL',                                    c: C.blue    },
    { n: '2', title: 'FOR UPDATE',   desc: 'Verrouille la ligne → 0 race condition si 2 requêtes simultanées', c: C.green   },
    { n: '3', title: 'ROLLBACK',     desc: 'Solde insuffisant → annulation totale de la transaction',       c: 'F59E0B'  },
    { n: '4', title: 'Anti-doublon', desc: 'Un pari max par match. 409 si déjà placé',                      c: 'EF4444'  },
    { n: '5', title: 'COMMIT',       desc: 'Tout OK → persiste atomiquement en BDD',                        c: C.green   },
  ];
  steps.forEach((step, i) => {
    const y = 1.0 + i * 0.84;
    s.addShape(pres.shapes.OVAL, {
      x: 6.7, y: y + 0.06, w: 0.34, h: 0.34,
      fill: { color: step.c }, line: { color: step.c }
    });
    s.addText(step.n, {
      x: 6.7, y: y + 0.06, w: 0.34, h: 0.34,
      fontSize: 10, bold: true, color: C.white, fontFace: 'Calibri',
      align: 'center', valign: 'middle', margin: 0
    });
    s.addText(step.title, {
      x: 7.12, y: y + 0.04, w: 2.65, h: 0.22,
      fontSize: 11, bold: true, color: C.white, fontFace: 'Calibri', margin: 0
    });
    s.addText(step.desc, {
      x: 7.12, y: y + 0.27, w: 2.65, h: 0.52,
      fontSize: 9.5, color: '94A3B8', fontFace: 'Calibri', margin: 0
    });
  });

  s.addNotes('C\'est le cœur technique du projet. La transaction garantit l\'atomicité : tout réussit ou tout échoue. FOR UPDATE est clé — il verrouille la ligne pour éviter qu\'un user parie deux fois simultanément avec le même solde.');
}

// ======================================================
// SLIDE 6 — CODE : JWT MIDDLEWARE
// ======================================================
{
  const s = pres.addSlide();
  s.background = { color: C.dark };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.72,
    fill: { color: C.blue }, line: { color: C.blue }
  });
  s.addText('Sécurité — JWT Middleware & bcrypt  (authMiddleware.js)', {
    x: 0.4, y: 0, w: 8.8, h: 0.72,
    fontSize: 19, bold: true, color: C.white, fontFace: 'Calibri',
    align: 'left', valign: 'middle', margin: 0
  });
  s.addText('05', {
    x: 9.1, y: 0, w: 0.7, h: 0.72,
    fontSize: 13, color: C.green, bold: true, fontFace: 'Calibri',
    align: 'right', valign: 'middle', margin: 0
  });

  // Left — code
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.4, y: 0.88, w: 5.6, h: 2.5,
    fill: { color: C.codeBg }, line: { color: '334155' }, rectRadius: 0.1
  });
  s.addText([
    { text: 'function', options: { color: C.codeKw } },
    { text: ' verifyToken(req, res, ', options: { color: C.codeFg } },
    { text: 'next', options: { color: C.codeFn } },
    { text: ') {\n', options: { color: C.codeFg } },
    { text: "  const", options: { color: C.codeKw } },
    { text: " token = req.headers\n", options: { color: C.codeFg } },
    { text: "    ['authorization']?.", options: { color: C.codeFg } },
    { text: "split", options: { color: C.codeFn } },
    { text: "(' ')[1];\n\n", options: { color: C.codeFg } },
    { text: '  if', options: { color: C.codeKw } },
    { text: ' (!token) ', options: { color: C.codeFg } },
    { text: 'return', options: { color: C.codeKw } },
    { text: ' res.', options: { color: C.codeFg } },
    { text: 'status', options: { color: C.codeFn } },
    { text: '(401)', options: { color: 'F9A8D4' } },
    { text: '.json(...);\n\n', options: { color: C.codeFg } },
    { text: '  jwt.', options: { color: C.codeFg } },
    { text: 'verify', options: { color: C.codeFn } },
    { text: '(token, process.env.', options: { color: C.codeFg } },
    { text: 'JWT_SECRET', options: { color: C.codeStr } },
    { text: ',\n    (err, decoded) => {\n', options: { color: C.codeFg } },
    { text: '      if', options: { color: C.codeKw } },
    { text: ' (err) ', options: { color: C.codeFg } },
    { text: 'return', options: { color: C.codeKw } },
    { text: ' res.', options: { color: C.codeFg } },
    { text: 'status', options: { color: C.codeFn } },
    { text: '(403)', options: { color: 'F9A8D4' } },
    { text: '.json(...);\n', options: { color: C.codeFg } },
    { text: '      req.user', options: { color: C.codeFg } },
    { text: ' = decoded; ', options: { color: C.codeFg } },
    { text: '// injecte dans la requête\n', options: { color: C.codeCm, italic: true } },
    { text: '      next', options: { color: C.codeFn } },
    { text: '();\n  });\n}', options: { color: C.codeFg } },
  ], {
    x: 0.55, y: 0.98, w: 5.3, h: 2.3,
    fontSize: 9.5, fontFace: 'Courier New', margin: 0, valign: 'top'
  });

  // Left bottom — security cards
  const secItems = [
    { title: 'bcrypt', desc: 'Hash côté serveur\njamais en clair en BDD' },
    { title: 'Rate Limit', desc: 'express-rate-limit\nanti brute-force' },
    { title: '.env', desc: 'JWT_SECRET\nhors du code source' },
  ];
  secItems.forEach((item, i) => {
    const x = 0.4 + i * 1.92;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y: 3.56, w: 1.75, h: 1.5,
      fill: { color: '1E293B' }, line: { color: C.blue }, rectRadius: 0.08,
      shadow: makeShadow()
    });
    s.addText(item.title, {
      x: x + 0.12, y: 3.66, w: 1.51, h: 0.32,
      fontSize: 11, bold: true, color: C.green, fontFace: 'Calibri', margin: 0
    });
    s.addText(item.desc, {
      x: x + 0.12, y: 4.02, w: 1.51, h: 0.9,
      fontSize: 10, color: '94A3B8', fontFace: 'Calibri', margin: 0
    });
  });

  // Right — auth flow
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 6.15, y: 0.88, w: 3.45, h: 4.32,
    fill: { color: C.codeBg }, line: { color: '334155' }, rectRadius: 0.1
  });
  s.addText('FLUX AUTHENTIFICATION', {
    x: 6.35, y: 1.0, w: 3.05, h: 0.3,
    fontSize: 9, bold: true, color: C.green, fontFace: 'Calibri',
    charSpacing: 2, margin: 0
  });

  const flow = [
    { n: '1', label: 'POST /api/auth/login',              c: C.blue  },
    { n: '2', label: 'bcrypt.compare(mdp, hash)',         c: C.blue  },
    { n: '3', label: 'jwt.sign() → token JWT',            c: C.green },
    { n: '4', label: 'Stockage localStorage client',      c: '64748B'},
    { n: '5', label: 'Requête protégée + Bearer token',   c: C.blue  },
    { n: '6', label: 'verifyToken() → req.user = data',   c: C.green },
    { n: '7', label: 'Route protégée exécutée ✓',         c: C.green },
  ];
  flow.forEach((item, i) => {
    const y = 1.42 + i * 0.41;
    s.addShape(pres.shapes.OVAL, {
      x: 6.35, y: y, w: 0.27, h: 0.27,
      fill: { color: item.c }, line: { color: item.c }
    });
    s.addText(item.n, {
      x: 6.35, y: y, w: 0.27, h: 0.27,
      fontSize: 8, bold: true, color: C.white, fontFace: 'Calibri',
      align: 'center', valign: 'middle', margin: 0
    });
    s.addText(item.label, {
      x: 6.68, y: y + 0.01, w: 2.78, h: 0.27,
      fontSize: 9.5, color: C.codeFg, fontFace: 'Courier New',
      margin: 0, valign: 'middle'
    });
  });

  s.addNotes('Montrer dans DevTools le header "Authorization: Bearer <token>" en direct pendant la démo. verifyToken est appliqué via app.use() — il protège toutes les routes d\'un bloc.');
}

// ======================================================
// SLIDE 7 — CODE : API HYBRIDE / PROMISE.ALL
// ======================================================
{
  const s = pres.addSlide();
  s.background = { color: C.dark };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.72,
    fill: { color: C.blue }, line: { color: C.blue }
  });
  s.addText('Intégration API Tierces — Architecture Hybride & Promise.all()', {
    x: 0.4, y: 0, w: 8.8, h: 0.72,
    fontSize: 19, bold: true, color: C.white, fontFace: 'Calibri',
    align: 'left', valign: 'middle', margin: 0
  });
  s.addText('06', {
    x: 9.1, y: 0, w: 0.7, h: 0.72,
    fontSize: 13, color: C.green, bold: true, fontFace: 'Calibri',
    align: 'right', valign: 'middle', margin: 0
  });

  // Code block
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.4, y: 0.88, w: 6.0, h: 3.85,
    fill: { color: C.codeBg }, line: { color: '334155' }, rectRadius: 0.1
  });
  s.addText([
    { text: '// Appels en PARALLÈLE — pas de waterfall\n', options: { color: C.codeCm, italic: true } },
    { text: 'const', options: { color: C.codeKw } },
    { text: ' [oddsRes, sportsRes] = ', options: { color: C.codeFg } },
    { text: 'await', options: { color: C.codeKw } },
    { text: ' Promise.', options: { color: C.codeFg } },
    { text: 'all', options: { color: C.codeFn } },
    { text: '([\n', options: { color: C.codeFg } },
    { text: '  fetch', options: { color: C.codeFn } },
    { text: "(THE_ODDS_API_URL),    ", options: { color: C.codeFg } },
    { text: '// cotes bookmakers\n', options: { color: C.codeCm, italic: true } },
    { text: '  fetch', options: { color: C.codeFn } },
    { text: "(THESPORTSDB_URL)       ", options: { color: C.codeFg } },
    { text: '// résultats + classements\n', options: { color: C.codeCm, italic: true } },
    { text: ']);\n\n', options: { color: C.codeFg } },

    { text: 'const', options: { color: C.codeKw } },
    { text: ' oddsData  = ', options: { color: C.codeFg } },
    { text: 'await', options: { color: C.codeKw } },
    { text: ' oddsRes.', options: { color: C.codeFg } },
    { text: 'json', options: { color: C.codeFn } },
    { text: '();\n', options: { color: C.codeFg } },
    { text: 'const', options: { color: C.codeKw } },
    { text: ' sportsData = ', options: { color: C.codeFg } },
    { text: 'await', options: { color: C.codeKw } },
    { text: ' sportsRes.', options: { color: C.codeFg } },
    { text: 'json', options: { color: C.codeFn } },
    { text: '();\n\n', options: { color: C.codeFg } },

    { text: '// Fusion des deux sources côté client\n', options: { color: C.codeCm, italic: true } },
    { text: 'const', options: { color: C.codeKw } },
    { text: ' enrichedMatches = oddsData.', options: { color: C.codeFg } },
    { text: 'map', options: { color: C.codeFn } },
    { text: '(match => ({\n', options: { color: C.codeFg } },
    { text: '  ...match,\n', options: { color: C.codeFg } },
    { text: '  ranking: sportsData.', options: { color: C.codeFg } },
    { text: 'find', options: { color: C.codeFn } },
    { text: '(\n', options: { color: C.codeFg } },
    { text: '    t => t.team === match.home_team\n', options: { color: C.codeFg } },
    { text: '  )\n', options: { color: C.codeFg } },
    { text: '}));\n\n', options: { color: C.codeFg } },
    { text: '// Rendu : filtrage par championnat, cotes cliquables\n', options: { color: C.codeCm, italic: true } },
    { text: 'renderDashboard', options: { color: C.codeFn } },
    { text: '(enrichedMatches);', options: { color: C.codeFg } },
  ], {
    x: 0.56, y: 0.98, w: 5.7, h: 3.65,
    fontSize: 9.5, fontFace: 'Courier New', margin: 0, valign: 'top'
  });

  // Right — 2 API source cards
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 6.6, y: 0.88, w: 3.0, h: 1.75,
    fill: { color: '1E293B' }, line: { color: 'D97706' }, rectRadius: 0.1
  });
  s.addText('THE ODDS API', {
    x: 6.78, y: 1.0, w: 2.64, h: 0.3,
    fontSize: 9, bold: true, color: 'F59E0B', fontFace: 'Calibri',
    charSpacing: 2, margin: 0
  });
  s.addText([
    { text: '✓ Cotes bookmakers (1 / N / 2)\n', options: { breakLine: true } },
    { text: '✓ Prochains matchs programmés\n', options: { breakLine: true } },
    { text: '✗ Classements → absents', options: {} }
  ], {
    x: 6.78, y: 1.38, w: 2.64, h: 1.1,
    fontSize: 10, color: '94A3B8', fontFace: 'Calibri', margin: 0
  });

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 6.6, y: 2.77, w: 3.0, h: 1.75,
    fill: { color: '1E293B' }, line: { color: C.blue }, rectRadius: 0.1
  });
  s.addText('THESPORTSDB', {
    x: 6.78, y: 2.89, w: 2.64, h: 0.3,
    fontSize: 9, bold: true, color: C.blueL, fontFace: 'Calibri',
    charSpacing: 2, margin: 0
  });
  s.addText([
    { text: '✓ Résultats matchs terminés\n', options: { breakLine: true } },
    { text: '✓ Classements championnats\n', options: { breakLine: true } },
    { text: '✗ Cotes → non disponibles', options: {} }
  ], {
    x: 6.78, y: 3.27, w: 2.64, h: 1.1,
    fontSize: 10, color: '94A3B8', fontFace: 'Calibri', margin: 0
  });

  // Bottom insight
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 6.6, y: 4.66, w: 3.0, h: 0.6,
    fill: { color: C.green, transparency: 82 }, line: { color: C.green }, rectRadius: 0.08
  });
  s.addText('Promise.all() → temps divisé par 2\nles 2 appels tournent en parallèle', {
    x: 6.72, y: 4.72, w: 2.76, h: 0.48,
    fontSize: 9.5, bold: true, color: C.white, fontFace: 'Calibri', margin: 0
  });

  s.addNotes('Promise.all() est la clé de performance ici. Sans ça, on attend API 1 PUIS API 2 = double attente. Montrer dans DevTools que les 2 requêtes partent simultanément.');
}

// ======================================================
// SLIDE 8 — DEMO LIVE
// ======================================================
{
  const s = pres.addSlide();
  s.background = { color: C.light };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.72,
    fill: { color: C.greenDk }, line: { color: C.greenDk }
  });
  s.addText('Démo Live — Flux Complet', {
    x: 0.4, y: 0, w: 8.8, h: 0.72,
    fontSize: 21, bold: true, color: C.white, fontFace: 'Calibri',
    align: 'left', valign: 'middle', margin: 0
  });
  s.addText('07', {
    x: 9.1, y: 0, w: 0.7, h: 0.72,
    fontSize: 13, color: C.white, bold: true, fontFace: 'Calibri',
    align: 'right', valign: 'middle', margin: 0
  });

  const demoSteps = [
    { n: '1', title: 'docker-compose up',    desc: 'Démarrage 3 services : API (8000) · BDD (5432) · pgAdmin (5050)', c: '0891B2' },
    { n: '2', title: 'Inscription',          desc: 'POST /api/auth/register → bcrypt → JWT visible dans DevTools',    c: C.blue   },
    { n: '3', title: 'Dashboard',            desc: 'Cotes temps réel · filtrage par championnat',                     c: '7C3AED' },
    { n: '4', title: 'Placer un pari',       desc: 'Bankroll 1000 → X pts · transaction visible dans pgAdmin',        c: C.greenDk},
    { n: '5', title: 'Erreur doublon',       desc: '2e pari sur le même match → 409 "Vous avez déjà parié"',          c: 'DC2626' },
    { n: '6', title: 'Panel Admin',          desc: 'Gestion utilisateurs · résolution des paris terminés',            c: 'D97706' },
  ];

  demoSteps.forEach((step, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.4 + col * 4.85;
    const y = 0.9 + row * 1.55;

    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y, w: 4.55, h: 1.35,
      fill: { color: C.white }, line: { color: C.lightGr }, rectRadius: 0.1,
      shadow: makeShadow()
    });
    s.addShape(pres.shapes.OVAL, {
      x: x + 0.18, y: y + 0.18, w: 0.44, h: 0.44,
      fill: { color: step.c }, line: { color: step.c }
    });
    s.addText(step.n, {
      x: x + 0.18, y: y + 0.18, w: 0.44, h: 0.44,
      fontSize: 13, bold: true, color: C.white, fontFace: 'Calibri',
      align: 'center', valign: 'middle', margin: 0
    });
    s.addText(step.title, {
      x: x + 0.74, y: y + 0.13, w: 3.65, h: 0.35,
      fontSize: 12, bold: true, color: C.textDk, fontFace: 'Calibri', margin: 0
    });
    s.addText(step.desc, {
      x: x + 0.74, y: y + 0.52, w: 3.65, h: 0.7,
      fontSize: 10, color: C.textMut, fontFace: 'Calibri', margin: 0
    });
  });

  s.addNotes('Ouvrir : Terminal (docker up visible), Chrome DevTools (Network → XHR), pgAdmin (localhost:5050). L\'erreur 409 est très percutante — elle prouve que la contrainte BDD agit en dernier rempart.');
}

// ======================================================
// SLIDE 9 — CONCLUSION
// ======================================================
{
  const s = pres.addSlide();
  s.background = { color: C.dark };

  // Bottom stripe
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.55, w: 10, h: 0.075,
    fill: { color: C.green }, line: { color: C.green }
  });

  s.addText('Compétences CDA Démontrées', {
    x: 0.8, y: 0.45, w: 8, h: 0.38,
    fontSize: 12, color: C.green, bold: true, fontFace: 'Calibri',
    charSpacing: 3, margin: 0
  });
  s.addText('CDA BET', {
    x: 0.8, y: 0.82, w: 8.4, h: 1.15,
    fontSize: 64, bold: true, color: C.white, fontFace: 'Calibri', margin: 0
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 1.95, w: 3.0, h: 0.05,
    fill: { color: C.green }, line: { color: C.green }
  });

  const comps = [
    { title: 'Modélisation BDD',  desc: '9 tables, clés composites\nCHECK, INDEX, vues SQL' },
    { title: 'API REST',          desc: 'Express.js, routes protégées\nmiddlewares JWT + Admin' },
    { title: 'Sécurité',          desc: 'JWT, bcrypt, rate-limiting\nvariables d\'environnement' },
    { title: 'Architecture',      desc: 'Docker, API hybride\nPromise.all(), séparation des responsabilités' },
  ];
  comps.forEach((comp, i) => {
    const x = 0.5 + i * 2.26;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y: 2.2, w: 2.12, h: 2.35,
      fill: { color: '1E293B' }, line: { color: C.blue }, rectRadius: 0.1,
      shadow: { type: "outer", color: "000000", blur: 10, offset: 4, angle: 45, opacity: 0.3 }
    });
    s.addText(comp.title, {
      x: x + 0.14, y: 2.3, w: 1.84, h: 0.42,
      fontSize: 11, bold: true, color: C.green, fontFace: 'Calibri', margin: 0
    });
    s.addText(comp.desc, {
      x: x + 0.14, y: 2.78, w: 1.84, h: 1.65,
      fontSize: 10, color: '94A3B8', fontFace: 'Calibri', margin: 0
    });
  });

  s.addText('Axes d\'amélioration', {
    x: 0.8, y: 4.7, w: 8, h: 0.3,
    fontSize: 11, bold: true, color: C.white, fontFace: 'Calibri', margin: 0
  });
  s.addText('Notifications WebSocket · Mode multi-joueurs · Prédictions ML · Tests unitaires Jest', {
    x: 0.8, y: 5.0, w: 8.5, h: 0.35,
    fontSize: 11, color: '475569', fontFace: 'Calibri', margin: 0
  });

  s.addNotes('Récapituler les compétences CDA couvertes. Inviter à poser des questions. Proposer la démo si pas encore faite.');
}

// ======================================================
// GENERATE
// ======================================================
pres.writeFile({ fileName: "CDA_Bet_Epitech.pptx" })
  .then(() => console.log("OK CDA_Bet_Epitech.pptx genere"))
  .catch(err => { console.error(err); process.exit(1); });
