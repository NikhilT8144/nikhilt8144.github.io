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

document.addEventListener('DOMContentLoaded', function() {
  
var app = document.getElementsByTagName("BODY")[0];
  if (localStorage.thememode == "dark") {
    app.setAttribute("theme-mode", "dark");
  }
  
function toggle_light_mode() {
  var app = document.getElementsByTagName("BODY")[0];
  if (localStorage.thememode == "dark") {
    localStorage.thememode = "light";
    app.setAttribute("theme-mode", "light");
  } else {
    localStorage.thememode = "dark";
    app.setAttribute("theme-mode", "dark");
  }       
}

window.addEventListener("storage", function () {
  if (localStorage.thememode == "dark") {
    app.setAttribute("theme-mode", "dark");
  } else {
    app.setAttribute("theme-mode", "light");
  }
}, false);

setInterval(function (){
  document.getElementById('dateandtime').innerHTML = Date();
}, 10);

//notification
let permission = Notification.permission;
if(permission === "granted") {
   showNotification();
} else if(permission === "default"){
   requestAndShowPermission();
} else {
  alert("Allow us to send you notifications to keep you updated.");
}
function showNotification() {
   if(document.visibilityState === "visible) {
       return;
   }
   var title = "Nikhil Tiwari - Portfolio";
   icon = "icon.png"
   var body = "Checking for new messages...";
   var notification = new Notification('Title', { body, icon });
   notification.onclick = () => { 
          notification.close();
          window.parent.focus();
   }
}
function requestAndShowPermission() {
   Notification.requestPermission(function (permission) {
      if (permission === "granted") {
            showNotification();
      }
   });
}
