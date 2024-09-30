$(document).ready(function() {
    const backendURL = "https://nikhilt8144.serv00.net";

    // Handle signup
    $('#signupForm').submit(function(e) {
        e.preventDefault();

        const username = $('#username').val();
        const password = $('#password').val();

        $.post(`${backendURL}/signup.php`, { username, password }, function(response) {
            if (response.success) {
                showAlert('Signup successful! Redirecting to login...', 'success');
                setTimeout(() => window.location.href = 'login.html', 2000);
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
