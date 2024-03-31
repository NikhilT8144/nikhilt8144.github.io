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

// Dark mode toggle
var toggleSwitch = document.querySelector('#theme-toggle');

toggleSwitch.addEventListener('change', function(event) {
  if (event.target.checked) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
});
