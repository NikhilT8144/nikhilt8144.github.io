document.addEventListener("DOMContentLoaded", function () {
        // Initialize GSAP
        gsap.registerPlugin(ScrollTrigger);

        // Mobile menu functionality
        const menuBtn = document.getElementById("menu-btn");
        const closeBtn = document.getElementById("close-menu");
        const mobileMenu = document.getElementById("mobile-menu");
        const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

        menuBtn.addEventListener("click", () => {
          mobileMenu.classList.remove("translate-x-full");
          mobileMenu.classList.add("translate-x-0");
        });

        closeBtn.addEventListener("click", () => {
          mobileMenu.classList.remove("translate-x-0");
          mobileMenu.classList.add("translate-x-full");
        });

        mobileNavLinks.forEach((link) => {
          link.addEventListener("click", () => {
            mobileMenu.classList.remove("translate-x-0");
            mobileMenu.classList.add("translate-x-full");
          });
        });

        // Smooth scroll functionality
        const navLinks = document.querySelectorAll('a[href^="#"]');

        navLinks.forEach((link) => {
          link.addEventListener("click", function (e) {
            e.preventDefault();

            const targetId = this.getAttribute("href");
            if (targetId === "#") return;

            const targetElement = document.querySelector(targetId);
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition =
              elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          });
        });

        // Back to top button
        const backToTopBtn = document.getElementById("back-to-top");

        window.addEventListener("scroll", () => {
          if (window.scrollY > 300) {
            gsap.to(backToTopBtn, {
              y: 0,
              opacity: 1,
              duration: 0.3,
            });
          } else {
            gsap.to(backToTopBtn, {
              y: 20,
              opacity: 0,
              duration: 0.3,
            });
          }
        });

        backToTopBtn.addEventListener("click", () => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        });

        // Form submission
        const contactForm = document.getElementById("contactForm");

        contactForm.addEventListener("submit", function (e) {
          e.preventDefault();
          // You can add your form submission logic here
          alert("Message sent successfully!");
          contactForm.reset();
        });

        // GSAP Animations

        // Hero section animations
        gsap.from(".hero-title span", {
          y: 50,
          opacity: 0,
          stagger: 0.2,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.5,
        });

        gsap.from(".hero-subtitle", {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 1,
        });

        gsap.from(".hero-buttons", {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 1.2,
        });

        gsap.from(".hero-image", {
          scale: 0.8,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          delay: 0.7,
        });

        // Section animations
        const sections = document.querySelectorAll("section:not(#hero)");

        sections.forEach((section) => {
          const sectionTitle = section.querySelector(".section-title");
          const sectionContent = section.querySelectorAll(
            ".project-card, .skill-card, form, .about-image"
          );

          gsap.from(sectionTitle, {
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
          });

          gsap.from(sectionContent, {
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
            },
            y: 30,
            opacity: 0,
            stagger: 0.2,
            duration: 0.8,
            ease: "power3.out",
          });
        });

        // Page transition animation
        const pageTransition = document.querySelector(".page-transition");

        // Initial page load animation
        gsap.to(pageTransition, {
          y: "-100%",
          duration: 1,
          ease: "power4.inOut",
        });

        // Navigation transitions
        function load(page) {
          // Show transition
          gsap.to(pageTransition, {
            y: 0,
            duration: 0.5,
            ease: "power4.inOut",
            onComplete: () => {
              // Redirect to page
              window.location.href = "https://nikhilt8144.github.io/" + page;
            },
          });
        }

        function reload() {
          // Show transition
          gsap.to(pageTransition, {
            y: 0,
            duration: 0.5,
            ease: "power4.inOut",
            onComplete: () => {
              // Reload page
              window.location.reload();
            },
          });
        }

        // Track page visit count with localStorage
        let visitCount = parseInt(localStorage.getItem("visitCount")) || 0;
        visitCount++;
        localStorage.setItem("visitCount", visitCount);

        // Cursor animation (custom cursor)
        const cursor = document.createElement("div");
        cursor.className = "custom-cursor";
        document.body.appendChild(cursor);

        const cursorDot = document.createElement("div");
        cursorDot.className = "cursor-dot";
        document.body.appendChild(cursorDot);

        // Add styles for cursor
        const cursorStyle = document.createElement("style");
        cursorStyle.innerHTML = `
                .custom-cursor {
                    position: fixed;
                    width: 30px;
                    height: 30px;
                    border: 2px solid rgba(14, 165, 233, 0.3);
                    border-radius: 50%;
                    pointer-events: none;
                    transform: translate(-50%, -50%);
                    transition: transform 0.1s ease;
                    z-index: 9999;
                }
                
                .cursor-dot {
                    position: fixed;
                    width: 8px;
                    height: 8px;
                    background-color: rgb(14, 165, 233);
                    border-radius: 50%;
                    pointer-events: none;
                    transform: translate(-50%, -50%);
                    z-index: 9999;
                }
                
                a:hover ~ .custom-cursor,
                button:hover ~ .custom-cursor {
                    transform: translate(-50%, -50%) scale(1.5);
                    background-color: rgba(14, 165, 233, 0.1);
                }
            `;
        document.head.appendChild(cursorStyle);

        // Cursor movement
        document.addEventListener("mousemove", (e) => {
          gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.2,
          });

          gsap.to(cursorDot, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1,
          });
        });

        // Hide default cursor
        document.body.style.cursor = "none";

        // Add cursor effects on interactive elements
        const interactiveElements = document.querySelectorAll("a, button");

        interactiveElements.forEach((el) => {
          el.addEventListener("mouseenter", () => {
            cursor.classList.add("grow");
          });

          el.addEventListener("mouseleave", () => {
            cursor.classList.remove("grow");
          });
        });

        // Parallax effect on hero section
        document.addEventListener("mousemove", parallax);

        function parallax(e) {
          const heroSection = document.querySelector("#hero");
          const moveX = (e.clientX - window.innerWidth / 2) / 20;
          const moveY = (e.clientY - window.innerHeight / 2) / 20;

          gsap.to(".hero-image", {
            x: moveX,
            y: moveY,
            duration: 1,
          });
        }

        // Project card hover effects
        const projectCards = document.querySelectorAll(".project-card");

        projectCards.forEach((card) => {
          card.addEventListener("mouseenter", () => {
            gsap.to(card, {
              y: -10,
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
              duration: 0.3,
            });
          });

          card.addEventListener("mouseleave", () => {
            gsap.to(card, {
              y: 0,
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              duration: 0.3,
            });
          });
        });

        // Skill card hover effects
        const skillCards = document.querySelectorAll(".skill-card");

        skillCards.forEach((card) => {
          card.addEventListener("mouseenter", () => {
            gsap.to(card, {
              y: -5,
              borderColor: "rgba(14, 165, 233, 0.3)",
              background: "linear-gradient(145deg, #ffffff, #f8fafc)",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.07)",
              duration: 0.3,
            });
          });

          card.addEventListener("mouseleave", () => {
            gsap.to(card, {
              y: 0,
              borderColor: "rgba(241, 245, 249, 1)",
              background: "#ffffff",
              boxShadow: "none",
              duration: 0.3,
            });
          });
        });

        // Text typing animation
        const typingText = document.querySelector(".hero-subtitle");
        const textToType = typingText.textContent;
        typingText.textContent = "";

        let i = 0;
        const typeWriter = () => {
          if (i < textToType.length) {
            typingText.textContent += textToType.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
          }
        };

        // Start typing animation after initial hero animations
        setTimeout(typeWriter, 1500);

        // Theme switcher
        const themeToggle = document.createElement("button");
        themeToggle.className =
          "fixed top-24 right-8 bg-white text-slate-800 dark:bg-slate-800 dark:text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-50 transition-all";
        themeToggle.innerHTML =
          '<i data-lucide="sun" class="w-6 h-6 dark:hidden"></i><i data-lucide="moon" class="w-6 h-6 hidden dark:block"></i>';
        document.body.appendChild(themeToggle);

        // Check for saved theme preference or prefer-color-scheme
        const userTheme = localStorage.getItem("theme");
        const systemTheme = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;

        // Initial theme check
        if (userTheme === "dark" || (!userTheme && systemTheme)) {
          document.documentElement.classList.add("dark");
        }

        // Theme toggle functionality
        themeToggle.addEventListener("click", () => {
          document.documentElement.classList.toggle("dark");

          // Update local storage
          if (document.documentElement.classList.contains("dark")) {
            localStorage.setItem("theme", "dark");
          } else {
            localStorage.setItem("theme", "light");
          }

          // Update icons
          lucide.createIcons();
        });

        // Update dark mode styles
        const darkModeStyles = document.createElement("style");
        darkModeStyles.innerHTML = `
                .dark body {
                    background-color: #0f172a;
                    color: #e2e8f0;
                }
                
                .dark .bg-white {
                    background-color: #1e293b;
                }
                
                .dark .text-slate-800 {
                    color: #e2e8f0;
                }
                
                .dark .text-slate-600 {
                    color: #cbd5e1;
                }
                
                .dark .border-slate-100 {
                    border-color: #334155;
                }
                
                .dark .bg-slate-50 {
                    background-color: #0f172a;
                }
                
                .dark .bg-slate-100 {
                    background-color: #1e293b;
                }
                
                .dark input, .dark textarea {
                    background-color: #334155;
                    border-color: #475569;
                    color: #e2e8f0;
                }
                
                .dark .skill-card {
                    background-color: #1e293b;
                    border-color: #334155;
                }
                
                .dark .bg-primary\/10 {
                    background-color: rgba(14, 165, 233, 0.2);
                }
            `;
        document.head.appendChild(darkModeStyles);

        // Initialize Lucide icons again to account for newly added icons
        lucide.createIcons();
      });
