require("dotenv").config();

const express = require("express");
const path = require("path");
const rateLimit = require("express-rate-limit");
const { Resend } = require("resend");

const app = express();
const PORT = process.env.PORT || 3000;


// =========================
// CONFIG
// =========================

app.set("trust proxy", 1);

const resend = new Resend(process.env.RESEND_API_KEY);


// =========================
// MIDDLEWARE
// =========================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// =========================
// FRONTEND
// =========================

app.use(express.static(path.join(__dirname, "public")));


// =========================
// RATE LIMIT
// =========================

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


    // =========================
    // WALIDACJA
    // =========================

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


    name = name.trim();
    email = email.trim();
    message = message.trim();


    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: "Wypełnij wszystkie pola."
        });
    }


    if (name.length < 2 || name.length > 50) {
        return res.status(400).json({
            success: false,
            message: "Imię musi mieć od 2 do 50 znaków."
        });
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Podaj poprawny adres e-mail."
        });
    }


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


    // =========================
    // RESEND
    // =========================

    try {

        const { data, error } = await resend.emails.send({

            from: "Bella Pizza <onboarding@resend.dev>",

            to: [process.env.CONTACT_EMAIL],

            replyTo: email,

            subject: `Bella Pizza - wiadomość od ${name}`,

            text: `
Nowa wiadomość z formularza Bella Pizza

Imię: ${name}
E-mail: ${email}

Wiadomość:
${message}
            `
        });


        if (error) {

            console.error("Błąd Resend:", error);

            return res.status(500).json({
                success: false,
                message: "Nie udało się wysłać wiadomości."
            });
        }


        console.log("Wiadomość wysłana:", data.id);


        return res.status(200).json({
            success: true,
            message: "Dziękujemy! Wiadomość została wysłana."
        });


    } catch (error) {

        console.error("Błąd wysyłania:", error);

        return res.status(500).json({
            success: false,
            message: "Nie udało się wysłać wiadomości."
        });
    }
});


// =========================
// START SERWERA
// =========================

app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});