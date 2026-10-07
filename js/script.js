/* Prem Mohan portfolio — vanilla JS, performant, accessible */
(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Loader (extremely short) ---------- */
  const loader = $("#loader");
  function hideLoader() {
    if (!loader) return;
    loader.classList.add("is-done");
    setTimeout(() => loader.remove(), 500);
  }
  if (document.readyState === "complete") setTimeout(hideLoader, 250);
  else {
    window.addEventListener("load", () => setTimeout(hideLoader, 250));
    setTimeout(hideLoader, 1800); // safety
  }

  /* ---------- Theme toggle ---------- */
  const root = document.documentElement;
  const themeToggle = $("#themeToggle");
  try {
    const saved = localStorage.getItem("pm-theme");
    if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);
  } catch (e) { /* private mode */ }
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("pm-theme", next); } catch (e) {}
    });
  }

  /* ---------- Header + scroll progress + back-to-top + timeline progress ---------- */
  const header = $("#siteHeader");
  const progressBar = $("#scrollProgressBar");
  const backToTop = $("#backToTop");
  const timeline = $("#timeline");
  const timelineProgress = $("#timelineProgress");
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 12);

    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, y / max) : 0;
    if (progressBar) progressBar.style.width = (p * 100).toFixed(2) + "%";

    if (backToTop) {
      const show = y > 600;
      if (show) backToTop.hidden = false;
      else backToTop.hidden = true;
    }

    if (timeline && timelineProgress) {
      const r = timeline.getBoundingClientRect();
      const total = r.height;
      const passed = Math.min(Math.max(window.innerHeight * 0.6 - r.top, 0), total);
      timelineProgress.style.height = total > 0 ? ((passed / total) * 100).toFixed(1) + "%" : "0%";
    }
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  if (backToTop) backToTop.addEventListener("click", () => {
    if (prefersReducedMotion) window.scrollTo(0, 0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Mobile menu ---------- */
  const hamburger = $("#hamburger");
  const mobileMenu = $("#mobileMenu");
  function setMenu(open) {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.toggle("is-open", open);
    mobileMenu.classList.toggle("is-open", open);
    hamburger.setAttribute("aria-expanded", String(open));
    hamburger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mobileMenu.setAttribute("aria-hidden", String(!open));
  }
  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      setMenu(!mobileMenu.classList.contains("is-open"));
    });
    $$(".m-link, .mobile-menu .btn", mobileMenu).forEach((a) => {
      a.addEventListener("click", () => setMenu(false));
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setMenu(false);
    });
    document.addEventListener("click", (e) => {
      if (mobileMenu.classList.contains("is-open") &&
          !mobileMenu.contains(e.target) && !hamburger.contains(e.target)) setMenu(false);
    });
  }

  /* ---------- Reveal on scroll (IntersectionObserver) ---------- */
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    let staggerDelay = 0;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Active nav highlighting ---------- */
  const sections = ["home", "about", "expertise", "skills", "experience", "projects", "education", "contact"]
    .map((id) => document.getElementById(id)).filter(Boolean);
  const navLinks = $$(".nav-link");
  function setActive(id) {
    navLinks.forEach((a) => a.classList.toggle("is-active", a.dataset.nav === id));
  }
  if ("IntersectionObserver" in window) {
    const navIO = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) setActive(en.target.id);
      });
    }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });
    sections.forEach((s) => navIO.observe(s));
  }

  /* ---------- Animated counters (real resume numbers only) ---------- */
  const counters = $$(".count");
  function animateCount(el) {
    const target = parseInt(el.dataset.count || "0", 10);
    if (isNaN(target)) return;
    if (prefersReducedMotion) { el.textContent = String(target); return; }
    const dur = 1100;
    const start = performance.now();
    function frame(now) {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  if ("IntersectionObserver" in window) {
    const cIO = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { animateCount(en.target); cIO.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach((c) => cIO.observe(c));
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- Expand / collapse ---------- */
  $$("[data-expand]").forEach((btn) => {
    const target = document.getElementById(btn.getAttribute("data-expand"));
    if (!target) return;
    btn.addEventListener("click", () => {
      const isHidden = target.hasAttribute("hidden");
      if (isHidden) target.removeAttribute("hidden");
      else target.setAttribute("hidden", "");
      btn.setAttribute("aria-expanded", String(isHidden));
      btn.textContent = isHidden ? (btn.dataset.labelOpen || "Show less") : (btn.dataset.labelClosed || (target.id.startsWith("proj") ? "Details" : "Show more"));
      // Re-run scroll calc so timeline progress stays correct
      onScroll();
    });
    // sensible labels
    if (target.id.startsWith("proj")) { btn.dataset.labelClosed = "Details"; btn.dataset.labelOpen = "Hide"; }
    else { btn.dataset.labelClosed = "Show more"; btn.dataset.labelOpen = "Show less"; }
  });

  /* ---------- Copy email ---------- */
  const copyBtn = $("#copyEmailBtn");
  const copyLabel = $("#copyEmailLabel");
  const toast = $("#toast");
  let toastTimer = null;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 2200);
  }
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const email = "premmohan7733@gmail.com";
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(email);
        else {
          const ta = document.createElement("textarea");
          ta.value = email; document.body.appendChild(ta); ta.select();
          document.execCommand("copy"); ta.remove();
        }
        if (copyLabel) copyLabel.textContent = "Copied!";
        showToast("Email copied to clipboard");
        setTimeout(() => { if (copyLabel) copyLabel.textContent = "Copy Email"; }, 2000);
      } catch (e) {
        showToast("Copy failed — email: " + email);
      }
    });
  }

  /* ---------- Footer year ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Subtle custom cursor (desktop, fine pointer only) ---------- */
  const dot = $("#cursorDot");
  const ring = $("#cursorRing");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (finePointer && dot && ring && !prefersReducedMotion) {
    let mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    }, { passive: true });
    (function follow() {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(follow);
    })();
    $$("a, button").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => ring.classList.remove("is-hover"));
    });
  } else {
    if (dot) dot.style.display = "none";
    if (ring) ring.style.display = "none";
  }

  /* ---------- Hero particles (lightweight, low CPU) ---------- */
  const canvas = $("#particles");
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, pts = [], raf = null;
    const COUNT = 42;
    function resize() {
      const r = canvas.parentElement.getBoundingClientRect();
      // Use hero section size
      const hero = canvas.closest(".hero");
      w = canvas.width = hero.offsetWidth;
      h = canvas.height = hero.offsetHeight;
    }
    function init() {
      pts = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.6 + 0.5,
        o: Math.random() * 0.5 + 0.15
      }));
    }
    function tick() {
      ctx.clearRect(0, 0, w, h);
      const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#2dd4bf";
      pts.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.globalAlpha = p.o * 0.7;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      // sparse links
      ctx.strokeStyle = accent;
      ctx.globalAlpha = 0.08;
      ctx.lineWidth = 1;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 120) {
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    }
    function start() {
      resize(); init();
      if (raf) cancelAnimationFrame(raf);
      // pause when tab hidden or hero off-screen
      tick();
    }
    start();
    window.addEventListener("resize", () => { resize(); }, { passive: true });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && raf) cancelAnimationFrame(raf);
      else if (!document.hidden && !prefersReducedMotion) tick();
    });
    // pause when hero not visible (perf)
    if ("IntersectionObserver" in window) {
      const hero = canvas.closest(".hero");
      new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { if (!raf) tick(); }
          else { if (raf) cancelAnimationFrame(raf); raf = null; }
        });
      }).observe(hero);
    }
  } else if (canvas) {
    canvas.style.display = "none";
  }
})();
