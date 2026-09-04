const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");

const updateHeader = () => {
  header.classList.toggle(
    "scrolled",
    window.scrollY > 28 && !header.classList.contains("menu-active"),
  );
};

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  navigation.classList.toggle("open", !isOpen);
  header.classList.toggle("menu-active", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
  updateHeader();
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle?.setAttribute("aria-expanded", "false");
    navigation.classList.remove("open");
    header.classList.remove("menu-active");
    document.body.classList.remove("menu-open");
    updateHeader();
  });
});

document.querySelectorAll("[data-gallery]").forEach((gallery) => {
  const track = gallery.querySelector("[data-track]");
  const previous = gallery.querySelector("[data-previous]");
  const next = gallery.querySelector("[data-next]");
  const getStep = () =>
    track.querySelector("figure").getBoundingClientRect().width + 15;
  let direction = 1;
  let intervalId;

  const move = (amount) => {
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (
      (amount > 0 && track.scrollLeft >= maxScroll - 8) ||
      (amount < 0 && track.scrollLeft <= 8)
    ) {
      track.scrollTo({ left: amount > 0 ? 0 : maxScroll, behavior: "smooth" });
      return;
    }
    track.scrollBy({ left: amount, behavior: "smooth" });
  };

  previous.addEventListener("click", () => move(-getStep()));
  next.addEventListener("click", () => move(getStep()));
  const startAutoSlide = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    intervalId = window.setInterval(() => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= maxScroll - 8) direction = -1;
      if (track.scrollLeft <= 8) direction = 1;
      move(direction * getStep());
    }, 4200);
  };
  const stopAutoSlide = () => window.clearInterval(intervalId);
  gallery.addEventListener("mouseenter", stopAutoSlide);
  gallery.addEventListener("mouseleave", () => {
    stopAutoSlide();
    startAutoSlide();
  });
  gallery.addEventListener("focusin", stopAutoSlide);
  gallery.addEventListener("focusout", () => {
    stopAutoSlide();
    startAutoSlide();
  });
  startAutoSlide();
});

document.querySelector("#year").textContent = new Date().getFullYear();
