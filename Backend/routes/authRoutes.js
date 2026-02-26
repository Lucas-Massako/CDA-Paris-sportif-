const express = require('express');
const router = express.Router();

// Cette route correspond à : POST http://localhost:8000/api/auth/register
router.post('/register', (req, res) => {
    // On récupère les données envoyées par ton fichier auth.js (le Frontend)
    const { name, email, password } = req.body;

    console.log("Tentative d'inscription pour :", email);

    // Pour l'instant, on répond juste "OK" pour vérifier que le tuyau marche
    res.status(201).json({ 
        message: "Route d'inscription atteinte !",
        receivedData: { name, email } 
    });
});

module.exports = router;