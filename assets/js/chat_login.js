$(document).ready(function() {
    const backendURL = "https://nikhilt8144.serv00.net";

    // Handle login
    $('#loginForm').submit(function(e) {
        e.preventDefault();

        const username = $('#username').val();
        const password = $('#password').val();

        $.post(`${backendURL}/login.php`, { username, password }, function(response) {
            if (response.success) {
                localStorage.setItem('username', username); // Store username
                window.location.href = 'index.html'; // Redirect to chat
            } else {
                showAlert(response.message, 'danger');
            }
        }, 'json');
    });

    // Show alert function
    function showAlert(message, type) {
        const alertBox = $('#alert');
        alertBox.removeClass('alert-info alert-success alert-danger').addClass(`alert-${type}`);
        alertBox.text(message).show();
        setTimeout(() => alertBox.hide(), 3000); // Hide after 3 seconds
    }
});
