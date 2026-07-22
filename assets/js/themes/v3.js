$(document).ready(function() {
    gsap.registerPlugin(ScrollTrigger);

    // --- 1. JS Nav Initialization (Prevents FOUC) ---
    $('#hamburger-btn, #desktop-links').removeClass('init-state');
    let isDesktop = window.innerWidth >= 768;
    
    if (isDesktop) {
        $('#desktop-links').css({ display: 'flex' });
        $('#hamburger-btn').hide();
    } else {
        $('#desktop-links').hide();
        $('#hamburger-btn').css({ display: 'flex' });
    }
    
    // --- 2. Sequence-Driven Mobile Menu Timeline ---
    const menuTl = gsap.timeline({ paused: true, reversed: true });

    menuTl.to('#mobile-menu', {
        y: 0, autoAlpha: 1, duration: 0.7,
        ease: "cubic-bezier(0.16, 1, 0.3, 1)" // Ookla-style drop
    })
    .to('.mobile-link-wrapper', {
        y: 0, autoAlpha: 1, stagger: 0.1, duration: 0.5,
        ease: "power3.out"
    }, "-=0.35");

    $('#hamburger-btn').on('click', function() {
        $(this).toggleClass('menu-open');
        if ($(this).hasClass('menu-open')) {
            $('body').css('overflow', 'hidden'); 
            menuTl.play(); 
        } else {
            $('body').css('overflow', '');
            menuTl.reverse(); 
        }
    });

    $('.mobile-link').on('click', function() {
        $('#hamburger-btn').removeClass('menu-open');
        $('body').css('overflow', '');
        menuTl.reverse();
    });

    // --- 3. Custom Responsive Breakpoint Choreography ---
    let resizeTimer;
    $(window).on('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            const currentlyDesktop = window.innerWidth >= 768;
            
            if (currentlyDesktop && !isDesktop) {
                // MOBILE -> DESKTOP
                isDesktop = true;
                
                // Close mobile menu smoothly if open
                if ($('#hamburger-btn').hasClass('menu-open')) {
                    $('#hamburger-btn').removeClass('menu-open');
                    menuTl.reverse();
                    $('body').css('overflow', '');
                }

                // Fade out Hamburger
                gsap.to('#hamburger-btn', { 
                    opacity: 0, scale: 0.8, duration: 0.3, 
                    onComplete: () => $('#hamburger-btn').hide() 
                });

                // Stagger Desktop Links in from right to left
                $('#desktop-links').css('display', 'flex');
                gsap.fromTo('.desktop-link', 
                    { x: 30, opacity: 0 }, 
                    { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out", delay: 0.1, overwrite: true }
                );

            } else if (!currentlyDesktop && isDesktop) {
                // DESKTOP -> MOBILE
                isDesktop = false;
                
                // Stagger Desktop Links out to the right
                gsap.to('.desktop-link', {
                    x: 30, opacity: 0, duration: 0.3, stagger: 0.05, ease: "power2.in", overwrite: true,
                    onComplete: () => {
                        $('#desktop-links').hide();
                        
                        // Pop Hamburger in
                        $('#hamburger-btn').css('display', 'flex');
                        gsap.fromTo('#hamburger-btn', 
                            { opacity: 0, scale: 0.5 }, 
                            { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.5)" }
                        );
                    }
                });
            }
        }, 50); 
    });

    // --- 4. Optimized Staggered Section Entrances ---
    gsap.set('.fade-up', { y: 30, opacity: 0, autoAlpha: 0 });
    ScrollTrigger.batch('.fade-up', {
        interval: 0.15, batchMax: 3,
        onEnter: batch => gsap.to(batch, { autoAlpha: 1, y: 0, stagger: 0.15, duration: 1.0, ease: "power3.out", overwrite: true }),
        onLeaveBack: batch => gsap.to(batch, { autoAlpha: 0, y: 30, stagger: 0.1, duration: 0.6, ease: "power2.in", overwrite: true }),
        start: "top 85%",
    });

    // --- 5. Taptic Engine Synthesis ---
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;

    function triggerHapticSound() {
        if (!audioCtx) audioCtx = new AudioContext();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.05);

        gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

        osc.connect(gainNode); gainNode.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + 0.05);

        if (navigator.vibrate) navigator.vibrate(15);
    }

    const $hapticTrigger = $('#haptic-trigger');
    const $hapticCard = $('#haptic-card');
    const $hapticIcon = $('#haptic-icon');

    $hapticTrigger.on('pointerdown', function(e) {
        e.stopPropagation();
        triggerHapticSound();
        
        gsap.to($hapticCard[0], { scale: 0.94, duration: 0.05, ease: "power1.out", boxShadow: "0 2px 10px 0 rgba(0,0,0,0.5)" });
        gsap.to($hapticIcon[0], { scale: 0.8, backgroundColor: "rgba(255,255,255,0.3)", duration: 0.05 });
    });

    $hapticTrigger.on('pointerup pointerleave', function() {
        gsap.to($hapticCard[0], { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.4)", boxShadow: "0 8px 32px 0 rgba(0,0,0,0.3)" });
        gsap.to($hapticIcon[0], { scale: 1, backgroundColor: "rgba(255,255,255,0.1)", duration: 0.4, ease: "back.out(1.5)" });
    });

    // --- 6. 3D Tilt Logic ---
    const $wrappers = $('.tilt-card-wrapper');
    $wrappers.on('mousemove', function(e) {
        if (window.matchMedia("(max-width: 768px)").matches) return;
        if ($(this).attr('id') === 'haptic-trigger' && e.buttons === 1) return;
        
        const $card = $(this).find('.tilt-card');
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left, y = e.clientY - rect.top;
        const centerX = rect.width / 2, centerY = rect.height / 2;
        
        gsap.to($card[0], {
            rotateX: -((y - centerY) / centerY) * 8, rotateY: ((x - centerX) / centerX) * 8,
            scale: 1.02, duration: 0.5, ease: "power2.out", overwrite: "auto"
        });
        
        $card.find('.shimmer').css({'opacity': '1', 'background': `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 60%)`});
    });
    
    $wrappers.on('mouseleave', function() {
        if (window.matchMedia("(max-width: 768px)").matches) return;
        const $card = $(this).find('.tilt-card');
        gsap.to($card[0], { rotateX: 0, rotateY: 0, scale: 1, duration: 0.7, ease: "power2.out" });
        $(this).find('.shimmer').css('opacity', '0');
    });

    // --- 7. Dynamic Nav Scroll State ---
    let ticking = false;
    $(window).on('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                if ($(window).scrollTop() > 50) {
                    $('#navbar').css({
                        'background': 'rgba(20, 20, 20, 0.7)',
                        'border-color': 'rgba(255, 255, 255, 0.05)'
                    });
                } else {
                    $('#navbar').css({
                        'background': 'rgba(30, 30, 30, 0.35)',
                        'border-color': 'rgba(255, 255, 255, 0.15)'
                    });
                }
                ticking = false;
            });
            ticking = true;
        }
    });
});
