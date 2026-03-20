// ============================================
// Kunal D Soni — Award-Winning Portfolio JS
// Cormorant Garamond × Space Grotesk
// ============================================

document.addEventListener('DOMContentLoaded', function () {

    // ============================================
    // 1. Custom Cursor
    // ============================================
    var cursor = document.getElementById('cursor');
    var follower = document.getElementById('cursorFollower');
    var mouseX = 0, mouseY = 0;
    var followerX = 0, followerY = 0;
    var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice && cursor && follower) {
        document.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        // Smooth follower with lerp
        (function animateFollower() {
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            follower.style.left = followerX + 'px';
            follower.style.top = followerY + 'px';
            requestAnimationFrame(animateFollower);
        })();

        // Hover state — enlarge cursor on interactive elements
        var hoverTargets = document.querySelectorAll('a, button, .work-item, .company-card, .about-card, .chips span, .test-btn, .nav-link');
        hoverTargets.forEach(function (el) {
            el.addEventListener('mouseenter', function () { document.body.classList.add('cursor-hover'); });
            el.addEventListener('mouseleave', function () { document.body.classList.remove('cursor-hover'); });
        });
    }

    // ============================================
    // 2. Scroll Progress Bar
    // ============================================
    var scrollProgress = document.getElementById('scrollProgress');
    window.addEventListener('scroll', function () {
        var scrollTop = window.scrollY;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0 && scrollProgress) {
            scrollProgress.style.width = (scrollTop / docHeight) * 100 + '%';
        }
    });

    // ============================================
    // 3. Navigation — scroll effect + hamburger
    // ============================================
    var navbar = document.getElementById('navbar');
    var hamburger = document.getElementById('hamburger');
    var navMenu = document.getElementById('navMenu');

    window.addEventListener('scroll', function () {
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 10);
        }
    });

    if (hamburger) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            if (navMenu) navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu on link click
    document.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            if (hamburger) hamburger.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
        });
    });

    // Active nav highlight on scroll
    var sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', function () {
        var scrollY = window.scrollY + 150;
        sections.forEach(function (section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');
            var link = document.querySelector('.nav-link[href="#' + id + '"]');
            if (link) {
                link.classList.toggle('active', scrollY >= top && scrollY < top + height);
            }
        });
    });

    // ============================================
    // 4. Smooth Scroll for ALL anchor links
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (!href || href === '#') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                var offset = 70;
                var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    // ============================================
    // 5. Typing Animation
    // ============================================
    var typingElement = document.getElementById('typingText');
    var words = ['money', 'payments', 'super apps', 'wallets', 'lending'];
    var wordIndex = 0;
    var charIndex = words[0].length; // Start with full word displayed
    var isDeleting = true;

    function typeEffect() {
        if (!typingElement) return;
        var word = words[wordIndex];

        if (isDeleting) {
            typingElement.textContent = word.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = word.substring(0, charIndex + 1);
            charIndex++;
        }

        var delay = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === word.length) {
            delay = 2500;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            delay = 400;
        }

        setTimeout(typeEffect, delay);
    }

    setTimeout(typeEffect, 2500);

    // ============================================
    // 6. Stat Counter Animation
    // ============================================
    function animateStats() {
        var stats = document.querySelectorAll('.stat-num');
        stats.forEach(function (stat) {
            if (stat.dataset.animated) return;

            var target = parseInt(stat.dataset.target) || 0;
            var prefix = stat.dataset.prefix || '';
            var suffix = stat.dataset.suffix || '';
            var duration = 2000;
            var start = performance.now();

            function update(now) {
                var elapsed = now - start;
                var progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                var eased = 1 - Math.pow(1 - progress, 3);
                var current = Math.floor(eased * target);
                stat.textContent = prefix + current + suffix;

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    stat.textContent = prefix + target + suffix;
                    stat.dataset.animated = 'true';
                }
            }

            requestAnimationFrame(update);
        });
    }

    // ============================================
    // 7. Scroll Reveal (IntersectionObserver)
    // ============================================
    var animElements = document.querySelectorAll('.anim-up');
    if ('IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    // Trigger stat counters when hero-stats become visible
                    if (entry.target.closest('.hero-stats') || entry.target.classList.contains('stat')) {
                        animateStats();
                    }

                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        animElements.forEach(function (el) { revealObserver.observe(el); });
    } else {
        animElements.forEach(function (el) { el.classList.add('visible'); });
        animateStats();
    }

    // ============================================
    // 8. Testimonials Carousel
    // ============================================
    var carouselTrack = document.getElementById('carouselTrack');
    var prevBtn = document.getElementById('prevBtn');
    var nextBtn = document.getElementById('nextBtn');
    var dotsContainer = document.getElementById('carouselDots');
    var slides = carouselTrack ? carouselTrack.querySelectorAll('.test-slide') : [];
    var currentSlide = 0;
    var totalSlides = slides.length;
    var autoPlayInterval;

    function initCarousel() {
        if (!carouselTrack || totalSlides === 0) return;

        // Build dots
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            for (var i = 0; i < totalSlides; i++) {
                var dot = document.createElement('span');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                (function (index) {
                    dot.addEventListener('click', function () { goToSlide(index); resetAutoPlay(); });
                })(i);
                dotsContainer.appendChild(dot);
            }
        }

        startAutoPlay();
    }

    function goToSlide(index) {
        currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;
        if (carouselTrack) {
            carouselTrack.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
        }
        if (dotsContainer) {
            var dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === currentSlide);
            });
        }
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(function () {
            goToSlide(currentSlide + 1);
        }, 5000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goToSlide(currentSlide - 1); resetAutoPlay(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goToSlide(currentSlide + 1); resetAutoPlay(); });

    initCarousel();

    // ============================================
    // 9. 3D Tilt Effect on [data-tilt] Elements
    // ============================================
    if (!isTouchDevice) {
        document.querySelectorAll('[data-tilt]').forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                var centerX = rect.width / 2;
                var centerY = rect.height / 2;

                var rotateX = ((y - centerY) / centerY) * -6;
                var rotateY = ((x - centerX) / centerX) * 6;

                card.style.transform = 'perspective(600px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.02, 1.02, 1.02)';
            });

            card.addEventListener('mouseleave', function () {
                card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }

    // ============================================
    // 10. Marquee Pause on Hover
    // ============================================
    var marquee = document.querySelector('.marquee');
    var marqueeInner = document.querySelector('.marquee-inner');
    if (marquee && marqueeInner) {
        marquee.addEventListener('mouseenter', function () {
            marqueeInner.style.animationPlayState = 'paused';
        });
        marquee.addEventListener('mouseleave', function () {
            marqueeInner.style.animationPlayState = 'running';
        });
    }

});
