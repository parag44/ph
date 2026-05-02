const dayCards = Array.from(document.querySelectorAll(".day-card"));
const filterButtons = Array.from(document.querySelectorAll(".chip"));
const toTopButton = document.querySelector(".to-top");
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

toTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", () => {
  toTopButton.classList.toggle("is-visible", window.scrollY > 600);
}, { passive: true });
