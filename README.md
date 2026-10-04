# 🍕 Bella Pizza

Responsywna strona internetowa fikcyjnej pizzerii stworzona jako projekt portfolio.

## 🌐 Demo

Live demo: [Bella Pizza](https://bella-pizza-dopu.onrender.com)

## ✨ Funkcje

- responsywny design
- mobilna nawigacja
- animacje podczas przewijania
- formularz kontaktowy
- walidacja danych po stronie serwera
- REST API w Express
- zabezpieczenie formularza przez rate limiting
- wysyłanie wiadomości e-mail przez Resend API

## 🛠 Technologie

- HTML5
- CSS3
- JavaScript
- Node.js
- Express.js
- Resend
- Git / GitHub
- Render

## 🚀 Uruchomienie lokalne

Zainstaluj zależności:

```bash
npm install
```

Uruchom aplikację:

```bash
npm start
```

Aplikacja będzie dostępna pod adresem:

```text
http://localhost:3000
```

## 🔐 Zmienne środowiskowe

Do poprawnego działania formularza kontaktowego utwórz lokalnie plik `.env`:

```env
RESEND_API_KEY=your_resend_api_key
CONTACT_EMAIL=your_email@example.com
```

Plik `.env` zawiera prywatne dane i nie powinien być dodawany do repozytorium.

## 📁 Struktura projektu

```text
bella-pizza/
├── public/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── favicon.svg
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## 📌 Informacja

Bella Pizza jest fikcyjną restauracją stworzoną wyłącznie jako projekt demonstracyjny do portfolio.
