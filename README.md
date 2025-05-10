# Digitalizacja - Laboratorium 3

## Opis projektu

Projekt jest aplikacją webową zbudowaną w Node.js, służącą do prezentacji danych na mapie oraz integracji z zewnętrznymi API (np. NBP, pogoda). Wykorzystuje szablony EJS do generowania widoków oraz własne skrypty JS do obsługi logiki po stronie klienta.

## Struktura katalogów

- `modules/` – moduły pomocnicze, np. obsługa GraphQL dla krajów.
- `public/`
  - `scripts/` – skrypty JS do obsługi mapy i danych NBP po stronie klienta.
  - `styles/` – arkusze CSS (np. stylowanie mapy).
- `routes/` – pliki definiujące trasy Express, obsługujące różne endpointy (NBP, OpenStreetMap, API pogodowe).
- `views/public/` – widoki EJS, np. dla mapy.
- `index.js` – główny plik uruchamiający aplikację Express.
- `package.json` – zależności projektu.

## Główne funkcjonalności

- Wyświetlanie mapy z wykorzystaniem OpenStreetMap.
- Pobieranie i prezentacja danych z API NBP (kursy walut).
- Integracja z API pogodowym.
- Prezentacja danych na mapie oraz w widokach EJS.

## Technologie

- Node.js + Express
- EJS (szablony widoków)
- JavaScript (frontend i backend)
- CSS

## Uruchomienie

1. Zainstaluj zależności:
   ```
   npm install
   ```
2. Utwórz plik `.env` z wymaganymi zmiennymi środowiskowymi (jeśli są wymagane przez API).
3. Uruchom aplikację:
   ```
   npm start
   ```
4. Otwórz przeglądarkę i przejdź pod adres `http://localhost:3000` (lub inny skonfigurowany port).

### Przykładowe zmienne środowiskowe (`.env`)

W pliku `.env` mogą znajdować się m.in.:

```
PORT=3000
WEATHER_API_KEY=twój_klucz_api
```

Dostosuj wartości do własnych potrzeb i posiadanych kluczy API.
