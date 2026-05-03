const track = document.querySelector("[data-gallery-track]");
const prev = document.querySelector("[data-gallery-prev]");
const next = document.querySelector("[data-gallery-next]");
const indexButtons = Array.from(document.querySelectorAll("[data-gallery-target]"));

function galleryCards() {
  return track ? Array.from(track.querySelectorAll(".gallery-card")) : [];
}

function scrollGallery(direction) {
  if (!track) return;
  const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
  const step = track.clientWidth + gap;
  track.scrollBy({ left: direction * step, behavior: "smooth" });
}

function updateGalleryIndex() {
  if (!track || !indexButtons.length) return;
  const cards = galleryCards();
  const current = cards.reduce((nearest, card) => {
    const distance = Math.abs(card.offsetLeft - track.scrollLeft);
    return distance < nearest.distance ? { id: card.id, distance } : nearest;
  }, { id: cards[0]?.id, distance: Infinity });

  indexButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.galleryTarget === current.id);
  });
}

prev?.addEventListener("click", () => scrollGallery(-1));
next?.addEventListener("click", () => scrollGallery(1));

indexButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.galleryTarget);
    target?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  });
});

let scrollFrame = null;
track?.addEventListener("scroll", () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    updateGalleryIndex();
    scrollFrame = null;
  });
});

updateGalleryIndex();
