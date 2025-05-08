const express = require('express');
const axios = require('axios');
const router = express.Router();
const { countries } = require('country-data')

router.get('/', async(req, res, next) => {});

router.get('/search', async(req, res) => {
    const query = req.query.q; // Pobierz zapytanie z parametrów URL
    if (!query) {
        return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
            params: {
                q: query,
                format: 'json',
                addressdetails: 1 // Dodano, aby uzyskać szczegóły adresu
            }
        });

        // Przekształć dane, aby zawierały tylko potrzebne informacje
        const results = response.data.map(location => ({
            display_name: location.display_name,
            lat: location.lat,
            lon: location.lon,
            country: location.address && location.address.country ? location.address.country : null, // Nazwa kraju
            country_code: location.address && location.address.country_code ? location.address.country_code : null, // Kod kraju
        }));
        try {
            const country = countries.all.find(c => c.alpha2 === (results[0].country_code).toUpperCase()); // Znajdź kraj na podstawie kodu
            if (country) {
                const currency = country.currencies[0]; // Pobierz walutę
                results[0].currency = currency; // Dodaj walutę do wyników
            } else {
                results[0].currency = null; // Jeśli kraj nie został znaleziony, ustaw walutę na null
            }
        } catch (error) {
            console.error('Error fetching currency:', error); // Obsługa błędów
            
        }

        res.json(results); // Zwróć przetworzone wyniki
        console.log('OpenStreetMap API response:', results);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data from OpenStreetMap' });
    }
});

router.get('/reverse', async(req, res) => {
    const { lat, lon } = req.query; // Pobierz szerokość i długość geograficzną z parametrów URL
    if (!lat || !lon) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
            params: {
                lat,
                lon,
                format: 'json',
                addressdetails: 1 // Dodano, aby uzyskać szczegóły adresu
            }
        });

        // Przekształć dane, aby zawierały tylko potrzebne informacje
        const result = {
            display_name: response.data.display_name,
            lat: response.data.lat,
            lon: response.data.lon,
            country: response.data.address && response.data.address.country ? response.data.address.country : null, // Nazwa kraju
            country_code: response.data.address && response.data.address.country_code ? response.data.address.country_code : null, // Kod kraju
        };
        try {
            const country = countries.all.find(c => c.alpha2 === (result.country_code).toUpperCase()); // Znajdź kraj na podstawie kodu
            if (country) {
                const currency = country.currencies[0]; // Pobierz walutę
                result.currency = currency; // Dodaj walutę do wyników
            } else {
                result.currency = null; // Jeśli kraj nie został znaleziony, ustaw walutę na null
            }
        } catch (error) {
            console.error('Error fetching currency:', error); // Obsługa błędów
            
        }

        res.json(result); // Zwróć przetworzone wyniki
        console.log('OpenStreetMap API reverse response:', result);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data from OpenStreetMap' });
    }
});

module.exports = {
    routeName: 'openStreetMap',
    path: '/openStreetMap',
    router
};