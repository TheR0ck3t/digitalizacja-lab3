require('dotenv').config();
const express = require('express');
const axios = require('axios');
const router = express.Router();
const apiKey = process.env.WEATHER_API_KEY || 'klucz_api' // https://www.weatherapi.com/ wydaje się ciekawsze niż openweathermap a w free tier jest znacznie lepszy
const apiUrl = 'http://api.weatherapi.com/v1/current.json'; // Adres API


router.get('/', async(req, res, next) => {
    const query = req.query.q; // Pobierz zapytanie z parametrów URL

    if (!query) {
        return res.status(400).json({ error: 'Query parameter "q" is required' });
    }
    try {
        const response = await axios.get(`${apiUrl}?key=${apiKey}&q=${query}&lang=pl`);
        // Przekształć dane, aby zawierały tylko potrzebne informacje
        const results = response.data;
        // Przykład przetwarzania danych
        const processedData = {
            temp_c: results.current.temp_c,
            temp_f: results.current.temp_f,
            condition: results.current.condition.text,
            icon: results.current.condition.icon
        };
        res.json(processedData); // Zwróć przetworzone wyniki
    } catch (error) {
        console.error('Error fetching data from Weather API:', error);
        res.status(500).json({ error: 'Error fetching data from Weather API' });
    }

});



module.exports = {
    routeName: 'weatherApi',
    path: '/weatherApi',
    router
};