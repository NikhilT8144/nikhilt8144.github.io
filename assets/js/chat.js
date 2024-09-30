$(document).ready(function() {
    const backendURL = "https://nikhilt8144.serv00.net";
    
    // Load chat messages
    function loadMessages() {
        $.get(`${backendURL}/get_messages.php`, function(data) {
            $('#chatMessages').html('');
            data.forEach(message => {
                const messageClass = message.username === localStorage.getItem('username') ? 'sent' : 'received';
                $('#chatMessages').append(`<div class="message ${messageClass}"><strong>${message.username}:</strong> ${message.text}</div>`);
            });
        });
    }

    // Send a message
    $('#messageForm').submit(function(e) {
        e.preventDefault();
        const messageText = $('#messageInput').val();

        $.post(`${backendURL}/send_message.php`, { text: messageText }, function(response) {
            if (response.success) {
                loadMessages(); // Reload messages after sending
                $('#messageInput').val(''); // Clear input
            } else {
                showAlert(response.message, 'danger');
            }
        }, 'json');
    });

    // Load messages on page load
    loadMessages();

    // Poll for new messages
    setInterval(loadMessages, 3000); // Refresh messages every 3 seconds

    // Show alert function
    function showAlert(message, type) {
        const alertBox = $('#alert');
        alertBox.removeClass('alert-info alert-success alert-danger').addClass(`alert-${type}`);
        alertBox.text(message).show();
        setTimeout(() => alertBox.hide(), 3000); // Hide after 3 seconds
    }
});
