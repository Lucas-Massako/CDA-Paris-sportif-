// Règles métier pures du système de paris (testables sans base de données)

// Résultat 1N2 d'un match : 1 = victoire domicile, 2 = victoire extérieur, 0 = nul
function matchOutcome(homeScore, awayScore) {
    if (homeScore > awayScore) return 1;
    if (awayScore > homeScore) return 2;
    return 0;
}

// Gain crédité au joueur : mise × cote, arrondi à l'entier (bankroll typée INT)
function computeGain(mise, cote) {
    return Math.round(mise * parseFloat(cote));
}

module.exports = { matchOutcome, computeGain };
