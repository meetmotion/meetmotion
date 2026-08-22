/* ===================================
   FADE — Main JavaScript
   Vanilla JS • No Dependencies
   =================================== */

// ---------- PRELOADER ----------
(function () {
    const preloader = document.getElementById('preloader');
    const bar = document.getElementById('preloaderBar');
    if (!preloader || !bar) return;

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 12 + 3;
        if (progress > 90) progress = 90;
        bar.style.width = progress + '%';
    }, 150);

    window.addEventListener('load', () => {
        // Check if we should skip preloader (after form submission)
        if (sessionStorage.getItem('formSubmitted') === 'true') {
            preloader.style.display = 'none';
            bar.style.width = '100%';
            sessionStorage.removeItem('formSubmitted');
            return;
        }

        clearInterval(interval);
        bar.style.width = '100%';
        setTimeout(() => {
            preloader.classList.add('loaded');
        }, 400);
        setTimeout(() => {
            preloader.remove();
        }, 1200);
    });
})();

document.addEventListener('DOMContentLoaded', () => {

    // ---------- LENIS SMOOTH SCROLL ----------
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Make lenis accessible globally for any components that need it
    window.lenis = lenis;


    // ---------- NAVBAR SCROLL ----------
    const navbar = document.getElementById('navbar');
    const onScroll = () => {
        const scrollPos = window.scrollY;
        navbar.classList.toggle('scrolled', scrollPos > 60);

        // Condensed logic for Desktop
        if (window.innerWidth > 1024) {
            navbar.classList.toggle('condensed', scrollPos > 200);
        } else {
            navbar.classList.remove('condensed');
        }

        // Active Link Tracking
        updateActiveLink();
    };

    const updateActiveLink = () => {
        const sections = document.querySelectorAll('section[id], header[id]');
        const navLinks = document.querySelectorAll('.navbar__link, .navbar__mobile-link');
        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop - 150) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.startsWith('#') && href.substring(1) === currentSectionId) {
                link.classList.add('active');
            }
        });

        // Handle Dropdown triggers if a sub-item is active
        document.querySelectorAll('.navbar__dropdown, .navbar__mobile-dropdown').forEach(dropdown => {
            const isMobile = dropdown.classList.contains('navbar__mobile-dropdown');
            const itemsSelector = isMobile ? '.navbar__mobile-link' : '.navbar__dropdown-item';
            const triggerSelector = isMobile ? '.navbar__mobile-dropdown-trigger' : '.navbar__dropdown-trigger';

            const items = dropdown.querySelectorAll(itemsSelector);
            const trigger = dropdown.querySelector(triggerSelector);
            let isAnyItemActive = false;

            items.forEach(item => {
                const href = item.getAttribute('href');
                if (href && href.startsWith('#') && href.substring(1) === currentSectionId) {
                    isAnyItemActive = true;
                }
            });
            if (trigger) trigger.classList.toggle('active', isAnyItemActive);
        });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ---------- MOBILE MENU ----------
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');

    if (hamburger && mobileMenu) {
        const mobileAboutTrigger = document.getElementById('mobileAboutTrigger');
        const mobileAboutList = document.getElementById('mobileAboutList');

        hamburger.addEventListener('click', () => {
            const isOpening = !hamburger.classList.contains('active');
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('open');
            if (mobileOverlay) mobileOverlay.classList.toggle('active');

            if (mobileMenu.classList.contains('open')) {
                document.body.style.overflow = 'hidden';
                document.body.classList.add('menu-open');
            } else {
                document.body.style.overflow = '';
                document.body.classList.remove('menu-open');
            }

            // Reset dropdown if closing menu
            if (!isOpening && mobileAboutList) {
                mobileAboutList.classList.remove('open');
                mobileAboutTrigger.classList.remove('open');
            }
        });

        // Close mobile menu on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('open');
                if (mobileOverlay) mobileOverlay.classList.remove('active');
                document.body.style.overflow = '';
                document.body.classList.remove('menu-open');

                // Reset dropdown
                if (mobileAboutList) {
                    mobileAboutList.classList.remove('open');
                    mobileAboutTrigger.classList.remove('open');
                }
            });
        });

        // Close on overlay click
        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('open');
                mobileOverlay.classList.remove('active');
                document.body.style.overflow = '';
                document.body.classList.remove('menu-open');
                if (mobileAboutList) {
                    mobileAboutList.classList.remove('open');
                    mobileAboutTrigger.classList.remove('open');
                }
            });
        }

        // Mobile About Us dropdown toggle
        if (mobileAboutTrigger && mobileAboutList) {
            mobileAboutTrigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const isOpen = mobileAboutList.classList.contains('open');
                if (isOpen) {
                    mobileAboutList.classList.remove('open');
                    mobileAboutTrigger.classList.remove('open');
                } else {
                    mobileAboutList.classList.add('open');
                    mobileAboutTrigger.classList.add('open');
                }
            });
        }
    }

    // ---------- MARQUEE HOVER SPEED CONTROL ----------
    const testimonialMarquee = document.querySelector('.testimonial-marquee');
    if (testimonialMarquee) {
        const tracks = Array.from(testimonialMarquee.querySelectorAll('.marquee-track'));

        // Cache animations for better performance
        const getTrackAnimations = () => {
            return tracks.flatMap(track => track.getAnimations());
        };

        testimonialMarquee.addEventListener('mouseenter', () => {
            getTrackAnimations().forEach(anim => {
                anim.updatePlaybackRate(0.2); // Smooth slow-down
            });
        }, { passive: true });

        testimonialMarquee.addEventListener('mouseleave', () => {
            getTrackAnimations().forEach(anim => {
                anim.updatePlaybackRate(1); // Resume normal speed
            });
        }, { passive: true });
    }



    // ---------- PRICING CATEGORY FILTER ----------
    const pricingBtns = document.querySelectorAll('.pricing-filter .filter-btn');
    const pricingCards = document.querySelectorAll('.pricing-card');

    if (pricingBtns.length && pricingCards.length) {
        pricingBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.classList.contains('active')) return;

                // Update active button
                pricingBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.pricingFilter;

                // Toggle cards with a smooth transition
                pricingCards.forEach(card => {
                    if (card.dataset.pricingFilter === filter) {
                        card.style.display = 'flex';

                        // Small timeout to allow display change before animation
                        setTimeout(() => {
                            card.classList.add('visible');
                        }, 50);
                    } else {
                        card.style.display = 'none';
                        card.classList.remove('visible');
                    }
                });

                // Refresh Lenis as height may have changed
                if (window.lenis) window.lenis.resize();
            });
        });
    }

    // ---------- SPLIT TEXT ANIMATION ----------
    // Wrap each word with spans for reveal animation
    document.querySelectorAll('.section-title, .split-title').forEach(title => {
        // Skip if already split
        if (title.classList.contains('split-text')) return;

        title.classList.add('split-text');

        // Process child nodes (handles <em> tags)
        const processNode = (node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const words = node.textContent.split(/\s+/).filter(w => w.length > 0);
                const frag = document.createDocumentFragment();
                words.forEach(word => {
                    const span = document.createElement('span');
                    span.className = 'word';
                    const inner = document.createElement('span');
                    inner.className = 'word-inner';
                    inner.textContent = word;
                    span.appendChild(inner);
                    frag.appendChild(span);
                });
                node.parentNode.replaceChild(frag, node);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // Process children of elements like <em>
                Array.from(node.childNodes).forEach(child => processNode(child));
            }
        };

        Array.from(title.childNodes).forEach(child => processNode(child));

        // Set stagger delays on word-inner elements
        title.querySelectorAll('.word-inner').forEach((inner, i) => {
            inner.style.setProperty('--word-delay', `${i * 0.06}s`);
        });
    });

    // ---------- STAGGER DELAY ASSIGNMENT ----------
    // Assign --delay CSS custom property to grid children for stagger effect
    const staggerGroups = [
        { selector: '.process__grid .process__card', delay: 0.1 },
        { selector: '.services__stack .services__card', delay: 0.15 },
        { selector: '.portfolio__grid .portfolio__card', delay: 0.12 },
        { selector: '.results__grid .results__card', delay: 0.1 },
        { selector: '.why-us__features .why-us__feature', delay: 0.12 },
        { selector: '.stats__grid .stats__item', delay: 0.1 },
        { selector: '.blog__grid .blog__card', delay: 0.08 },

        { selector: '.team-reveal-grid .team-reveal-card', delay: 0.15 },
        { selector: '.comparison__row', delay: 0.05 },
        { selector: '.faq__list .faq__item', delay: 0.07 },
        { selector: '.why-us__badge-group .why-us__badge', delay: 0.08 },
    ];

    staggerGroups.forEach(({ selector, delay }) => {
        document.querySelectorAll(selector).forEach((el, i) => {
            el.style.setProperty('--delay', `${i * delay}s`);
        });
    });

    // ---------- SCROLL REVEAL (Enhanced IntersectionObserver) ----------
    const revealSelectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade, .reveal-3d, .split-text, .reveal-up, .fade-up';
    const revealElements = document.querySelectorAll(revealSelectors);

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -60px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback: show everything
        revealElements.forEach(el => el.classList.add('visible'));
    }

    // ---------- COUNTER ANIMATION ----------
    // Animate stat numbers when they scroll into view
    const statNums = document.querySelectorAll('.results__stat-num, .stats__number');

    if (statNums.length && 'IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNums.forEach(el => counterObserver.observe(el));
    }

    function animateCounter(el) {
        const text = el.textContent.trim();
        // Parse: "70k+", "$8m+", "100k+", "$5m+", "50k+", "$2m+"
        const match = text.match(/^(\$?)(\d+)(k|m|M|K)?(\+?)$/);
        if (!match) {
            el.classList.add('counted');
            return;
        }

        const prefix = match[1];
        const target = parseInt(match[2]);
        const suffix = (match[3] || '') + (match[4] || '');
        const duration = 1500;
        const startTime = performance.now();

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(target * eased);
            el.textContent = `${prefix}${current}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.classList.add('counted');
            }
        };

        requestAnimationFrame(step);
    }
    // ==========================================
    // FAQ ACCORDION
    // ==========================================
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', function () {
            const item = this.parentElement;
            const isOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('open');
                i.querySelector('.faq-icon').textContent = '+';
            });
            if (!isOpen) {
                item.classList.add('open');
                this.querySelector('.faq-icon').textContent = '−';
            }
        });
    });

    // ---------- SMOOTH SCROLL FOR ANCHOR LINKS ----------
    // ---------- CUSTOM CURSOR LOGIC ----------
    // ---------- CUSTOM CURSOR LOGIC ----------
    const cursor = document.querySelector('.cursor-follower');
    const body = document.body;

    if (cursor && window.innerWidth > 1024) {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (cursor.style.opacity === '0' || !cursor.style.opacity) {
                cursor.style.opacity = '1';
            }
        });

        // Precise tracking with very light easing for premium feel
        const renderCursor = () => {
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;

            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';

            requestAnimationFrame(renderCursor);
        };
        requestAnimationFrame(renderCursor);

        // Hover states: Grow on links/buttons
        const hoverElements = document.querySelectorAll('main a, button, .pricing__toggle-btn, .faq__question, .navbar__hamburger, .dashboard-nav__item');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => body.classList.remove('cursor-hover'));
        });

        // View state: Large circle with "VIEW" text for project cards
        const viewElements = document.querySelectorAll('.portfolio__card, .blog__card');
        viewElements.forEach(el => {
            el.addEventListener('mouseenter', () => body.classList.add('cursor-view'));
            el.addEventListener('mouseleave', () => body.classList.remove('cursor-view'));
        });

        // Visibility toggle
        document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
        document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#' || !href) return;
            e.preventDefault();

            const target = document.querySelector(href);
            if (target) {
                const offset = 80; // navbar height
                lenis.scrollTo(target, {
                    offset: -offset,
                    duration: 1.5,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });
            }
        });
    });

    // ---------- NEWSLETTER FORM HANDLING ----------
    const newsletterForm = document.querySelector('.newsletter__form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = newsletterForm.querySelector('.newsletter__btn');
            const input = newsletterForm.querySelector('.newsletter__input');

            if (!btn || !input || btn.classList.contains('loading') || btn.classList.contains('success')) return;

            // Start Loading State
            btn.classList.add('loading');
            input.disabled = true;

            // Simulate API Call
            setTimeout(() => {
                btn.classList.remove('loading');
                btn.classList.add('success');

                // Reset after 4 seconds
                setTimeout(() => {
                    btn.classList.remove('success');
                    input.disabled = false;
                    input.value = '';
                }, 4000);
            }, 1800);
        });
    }

    // ---------- AJAX CONTACT FORM HANDLING ----------
    const contactForms = document.querySelectorAll('.contact__form');
    contactForms.forEach(form => {
        // Skip newsletter form as it has its own handler
        if (form.classList.contains('newsletter__form')) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const button = form.querySelector('button[type="submit"]');
            const statusDiv = form.querySelector('.form-status') || (() => {
                const div = document.createElement('div');
                div.className = 'form-status';
                form.appendChild(div);
                return div;
            })();

            const formData = new FormData(form);
            const endpoint = form.getAttribute('action');

            if (!endpoint) return;

            // Loading state
            button.disabled = true;
            button.innerHTML = 'Sending... <i class="ph ph-circle-notch-bold spinning"></i>';
            statusDiv.style.display = 'none';
            statusDiv.className = 'form-status';

            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    statusDiv.innerHTML = '<i class="ph ph-check-circle"></i> Success! Your message has been sent.';
                    statusDiv.className = 'form-status success';
                    form.reset();
                    button.innerHTML = 'Message Sent <i class="ph ph-check"></i>';
                } else {
                    const data = await response.json();
                    if (data.errors) {
                        statusDiv.innerText = data.errors.map(error => error.message).join(", ");
                    } else {
                        statusDiv.innerText = "Oops! There was a problem submitting your form";
                    }
                    statusDiv.className = 'form-status error';
                    button.disabled = false;
                    button.innerHTML = 'Send Message <i class="ph ph-paper-plane-tilt"></i>';
                }
            } catch (error) {
                statusDiv.innerText = "Oops! There was a problem submitting your form";
                statusDiv.className = 'form-status error';
                button.disabled = false;
                button.innerHTML = 'Send Message <i class="ph ph-paper-plane-tilt"></i>';
            }

            statusDiv.style.display = 'block';
        });
    });

    // ---------- TESTIMONIAL SLIDER ----------
    if (document.querySelector('.testimonials-slider')) {
        new Swiper('.testimonials-slider', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
            },
        });
    }

    // ---------- PHILOSOPHY PARALLAX ZOOM ----------
    const philosophySection = document.querySelector('.philosophy');
    const philosophyTitle = document.querySelector('.philosophy__title');
    const philosophySticky = document.querySelector('.philosophy__sticky');
    const nav = document.getElementById('navbar');

    if (philosophySection && philosophyTitle && window.lenis) {
        window.lenis.on('scroll', (e) => {
            const rect = philosophySection.getBoundingClientRect();
            const scrollHeight = philosophySection.offsetHeight - window.innerHeight;
            const scrollProgress = Math.max(0, Math.min(1, -rect.top / scrollHeight));

            // Navbar Hide/Show Logic
            if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
                nav.classList.add('hide-philosophy');
            } else {
                nav.classList.remove('hide-philosophy');
            }

            // Smoother easing for zoom - calibrated for 600vh
            const easedProgress = Math.pow(scrollProgress, 1.2);
            const scale = 1 + easedProgress * 15;

            philosophyTitle.style.transform = `scale(${scale})`;

            // Fade out title earlier in the scroll to focus on the paragraph
            const titleOpacity = 1 - Math.max(0, (scrollProgress - 0.45) * 4);
            philosophyTitle.style.opacity = Math.max(0, titleOpacity);

            // Show paragraph text later to allow zoom to breathe
            if (scrollProgress > 0.55 && scrollProgress < 0.95) {
                philosophySticky.classList.add('zoomed');
            } else {
                philosophySticky.classList.remove('zoomed');
            }
        });
    }



    // ---------- SCROLL-BASED TEXT REVEAL (Color Transition) ----------
    const scrollRevealLines = document.querySelectorAll('.scroll-reveal-line');

    function updateScrollReveal() {
        scrollRevealLines.forEach(line => {
            const rect = line.getBoundingClientRect();
            const viewHeight = window.innerHeight;

            // Calculate progress: 0 when just entering bottom, 1 when at 20% from top
            let progress = (viewHeight - rect.top) / (viewHeight * 0.8);
            progress = Math.max(0, Math.min(1, progress));

            line.style.setProperty('--reveal-width', `${progress * 100}%`);
        });
    }

    if (scrollRevealLines.length > 0) {
        window.addEventListener('scroll', updateScrollReveal, { passive: true });
        updateScrollReveal();
    }
    // ---------- SERVICES SPOTLIGHT EFFECT ----------
    const serviceCards = document.querySelectorAll('.services__card');
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // ---------- TEAM PLATFORM SLIDER ----------
    const teamPlatform = document.getElementById('teamPlatform');
    if (teamPlatform) {
        const teamData = [
            {
                name: "Rahat Islam Apon",
                role: "Founder & CEO",
                bio: "As founder, I drive our mission of pioneering brand identities. I'm dedicated to turning complexity into clarity with scalable, intelligent designs that revolutionize how businesses operate.",
                image: "https://i.pinimg.com/736x/e3/6a/72/e36a728acfd72c5baf1ebbaae5fadf5e.jpg"
            },
            {
                name: "Rawfun Bin Amin",
                role: "Co Founder & COO",
                bio: "As co-founder, I focus on operational excellence and strategic growth. My goal is to bridge the gap between creative vision and business impact, ensuring every project delivers results.",
                image: "https://i.pinimg.com/736x/49/82/71/4982712fae55e5550f3a4605c56ee765.jpg"
            },
            {
                name: "Priyanka Das",
                role: "Logo Designer",
                bio: "Specialized in logo design and visual metaphors. I craft symbols that represent the core essence of modern brands, creating timeless marks that resonate with audiences worldwide.",
                image: "https://i.pinimg.com/736x/61/b6/fa/61b6fa6ed35d5f64a9355ea06751d5ef.jpg"
            },
            {
                name: "Rima Khatun",
                role: "Brand Designer",
                bio: "Expert in brand systems and design consistency. I ensure every touchpoint of your brand feels premium and cohesive, from digital interfaces to physical brand experiences.",
                image: "https://i.pinimg.com/736x/fd/16/61/fd1661e37922f95caf71070edadf6f85.jpg"
            }
        ];

        let currentIndex = 0;
        const nameEl = document.getElementById('memberName');
        const roleEl = document.getElementById('memberRole');
        const bioEl = document.getElementById('memberBio');
        const imageEl = document.getElementById('memberImage');
        const dotsEl = document.getElementById('teamDots');
        const prevBtn = document.getElementById('prevTeam');
        const nextBtn = document.getElementById('nextTeam');

        // Create dots
        if (dotsEl) {
            teamData.forEach((_, i) => {
                const dot = document.createElement('div');
                dot.className = `team-platform__dot ${i === 0 ? 'active' : ''}`;
                dot.addEventListener('click', () => updateTeam(i));
                dotsEl.appendChild(dot);
            });
        }

        function updateTeam(index) {
            if (index === currentIndex) return;

            // Animate out
            if (bioEl) bioEl.classList.remove('active');
            if (imageEl) imageEl.classList.remove('active');

            currentIndex = index;
            const data = teamData[currentIndex];

            // Update dots
            const dots = document.querySelectorAll('.team-platform__dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });

            // Brief delay for the slider feeling
            setTimeout(() => {
                // Update name with roll effect
                if (nameEl) {
                    const rollSpan = nameEl.querySelector('.btn-text-roll');
                    if (rollSpan) {
                        rollSpan.innerText = data.name;
                        rollSpan.setAttribute('data-text', data.name);
                    } else {
                        nameEl.innerText = data.name;
                    }
                }

                if (roleEl) roleEl.innerText = data.role;
                if (bioEl) bioEl.innerText = data.bio;
                if (imageEl) imageEl.src = data.image;

                // Animate in
                if (bioEl) bioEl.classList.add('active');
                if (imageEl) imageEl.classList.add('active');
            }, 400);
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                let index = (currentIndex - 1 + teamData.length) % teamData.length;
                updateTeam(index);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                let index = (currentIndex + 1) % teamData.length;
                updateTeam(index);
            });
        }
    }
    // ---------- TM SLIDER (New Cinematic Team Slider) ----------
    const tmSlider = document.getElementById('tmSlider');
    if (tmSlider) {
        const tmData = [
            {
                name: "Rahat Islam Apon",
                role: "Founder & CEO",
                bio: "As founder, I drive our mission of pioneering brand identities. I'm dedicated to turning complexity into clarity with scalable, intelligent designs that revolutionize how businesses operate.",
                image: "https://i.pinimg.com/736x/e3/6a/72/e36a728acfd72c5baf1ebbaae5fadf5e.jpg"
            },
            {
                name: "Rawfun Bin Amin",
                role: "Co Founder & COO",
                bio: "As co-founder, I focus on operational excellence and strategic growth. My goal is to bridge the gap between creative vision and business impact, ensuring every project delivers results.",
                image: "https://i.pinimg.com/736x/49/82/71/4982712fae55e5550f3a4605c56ee765.jpg"
            },
            {
                name: "Priyanka Das",
                role: "Logo Designer",
                bio: "Specialized in logo design and visual metaphors. I craft symbols that represent the core essence of modern brands, creating timeless marks that resonate with audiences worldwide.",
                image: "https://i.pinimg.com/736x/61/b6/fa/61b6fa6ed35d5f64a9355ea06751d5ef.jpg"
            },
            {
                name: "Rima Khatun",
                role: "Brand Designer",
                bio: "Expert in brand systems and design consistency. I ensure every touchpoint of your brand feels premium and cohesive, from digital interfaces to physical brand experiences.",
                image: "https://i.pinimg.com/736x/fd/16/61/fd1661e37922f95caf71070edadf6f85.jpg"
            }
        ];

        let tmIndex = 0;
        const tmImage = document.getElementById('tmImage');
        const tmName = document.getElementById('tmName');
        const tmRole = document.getElementById('tmRole');
        const tmBio = document.getElementById('tmBio');
        const tmPrev = document.getElementById('tmPrev');
        const tmNext = document.getElementById('tmNext');
        const tmScrollUp = document.getElementById('tmScrollUp');
        const tmThumbs = document.querySelectorAll('.tm-thumb');

        function tmUpdate(index, force) {
            if (index === tmIndex && !force) return;
            tmIndex = ((index % tmData.length) + tmData.length) % tmData.length;
            const d = tmData[tmIndex];

            // Fade out
            tmImage.classList.add('fading');
            tmName.classList.add('fading');
            tmBio.classList.add('fading');

            setTimeout(() => {
                tmImage.src = d.image;
                tmImage.alt = d.name;
                tmName.textContent = d.name;
                tmRole.textContent = d.role;
                tmBio.textContent = d.bio;

                tmImage.onload = () => {
                    tmImage.classList.remove('fading');
                };
                // fallback
                setTimeout(() => tmImage.classList.remove('fading'), 400);
                tmName.classList.remove('fading');
                tmBio.classList.remove('fading');
            }, 320);

            // Update thumbnails
            tmThumbs.forEach((th, i) => th.classList.toggle('active', i === tmIndex));
        }

        // Thumbnail clicks
        tmThumbs.forEach((thumb, i) => {
            thumb.addEventListener('click', () => {
                tmUpdate(i);
                resetAutoPlay();
            });
        });

        // Arrow buttons
        if (tmPrev) tmPrev.addEventListener('click', () => { tmUpdate(tmIndex - 1); resetAutoPlay(); });
        if (tmNext) tmNext.addEventListener('click', () => { tmUpdate(tmIndex + 1); resetAutoPlay(); });

        // Auto-play: only runs while team section is visible
        let tmAutoPlay = null;

        function startAutoPlay() {
            if (tmAutoPlay) return; // already running
            tmAutoPlay = setInterval(() => {
                tmUpdate(tmIndex + 1, true);
            }, 7000);
        }

        function stopAutoPlay() {
            clearInterval(tmAutoPlay);
            tmAutoPlay = null;
        }

        function resetAutoPlay() {
            stopAutoPlay();
            startAutoPlay();
        }

        // Start auto-play only when team section enters the viewport
        const tmSection = document.getElementById('team') || tmSlider.closest('section') || tmSlider;
        if ('IntersectionObserver' in window) {
            const tmObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        startAutoPlay();
                    } else {
                        stopAutoPlay();
                    }
                });
            }, { threshold: 0.3 });
            tmObserver.observe(tmSection);
        }

        // Pause on hover, resume on leave (only if section is visible)
        const tmSliderEl = document.getElementById('tmSlider');
        if (tmSliderEl) {
            tmSliderEl.addEventListener('mouseenter', () => stopAutoPlay());
            tmSliderEl.addEventListener('mouseleave', () => {
                // Only restart if currently in section view
                if (tmSection.getBoundingClientRect().top < window.innerHeight * 0.7) {
                    startAutoPlay();
                }
            });
        }
    }
});
