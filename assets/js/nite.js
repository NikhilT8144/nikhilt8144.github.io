$(document).ready(function() {
    // Store chat history locally
    let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];

    // Function to send message
    function sendMessage() {
        const message = $('#userMessage').val().trim();
        if (message !== '') {
            // Display the user's message
            displayMessage('user', message);

            // Send to PHP for response
            $.post('https://nikhilt8144.great-site.net/chatbot.php', { userMessage: message }, function(data) {
                if (data.botResponse) {
                    displayMessage('bot', data.botResponse);
                    // Save the chat history locally
                    chatHistory.push({ user: message, bot: data.botResponse });
                    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
                } else {
                    displayMessage('bot', 'Sorry, there was an error generating the response.');
                }
            }, 'json').fail(function(xhr, status, error) {
                console.error('Error:', error);
                displayMessage('bot', 'Sorry, there was an error communicating with the server.');
            });

            // Clear input
            $('#userMessage').val('');
        }
    }

    // Function to display message
    function displayMessage(sender, message) {
        const messageElement = $('<div>').addClass('message').addClass(sender);
        messageElement.html(`<p>${message}</p>`);
        $('#chat-body').append(messageElement);
        $('#chat-body').scrollTop($('#chat-body')[0].scrollHeight); // Auto-scroll
    }

    // Function to load chat history from local storage
    function loadChatHistory() {
        if (chatHistory.length > 0) {
            chatHistory.forEach(chat => {
                displayMessage('user', chat.user);
                displayMessage('bot', chat.bot);
            });
        }
    }

    // Function to reset chat history
    function resetChat() {
        localStorage.removeItem('chatHistory');
        chatHistory = [];
        $('#chat-body').empty();
    }

    // Event listeners
    $('#sendButton').click(sendMessage);
    $('#userMessage').on('keypress', function(event) {
        if (event.which === 13 && !event.shiftKey) { // Enter key without Shift
            event.preventDefault();
            sendMessage();
        }
    });
    $('#resetButton').click(resetChat);

    // Load chat history on page load
    loadChatHistory();
});
