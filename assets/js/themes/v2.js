        // Initialize AOS
        AOS.init({
            duration: 1000,
            once: true
        });

        // Wait for all resources to load
        window.addEventListener('load', () => {
            // Remove loader with proper checks
            const loader = document.querySelector('.loader');
            if (loader) {
                setTimeout(() => {
                    loader.style.opacity = '0';
                    setTimeout(() => {
                        loader.style.display = 'none';
                    }, 500);
                }, 1000);
            }

            // Initialize GSAP Animation
            const gsapBox = document.getElementById('gsap-box');
            if (gsapBox && window.gsap) {
                gsap.to('#gsap-box', {
                    duration: 2,
                    rotation: 360,
                    x: 100,
                    scale: 1.5,
                    repeat: -1,
                    yoyo: true,
                    ease: "elastic.out(1, 0.3)",
                    transformOrigin: '50% 50%'
                });
            }

            // Initialize Anime.js Animation
            const animeBox = document.getElementById('anime-box');
            if (animeBox && window.anime) {
                anime({
                    targets: '#anime-box',
                    translateX: 250,
                    scale: {
                        value: 2,
                        duration: 1600,
                        delay: 800,
                        easing: 'easeInOutQuart'
                    },
                    rotate: {
                        value: '1turn',
                        duration: 1800,
                        easing: 'easeInOutSine'
                    },
                    loop: true,
                    direction: 'alternate'
                });
            }

            // Initialize Vanilla-tilt
            if (window.VanillaTilt) {
                VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
                    max: 25,
                    speed: 400,
                    scale: 1.1,
                    transition: true,
                    easing: "cubic-bezier(.03,.98,.52,.99)",
                });
            }

            // Initialize Tippy.js
            if (window.tippy) {
                tippy('[data-tippy-content]', {
                    placement: 'top',
                    animation: 'scale',
                    theme: 'light'
                });
            }

            // Initialize Chart.js
            const ctx = document.getElementById('myChart')?.getContext('2d');
            if (ctx && window.Chart) {
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
                        datasets: [{
                            label: 'Data Statistics',
                            data: [12, 19, 3, 5, 2, 3],
                            borderColor: getComputedStyle(document.documentElement)
                                .getPropertyValue('--primary').trim(),
                            tension: 0.4,
                            fill: false
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'top',
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }

            // Scroll Progress Bar
            window.addEventListener('scroll', () => {
                const winScroll = document.documentElement.scrollTop;
                const height = document.documentElement.scrollHeight - 
                              document.documentElement.clientHeight;
                const scrolled = (winScroll / height) * 100;
                const progressBar = document.querySelector('.progress-bar');
                if (progressBar) {
                    progressBar.style.width = scrolled + '%';
                }
            });
        });

        // Enhanced Error Handling
        window.onerror = function(msg, url, lineNo, columnNo, error) {
            console.error('Error Details:', {
                message: msg,
                url: url,
                line: lineNo,
                column: columnNo,
                error: error
            });
            return false;
        };

        // Library Loading Check
        document.addEventListener('DOMContentLoaded', () => {
            const requiredLibraries = {
                'gsap': window.gsap,
                'anime': window.anime,
                'VanillaTilt': window.VanillaTilt,
                'Chart': window.Chart,
                'tippy': window.tippy,
                'AOS': window.AOS
            };

            Object.entries(requiredLibraries).forEach(([name, lib]) => {
                if (!lib) {
                    console.error(`Required library ${name} is not loaded`);
                }
            });
        });
