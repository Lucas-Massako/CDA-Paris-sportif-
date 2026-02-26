// Configuration de l'URL de ton API (ton container Docker)
const API_URL = "http://localhost:8000";

// --- LOGIQUE D'AFFICHAGE ---

function showRegister() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
    document.getElementById('formTitle').textContent = "Inscription";
}

function showLogin() {
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('formTitle').textContent = "Connexion";
}

function showError(id, message) {
    const el = document.getElementById(id);
    el.textContent = message;
    el.classList.add('show');
}

function clearErrors() {
    document.querySelectorAll('.error').forEach(el => el.textContent = "");
}

// --- LOGIQUE D'INSCRIPTION (Lien avec le Backend) ---

async function register() {
    clearErrors();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirm = document.getElementById('registerConfirmPassword').value;

    // Validation simple côté client
    if (password !== confirm) {
        showError('registerConfirmPasswordError', "Les mots de passe ne correspondent pas");
        return;
    }

    try {
        // C'est ici qu'on appelle ton API Docker !
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Inscription réussie ! Connectez-vous.");
            showLogin();
        } else {
            showError('registerEmailError', data.message || "Erreur lors de l'inscription");
        }
    } catch (error) {
        console.error("Erreur connexion API:", error);
        alert("Impossible de contacter le serveur. Vérifie que Docker tourne !");
    }
}

// --- LOGIQUE DE CONNEXION ---

async function login() {
    clearErrors();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // On stocke le nom pour le dashboard
            document.getElementById('userName').textContent = data.user.name;
            document.getElementById('loginForm').classList.add('hidden');
            document.getElementById('dashboard').classList.remove('hidden');
            document.getElementById('formTitle').textContent = "Dashboard";
        } else {
            showError('loginEmailError', "Identifiants incorrects");
        }
    } catch (error) {
        alert("Erreur serveur.");
    }
}