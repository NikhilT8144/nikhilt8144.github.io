    function toggleTheme() {
      const toggler = document.getElementById("toggler");
      const body = document.body;
      const themeStatus = document.getElementById("theme-status");

      if (toggler.checked) {
        // Apply dark theme
        body.classList.add("dark");
        body.classList.remove("light");
        themeStatus.textContent = "Dark Mode";
      } else {
        // Apply light theme
        body.classList.add("light");
        body.classList.remove("dark");
        themeStatus.textContent = "Light Mode";
      }
    }

    // Wait for the DOM to load before initializing the theme.
    document.addEventListener("DOMContentLoaded", function() {
      toggleTheme();
    });
    
    window.addEventListner("keypress", function (e) {
      if (e.key === "Enter") {
        toggler.click();
      } else {
        return false;
      }
    })
