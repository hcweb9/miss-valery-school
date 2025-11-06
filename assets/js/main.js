// main.js — smooth scroll with offset + rock-solid scrollspy + menu toggle
document.addEventListener("DOMContentLoaded", () => {
  const navbarToggle = document.getElementById("navbarToggle");
  const navbarLinks = document.getElementById("navbarLinks");
  const nav = document.querySelector(".navbar");
  const startBtn = document.getElementById("startBtn");

  // 1) Expose nav height as CSS var (fallback + resize)
  const setNavHeight = () => {
    if (!nav) return;
    document.documentElement.style.setProperty(
      "--nav-height",
      nav.offsetHeight + "px"
    );
  };
  setNavHeight();
  window.addEventListener("resize", setNavHeight);

  // 2) Mobile menu toggle
  if (navbarToggle && navbarLinks) {
    navbarToggle.addEventListener("click", () => {
      const isOpen = navbarLinks.classList.toggle("active");
      navbarToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // 3) Smooth scroll with manual offset (prevents titles hiding under navbar)
  const anchorLinks = document.querySelectorAll('.navbar__link[href^="#"]');
  const linkByHash = new Map();
  anchorLinks.forEach((link) =>
    linkByHash.set(link.getAttribute("href"), link)
  );

  const smoothScrollTo = (targetEl) => {
    if (!targetEl || !nav) return;
    const yOffset = -nav.offsetHeight;
    const y =
      targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  anchorLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      const target = targetId ? document.querySelector(targetId) : null;
      if (target) {
        e.preventDefault();
        // proactively set active on click (UI feels snappier)
        setActiveLink(targetId.slice(1));
        smoothScrollTo(target);
        // close mobile menu if open
        navbarLinks?.classList.remove("active");
        navbarToggle?.setAttribute("aria-expanded", "false");
        history.pushState(null, "", targetId);
      }
    });
  });

  // ✅ Select both buttons
  const ctaBtn = document.querySelector(".cta .btn--primary");
  const heroBtn = document.querySelector(".hero .btn--secondary");

  function scrollToContact() {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      setActiveLink("contact");
      smoothScrollTo(contactSection);
    }
  }

  // Attach event listeners
  if (ctaBtn) ctaBtn.addEventListener("click", scrollToContact);
  if (heroBtn) heroBtn.addEventListener("click", scrollToContact);

  // 4) “Take a Test” button uses the same offset scroll
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      const test = document.getElementById("test");
      if (test) smoothScrollTo(test);
      alert("📚 Ready to begin your test? Let’s go!");
    });
  }

  // 5) Scrollspy — pick the section whose TOP is closest to the navbar bottom
  const sections = document.querySelectorAll("section[id], header[id]");

  function setActiveLink(id) {
    anchorLinks.forEach((a) => {
      a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
    });
  }

  function updateActiveOnScroll() {
    if (!nav) return;
    const navH = nav.offsetHeight;
    let bestId = null;
    let bestDist = Infinity;

    sections.forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      // skip sections that are fully above the navbar line
      if (rect.bottom <= navH) return;
      const dist = Math.abs(rect.top - navH);
      if (dist < bestDist) {
        bestDist = dist;
        bestId = sec.id;
      }
    });

    if (bestId) setActiveLink(bestId);
  }

  // rAF-throttled scroll handler
  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateActiveOnScroll();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  // initial highlight
  updateActiveOnScroll();

  // 6) Contact form submission via Formspree
const form = document.querySelector(".contact__form");
if (form) {
  const status = document.getElementById("form-status");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // stop redirect
    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        status.textContent = "Thank you! Your message has been sent successfully 💌";
        status.className = "form__status success";
        form.reset(); // clear inputs
      } else {
        status.textContent = "Oops! There was a problem sending your message. Please try again.";
        status.className = "form__status error";
      }
    } catch (error) {
      status.textContent = "Network error — please try again later.";
      status.className = "form__status error";
    }

    // fade out message after a few seconds
    setTimeout(() => {
      status.className = "form__status";
      status.textContent = "";
    }, 5000);
  });
}

// 7) Allow "Enter" key to submit form
if (form) {
  form.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // prevent accidental newlines in textarea
      form.requestSubmit(); // triggers the same async handler above
    }
  });
}


});

