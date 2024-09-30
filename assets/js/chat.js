// script.js

const backendURL = "https://nikhilt8144.serv00.net"; // Backend URL (PHP hosted on Serv00)

// Handle message sending
document.addEventListener('DOMContentLoaded', function() {
    const messageForm = document.getElementById('messageForm');
    const messageInput = document.getElementById('messageInput');
    const chatMessages = document.getElementById('chatMessages');

    // Send message on form submit
    messageForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const messageText = messageInput.value.trim();
        if (messageText) {
            // Send message to backend
            $.post(`${backendURL}/send_message.php`, { message: messageText }, function(response) {
                // Add message to chat window on success
                const messageElement = document.createElement('div');
                messageElement.classList.add('message', 'user', 'animated', 'fadeInUp');
                messageElement.innerHTML = `<div class="text">${messageText}</div>`;
                chatMessages.appendChild(messageElement);

                // Scroll to bottom
                chatMessages.scrollTop = chatMessages.scrollHeight;

                // Clear message input
                messageInput.value = '';
            });
        }
    });

    // Load messages from the backend
    function loadMessages() {
        $.get(`${backendURL}/load_messages.php`, function(messages) {
            chatMessages.innerHTML = '';
            messages.forEach(msg => {
                const messageElement = document.createElement('div');
                messageElement.classList.add('message', 'animated', 'fadeInUp');
                messageElement.innerHTML = `<div class="text">${msg.message}</div>`;
                chatMessages.appendChild(messageElement);
            });
        });
    }

    // Refresh messages every 2 seconds
    setInterval(loadMessages, 2000);

    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', function() {
        $.get(`${backendURL}/logout.php`, function() {
            window.location.href = 'login.html'; // Redirect to login page after logout
        });
    });
});
