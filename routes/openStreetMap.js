const express = require('express');
const axios = require('axios');
const router = express.Router();
const {getCountry} = require('../modules/countriesGraphQL');


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
        // Pobierz walutę dla każdego kraju
        try {
            if (!results[0].country_code || results[0].country_code == null || results[0].country_code === '') {
                results.forEach(result => {
                    result.currency = null; // Ustaw walutę na null, jeśli kod kraju jest pusty
                });
            }
            else {
                const countryData = await getCountry(results[0].country_code); // Pobierz dane kraju
                if (countryData) {
                    const currency = countryData.currency; // Pobierz walutę
                    results.forEach(result => {
                        result.currency = currency; // Dodaj walutę do wyników
                    });
                } else {
                    results.forEach(result => {
                        result.currency = null; // Ustaw walutę na null, jeśli kraj nie został znaleziony
                    });
                } 
            }

        } catch (error) {
            console.error('Error fetching currency:', error); // Obsługa błędów
            results.forEach(result => {
                result.currency = null; // Ustaw walutę na null w przypadku błędu
            });
        }

        res.json(results); // Zwróć przetworzone wyniki
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
        // Pobierz walutę dla kraju
        try {
            if (!result.country_code || result.country_code == null || result.country_code === '') {
                result.currency = null; // Ustaw walutę na null, jeśli kod kraju jest pusty
            }
            else {
                const countryData = await getCountry(result.country_code); // Pobierz dane kraju
                if (countryData) {
                    const currency = countryData.currency; // Pobierz walutę
                    result.currency = currency; // Dodaj walutę do wyników
                } else {
                    result.currency = null; // Ustaw walutę na null, jeśli kraj nie został znaleziony
                } 
            }

        } catch (error) {
            console.error('Error fetching currency:', error); // Obsługa błędów
            result.currency = null; // Ustaw walutę na null w przypadku błędu
        }

        res.json(result); // Zwróć przetworzone wyniki
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data from OpenStreetMap' });
    }
});

module.exports = {
    routeName: 'openStreetMap',
    path: '/openStreetMap',
    router
};