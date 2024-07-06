document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav ul');
  const navLinks = document.querySelectorAll('nav ul li a');

  menuToggle.addEventListener('click', function () {
    nav.classList.toggle('active');
    menuToggle.classList.toggle('menu-open');
  });

  function scrollToSection(target) {
    window.scrollTo({
      top: target.offsetTop - 0,
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

  const visitCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('visit='));
  let visitCount = 0;
  if (visitCookie) {
    visitCount = parseInt(visitCookie.split('=')[1]) || 0;
  }
  visitCount++;
  document.cookie = `visit=${visitCount}`;
  var uservisits = "Visits: " + visitCount;
});
window.onscroll = function () { scrollFunction() };

function scrollFunction() {
  var mybutton = document.getElementById("myBtn");
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

function home(){
  window.location.href = '/';
}

function reload(){
  window.location.reload();
}

function open(url){
  window.location.href = 'https://nikhilt8144.github.io' + url;
}
