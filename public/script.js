const header = document.querySelector(".site-header");
const menuToggle = document.querySelector("#menuToggle");
const nav = document.querySelector("#nav");


// =========================
// NAVBAR — SCROLL
// =========================

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

});


// =========================
// MOBILE MENU
// =========================

menuToggle.addEventListener("click", () => {

    const isOpen = menuToggle.classList.toggle("active");

    nav.classList.toggle("active");

    menuToggle.setAttribute(
        "aria-expanded",
        isOpen ? "Zamknij menu" : "Otwórz menu"
    );

});


// =========================
// ZAMKNIĘCIE MENU PO KLIKNIĘCIU
// =========================

document.querySelectorAll(".nav a").forEach((link) => {

    link.addEventListener("click", () => {

        menuToggle.classList.remove("active");

        nav.classList.remove("active");

        menuToggle.setAttribute(
    "aria-label",
    "Otwórz menu"
);

    });

});
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
    (entries, observer) => {

        entries.forEach((entry) => {

            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("visible");

            observer.unobserve(entry.target);

        });

    },
    {
        threshold: 0.15
    }
);


revealElements.forEach((element) => {
    revealObserver.observe(element);
});
// =========================
// FORMULARZ KONTAKTOWY
// =========================

const form = document.querySelector(".contact-form");
const formStatus = document.querySelector(".form-status");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton =
        form.querySelector(".submit-button");

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Reset komunikatu
    formStatus.textContent = "";
    formStatus.className = "form-status";

    // Stan loading
    submitButton.disabled = true;
    submitButton.textContent = "Wysyłanie...";

    try {
        const response = await fetch("/api/contact", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message ||
                "Nie udało się wysłać wiadomości."
            );
        }

        // SUCCESS
        formStatus.textContent = result.message;
        formStatus.classList.add("success");

        form.reset();

    } catch (error) {
        // ERROR
        formStatus.textContent =
            error.message ||
            "Wystąpił nieoczekiwany błąd.";

        formStatus.classList.add("error");

    } finally {
        submitButton.disabled = false;
        submitButton.textContent =
            "Wyślij wiadomość";
    }
});