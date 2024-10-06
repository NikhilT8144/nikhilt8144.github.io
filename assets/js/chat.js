$(document).ready(function() {
    // Function to fetch messages
    function fetchMessages() {
        $.ajax({
            type: 'GET',
            url: 'https://nikhilt8144.serv00.net/fetch_messages.php',
            dataType: 'json',
            success: function(data) {
                if (Array.isArray(data)) {
                    $('#messages-container').empty(); // Clear existing messages
                    data.forEach(function(message) {
                        const messageDiv = $('<div class="message"></div>');
                        messageDiv.append('<strong>' + message.username + ':</strong> ' + message.message);
                        messageDiv.append('<span class="timestamp">' + new Date(message.timestamp).toLocaleString() + '</span>');
                        $('#messages-container').append(messageDiv);
                    });
                } else if (data.status === "empty") {
                    $('#messages-container').empty(); // Clear existing messages
                } else {
                    console.error("Error fetching messages:", data.error);
                }
            },
            error: function(xhr, status, error) {
                console.error("Error fetching messages:", xhr.responseText);
            }
        });
    }

    // Function to send a message
    function sendMessage() {
        var username = $('#username-input').val();
        var message = $('#message-input').val();

        if (username === "" || message === "") {
            alert("Username and message cannot be empty!");
            return; // Prevent sending if fields are empty
        }

        $.ajax({
            type: 'POST',
            url: 'https://nikhilt8144.serv00.net/send_message.php',
            data: { username: username, message: message },
            dataType: 'json',
            success: function(response) {
                if (response.status === "success") {
                    $('#message-input').val(''); // Clear the message input
                    fetchMessages(); // Fetch messages again to update the chat
                } else if (response.error) {
                    console.error("Error sending message:", response.error);
                }
            },
            error: function(xhr, status, error) {
                console.error("AJAX Error:", error);
            }
        });
    }

    // Handle Enter key to send messages
    $('#message-input').keypress(function(event) {
        if (event.which === 13) { // Check for Enter key (key code 13)
            event.preventDefault(); // Prevent the default action (newline in textarea)
            sendMessage(); // Call the sendMessage function
        }
    });

    // Handle send button click
    $('#send-button').click(function() {
        sendMessage(); // Call the sendMessage function
    });

    // Fetch messages on page load
    fetchMessages();

    // Optionally, you can set an interval to fetch messages periodically
    setInterval(fetchMessages, 3000); // Fetch messages every 3 seconds
});
