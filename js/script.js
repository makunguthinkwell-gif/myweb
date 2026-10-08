/* ============================================================
   script.js
   Interactive features for Makungu Thinkwell's ICT251 portfolio.
   Features:
   1. Contact form validation + local preview (compulsory)
   2. Expandable project/skill details
   3. Photo gallery viewer with Previous/Next
   4. Light/Dark theme switch (preference saved in localStorage)
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  initContactForm();
  initExpandableCards();
  initGalleryViewer();
  initThemeToggle();
  initNavToggle();
});

/* ------------------------------------------------------------
   Feature 1 (compulsory): Contact form validation + preview
   Validates name, email and message on submit. Shows inline
   error messages and, when valid, a local summary preview
   using textContent (never innerHTML) for user-entered text.
------------------------------------------------------------ */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const topicInput = document.getElementById("topic");
  const messageInput = document.getElementById("message");
  const preview = document.getElementById("form-preview");

  const nameError = document.getElementById("name-error");
  const emailError = document.getElementById("email-error");
  const messageError = document.getElementById("message-error");

  // Simple, readable email pattern: something@something.something
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // keep submission local

    let isValid = true;

    // Clear previous errors
    [nameError, emailError, messageError].forEach(function (el) {
      el.textContent = "";
    });

    const nameValue = nameInput.value.trim();
    const emailValue = emailInput.value.trim();
    const messageValue = messageInput.value.trim();

    if (nameValue === "") {
      nameError.textContent = "Please enter your name (it cannot be blank or just spaces).";
      isValid = false;
    }

    if (!emailPattern.test(emailValue)) {
      emailError.textContent = "Please enter a valid email address, e.g. name@example.com.";
      isValid = false;
    }

    if (messageValue === "") {
      messageError.textContent = "Please enter a message (it cannot be blank or just spaces).";
      isValid = false;
    }

    if (!isValid) {
      preview.hidden = true;
      return;
    }

    // Build the preview using textContent only, never innerHTML,
    // so entered text is always displayed as plain text.
    preview.innerHTML = ""; // clear previous preview nodes (no user text involved here)

    const heading = document.createElement("h3");
    heading.textContent = "Your message was validated (not sent)";

    const nameP = document.createElement("p");
    nameP.textContent = "Name: " + nameValue;

    const emailP = document.createElement("p");
    emailP.textContent = "Email: " + emailValue;

    const topicP = document.createElement("p");
    topicP.textContent = "Topic: " + topicInput.options[topicInput.selectedIndex].textContent;

    const messageP = document.createElement("p");
    messageP.textContent = "Message: " + messageValue;

    preview.appendChild(heading);
    preview.appendChild(nameP);
    preview.appendChild(emailP);
    preview.appendChild(topicP);
    preview.appendChild(messageP);
    preview.hidden = false;
  });
}

/* ------------------------------------------------------------
   Feature 2: Expandable project/skill cards
   Each card has a button that toggles its details section
   open or closed, and updates aria-expanded + button text.
------------------------------------------------------------ */
function initExpandableCards() {
  const buttons = document.querySelectorAll(".expand-btn");

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      const card = button.closest(".project-card");
      const details = card.querySelector(".project-details");
      const isOpen = !details.hidden;

      details.hidden = isOpen;
      button.setAttribute("aria-expanded", String(!isOpen));
      button.textContent = isOpen ? "Show details" : "Hide details";
    });
  });
}

/* ------------------------------------------------------------
   Feature 3: Photo gallery viewer
   An array holds each photo's path, alt text and caption.
   Previous/Next buttons move through the array and wrap
   around correctly at the first and last photo.
------------------------------------------------------------ */
function initGalleryViewer() {
  const photos = [
    {
      src: "images/image-1.jpg",
      alt: "Photo related to listening to music",
      caption: "Music"
    },
    {
      src: "images/image-2.jpg",
      alt: "Photo related to exploring technology",
      caption: "Exploring Technology"
    },
    {
      src: "images/image-3.jpg",
      alt: "Photo related to reading",
      caption: "Reading"
    }
  ];

  const imageEl = document.getElementById("gallery-image");
  const captionEl = document.getElementById("gallery-caption");
  const counterEl = document.getElementById("gallery-counter");
  const prevBtn = document.getElementById("gallery-prev");
  const nextBtn = document.getElementById("gallery-next");

  if (!imageEl || !prevBtn || !nextBtn) return;

  let currentIndex = 0;

  function showPhoto(index) {
    const photo = photos[index];
    imageEl.src = photo.src;
    imageEl.alt = photo.alt;
    captionEl.textContent = photo.caption;
    counterEl.textContent = "Photo " + (index + 1) + " of " + photos.length;
  }

  prevBtn.addEventListener("click", function () {
    // Wrap to the last photo when moving back from the first
    currentIndex = (currentIndex - 1 + photos.length) % photos.length;
    showPhoto(currentIndex);
  });

  nextBtn.addEventListener("click", function () {
    // Wrap to the first photo when moving forward from the last
    currentIndex = (currentIndex + 1) % photos.length;
    showPhoto(currentIndex);
  });
}

/* ------------------------------------------------------------
   Feature 4: Theme switch (4 modes)
   Cycles the page through four backgrounds: Light, Dark, a photo
   background, and the same photo blurred. The current mode is
   applied as a class on <body>, and the button label always
   shows the NEXT mode the visitor will switch to. The choice is
   remembered in localStorage.
------------------------------------------------------------ */
function initThemeToggle() {
  const toggleBtn = document.getElementById("theme-toggle");
  if (!toggleBtn) return;

  // Order the button cycles through on each click.
  const themes = ["light", "dark", "image", "image-blur"];

  // What the button says while a given theme is active
  // (it names the mode clicking will switch TO).
  const nextLabel = {
    light: "🌙 Dark Mode",
    dark: "🖼️ Photo Background",
    image: "🌫️ Blurred Photo",
    "image-blur": "☀️ Light Mode"
  };

  const themeClasses = ["dark-theme", "image-theme", "image-blur-theme"];

  function applyTheme(theme) {
    document.body.classList.remove(...themeClasses);
    if (theme === "dark") {
      document.body.classList.add("dark-theme");
    } else if (theme === "image") {
      document.body.classList.add("image-theme");
    } else if (theme === "image-blur") {
      document.body.classList.add("image-blur-theme");
    }
    toggleBtn.textContent = nextLabel[theme];
    toggleBtn.setAttribute("aria-label", "Current theme: " + theme + ". Click to change.");
  }

  let currentTheme = localStorage.getItem("preferredTheme") || "light";
  if (!themes.includes(currentTheme)) {
    currentTheme = "light";
  }
  applyTheme(currentTheme);

  toggleBtn.addEventListener("click", function () {
    const currentIndex = themes.indexOf(currentTheme);
    currentTheme = themes[(currentIndex + 1) % themes.length];
    applyTheme(currentTheme);
    localStorage.setItem("preferredTheme", currentTheme);
  });
}

/* ------------------------------------------------------------
   Bonus: Mobile navigation toggle
   Shows/hides the nav links on narrow screens via a menu button.
------------------------------------------------------------ */
function initNavToggle() {
  const navToggle = document.getElementById("nav-toggle");
  const mainNav = document.getElementById("main-nav");
  if (!navToggle || !mainNav) return;

  navToggle.addEventListener("click", function () {
    const isOpen = mainNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}
