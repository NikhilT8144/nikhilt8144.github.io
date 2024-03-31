// Function to show/hide sections based on URL hash
function showSection() {
  // Get the hash from the URL
  var hash = window.location.hash;
  
  // Hide all sections
  var sections = document.querySelectorAll('section');
  sections.forEach(function(section) {
    section.style.display = 'none';
  });
  
  // Show the section corresponding to the hash
  var targetSection = document.querySelector(hash);
  if (targetSection) {
    targetSection.style.display = 'block';
  }
}

// Call the function on page load and when the hash changes
window.addEventListener('load', showSection);
window.addEventListener('hashchange', showSection);

// Function to toggle dark/light mode
function savemode() {
  var checkbox = document.getElementById('mode');
  if (checkbox.checked) {
    localStorage.setItem('viewmode', 'light');
    document.body.classList.remove('dark');
    document.getElementsByTagName('header').classList.remove('dark');
    document.getElementsByTagName('nav').classList.remove('dark');
    document.getElementsByTagName('footer').classList.remove('dark');
  } else {
    localStorage.setItem('viewmode', 'dark');
    document.body.classList.add('dark');
    document.getElementsByTagName('header').classList.add('dark');
    document.getElementsByTagName('nav').classList.add('dark');
    document.getElementsByTagName('footer').classList.add('dark');
  }
}

function getsavemode() {
  var checkboxState = localStorage.getItem('viewmode');
  if (checkboxState === 'checked') {
    document.getElementById('mode').checked = true;
    document.body.classList.remove('dark');
    document.getElementsByTagName('header').classList.remove('dark');
    document.getElementsByTagName('nav').classList.remove('dark');
    document.getElementsByTagName('footer').classList.remove('dark');
  } else {
    document.getElementById('mode').checked = false;
    document.body.classList.add('dark');
    document.getElementsByTagName('header').classList.add('dark');
    document.getElementsByTagName('nav').classList.add('dark');
    document.getElementsByTagName('footer').classList.add('dark');
  }
}

document.getElementById('main').addEventListener('change', function() {
  savemode();
});

window.onload = function() {
  getsavemode();
};

