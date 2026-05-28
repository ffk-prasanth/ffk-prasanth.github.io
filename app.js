/* ==========================================================================
   FFK PRASANTH OFFICIAL UNIVERSE - JAVASCRIPT ANIMATIONS & ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------------------------
    // 0. QUICK INTRO BYPASS FOR SUB-PAGE TRANSITIONS
    // ----------------------------------------------------------------------
    const urlParams = new URLSearchParams(window.location.search);
    const skipParam = urlParams.get('skipIntro') === 'true' || urlParams.get('skip') === 'true';

    // ----------------------------------------------------------------------
    // 1. CONFIGURATION & STATE
    // ----------------------------------------------------------------------
    const state = {
        isLoaded: skipParam,
        introSkipped: skipParam,
        deviceType: window.innerWidth < 768 ? 'mobile' : 'desktop',
    };

    if (skipParam) {
        const intro = document.getElementById('intro-screen');
        if (intro) intro.style.display = 'none';
        
        document.body.classList.remove('loading-active');
        
        const main = document.getElementById('main-app');
        if (main) {
            main.classList.remove('hidden-app');
            main.style.opacity = '1';
            main.style.visibility = 'visible';
        }
        
        // Silently clear the skip parameter from the URL address bar
        // so that a manual browser refresh properly re-triggers the cinematic loading screen!
        try {
            window.history.replaceState({}, document.title, window.location.pathname);
        } catch (e) {
            console.error('Failed to clean URL parameters:', e);
        }
    }

    // Recalculate layout metrics on resize
    window.addEventListener('resize', () => {
        state.deviceType = window.innerWidth < 768 ? 'mobile' : 'desktop';
    });

    // ----------------------------------------------------------------------
    // 2. HIGH-PERFORMANCE CANVAS PARTICLE SYSTEM
    // ----------------------------------------------------------------------
    class ParticleEngine {
        constructor(canvasId, maxParticles) {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.maxParticles = state.deviceType === 'mobile' ? Math.floor(maxParticles * 0.35) : maxParticles;
            this.animationFrameId = null;

            this.resize();
            window.addEventListener('resize', () => this.resize());
            this.init();
            this.animate();
        }

        resize() {
            if (!this.canvas) return;
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.maxParticles = state.deviceType === 'mobile' ? Math.floor(this.maxParticles * 0.35) : this.maxParticles;
        }

        init() {
            this.particles = [];
            for (let i = 0; i < this.maxParticles; i++) {
                this.particles.push(this.createParticle(true));
            }
        }

        createParticle(randomY = false) {
            return {
                x: Math.random() * this.canvas.width,
                y: randomY ? Math.random() * this.canvas.height : this.canvas.height + 20,
                vx: (Math.random() - 0.5) * 1.5,
                vy: -Math.random() * 2.5 - 1.0,
                size: Math.random() * 3.5 + 0.5,
                alpha: Math.random() * 0.5 + 0.3,
                decay: Math.random() * 0.003 + 0.002,
                color: Math.random() > 0.5 ? '255, 95, 0' : '255, 15, 15', // Fire orange vs cinematic red
                sparkle: Math.random() * 0.05
            };
        }

        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            for (let i = 0; i < this.particles.length; i++) {
                const p = this.particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= p.decay;

                // Add subtle sparkle glow variations
                p.alpha += (Math.random() - 0.5) * p.sparkle;
                if (p.alpha < 0) p.alpha = 0;

                // Render ember glow
                this.ctx.save();
                this.ctx.globalAlpha = p.alpha;

                // Outer glow shadow
                this.ctx.shadowBlur = p.size * 2.5;
                this.ctx.shadowColor = `rgba(${p.color}, 0.8)`;

                // Draw rounded ember spark
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgb(${p.color})`;
                this.ctx.fill();
                this.ctx.restore();

                // Recycled dead particles
                if (p.alpha <= 0 || p.y < -20 || p.x < -20 || p.x > this.canvas.width + 20) {
                    this.particles[i] = this.createParticle(false);
                }
            }

            this.animationFrameId = requestAnimationFrame(() => this.animate());
        }

        stop() {
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
            }
        }
    }

    // Initialize background floating embers immediately
    const bgEmbers = new ParticleEngine('bg-canvas', 100);
    // Initialize intro canvas embers
    const introEmbers = new ParticleEngine('intro-canvas', 70);

    // ----------------------------------------------------------------------
    // 3. CINEMATIC INTRO SEQUENCING (GSAP & TIMING)
    // ----------------------------------------------------------------------
    const elements = {
        introScreen: document.getElementById('intro-screen'),
        charContainer: document.getElementById('intro-char-container'),
        purpleEyes: document.getElementById('purple-eyes'),
        groundCrack: document.getElementById('ground-crack'),
        introTitles: document.getElementById('intro-titles'),
        loadingBar: document.getElementById('intro-loading-bar'),
        loadingBarWrapper: document.getElementById('loading-bar-wrapper'),
        loadingText: document.getElementById('loading-text'),
        enterBtn: document.getElementById('enter-btn'),
        skipIntro: document.getElementById('skip-intro'),
        mainApp: document.getElementById('main-app'),
        body: document.body,
    };

    // Logging text updates mapping
    const logs = [
        { percentage: 5, text: "CONNECTING TO FREE FIRE ENGINE..." },
        { percentage: 20, text: "LOADING FFK CREATOR ASSETS..." },
        { percentage: 38, text: "IGNITING CINEMATIC NEON FIRE AURA..." },
        { percentage: 52, text: "CHARGING UP TAMIL MASS DIALOGUES..." },
        { percentage: 70, text: "SYNCING FFK FAMILY HEARTBEAT... ❤️" },
        { percentage: 88, text: "PREPARING CINEMATIC GOOSEBUMPS..." },
        { percentage: 100, text: "LOBBY CONNECTED! WELCOME TO FFK UNIVERSE 🔥" }
    ];

    // Trigger fake progress bar loading logic (Time-based to take exactly 4.5 seconds)
    let currentPercent = 0;
    const totalDuration = 4500; // 4.5 seconds
    const startTime = Date.now();

    const progressInterval = setInterval(() => {
        if (state.introSkipped) {
            clearInterval(progressInterval);
            return;
        }

        const elapsed = Date.now() - startTime;
        currentPercent = Math.min(Math.round((elapsed / totalDuration) * 100), 100);

        // Update progress bar width
        elements.loadingBar.style.width = `${currentPercent}%`;

        // Update logger descriptions
        const logObj = logs.find(log => currentPercent <= log.percentage) || logs[logs.length - 1];
        elements.loadingText.textContent = `${logObj.text} ${currentPercent}%`;

        if (currentPercent >= 100) {
            clearInterval(progressInterval);
            revealEnterButton();
        }
    }, 50);

    // Timeline GSAP for cinematic elements
    const introTimeline = gsap.timeline();

    // Sequence timing steps:
    // Step 1: Slow embers floating on canvas (handled by ParticleEngine).
    // Step 2: At 1.2s, launch FFK character forward from deep screen center.
    introTimeline.to(elements.charContainer, {
        duration: 1.5,
        scale: 1,
        opacity: 1,
        z: 0,
        filter: "blur(0px) brightness(1.2)",
        ease: "power4.out",
        delay: 1.0,
        onStart: () => {
            // Trigger circular shockwave flare from center
            triggerIntroShockwave();
        },
        onComplete: () => {
            // Trigger character landing shockwaves and cracks
            triggerLandingEffects();
        }
    });

    function triggerIntroShockwave() {
        const wave = document.getElementById('intro-shockwave');
        const flash = document.getElementById('intro-flash');
        if (!wave || !flash) return;

        // Animate dynamic blast overlay
        gsap.set(wave, { xPercent: -50, yPercent: -50, left: "50%", top: "50%", scale: 0.1, opacity: 0.8 });
        gsap.to(wave, { duration: 1.2, scale: 60, opacity: 0, ease: "power2.out" });

        // Fast screen brightness flash
        gsap.to(flash, {
            duration: 0.15, opacity: 0.9, ease: "power1.in", onComplete: () => {
                gsap.to(flash, { duration: 0.6, opacity: 0, ease: "power2.out" });
            }
        });
    }

    function triggerLandingEffects() {
        if (state.introSkipped) return;

        // Ground crack expanding
        gsap.to(elements.groundCrack, { duration: 0.4, opacity: 1, scale: 1.3, ease: "back.out(2)" });

        // Purple eyes glow activated
        gsap.to(elements.purpleEyes, {
            duration: 0.3, opacity: 1, scale: 1.1, ease: "power1.out", onComplete: () => {
                // Subtle hover scaling pulsing animation
                elements.purpleEyes.style.animation = "eyePulse 2s infinite ease-in-out";
            }
        });

        // Aura ignition glowing
        const aura = elements.charContainer.querySelector('.fire-aura-flare');
        if (aura) {
            gsap.to(aura, { duration: 0.8, opacity: 0.8, ease: "power2.out" });
        }

        // Viewport screen shake simulation on landing impact
        elements.introScreen.classList.add('camera-shake');
        setTimeout(() => {
            elements.introScreen.classList.remove('camera-shake');
        }, 500);

        // Titles fade-in sequence
        gsap.to(elements.introTitles, { duration: 1.0, opacity: 1, y: 0, ease: "power3.out", delay: 0.2 });
    }

    function revealEnterButton() {
        if (state.isLoaded || state.introSkipped) return;
        state.isLoaded = true;

        // Hide loading bar smoothly
        gsap.to(elements.loadingBarWrapper, {
            duration: 0.5, opacity: 0, y: 15, ease: "power2.in", onComplete: () => {
                elements.loadingBarWrapper.style.display = 'none';

                // Automatically enter lobby immediately (Total 5.0 seconds)
                skipOrEnterLobby();
            }
        });
    }

    // ----------------------------------------------------------------------
    // 4. ENTER LOBBY & TRANSITION LOGIC
    // ----------------------------------------------------------------------
    const skipOrEnterLobby = () => {
        if (state.introSkipped) return;
        state.introSkipped = true;
        clearInterval(progressInterval);

        // Stop intro particle loops
        introEmbers.stop();

        // Explosion audio flash visual overlay trigger
        const flash = document.getElementById('intro-flash');
        if (flash) {
            gsap.set(flash, { opacity: 1 });
            gsap.to(flash, { duration: 0.8, opacity: 0, ease: "power2.out" });
        }

        // Add camera shake on enter transition
        elements.body.classList.add('camera-shake');
        setTimeout(() => elements.body.classList.remove('camera-shake'), 600);

        // Animate Intro Screen slide out
        gsap.to(elements.introScreen, {
            duration: 0.8, opacity: 0, scale: 1.1, ease: "power3.inOut", onComplete: () => {
                elements.introScreen.style.display = 'none';
                elements.body.classList.remove('loading-active');

                // Reveal App Interface
                elements.mainApp.classList.remove('hidden-app');
                gsap.to(elements.mainApp, {
                    duration: 1.0, opacity: 1, ease: "power2.out", onComplete: () => {
                        // Trigger scroll indicator animations
                        gsap.to('.scroll-indicator', { duration: 0.5, opacity: 0.8 });
                    }
                });

                // Animate Hero typography elements in sequence
                gsap.from('.hero-title span', { duration: 1.0, y: 50, opacity: 0, ease: "power4.out", delay: 0.1 });
                gsap.from('.hero-subtitle', { duration: 1.0, y: 30, opacity: 0, ease: "power3.out", delay: 0.3 });
                gsap.from('.hero-buttons', { duration: 1.0, y: 20, opacity: 0, ease: "power2.out", delay: 0.5 });
                gsap.from('.hero-image-card', { duration: 1.2, opacity: 0, ease: "power2.out", delay: 0.4, clearProps: "opacity" });
            }
        });
    };

    if (elements.enterBtn) elements.enterBtn.addEventListener('click', skipOrEnterLobby);
    if (elements.skipIntro) elements.skipIntro.addEventListener('click', skipOrEnterLobby);

    // ----------------------------------------------------------------------
    // 5. RESPONSIVE MENU (HAMBURGER & MOBILE DRAWER)
    // ----------------------------------------------------------------------
    const hamburger = document.getElementById('hamburger-toggle');
    const drawer = document.getElementById('mobile-drawer');
    const links = document.querySelectorAll('.mobile-link');
    const drawerCloseBtn = document.getElementById('drawer-close');

    const toggleMenu = () => {
        hamburger.classList.toggle('active');
        drawer.classList.toggle('active');
    };

    hamburger.addEventListener('click', toggleMenu);

    if (drawerCloseBtn) {
        drawerCloseBtn.addEventListener('click', () => {
            hamburger.classList.remove('active');
            drawer.classList.remove('active');
        });
    }

    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            drawer.classList.remove('active');
        });
    });

    // Close drawer when clicked outside
    document.addEventListener('click', (e) => {
        if (drawer.classList.contains('active') && !drawer.contains(e.target) && e.target !== hamburger && !hamburger.contains(e.target)) {
            toggleMenu();
        }
    });

    // ----------------------------------------------------------------------
    // 6. PREMIUM INTERACTIVE ABOUT CARDS (3D MOUSE TILT EFFECT)
    // ----------------------------------------------------------------------
    const tiltCards = document.querySelectorAll('.hover-tilt');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (state.deviceType === 'mobile') {
                card.style.transform = 'none';
                return;
            }

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x coordinate inside the element.
            const y = e.clientY - rect.top;  // y coordinate inside the element.

            const cardWidth = rect.width;
            const cardHeight = rect.height;

            // Calculate tilt angle relative to center (-12deg to 12deg max)
            const angleX = -((y - cardHeight / 2) / (cardHeight / 2)) * 10;
            const angleY = ((x - cardWidth / 2) / (cardWidth / 2)) * 10;

            // Render 3D rotation transform values
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateZ(8px)`;
        });

        card.addEventListener('mouseleave', () => {
            // Smoothly reset tilt matrices on exit
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });

    // ----------------------------------------------------------------------
    // 7. HIGH FPS "FIRE PODUNGA GUYS" CLICK BLAST ENGINE
    // ----------------------------------------------------------------------
    const fireTrigger = document.getElementById('fire-podunga-trigger');
    const explCanvas = document.getElementById('explosion-canvas');
    let explCtx = null;
    let sparks = [];
    let explAnimationId = null;

    if (explCanvas) {
        explCtx = explCanvas.getContext('2d');
        explCanvas.width = window.innerWidth;
        explCanvas.height = window.innerHeight;
        window.addEventListener('resize', () => {
            explCanvas.width = window.innerWidth;
            explCanvas.height = window.innerHeight;
        });
    }

    class ExplSpark {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 12 + 4; // Fast expanding vector
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed - (Math.random() * 3 + 2); // Drift upwards
            this.size = Math.random() * 6 + 2;
            this.alpha = 1;
            this.decay = Math.random() * 0.02 + 0.015; // Fast decay
            this.color = Math.random() > 0.4 ? '255, 95, 0' : '255, 15, 15'; // Red vs orange sparks
            if (Math.random() > 0.8) this.color = '255, 220, 0'; // Splash of yellow ember heat
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.15; // Add gravity friction force pulling sparks down
            this.alpha -= this.decay;
            this.size *= 0.96; // Shrink size over lifetime
        }

        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.shadowBlur = this.size * 3;
            ctx.shadowColor = `rgba(${this.color}, 0.8)`;

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgb(${this.color})`;
            ctx.fill();
            ctx.restore();
        }
    }

    function renderExplosionFrame() {
        if (!explCtx) return;
        explCtx.clearRect(0, 0, explCanvas.width, explCanvas.height);

        sparks = sparks.filter(spark => {
            spark.update();
            spark.draw(explCtx);
            return spark.alpha > 0 && spark.size > 0.1;
        });

        if (sparks.length > 0) {
            explAnimationId = requestAnimationFrame(renderExplosionFrame);
        } else {
            cancelAnimationFrame(explAnimationId);
            explAnimationId = null;
        }
    }

    const fireEmojis = ["🔥", "❤️", "💥", "🔥", "❤️"];

    function spawnFloatingEmoji(x, y) {
        const emoji = document.createElement('div');
        emoji.className = 'floating-emoji';
        emoji.textContent = fireEmojis[Math.floor(Math.random() * fireEmojis.length)];

        // Random horizontal spawn offset
        const xOffset = (Math.random() - 0.5) * 160;
        emoji.style.left = `${x + xOffset}px`;
        emoji.style.top = `${y - 20}px`;

        // Random typography sizing and rotations
        const scale = Math.random() * 1.5 + 0.8;
        const rotate = (Math.random() - 0.5) * 60;
        emoji.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${rotate}deg)`;

        // Custom absolute css styles
        emoji.style.position = 'fixed';
        emoji.style.pointerEvents = 'none';
        emoji.style.fontSize = '32px';
        emoji.style.zIndex = '99999';
        emoji.style.transition = 'all 2.0s cubic-bezier(0.1, 0.8, 0.3, 1)';
        emoji.style.opacity = '1';

        elements.body.appendChild(emoji);

        // Animate up and fade away
        setTimeout(() => {
            const finalY = y - 300 - Math.random() * 150;
            const finalX = x + xOffset + (Math.random() - 0.5) * 120;
            emoji.style.top = `${finalY}px`;
            emoji.style.left = `${finalX}px`;
            emoji.style.opacity = '0';
            emoji.style.transform = `translate(-50%, -50%) scale(0.1) rotate(${rotate * 2}deg)`;
        }, 50);

        // Cleanup DOM element
        setTimeout(() => {
            emoji.remove();
        }, 2200);
    }

    const triggerFireExplosion = (e) => {
        // Toggle action clicked class state
        fireTrigger.classList.add('clicked');
        setTimeout(() => fireTrigger.classList.remove('clicked'), 400);

        // Find absolute trigger coordinate position
        const rect = fireTrigger.getBoundingClientRect();
        const triggerX = rect.left + rect.width / 2;
        const triggerY = rect.top + rect.height / 2;

        // Generate sparks on Canvas
        const sparkCount = state.deviceType === 'mobile' ? 40 : 120;
        for (let i = 0; i < sparkCount; i++) {
            sparks.push(new ExplSpark(triggerX, triggerY));
        }

        // Render Canvas sparks
        if (!explAnimationId) {
            renderExplosionFrame();
        }

        // Spawn drifting emojis
        const emojiCount = state.deviceType === 'mobile' ? 6 : 14;
        for (let i = 0; i < emojiCount; i++) {
            setTimeout(() => {
                spawnFloatingEmoji(triggerX, triggerY);
            }, i * 75);
        }

        // Viewport screen rumble vibration
        const mainContainer = document.getElementById('main-app');
        if (mainContainer) {
            mainContainer.classList.add('camera-shake');
            setTimeout(() => {
                mainContainer.classList.remove('camera-shake');
            }, 500);
        }
    };

    fireTrigger.addEventListener('click', triggerFireExplosion);

    const fireLabel = document.getElementById('fire-podunga-label');
    if (fireLabel) {
        fireLabel.addEventListener('click', triggerFireExplosion);
        fireLabel.style.cursor = 'pointer';
    }

    // ----------------------------------------------------------------------
    // 8. SCROLL REVEAL & STATISTIC NUMBER COUNTERS
    // ----------------------------------------------------------------------
    const revealSections = document.querySelectorAll('.scroll-reveal');

    const animateNumber = (element) => {
        const targetVal = parseInt(element.getAttribute('data-target'), 10);
        if (isNaN(targetVal)) return;

        let currentVal = 0;
        const duration = 2000; // Counter timing in milliseconds
        const steps = 60;
        const stepVal = targetVal / steps;
        const stepTime = duration / steps;
        let stepCount = 0;

        const countTimer = setInterval(() => {
            currentVal += stepVal;
            stepCount++;

            if (stepCount >= steps) {
                currentVal = targetVal;
                clearInterval(countTimer);
            }

            // Format numbers with commas (e.g. 150,000,000)
            element.textContent = Math.floor(currentVal).toLocaleString() + "+";
        }, stepTime);
    };

    // IntersectionObserver options configuration
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Activates when 15% visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');

                // Trigger counts within this section if not already triggered
                const counters = entry.target.querySelectorAll('.channel-subs, .stat-number');
                counters.forEach(counter => {
                    if (!counter.classList.contains('counted')) {
                        counter.classList.add('counted');
                        animateNumber(counter);
                    }
                });

                // Unobserve section once revealed
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealSections.forEach(section => {
        sectionObserver.observe(section);
    });

    // ----------------------------------------------------------------------
    // 9. ACTIVE NAVIGATION TRACKING
    // ----------------------------------------------------------------------
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let currentSectionId = 'hero';

        sections.forEach(sec => {
            const sectionTop = sec.offsetTop;
            const sectionHeight = sec.clientHeight;
            if (pageYOffset >= (sectionTop - 250)) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // ----------------------------------------------------------------------
    // 10. REAL-TIME AUTOMATIC YOUTUBE LIVE CHECKER
    // ----------------------------------------------------------------------
    async function checkYouTubeLiveStatus(handle) {
        try {
            // Uses a free, highly reliable CORS proxy to inspect the public live endpoint of your channel
            const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(`https://www.youtube.com/${handle}/live`)}`;
            const response = await fetch(proxyUrl);
            if (!response.ok) return false;

            const html = await response.text();

            // Premium API-free Detection:
            // 1. YouTube redirects the /live URL of an active live stream to watch?v=VIDEO_ID.
            // 2. We extract the canonical link from the returned HTML.
            // 3. If the canonical link contains 'watch?v=', it is redirected to a live watch page, meaning they are actively live.
            // 4. Fallback check for '"isLive":true' in JSON configs inside the script tags.
            const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)"/);
            const canonicalUrl = canonicalMatch ? canonicalMatch[1] : "";
            const isWatchPage = canonicalUrl.includes("watch?v=");

            // Check if it's an upcoming scheduled stream instead of actively live
            const isUpcoming = html.includes('"isUpcoming":true') ||
                html.includes('isUpcoming":true') ||
                html.includes('"style":"UPCOMING"') ||
                html.includes('style":"UPCOMING"') ||
                html.includes('upcomingEventData');

            const isLive = isWatchPage && !isUpcoming && (html.includes('"isLive":true') || html.includes('isLive":true'));

            return !!isLive;
        } catch (error) {
            console.error(`YouTube Live Checker encountered error for ${handle}:`, error);
            return false;
        }
    }

    async function initializeLiveStreamChecker() {
        // Map channel handles to their corresponding DOM card elements and live badges
        const channels = [
            {
                handle: "@FFK_Prasanth",
                badgeId: "live-card-badge-main",
                cardSelector: "#channels .channel-card:nth-child(1)"
            },
            {
                handle: "@FFKPrasanth_Shorts",
                badgeId: "live-card-badge-shorts",
                cardSelector: "#channels .channel-card:nth-child(2)"
            },
            {
                handle: "@FFKPrasanth_Live",
                badgeId: "live-card-badge-live",
                cardSelector: "#channels .channel-card:nth-child(3)"
            },
            {
                handle: "@ffkprasanth07",
                badgeId: "live-card-badge-plays",
                cardSelector: "#channels .channel-card:nth-child(4)"
            },
            {
                handle: "@FFKDeepak-d9o",
                badgeId: "live-card-badge-deepak",
                cardSelector: "#channels .channel-card:nth-child(5)"
            }
        ];

        try {
            // Check all channels in parallel for maximum performance
            const checkPromises = channels.map(async (chan) => {
                const liveStatus = await checkYouTubeLiveStatus(chan.handle);
                return { ...chan, isLive: liveStatus };
            });

            const results = await Promise.all(checkPromises);

            // Check if any of FFK Prasanth's streaming channels are live (or Deepak)
            const liveChannels = results.filter(res => res.isLive);
            const anyChannelLive = liveChannels.length > 0;

            if (anyChannelLive) {
                // Activate header and mobile nav indicators
                const headerBadge = document.getElementById('live-badge-header');
                const mobileDot = document.getElementById('live-dot-mobile');

                if (headerBadge) headerBadge.style.display = 'inline-flex';
                if (mobileDot) mobileDot.style.display = 'inline';

                // Activate cards and individual badges for each live channel
                liveChannels.forEach(chan => {
                    const cardBadge = document.getElementById(chan.badgeId);
                    if (cardBadge) cardBadge.style.display = 'inline-block';

                    const cardElem = document.querySelector(chan.cardSelector);
                    if (cardElem) {
                        cardElem.classList.add('live-active-glow');
                    }
                    console.log(`FFK Streamer is currently LIVE on ${chan.handle}! Card highlighted.`);
                });
            } else {
                console.log("All FFK channels are currently offline. Stream indicators on standby.");
            }
        } catch (err) {
            console.error("Error running global live stream check engine:", err);
        }
    }

    // Fire off the checker instantly on load
    initializeLiveStreamChecker();

});
