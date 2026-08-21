// =========================================
// USN GLOBAL TRADE
// Main JavaScript
// =========================================


// =========================================
// MOBILE MENU
// =========================================

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");

    if (navLinks.classList.contains("active")) {
        menuToggle.textContent = "✕";
    } else {
        menuToggle.textContent = "☰";
    }
});


// Close mobile menu after clicking a link

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuToggle.textContent = "☰";
    });
});


// =========================================
// FOOTER YEAR
// =========================================

const year = document.getElementById("year");

if (year) {
    year.textContent = new Date().getFullYear();
}


// =========================================
// CONTACT FORM
// =========================================

const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

contactForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const company = document.getElementById("company").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {

        formMessage.textContent =
            "Please fill in your name, email and message.";

        formMessage.style.color = "#c0392b";

        return;
    }


    const subject =
        encodeURIComponent(
            "Business Enquiry - USN GLOBAL TRADE"
        );


    const emailBody =
        encodeURIComponent(
`Hello USN GLOBAL TRADE,

I would like to make a business enquiry.

Name: ${name}
Company: ${company || "Not provided"}
Email: ${email}

Message:
${message}

Regards,
${name}`
        );


    window.location.href =
        `mailto:usnglobaltradepvtltd@gmail.com?subject=${subject}&body=${emailBody}`;


    formMessage.textContent =
        "Opening your email application...";

    formMessage.style.color = "#1f7a4d";

});


// =========================================
// SCROLL REVEAL
// =========================================

const revealElements = document.querySelectorAll(
    ".product-card, .feature, .about-content, .contact-info, .contact-form-wrapper"
);

const revealObserver = new IntersectionObserver(
    (entries, observer) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";

                observer.unobserve(entry.target);
            }

        });

    },
    {
        threshold: 0.12
    }
);


revealElements.forEach(element => {

    element.style.opacity = "0";
    element.style.transform = "translateY(25px)";
    element.style.transition =
        "opacity 0.7s ease, transform 0.7s ease";

    revealObserver.observe(element);

});


// =========================================
// HEADER SHADOW ON SCROLL
// =========================================

const header = document.querySelector(".header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {

        header.style.boxShadow =
            "0 8px 30px rgba(7, 28, 44, 0.08)";

    } else {

        header.style.boxShadow = "none";

    }

});


// =========================================
// ESC KEY CLOSES MOBILE MENU
// =========================================

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        navLinks.classList.remove("active");
        menuToggle.textContent = "☰";

    }

});