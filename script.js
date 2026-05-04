const dayCards = Array.from(document.querySelectorAll(".day-card"));
const filterButtons = Array.from(document.querySelectorAll(".chip"));
const toTopButton = document.querySelector(".to-top");
const passwordForm = document.querySelector("[data-password-form]");
const passwordError = document.querySelector("[data-password-error]");
const PASSWORD_HASH = "40c110f873b68a765841be42dfbec4a52139586c32443a4c6d3838d4d0412def";
const UNLOCK_KEY = "ph-trip-unlocked";
const placeIcons = {
  cafe: "☕",
  flight: "✈️",
  food: "🍜",
  heritage: "🏛️",
  mall: "🛍️",
  market: "🧺",
  park: "🌳",
  photo: "📷",
  stay: "🏨"
};

async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const buffer = await crypto.subtle.digest("SHA-256", bytes);

  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function unlockApp() {
  document.body.classList.remove("app-locked");
  localStorage.setItem(UNLOCK_KEY, "yes");
}

if (localStorage.getItem(UNLOCK_KEY) === "yes") {
  unlockApp();
} else {
  window.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#trip-password")?.focus();
  });
}

passwordForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const input = passwordForm.elements["trip-password"];
  const attemptedPassword = input.value.trim();
  const attemptedHash = await sha256(attemptedPassword);

  if (attemptedHash === PASSWORD_HASH) {
    passwordError.textContent = "";
    input.value = "";
    unlockApp();
    return;
  }

  passwordError.textContent = "Wrong passcode. Try again.";
  input.select();
});

document.querySelectorAll(".place-link").forEach((link) => {
  const type = link.dataset.type;
  const query = link.dataset.query || link.textContent.trim();
  const icon = document.createElement("span");

  icon.className = "type-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = placeIcons[type] || "📍";

  link.prepend(icon);
  link.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", `${link.textContent.trim()} on Google Maps`);
});

function setOpen(card, shouldOpen) {
  const toggle = card.querySelector(".day-toggle");
  card.classList.toggle("is-open", shouldOpen);
  toggle.setAttribute("aria-expanded", String(shouldOpen));
}

dayCards.forEach((card) => {
  const toggle = card.querySelector(".day-toggle");

  toggle.addEventListener("click", () => {
    setOpen(card, !card.classList.contains("is-open"));
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.toggle("active", item === button));

    dayCards.forEach((card) => {
      const tags = card.dataset.tags.split(" ");
      const shouldShow = filter === "all" || tags.includes(filter);
      card.classList.toggle("is-hidden", !shouldShow);

      if (shouldShow && filter !== "all") {
        setOpen(card, true);
      }
    });

    document.querySelector("#timeline").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelector('[data-action="expand-all"]').addEventListener("click", () => {
  dayCards.forEach((card) => {
    if (!card.classList.contains("is-hidden")) {
      setOpen(card, true);
    }
  });
});

document.querySelector('[data-action="collapse-all"]').addEventListener("click", () => {
  dayCards.forEach((card) => setOpen(card, false));
});

document.querySelector('[data-action="lock-app"]').addEventListener("click", () => {
  localStorage.removeItem(UNLOCK_KEY);
  window.location.reload();
});

toTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", () => {
  toTopButton.classList.toggle("is-visible", window.scrollY > 600);
}, { passive: true });

if ("serviceWorker" in navigator && window.location.protocol === "https:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {
      // The itinerary still works normally if offline caching is unavailable.
    });
  });
}
