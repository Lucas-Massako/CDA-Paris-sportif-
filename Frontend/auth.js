// Configuration de l'URL de ton API (ton container Docker)
const API_URL = "http://localhost:8000";

// --- LOGIQUE D'AFFICHAGE ---
// (Tes fonctions showRegister, showLogin, etc. ne changent pas)
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

// --- LOGIQUE D'INSCRIPTION ---
async function register() {
    clearErrors();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirm = document.getElementById('registerConfirmPassword').value;

    if (password !== confirm) {
        showError('registerConfirmPasswordError', "Les mots de passe ne correspondent pas");
        return;
    }

    try {
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
        alert("Impossible de contacter le serveur.");
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
            // --- LE CHANGEMENT EST ICI ---
            // On sauvegarde le token JWT reçu du serveur
            localStorage.setItem('token', data.token); 
            
            // On stocke le nom pour le dashboard
            document.getElementById('userName').textContent = data.user.name;
            document.getElementById('loginForm').classList.add('hidden');
            document.getElementById('dashboard').classList.remove('hidden');
            document.getElementById('formTitle').textContent = "Dashboard";
        } else {
            showError('loginEmailError', data.message || "Identifiants incorrects");
        }
    } catch (error) {
        alert("Erreur serveur.");
    }
}

function logout() {
    // 1. On supprime le token
    localStorage.removeItem('token');
    
    // 2. Optionnel : On peut aussi supprimer d'autres infos si tu en as stocké
    // localStorage.removeItem('userName'); 

    // 3. On redirige l'affichage vers le formulaire de login
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('formTitle').textContent = "Connexion";

    // 4. Petit message de confirmation en console
    console.log("Token supprimé, utilisateur déconnecté.");
}