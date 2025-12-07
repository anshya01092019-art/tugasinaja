document.addEventListener("DOMContentLoaded", () => {
  // ====== NAVBAR TOGGLE (MOBILE) ======
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });

    navLinks.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        navLinks.classList.remove("show");
      }
    });
  }

  // ====== SMOOTH SCROLL UNTUK LINK # ======
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // ====== REVEAL SAAT SCROLL ======
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  // ====== CARD TILT EFFECT (MOUSE) ======
  const tiltCards = document.querySelectorAll(".card-tilt");
  tiltCards.forEach((card) => {
    const rect = () => card.getBoundingClientRect();
    const damp = 18;

    card.addEventListener("mousemove", (e) => {
      const r = rect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const centerX = r.width / 2;
      const centerY = r.height / 2;
      const rotateX = ((y - centerY) / damp) * -1;
      const rotateY = (x - centerX) / damp;

      card.style.transform = `
        perspective(900px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-3px)
      `;
      card.style.boxShadow = "0 18px 40px rgba(0,0,0,0.7)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
      card.style.boxShadow = "";
    });
  });

  // ====== CURSOR GLOW ======
  const glow = document.querySelector(".cursor-glow");
  let glowX = window.innerWidth / 2;
  let glowY = window.innerHeight / 2;

  if (glow) {
    window.addEventListener("mousemove", (e) => {
      glowX = e.clientX;
      glowY = e.clientY;
      glow.style.transform = `translate(${glowX - 110}px, ${glowY - 110}px)`;
    });
  }

  // ====== CANVAS BACKGROUND: PARTIKEL CYBER ANIME ======
  const canvas = document.getElementById("bg-canvas");
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouse = { x: width / 2, y: height / 2 };
  const particles = [];
  const PARTICLE_COUNT = 60;

  class Particle {
    constructor() {
      this.reset(true);
    }
    reset(initial = false) {
      this.x = initial ? Math.random() * width : Math.random() * width;
      this.y = initial ? Math.random() * height : -10;
      this.size = 1 + Math.random() * 2.2;
      this.speedY = 0.3 + Math.random() * 0.6;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.alpha = 0.2 + Math.random() * 0.5;
      this.hue = 210 + Math.random() * 70; // biru-ungu anime
    }
    update() {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const force = Math.min(70 / dist, 0.6);

      // sedikit menjauh dari mouse
      this.x += this.speedX + (dx / dist) * force * 0.1;
      this.y += this.speedY + (dy / dist) * force * 0.1;

      if (this.y > height + 10 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }
    draw(ctx) {
      ctx.beginPath();
      const gradient = ctx.createRadialGradient(
        this.x,
        this.y,
        0,
        this.x,
        this.y,
        this.size * 3
      );
      gradient.addColorStop(0, `hsla(${this.hue}, 80%, 70%, ${this.alpha})`);
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    // background halus
    const grd = ctx.createLinearGradient(0, 0, width, height);
    grd.addColorStop(0, "rgba(10,14,40,0.9)");
    grd.addColorStop(1, "rgba(4,6,20,0.9)");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, height);

    particles.forEach((p) => {
      p.update();
      p.draw(ctx);
    });

    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // ====== FOOTER TAHUN OTOMATIS ======
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // ====== FORM SIMULASI ======
  document.querySelectorAll(".fake-submit").forEach((btn) => {
    btn.addEventListener("click", () => {
      alert(
        "Ini simulasi form untuk tugas PKWU.\nUntuk order asli, silakan chat via WhatsApp."
      );
    });
  });
});
