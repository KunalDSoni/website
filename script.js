// ============================================
// Particle Background Canvas
// ============================================
class ParticleCanvas {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.particles = [];
        const numParticles = Math.min(80, Math.floor((this.canvas.width * this.canvas.height) / 15000));
        for (let i = 0; i < numParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.1,
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        const particleColor = isDark ? '99, 102, 241' : '99, 102, 241';

        this.particles.forEach((p, i) => {
            // Move particles
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off edges
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

            // Mouse interaction
            if (this.mouse.x !== null) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < this.mouse.radius) {
                    const force = (this.mouse.radius - dist) / this.mouse.radius;
                    p.x += dx * force * 0.02;
                    p.y += dy * force * 0.02;
                }
            }

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${particleColor}, ${p.opacity})`;
            this.ctx.fill();

            // Connect nearby particles
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(${particleColor}, ${0.08 * (1 - dist / 150)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// Cursor Glow Effect
// ============================================
function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow) return;

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateGlow() {
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;
        glow.style.left = glowX + 'px';
        glow.style.top = glowY + 'px';
        requestAnimationFrame(updateGlow);
    }
    updateGlow();
}

// ============================================
// Navigation
// ============================================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        navbar.classList.toggle('scrolled', currentScroll > 50);
        lastScroll = currentScroll;
    });

    // Hamburger toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset + 100;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${id}"]`);
            if (link) {
                link.classList.toggle('active', scrollY >= top && scrollY < top + height);
            }
        });
    });
}

// ============================================
// Theme Toggle
// ============================================
function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });
}

// ============================================
// Scroll Reveal
// ============================================
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

// ============================================
// Stats Counter Animation
// ============================================
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => observer.observe(el));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const prefix = element.getAttribute('data-prefix') || '';
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 2000;
    const start = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        element.textContent = prefix + current + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = prefix + target + suffix;
        }
    }

    requestAnimationFrame(update);
}

// ============================================
// Skill Bars Animation
// ============================================
function initSkillBars() {
    const skillFills = document.querySelectorAll('.skill-fill');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = width + '%';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    skillFills.forEach(el => observer.observe(el));
}

// ============================================
// Testimonials Carousel
// ============================================
function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('carouselDots');
    const cards = track.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    let autoPlayTimer;

    // Create dots
    cards.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.carousel-dot');

    function goTo(index) {
        currentIndex = index;
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === index));
        resetAutoPlay();
    }

    function next() {
        goTo((currentIndex + 1) % cards.length);
    }

    function prev() {
        goTo((currentIndex - 1 + cards.length) % cards.length);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayTimer);
        autoPlayTimer = setInterval(next, 5000);
    }

    nextBtn.addEventListener('click', next);
    prevBtn.addEventListener('click', prev);

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) next();
        else if (touchEndX - touchStartX > 50) prev();
    }, { passive: true });

    resetAutoPlay();
}

