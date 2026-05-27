/* ================================================
   PARTICLE NETWORK ANIMATION
   ================================================ */
(function () {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrame;
    let mouse = { x: -1000, y: -1000 };

    const PARTICLE_COUNT = 70;
    const CONNECTION_DIST = 150;
    const MOUSE_RADIUS = 120;
    const PARTICLE_SPEED = 0.3;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = document.documentElement.scrollHeight;
    }

    class Particle {
        constructor() {
            this.reset(true);
        }

        reset(initial) {
            this.x = Math.random() * canvas.width;
            this.y = initial ? Math.random() * canvas.height : canvas.height + 10;
            this.vx = (Math.random() - 0.5) * PARTICLE_SPEED;
            this.vy = -(Math.random() * 0.5 + 0.2);
            this.size = Math.random() * 1.8 + 0.4;
            this.opacity = Math.random() * 0.5 + 0.15;
            this.fromBottom = !initial;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            const dxm = this.x - mouse.x;
            const dym = this.y - mouse.y;
            const distM = Math.sqrt(dxm * dxm + dym * dym);
            if (distM < MOUSE_RADIUS && distM > 0) {
                const force = (MOUSE_RADIUS - distM) / MOUSE_RADIUS;
                this.vx += (dxm / distM) * force * 0.05;
                this.vy += (dym / distM) * force * 0.05;
            }

            this.vx *= 0.999;
            this.vy *= 0.999;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < -20 || this.y > canvas.height + 20) {
                this.reset(false);
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(79, 140, 247, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONNECTION_DIST) {
                    const opacity = (1 - dist / CONNECTION_DIST) * 0.12;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(79, 140, 247, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p) => {
            p.update();
            p.draw();
        });

        drawConnections();
        animFrame = requestAnimationFrame(animate);
    }

    window.addEventListener('mousemove', function (e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('resize', function () {
        resize();
    });

    resize();
    initParticles();
    animate();
})();

/* ================================================
   CURSOR GLOW
   ================================================ */
(function () {
    const glow = document.getElementById('cursor-glow');
    if (!glow) return;

    let timeout;

    document.addEventListener('mousemove', function (e) {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
        glow.style.opacity = '1';

        clearTimeout(timeout);
        timeout = setTimeout(function () {
            glow.style.opacity = '0';
        }, 2000);
    });

    document.addEventListener('mouseleave', function () {
        glow.style.opacity = '0';
    });
})();

/* ================================================
   TYPED TEXT EFFECT
   ================================================ */
(function () {
    const el = document.getElementById('typing-text');
    if (!el) return;

    const titles = [
        'Software Engineer',
        'COMOS Specialist',
        'Full‑Stack Developer',
        'CI/CD Enthusiast',
        'Problem Solver',
    ];

    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 120;

    function type() {
        const current = titles[titleIndex];

        if (isDeleting) {
            el.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 40;
        } else {
            el.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === current.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            typeSpeed = 400;
        }

        setTimeout(type, typeSpeed);
    }

    setTimeout(type, 1000);
})();

/* ================================================
   SCROLL REVEAL (Intersection Observer)
   ================================================ */
(function () {
    const reveals = document.querySelectorAll('.reveal');

    if (!reveals.length) return;

    const observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    reveals.forEach(function (el) {
        observer.observe(el);
    });
})();

/* ================================================
   COUNTER ANIMATION
   ================================================ */
(function () {
    const counters = document.querySelectorAll('.stat-number[data-count]');

    if (!counters.length) return;

    let animated = false;

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-count'), 10);
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(function () {
            step++;
            current += increment;
            if (step >= steps) {
                el.textContent = target + '+';
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current);
            }
        }, duration / steps);
    }

    const counterObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    counters.forEach(animateCounter);
                    counterObserver.disconnect();
                }
            });
        },
        { threshold: 0.5 }
    );

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        counterObserver.observe(statsSection);
    }
})();

/* ================================================
   HEADER SCROLL EFFECT & ACTIVE NAV
   ================================================ */
(function () {
    const header = document.getElementById('header');
    if (!header) return;

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.desktop-nav a');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active nav highlighting
        let currentSection = '';
        sections.forEach(function (section) {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    });
})();

/* ================================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ================================================ */
(function () {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
})();

/* ================================================
   MOBILE NAV TOGGLE
   ================================================ */
(function () {
    var burger = document.getElementById('burger-menu');
    var mobileNav = document.getElementById('mobile-menu-overlay');
    if (!burger || !mobileNav) return;

    burger.addEventListener('click', function () {
        var isActive = mobileNav.classList.contains('active');
        burger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        burger.setAttribute('aria-expanded', !isActive);
        document.body.style.overflow = isActive ? '' : 'hidden';
    });

    document.querySelectorAll('.mobile-menu-link').forEach(function (link) {
        link.addEventListener('click', function () {
            burger.classList.remove('active');
            mobileNav.classList.remove('active');
            burger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
})();

/* ================================================
   DYNAMIC COPYRIGHT YEAR
   ================================================ */
(function () {
    var yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
    var mobileYearEl = document.getElementById('mobile-current-year');
    if (mobileYearEl) {
        mobileYearEl.textContent = new Date().getFullYear();
    }
})();
