document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll('nav ul li a');
    
    function scrollToSection(target) {
        const spaceAbove = 0.5 * parseFloat(getComputedStyle(document.documentElement).fontSize); // Converts 0.5rem to pixels
        window.scrollTo({
            top: target.offsetTop - spaceAbove,
            behavior: 'smooth'
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                scrollToSection(targetSection);
            } else {
                console.error('Target section not found:', targetId);
            }
        });
    });

    const scrollPosition = localStorage.getItem('scrollPosition');
    if (scrollPosition) {
        window.scrollTo(0, scrollPosition);
    }

    window.addEventListener('scroll', function () {
        localStorage.setItem('scrollPosition', window.pageYOffset);
    });

    let visitCount = parseInt(getCookieValue('visit')) || 0;
    visitCount++;
    setCookie('visit', visitCount);

    console.log("Visits:", visitCount);
});

window.onscroll = function () {
    scrollFunction();
};

function scrollFunction() {
    const mybutton = document.getElementById("myBtn");
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.classList.add("show");
        mybutton.classList.remove("hide");
    } else {
        mybutton.classList.remove("show");
        mybutton.classList.add("hide");
    }
}

function topFunction() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function getCookieValue(name) {
    const cookie = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookie ? cookie.pop() : '';
}

function setCookie(name, value) {
    document.cookie = name + '=' + value;
}

function reload(){
    window.location.reload();
}

function load(page){
    window.location.href = 'https://nikhilt8144.github.io/' + page;
}
