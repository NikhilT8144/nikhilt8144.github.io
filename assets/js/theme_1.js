// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Go to Top Button Visibility and Scroll
const upButton = document.getElementById('up');

window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        upButton.style.opacity = '1';
        upButton.style.visibility = 'visible';
    } else {
        upButton.style.opacity = '0';
        upButton.style.visibility = 'hidden';
    }
});

upButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Initial Hero Content Animations
gsap.fromTo(".hero-content",
    {
        opacity: 0,
        y: 100
    },
    {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power3.out"
    }
);

// Scroll Indicator Animation
gsap.to(".scroll-indicator", {
    y: 20,
    duration: 1,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut"
});

// Feature Cards Content
const features = [
    {
        icon: "speed",
        title: "Lightning Fast",
        description: "Optimized performance for smooth user experience",
        color: "#4facfe"
    },
    {
        icon: "brush",
        title: "Modern Design",
        description: "Clean and contemporary UI/UX principles",
        color: "#FF6B6B"
    },
    {
        icon: "auto_awesome",
        title: "Animations",
        description: "Amazing fluid animations powered by GSAP",
        color: "#FFE66D"
    }
];

// Load Features with Enhanced Animation
function loadFeatures() {
    const featureSection = document.getElementById('features-section');

    // Clear existing content
    featureSection.innerHTML = '';

    // Create and append feature cards
    features.forEach((feature, index) => {
        const colDiv = document.createElement('div');
        colDiv.className = 'col-lg-4 col-md-6';

        const cardDiv = document.createElement('div');
        cardDiv.className = 'feature-card text-center';

        const iconSpan = document.createElement('span');
        iconSpan.className = 'material-icons-round';
        iconSpan.style.color = feature.color;
        iconSpan.textContent = feature.icon;

        const titleH4 = document.createElement('h4');
        titleH4.className = 'mb-3';
        titleH4.textContent = feature.title;

        const descP = document.createElement('p');
        descP.className = 'mb-0 text-muted';
        descP.textContent = feature.description;

        cardDiv.appendChild(iconSpan);
        cardDiv.appendChild(titleH4);
        cardDiv.appendChild(descP);

        colDiv.appendChild(cardDiv);
        featureSection.appendChild(colDiv);
    });

    // Scroll-Triggered Animation for Features
    gsap.fromTo(".feature-card",
        {
            opacity: 0,
            y: 100
        },
        {
            scrollTrigger: {
                trigger: "#features-section",
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.inOut"
        }
    );
}

// Load features when DOM is ready
document.addEventListener('DOMContentLoaded', loadFeatures);

// Explore Button Scroll
document.getElementById('explore').addEventListener('click', () => {
    const targetElement = document.getElementById('features-section');
    const targetPosition = targetElement.offsetTop - 100;

    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
});

// Animated Box Interactions
const box = document.getElementById('animated-box');
box.addEventListener('mouseenter', () => {
    gsap.to(box, {
        scale: 1.2,
        rotation: 180,
        duration: 0.5,
        ease: "power2.out"
    });
});

box.addEventListener('mouseleave', () => {
    gsap.to(box, {
        scale: 1,
        rotation: 0,
        duration: 0.5,
        ease: "power2.out"
    });
});