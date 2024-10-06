$(document).ready(function () {
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
  
function fetchMessages() {
    $.ajax({
        url: 'https://nikhilt8144.serv00.net/fetch_messages.php',
        type: 'GET',
        dataType: 'json', // Specify that you're expecting a JSON response
        success: function (data) {
            console.log(data); // Check the response
            if (Array.isArray(data)) {
                $('#chatBody').html(''); // Clear existing messages
                data.forEach(function (msg) {
                    let messageClass = msg.username === sessionStorage.getItem('username') ? 'user-message' : 'other-message';
                    let messageDiv = $('<div>').addClass('message ' + messageClass);
                    // Include username in the message bubble
                    let messageBubble = $('<div>').addClass('message-bubble').html(`<strong>${msg.username}:</strong> ${msg.message}`);
                    messageDiv.append(messageBubble);
                    $('#chatBody').append(messageDiv);
                });
                $('#chatBody').scrollTop($('#chatBody')[0].scrollHeight); // Auto-scroll to the bottom
            } else if (data.status === 'empty') {
                console.log("No messages yet.");
            } else {
                console.error("Unexpected response format:", data);
            }
        },
        error: function (error) {
            console.error("Error fetching messages:", error);
        }
    });
}


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
                    $('#messageInput').val(''); // Clear input field
                    fetchMessages(); // Refresh message list
                },
                error: function (error) {
                    console.error("Error sending message:", error);
                }
            });
        }
    }

    function addMessage(content, type, animate = true) {
        let messageDiv = $('<div>').addClass('message ' + type);
        let messageBubble = $('<div>').addClass('message-bubble').text(content);
        if (animate) {
            messageBubble.addClass('animate__animated animate__fadeInUp');
        }
        messageDiv.append(messageBubble);
        $('#chatBody').append(messageDiv);
        $('#chatBody').scrollTop($('#chatBody')[0].scrollHeight);
    }
});
