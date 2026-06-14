(function () {
  const THEME_KEY = 'cdabet_theme';
  const LANG_KEY  = 'cdabet_lang';

  let dark = localStorage.getItem(THEME_KEY) === 'dark';
  let lang = localStorage.getItem(LANG_KEY) || 'fr';

  // ── Traductions ────────────────────────────────────────────────────────────
  const T = {
    fr: {
      'nav.leaderboard': 'Leaderboard',
      'nav.logout':      'Déconnexion',
      'nav.back':        'Retour aux pronostics',
      'nav.dashboard':   '🏠 Dashboard',
      'main.title':      'Prochains Matchs',
      'main.past':       'Derniers scores',
      'main.bets':       '📝 Mes Pronostics',
      'main.champ':      'Championnat :',
      'board.title':     '🏆 Classement Général',
      'board.sub':       'Découvrez les meilleurs pronostiqueurs de la plateforme.',
      'board.rank':      'Rang',
      'board.player':    'Joueur',
      'board.points':    'Points',
      'login.title':     'Connexion',
      'login.email':     'Email',
      'login.pwd':       'Mot de passe',
      'login.btn':       'Se connecter',
      'login.switch':    "Pas encore de compte ?",
      'login.switchBtn': "S'inscrire",
      'reg.title':       'Inscription',
      'reg.name':        'Pseudo',
      'reg.email':       'Email',
      'reg.pwd':         'Mot de passe',
      'reg.confirm':     'Confirmer le mot de passe',
      'reg.btn':         "S'inscrire",
      'reg.switch':      'Déjà un compte ?',
      'reg.switchBtn':   'Se connecter',
      'admin.matches':   '⚽ Gestion des Matchs',
      'admin.all':       'Tous',
      'admin.pending':   'En attente',
      'admin.resolved':  'Résolus',
      'admin.sync':      '🔄 Sync TheSportsDB',
      'admin.score':     'Entrer le score',
      'admin.resolve':   '✅ Valider et distribuer les gains',
      'profile.title':   'Mon Profil',
      'profile.avatars': '🎭 Mes Avatars',
      'profile.team':    '⚽ Mon Équipe Favorite',
      'profile.pwd':     '🔒 Changer le mot de passe',
      'profile.save':    'Sauvegarder',
      'status.EN_COURS': 'En cours',
      'status.GAGNE':    'Gagné',
      'status.PERDU':    'Perdu',
      'bet.mise':        'Mise',
      'bet.cote':        'Cote',
    },
    en: {
      'nav.leaderboard': 'Leaderboard',
      'nav.logout':      'Logout',
      'nav.back':        'Back to bets',
      'nav.dashboard':   '🏠 Dashboard',
      'main.title':      'Upcoming Matches',
      'main.past':       'Latest scores',
      'main.bets':       '📝 My Bets',
      'main.champ':      'League:',
      'board.title':     '🏆 Leaderboard',
      'board.sub':       'Discover the best predictors on the platform.',
      'board.rank':      'Rank',
      'board.player':    'Player',
      'board.points':    'Points',
      'login.title':     'Login',
      'login.email':     'Email',
      'login.pwd':       'Password',
      'login.btn':       'Sign in',
      'login.switch':    'No account yet?',
      'login.switchBtn': 'Register',
      'reg.title':       'Register',
      'reg.name':        'Username',
      'reg.email':       'Email',
      'reg.pwd':         'Password',
      'reg.confirm':     'Confirm password',
      'reg.btn':         'Sign up',
      'reg.switch':      'Already have an account?',
      'reg.switchBtn':   'Sign in',
      'admin.matches':   '⚽ Match Management',
      'admin.all':       'All',
      'admin.pending':   'Pending',
      'admin.resolved':  'Resolved',
      'admin.sync':      '🔄 Sync TheSportsDB',
      'admin.score':     'Enter score',
      'admin.resolve':   '✅ Validate and distribute winnings',
      'profile.title':   'My Profile',
      'profile.avatars': '🎭 My Avatars',
      'profile.team':    '⚽ My Favorite Team',
      'profile.pwd':     '🔒 Change password',
      'profile.save':    'Save',
      'status.EN_COURS': 'In progress',
      'status.GAGNE':    'Won',
      'status.PERDU':    'Lost',
      'bet.mise':        'Stake',
      'bet.cote':        'Odds',
    },
  };

  // ── CSS Dark Mode ──────────────────────────────────────────────────────────
  const DARK_CSS = `
html.dark { color-scheme: dark; }
html.dark body {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%) !important;
  color: #e2e8f0;
  --bg-gradient: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}
html.dark [class*="bg-white"] { background-color: #1e293b !important; }
html.dark [class*="bg-white\\/80"] { background-color: rgba(30,41,59,0.85) !important; }
html.dark [class*="bg-gray-50"]:not([class*="bg-gray-500"]) { background-color: #0f172a !important; }
html.dark [class*="bg-gray-100"] { background-color: #1e293b !important; }
html.dark [class*="bg-gray-200"] { background-color: #334155 !important; }
html.dark [class*="text-gray-900"],
html.dark [class*="text-gray-800"] { color: #f1f5f9 !important; }
html.dark [class*="text-gray-700"],
html.dark [class*="text-gray-600"] { color: #cbd5e1 !important; }
html.dark [class*="text-gray-500"] { color: #94a3b8 !important; }
html.dark [class*="text-gray-400"] { color: #64748b !important; }
html.dark [class*="border-gray-100"],
html.dark [class*="border-gray-200"] { border-color: #334155 !important; }
html.dark [class*="divide-gray-50"] > * { border-color: #1e293b !important; }
html.dark [class*="divide-gray-100"] > * { border-color: #334155 !important; }
html.dark input, html.dark select, html.dark textarea {
  background-color: #1e293b !important;
  border-color: #334155 !important;
  color: #f1f5f9 !important;
}
html.dark [class*="bg-yellow-100"] { background-color: #1c1207 !important; }
html.dark [class*="text-yellow-700"] { color: #fbbf24 !important; }
html.dark [class*="bg-green-100"],
html.dark [class*="bg-green-50"] { background-color: #052e16 !important; }
html.dark [class*="text-green-700"],
html.dark [class*="text-green-600"] { color: #4ade80 !important; }
html.dark [class*="bg-red-50"],
html.dark [class*="bg-red-100"] { background-color: #1f0707 !important; }
html.dark [class*="text-red-600"],
html.dark [class*="text-red-500"] { color: #f87171 !important; }
html.dark [class*="bg-indigo-50"],
html.dark [class*="bg-indigo-100"] { background-color: #1e1b4b !important; }
html.dark [class*="text-indigo-600"],
html.dark [class*="text-indigo-700"] { color: #818cf8 !important; }
html.dark [class*="bg-blue-50"] { background-color: #0c1a33 !important; }
html.dark [class*="text-blue-"] { color: #60a5fa !important; }
html.dark [class*="shadow"] { box-shadow: 0 4px 24px rgba(0,0,0,0.5) !important; }
/* stylelog.css overrides */
html.dark .container { background: #1e293b !important; box-shadow: 0 20px 40px rgba(0,0,0,0.5) !important; }
html.dark .form-container label { color: #94a3b8 !important; }
html.dark .switch-form { color: #94a3b8 !important; }
html.dark .switch-form a { color: #818cf8 !important; }
/* Modal resolve */
html.dark #resolve-modal > div { background: #1e293b !important; }
  `;

  // ── API publique ──────────────────────────────────────────────────────────
  window.t = function (key) {
    return (T[lang] && T[lang][key]) || (T.fr[key]) || key;
  };
  window.getCurrentLang = function () { return lang; };

  // ── Appliquer les traductions aux éléments data-i18n ─────────────────────
  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key  = el.getAttribute('data-i18n');
      const attr = el.getAttribute('data-i18n-attr');
      const val  = window.t(key);
      if (attr) el.setAttribute(attr, val);
      else el.textContent = val;
    });
    document.documentElement.lang = lang === 'en' ? 'en' : 'fr';
  }

  // ── Appliquer le thème ────────────────────────────────────────────────────
  function applyTheme() {
    document.documentElement.classList.toggle('dark', dark);
    const btn = document.getElementById('_cdabet_dark_btn');
    if (btn) btn.textContent = dark ? '☀️' : '🌙';
  }

  // ── Injecter le CSS dark mode ─────────────────────────────────────────────
  function injectCSS() {
    if (document.getElementById('_cdabet_dark_css')) return;
    const s = document.createElement('style');
    s.id = '_cdabet_dark_css';
    s.textContent = DARK_CSS;
    document.head.appendChild(s);
  }

  // ── Créer le widget flottant ──────────────────────────────────────────────
  function createWidget() {
    if (document.getElementById('_cdabet_widget')) return;

    const wrap = document.createElement('div');
    wrap.id = '_cdabet_widget';
    wrap.style.cssText = [
      'position:fixed', 'bottom:24px', 'right:24px',
      'display:flex', 'gap:8px', 'z-index:99999',
    ].join(';');

    function makeBtn(id, emoji, title, onClick) {
      const b = document.createElement('button');
      b.id = id;
      b.textContent = emoji;
      b.title = title;
      b.style.cssText = [
        'width:42px', 'height:42px', 'border-radius:50%', 'border:none',
        'background:rgba(30,41,59,0.92)', 'color:white', 'font-size:20px',
        'cursor:pointer', 'box-shadow:0 4px 14px rgba(0,0,0,0.35)',
        'transition:transform .15s', 'display:flex',
        'align-items:center', 'justify-content:center',
        'backdrop-filter:blur(6px)',
      ].join(';');
      b.onmouseover = () => { b.style.transform = 'scale(1.12)'; };
      b.onmouseout  = () => { b.style.transform = 'scale(1)'; };
      b.onclick = onClick;
      return b;
    }

    const darkBtn = makeBtn('_cdabet_dark_btn', dark ? '☀️' : '🌙', 'Dark / Light mode', () => {
      dark = !dark;
      localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
      applyTheme();
    });

    const langBtn = makeBtn('_cdabet_lang_btn', lang === 'fr' ? '🇬🇧' : '🇫🇷', 'FR / EN', () => {
      lang = lang === 'fr' ? 'en' : 'fr';
      localStorage.setItem(LANG_KEY, lang);
      langBtn.textContent = lang === 'fr' ? '🇬🇧' : '🇫🇷';
      applyTranslations();
    });

    wrap.appendChild(darkBtn);
    wrap.appendChild(langBtn);
    document.body.appendChild(wrap);
  }

  // ── Init ───────────────────────────────────────────────────────────────────
  function init() {
    injectCSS();
    applyTheme();
    createWidget();
    applyTranslations();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