// ============================================
// Modal System
// ============================================
function initModals() {
    const overlay = document.getElementById('modalOverlay');
    const modal = document.getElementById('modal');
    const closeBtn = document.getElementById('modalClose');
    const content = document.getElementById('modalContent');

    const caseStudies = {
        modal1: {
            title: 'PayFlow Checkout Redesign',
            subtitle: 'TechScale Inc. — 2023',
            challenge: 'The existing checkout flow had an 18% abandonment rate at the payment step, costing the business an estimated $15M in lost annual revenue. User research revealed confusion around payment options and a lack of trust signals.',
            approach: [
                'Conducted 50+ user interviews and session recordings',
                'Mapped the entire checkout journey with drop-off analytics',
                'A/B tested 12 different layout variations',
                'Implemented progressive disclosure pattern',
                'Added trust badges, price breakdowns, and saved payment methods'
            ],
            results: 'The redesigned checkout flow launched to 100% of traffic after 8 weeks of testing. Cart abandonment dropped from 18% to 14.7%, and overall conversion improved by 23%.',
            metrics: [
                { value: '-18%', label: 'Abandonment' },
                { value: '+23%', label: 'Conversion' },
                { value: '$12M', label: 'Revenue Impact' }
            ]
        },
        modal2: {
            title: 'Analytics Dashboard 2.0',
            subtitle: 'DataFlow Analytics — 2021',
            challenge: 'The company needed to build its flagship analytics product from scratch to compete in the enterprise BI market. No existing product, team, or infrastructure existed.',
            approach: [
                'Defined the product vision and 18-month roadmap',
                'Hired and built a cross-functional team of 17',
                'Ran weekly design sprints with enterprise beta customers',
                'Built a modular dashboard architecture for customization',
                'Integrated with 50+ data sources and created self-serve onboarding'
            ],
            results: 'Launched to GA within 6 months, reaching 2,000+ enterprise customers and $45M ARR within 18 months. Achieved a 4.8 star rating on G2 and won "Best Analytics Platform" at SaaStr.',
            metrics: [
                { value: '2K+', label: 'Customers' },
                { value: '$45M', label: 'ARR' },
                { value: '4.8★', label: 'G2 Rating' }
            ]
        },
        modal3: {
            title: 'Social Onboarding Revamp',
            subtitle: 'NexGen Mobile — 2020',
            challenge: 'The mobile app had a 65% drop-off during onboarding, with most users never reaching the core experience. Day-7 retention was at an abysmal 12%.',
            approach: [
                'Conducted 200+ user interviews across 5 markets',
                'Reduced onboarding steps from 8 to 3',
                'Introduced progressive profiling instead of upfront data collection',
                'Created personalized onboarding paths based on use case',
                'Built a continuous feedback loop with in-app surveys'
            ],
            results: 'The new onboarding experience improved Day-7 retention from 12% to 16.2% (+35%). Time-to-value dropped from 4 minutes to 90 seconds, and NPS for new users increased by 25 points.',
            metrics: [
                { value: '+35%', label: 'Retention' },
                { value: '-60%', label: 'Time to Value' },
                { value: '5M+', label: 'Users' }
            ]
        },
        modal4: {
            title: 'AI-Powered Recommendations',
            subtitle: 'TechScale Inc. — 2024',
            challenge: 'Users were overwhelmed by product choices, leading to decision fatigue and lower average order values. The existing recommendation engine used basic collaborative filtering with diminishing returns.',
            approach: [
                'Partnered with the ML team to build a hybrid recommendation system',
                'Combined collaborative filtering, content-based, and contextual signals',
                'Designed explainable recommendations ("Because you liked...")',
                'Ran multi-arm bandit tests for optimal placement',
                'Built a feedback loop with implicit and explicit signals'
            ],
            results: 'The new ML-powered engine increased engagement by 42% and average order value by 28%. The recommendation click-through rate reached 94% precision, significantly outperforming the previous system.',
            metrics: [
                { value: '+42%', label: 'Engagement' },
                { value: '+28%', label: 'AOV' },
                { value: '94%', label: 'Accuracy' }
            ]
        }
    };

    document.querySelectorAll('.project-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-modal');
            const data = caseStudies[id];
            if (!data) return;

            content.innerHTML = `
                <h2>${data.title}</h2>
                <p class="modal-subtitle">${data.subtitle}</p>
                <div class="modal-metrics">
                    ${data.metrics.map(m => `
                        <div class="modal-metric">
                            <span class="modal-metric-value">${m.value}</span>
                            <span class="modal-metric-label">${m.label}</span>
                        </div>
                    `).join('')}
                </div>
                <h3>The Challenge</h3>
                <p>${data.challenge}</p>
                <h3>The Approach</h3>
                <ul>
                    ${data.approach.map(a => `<li>${a}</li>`).join('')}
                </ul>
                <h3>The Results</h3>
                <p>${data.results}</p>
            `;

            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeModal() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

// ============================================
// Contact Form
// ============================================
function initContactForm() {
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Show success state
        form.innerHTML = `
            <div class="form-success">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="48" height="48">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <h3>Message Sent!</h3>
                <p>Thanks for reaching out. I'll get back to you within 24 hours.</p>
            </div>
        `;
    });
}

// ============================================
// Smooth Scroll for Anchor Links
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ============================================
// Tilt Effect on Project Cards
// ============================================
function initTiltEffect() {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// ============================================
// Initialize Everything
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Init particle canvas
    const heroCanvas = document.getElementById('heroCanvas');
    if (heroCanvas) new ParticleCanvas(heroCanvas);

    initCursorGlow();
    initNavigation();
    initThemeToggle();
    initScrollReveal();
    initStatsCounter();
    initSkillBars();
    initCarousel();
    initModals();
    initContactForm();
    initSmoothScroll();
    initTiltEffect();
});
