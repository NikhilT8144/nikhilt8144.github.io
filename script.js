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

document.addEventListener("DOMContentLoaded", function() {
    // Check if the user has a preferred theme mode saved locally
    var savedTheme = localStorage.getItem('theme');

    // Set the theme mode based on the saved value or default to light mode
    if (savedTheme === 'dark') {
        enableDarkMode();
    } else {
        disableDarkMode();
    }

    // Toggle dark mode when the toggle button is clicked
    var toggleButton = document.querySelector('.toggle-button');
    toggleButton.addEventListener('click', function() {
        if (document.body.classList.contains('dark-mode')) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });

    // Function to enable dark mode
    function enableDarkMode() {
        document.body.classList.add('dark-mode');
        toggleButton.classList.add('active');
        document.querySelector('.fa-sun').style.display = 'none';
        document.querySelector('.fa-moon').style.display = 'inline-block';
        localStorage.setItem('theme', 'dark');
    }

    // Function to disable dark mode
    function disableDarkMode() {
        document.body.classList.remove('dark-mode');
        toggleButton.classList.remove('active');
        document.querySelector('.fa-moon').style.display = 'none';
        document.querySelector('.fa-sun').style.display = 'inline-block';
        localStorage.setItem('theme', 'light');
    }
});
