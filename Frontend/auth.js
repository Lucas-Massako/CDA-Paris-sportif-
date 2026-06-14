const API_URL = "http://localhost:8000";

// --- 1. SÉCURITÉ ET REDIRECTIONS (Le "Check" intelligent) ---
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    
    // On regarde sur quelle page on est actuellement
    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage === 'log.html' || currentPage === '') {
        if (token && userName) {
            window.location.href = "main.html";
        }
    } else if (currentPage === 'main.html' || currentPage === 'board.html' || currentPage === 'profile.html') {
        if (!token || !userName) {
            window.location.href = "log.html";
        } else {
            const userNameDisplay = document.getElementById('userNameDisplay');
            if (userNameDisplay) userNameDisplay.textContent = userName;
        }
    }
});

// --- 2. LOGIQUE D'AFFICHAGE (Uniquement pour log.html) ---
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
    if (el) {
        el.textContent = message;
        el.classList.add('show');
    }
}

function clearErrors() {
    document.querySelectorAll('.error').forEach(el => el.textContent = "");
}

// --- 3. LOGIQUE D'INSCRIPTION ---
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

// --- 4. LOGIQUE DE CONNEXION ---
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
            // SAUVEGARDE EN MÉMOIRE
            localStorage.setItem('token', data.token);
            localStorage.setItem('userName', data.user.name);
            if (data.bonusRecharge > 0) {
                localStorage.setItem('bonusRecharge', data.bonusRecharge);
            }

            // REDIRECTION VERS L'APPLICATION
            window.location.href = "main.html";
        } else {
            showError('loginEmailError', data.message || "Identifiants incorrects");
        }
    } catch (error) {
        alert("Erreur serveur.");
    }
}

// --- 5. LOGIQUE DE DÉCONNEXION ---
function logout() {
    // On supprime le token
    localStorage.removeItem('token');
    localStorage.removeItem('userName'); 

    // On redirige vers le login
    window.location.href = "log.html";
}