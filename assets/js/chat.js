$(document).ready(function () {
    // Initialize lastMessageId to track the latest message
    let lastMessageId = 0;

    // Fetch messages initially
    fetchMessages();

    // Handle Enter Chat Button
    $('#enterChatBtn').click(function () {
        let name = $('#nameInput').val().trim();
        if (name !== "") {
            $('.name-input-section').hide();
            $('.chat-section').show();
            // Store user's name
            sessionStorage.setItem('username', name);
            $('.chat-header h3').html(`<i class="fas fa-comments"></i> Welcome, ${name}`);
        } else {
            alert("Please enter your name!");
        }
    });

    // Handle Send Message Button
    $('#sendBtn').click(function () {
        sendMessage();
    });

    // Send message on Enter key press
    $('#messageInput').keypress(function (e) {
        if (e.which === 13) { // Enter key
            sendMessage();
            return false; // Prevent default form submission
        }
    });

    // Fetch messages every 2 seconds
    setInterval(fetchMessages, 2000);

    // Function to fetch messages from the server
    function fetchMessages() {
        $.ajax({
            url: 'https://nikhilt8144.serv00.net/fetch_messages.php',
            type: 'GET',
            dataType: 'json',  // Expect JSON response
            success: function (data) {
                console.log(data);  // Debugging

                if (Array.isArray(data)) {
                    // Clear the chat body
                    $('#chatBody').html('');

                    // Loop through each message and display it
                    data.forEach(function (msg) {
                        let messageClass = msg.username === sessionStorage.getItem('username') ? 'user-message' : 'other-message';
                        let messageDiv = $('<div>').addClass('message ' + messageClass);
                        let messageBubble = $('<div>').addClass('message-bubble').text(msg.message);
                        messageDiv.append(messageBubble);
                        $('#chatBody').append(messageDiv);
                    });

                    // Scroll to the bottom of the chat body
                    $('#chatBody').scrollTop($('#chatBody')[0].scrollHeight);
                } else if (data.status === 'empty') {
                    console.log("No messages yet.");
                } else {
                    console.error("Unexpected response format:", data);
                }
            },
            error: function (xhr, status, error) {
                console.error("Error fetching messages:", {
                    xhr: xhr,
                    status: status,
                    error: error,
                    responseText: xhr.responseText  // Log the response text for further debugging
                });
            }
        });
    }

    // Function to send a message to the server
    function sendMessage() {
        let message = $('#messageInput').val().trim();
        if (message !== "") {
            let username = sessionStorage.getItem('username');

            $.ajax({
                url: 'https://nikhilt8144.serv00.net/send_message.php',
                type: 'POST',
                data: {
                    username: username,
                    message: message
                },
                success: function (response) {
                    $('#messageInput').val(''); // Clear the input field
                    fetchMessages(); // Fetch messages again to update the chat
                },
                error: function (xhr, status, error) {
                    console.error("Error sending message:", {
                        xhr: xhr,
                        status: status,
                        error: error,
                        responseText: xhr.responseText  // Log the response text for further debugging
                    });
                }
            });
        }
    }
});
