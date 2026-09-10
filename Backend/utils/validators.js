// Validations pures des entrées utilisateur (testables sans base de données)

// Validation des inputs d'inscription
function validateRegister(name, email, password) {
    if (!name || name.trim().length < 2 || name.trim().length > 50)
        return "Le pseudo doit faire entre 2 et 50 caractères.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 100)
        return "Email invalide.";
    if (!password || password.length < 6 || password.length > 100)
        return "Le mot de passe doit faire entre 6 et 100 caractères.";
    return null;
}

// Nom d'équipe : lettres (accents inclus), chiffres, espaces et ponctuation usuelle — pas de HTML
const TEAM_NAME_REGEX = /^[\p{L}\p{N} .,'’\-()&/]+$/u;
function isValidTeamName(name) {
    return typeof name === 'string'
        && name.trim().length > 0
        && name.trim().length <= 100
        && TEAM_NAME_REGEX.test(name.trim());
}

module.exports = { validateRegister, isValidTeamName };
