document.addEventListener("DOMContentLoaded", () => {

  // ── CURRENT YEAR (footer copyright) ──
  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }

  // ── MOBILE MENU TOGGLE ──
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const menuClose = document.getElementById("menuClose");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      mobileMenu.classList.add("open");
      hamburger.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    });
  }

  if (menuClose && mobileMenu) {
    menuClose.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  }

  // Close mobile menu when a nav link is clicked
  if (mobileMenu) {
    mobileMenu.addEventListener("click", (event) => {
      if (
        event.target instanceof HTMLElement &&
        event.target.closest("a")
      ) {
        mobileMenu.classList.remove("open");
        if (hamburger) hamburger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });
  }

  // ── STICKY NAV SHADOW ON SCROLL ──
  const nav = document.querySelector(".nav");
  if (nav) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 10) {
        nav.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
      } else {
        nav.style.boxShadow = "0 1px 2px rgba(0,0,0,0.05)";
      }
    });
  }

  // ── CART COUNTER ──
  const cartBadge = document.querySelector(".cart-badge");
  let cartCount = cartBadge ? parseInt(cartBadge.textContent) : 0;

  function updateCartBadge() {
    if (cartBadge) {
      cartBadge.textContent = String(cartCount);
    }
  }

  // ── ADD TO CART BUTTONS ──
  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      cartCount++;
      updateCartBadge();

      this.textContent = "Added!";
      this.style.background = "#0D9488";

      setTimeout(() => {
        this.textContent = "Add to Cart";
        this.style.background = "";
      }, 1500);
    });
  });

  // ── WISHLIST TOGGLE ──
  document.querySelectorAll(".wishlist-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const svg = this.querySelector("svg");
      if (!svg) return;
      const isActive = svg.getAttribute("fill") === "#14B8A6";
      svg.setAttribute("fill", isActive ? "none" : "#14B8A6");
      svg.setAttribute("stroke", isActive ? "currentColor" : "#14B8A6");
    });
  });

  // ── NEWSLETTER FORM ──
  const newsletterForm = document.querySelector(".newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = newsletterForm.querySelector(".newsletter-input");
      const btn = newsletterForm.querySelector(".btn-subscribe");

      if (input instanceof HTMLInputElement) {
        const email = input.value.trim();
        if (email) {
          console.info(`Newsletter subscription for: ${email}`);
          if (btn) {
            btn.textContent = "Subscribed! ✓";
            btn.style.background = "#0D9488";
          }
          input.value = "";
        }
      }
    });
  }

  // ── SCROLL FADE-UP ANIMATIONS ──
  const fadeEls = document.querySelectorAll(".fade-up");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animationPlayState = "running";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    fadeEls.forEach((el) => {
      el.style.animationPlayState = "paused";
      observer.observe(el);
    });
  } else {
    // Fallback: just show all elements
    fadeEls.forEach((el) => {
      el.style.animationPlayState = "running";
    });
  }

});