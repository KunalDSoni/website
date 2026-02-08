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
    if (!track) return;
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('carouselDots');
    if (!prevBtn || !nextBtn || !dotsContainer) return;
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
// Page Loader
// ============================================
function initPageLoader() {
    const loader = document.getElementById('pageLoader');
    if (!loader) return;

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('loaded');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 600);
        }, 1200);
    });
}

// ============================================
// Scroll Progress Bar
// ============================================
function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// ============================================
// Typing Animation
// ============================================
function initTypingAnimation() {
    const typingElement = document.getElementById('typingText');
    if (!typingElement) return;

    const words = ['payments', 'wallets', 'neobanks', 'super apps', 'fintech'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            typingSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 400; // Pause before next word
        }

        setTimeout(type, typingSpeed);
    }

    setTimeout(type, 1500); // Initial delay
}

// ============================================
// Magnetic Buttons
// ============================================
function initMagneticButtons() {
    const magnetics = document.querySelectorAll('.magnetic');

    magnetics.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

// ============================================
// Parallax Blobs
// ============================================
function initParallaxBlobs() {
    // Add decorative blobs to sections
    const sections = [
        { selector: '.about', color: '#6366f1' },
        { selector: '.experience', color: '#ec4899' },
        { selector: '.skills', color: '#14b8a6' },
        { selector: '.projects', color: '#f59e0b' },
    ];

    sections.forEach(({ selector, color }) => {
        const section = document.querySelector(selector);
        if (!section) return;

        const blob = document.createElement('div');
        blob.classList.add('parallax-bg');
        blob.style.background = color;
        blob.style.width = (300 + Math.random() * 200) + 'px';
        blob.style.height = blob.style.width;
        blob.style.top = (Math.random() * 60 + 10) + '%';
        blob.style[Math.random() > 0.5 ? 'left' : 'right'] = -(Math.random() * 100 + 50) + 'px';
        section.style.position = 'relative';
        section.appendChild(blob);
    });

    // Parallax movement on scroll
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        document.querySelectorAll('.parallax-bg').forEach(blob => {
            const speed = 0.05;
            const yPos = scrollY * speed;
            blob.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// ============================================
// Animated Tool Tag Shuffle on Hover
// ============================================
function initToolTagAnimation() {
    const tags = document.querySelectorAll('.tool-tag');
    tags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            tag.style.animation = 'none';
            tag.offsetHeight; // reflow
            tag.style.animation = 'tagPop 0.4s ease';
        });
    });

    // Add the keyframes dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes tagPop {
            0% { transform: scale(1); }
            50% { transform: scale(1.1) translateY(-4px); }
            100% { transform: scale(1) translateY(-2px); }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// Floating Fintech Icons
// ============================================
function initFintechFloaters() {
    const container = document.getElementById('fintechFloaters');
    if (!container) return;

    // Currency symbols
    const currencies = ['$', '₹', 'د.إ', '€', '£', '¥', '₿'];

    // SVG icons for fintech items
    const svgIcons = {
        card: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="24" height="24">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
            <line x1="1" y1="10" x2="23" y2="10"></line>
        </svg>`,
        pos: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="24" height="24">
            <rect x="4" y="2" width="16" height="20" rx="2"></rect>
            <line x1="8" y1="6" x2="16" y2="6"></line>
            <rect x="8" y="10" width="3" height="3" rx="0.5"></rect>
            <rect x="13" y="10" width="3" height="3" rx="0.5"></rect>
            <rect x="8" y="15" width="3" height="3" rx="0.5"></rect>
            <rect x="13" y="15" width="3" height="3" rx="0.5"></rect>
        </svg>`,
        transaction: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="24" height="24">
            <polyline points="17 1 21 5 17 9"></polyline>
            <line x1="3" y1="5" x2="21" y2="5"></line>
            <polyline points="7 23 3 19 7 15"></polyline>
            <line x1="21" y1="19" x2="3" y2="19"></line>
        </svg>`,
        wallet: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="24" height="24">
            <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path>
            <path d="M4 6v12a2 2 0 0 0 2 2h14v-4"></path>
            <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z"></path>
        </svg>`,
        chart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="24" height="24">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>`,
        shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="24" height="24">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <polyline points="9 12 11 14 15 10"></polyline>
        </svg>`,
        bank: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="24" height="24">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <line x1="2" y1="17" x2="22" y2="17"></line>
            <line x1="2" y1="12" x2="2" y2="17"></line>
            <line x1="22" y1="12" x2="22" y2="17"></line>
            <line x1="6" y1="9.5" x2="6" y2="17"></line>
            <line x1="10" y1="8" x2="10" y2="17"></line>
            <line x1="14" y1="8" x2="14" y2="17"></line>
            <line x1="18" y1="9.5" x2="18" y2="17"></line>
        </svg>`,
        contactless: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="24" height="24">
            <path d="M8.5 16.5a5 5 0 0 1 0-9"></path>
            <path d="M12 19a8 8 0 0 0 0-14"></path>
            <path d="M15.5 21.5a11 11 0 0 0 0-19"></path>
        </svg>`
    };

    const svgKeys = Object.keys(svgIcons);
    const sizes = ['size-sm', 'size-md', 'size-lg'];
    const drifts = ['', 'drift-left', 'drift-right', 'pulse'];

    function createIcon() {
        const icon = document.createElement('div');
        icon.classList.add('fintech-icon');

        // Random size
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        icon.classList.add(size);

        // Random drift
        const drift = drifts[Math.floor(Math.random() * drifts.length)];
        if (drift) icon.classList.add(drift);

        // 50% chance currency vs SVG icon
        if (Math.random() > 0.45) {
            icon.classList.add('currency');
            icon.textContent = currencies[Math.floor(Math.random() * currencies.length)];
        } else {
            const key = svgKeys[Math.floor(Math.random() * svgKeys.length)];
            icon.innerHTML = svgIcons[key];
        }

        // Random position and timing
        icon.style.left = (Math.random() * 90 + 5) + '%';
        const duration = Math.random() * 15 + 12; // 12-27s
        icon.style.animationDuration = duration + 's';
        icon.style.animationDelay = (Math.random() * 10) + 's';

        container.appendChild(icon);

        // Remove after animation completes and create a new one
        setTimeout(() => {
            icon.remove();
            createIcon();
        }, (duration + 10) * 1000);
    }

    // Spawn initial batch (fewer on mobile)
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 6 : 14;
    for (let i = 0; i < count; i++) {
        setTimeout(() => createIcon(), i * 800);
    }
}

// ============================================
// Initialize Everything
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Init page loader first
    initPageLoader();

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

    // New features
    initScrollProgress();
    initTypingAnimation();
    initMagneticButtons();
    initParallaxBlobs();
    initToolTagAnimation();
    initFintechFloaters();
});
