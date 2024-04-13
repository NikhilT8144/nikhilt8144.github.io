// Disable right-click
document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});

// Disable Ctrl+Shift+I
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.shiftKey && event.keyCode === 73) {
        event.preventDefault();
    }
});
