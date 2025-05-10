let map;

document.addEventListener('DOMContentLoaded', () => {
    navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        map = L.map('map').setView([lat, lon], 13); // <-- przypisanie do globalnej map
        window.marker = L.marker([lat, lon]).addTo(map);
        window.marker.bindPopup('Twoja lokalizacja').openPopup();
        map.on('click', onMapClick); // Dodaj nasłuchiwacz zdarzeń kliknięcia na mapie
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap',
        }).addTo(map);
    }
    , (error) => {
        map = L.map('map').setView([14.5605166, 121.0764343], 13); // <-- przypisanie do globalnej map
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap',
        }).addTo(map);        
        console.error('Error getting location:', error);
        map.on('click', onMapClick); // Dodaj nasłuchiwacz zdarzeń kliknięcia na mapie
    });
});

document.getElementById('locationForm').addEventListener('submit', async(event) => {
    event.preventDefault();
    if (window.marker) {
        map.removeLayer(window.marker); // Usuń ostatni znacznik, jeśli istnieje
    }
    const locationInput = document.getElementById('locationInput');
    const location = locationInput.value;
    locationInput.value = '';
    try {
        const response = await axios.get('/openStreetMap/search', {
            params: {
                q: location,
            }
        });
        const data = response.data;
        if (data.length === 0) {
            return alert('No results found.');
        }
        const { lat, lon, display_name, currency } = data[0];
        const weatherData = await getWeatherData(location);
        if (!weatherData) {
            return alert('No weather data found.');
        }
        const { temp_c, temp_f, condition, icon } = weatherData; 
        window.marker = L.marker([lat, lon]).addTo(map);
        map.setView([lat, lon], 13);
        window.marker.bindPopup(`Miejsce: ${display_name }, <br> Szer.: ${lat}, Dług: ${lon}<br>Waluta: ${currency}<br>Temperatura: ${temp_c}°C / ${temp_f}°F,<br>Pogoda: ${condition}<br><img src="${icon}" style="width:32px; heigth:32px;">`).openPopup();
        import('./nbp.js').then(module => {
            module.default(currency); // Wywołaj funkcję z pliku nbp.js
        });
    } catch (error) {
        console.error('Error fetching data from OpenStreetMap:', error);
        alert('Could not fetch location data.');
    }
});

async function onMapClick(e) {
    //alert("You clicked the map at " + e.latlng);
    if (window.marker) {
        map.removeLayer(window.marker); // Usuń ostatni znacznik, jeśli istnieje
    }
    try {
        const response = await axios.get('/openStreetMap/reverse', {
            params: {
                lat: e.latlng.lat,
                lon: e.latlng.lng,
            }
        });
        const data = response.data;
        if (data.length === 0) {
            return alert('No results found.');
        }
        const {display_name, lat, lon, currency } = data;
        let location = e.latlng.lat + ',' + e.latlng.lng;
        const weatherData = await getWeatherData(location);
        if (!weatherData) {
            return alert('No weather data found.');
        }
        const { temp_c, temp_f, condition, icon } = weatherData; 
        window.marker = L.marker([lat, lon]).addTo(map);
        map.setView([lat, lon], 13);
        window.marker.bindPopup(`Miejsce: ${display_name }, <br> Szer.: ${lat}, Dług: ${lon}<br>Waluta: ${currency}<br>Temperatura: ${temp_c}°C / ${temp_f}°F, Pogoda: ${condition}<img src="${icon}" style="width:32px; heigth:32px;">`).openPopup();
        import('./nbp.js').then(module => {
            module.default(currency); // Wywołaj funkcję z pliku nbp.js
        });
    }
    catch (error) {
        console.error('Error fetching data from OpenStreetMap:', error);
        alert('Could not fetch location data.');
    }
}

async function getWeatherData(location) {
    if (!location) {
        console.error('Location is not defined');
        return;
    }
    try {
        const response = await axios.get('/weatherApi', {
            params: {
                q: location,
            }
        });
        const weatherData = response.data;
        if (!weatherData) {
            return alert('No weather data found.');
        }
        return weatherData; // Zwróć dane pogodowe
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}