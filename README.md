# Digitalizacja - Laboratorium 3

## Opis projektu

Projekt to aplikacja webowa oparta o Node.js i Express, umożliwiająca prezentację danych na mapie oraz integrację z zewnętrznymi API (NBP, pogoda). Wykorzystuje szablony EJS do generowania widoków oraz własne skrypty JS do obsługi mapy i danych po stronie klienta.

## Struktura katalogów

- `public/`
  - `scripts/` – skrypty JS do obsługi mapy i danych NBP po stronie klienta.
  - `styles/` – arkusze CSS (np. stylowanie mapy).
- `routes/` – pliki definiujące trasy Express, obsługujące różne endpointy (NBP, OpenStreetMap, API pogodowe).
- `views/public/` – widoki EJS, np. dla mapy.
- `index.js` – główny plik uruchamiający aplikację.
- `package.json` – zależności projektu.

## Główne funkcjonalności

- Wyświetlanie mapy z wykorzystaniem OpenStreetMap.
- Pobieranie i prezentacja kursów walut z API NBP.
- Pobieranie i prezentacja danych pogodowych.
- Interaktywna prezentacja danych na mapie i w widokach EJS.

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
2. Utwórz plik `.env` z wymaganymi zmiennymi środowiskowymi (patrz poniżej).
3. Uruchom aplikację:
   ```
   npm start
   ```
4. Otwórz przeglądarkę i przejdź pod adres `http://localhost:3000` (lub inny skonfigurowany port).

### Przykładowe zmienne środowiskowe (`.env`)

```
PORT=3000
WEATHER_API_KEY=twój_klucz_api
```

Dostosuj wartości do własnych potrzeb i posiadanych kluczy API.
