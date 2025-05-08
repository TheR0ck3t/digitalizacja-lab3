const express = require('express');
const axios = require('axios');
const router = express.Router();

// NBP API Interaction
router.get('/', async(req, res) => {
    const currency = req.query.currency; // Pobierz walutę z parametrów URL
    try {
        const [resultA, resultB] = await Promise.all([
            axios.get('http://api.nbp.pl/api/exchangerates/tables/A?format=json'),
            axios.get('http://api.nbp.pl/api/exchangerates/tables/B?format=json')
        ]);

        const result = [
            ...resultA.data[0].rates,
            ...resultB.data[0].rates
        ];

        res.json(result);
    } catch (error) {
        console.error('NBP API error:', error);
        res.status(500).json({ error: 'Could not fetch data from NBP API.' });
    }
});

module.exports = {
    routeName: 'nbp',
    path: '/nbp',
    router
};