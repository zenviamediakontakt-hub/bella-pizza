require("dotenv").config();

const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3000;
app.set("trust proxy", 1);

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,

    family: 4,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// =========================
// MIDDLEWARE
// =========================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// =========================
// FRONTEND
// =========================

app.use(express.static(path.join(__dirname, "public")));

    const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,

    standardHeaders: true,
    legacyHeaders: false,

    message: {
        success: false,
        message: "Wysłano zbyt wiele wiadomości. Spróbuj ponownie później."
    }
});
// =========================
// CONTACT API
// =========================

app.post("/api/contact", contactLimiter, async (req, res) => {
    let { name, email, message } = req.body;


    // Sprawdzamy typ danych
    if (
        typeof name !== "string" ||
        typeof email !== "string" ||
        typeof message !== "string"
    ) {
        return res.status(400).json({
            success: false,
            message: "Nieprawidłowe dane formularza."
        });
    }


    // Usuwamy zbędne spacje
    name = name.trim();
    email = email.trim();
    message = message.trim();


    // Sprawdzamy puste pola
    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: "Wypełnij wszystkie pola."
        });
    }


    // Walidacja imienia
    if (name.length < 2 || name.length > 50) {
        return res.status(400).json({
            success: false,
            message: "Imię musi mieć od 2 do 50 znaków."
        });
    }


    // Walidacja e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Podaj poprawny adres e-mail."
        });
    }


    // Walidacja wiadomości
    if (message.length < 10) {
        return res.status(400).json({
            success: false,
            message: "Wiadomość musi mieć minimum 10 znaków."
        });
    }

    if (message.length > 2000) {
        return res.status(400).json({
            success: false,
            message: "Wiadomość jest zbyt długa."
        });
    }


    // Na razie wyświetlamy wiadomość w terminalu
    console.log("NOWA WIADOMOŚĆ:");
    console.log({
        name,
        email,
        message
    });


    // Odpowiedź do frontendu
    return res.status(200).json({
        success: true,
        message: "Dziękujemy! Wiadomość została wysłana."
    });
});


// =========================
// START SERWERA
// =========================

transporter.verify()
    .then(() => {
        console.log("Połączenie z Gmail działa!");
    })
    .catch((error) => {
        console.error("Błąd Gmail:", error);
    });
app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});