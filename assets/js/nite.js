$(document).ready(function() {
    let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];

    function sendMessage() {
        const message = $('#userMessage').val().trim();
        if (message !== '') {
            displayMessage('user', message);

            $.post('https://nikhilt8144.great-site.net/chatbot.php', { userMessage: message }, function(data) {
                if (data.botResponse) {
                    displayMessage('bot', data.botResponse);
                    chatHistory.push({ user: message, bot: data.botResponse });
                    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
                } else {
                    displayMessage('bot', 'Sorry, there was an error generating the response.');
                }
            }, 'json').fail(function(xhr, status, error) {
                console.error('Error:', error);
                displayMessage('bot', 'Sorry, there was an error communicating with the server.');
            });

            $('#userMessage').val('');
        }
    }

    function displayMessage(sender, message) {
        const messageElement = $('<div>').addClass('message').addClass(sender);
        messageElement.html(`<p>${message}</p>`);
        $('#chat-body').append(messageElement);
        $('#chat-body').scrollTop($('#chat-body')[0].scrollHeight);
    }

    function loadChatHistory() {
        if (chatHistory.length > 0) {
            chatHistory.forEach(chat => {
                displayMessage('user', chat.user);
                displayMessage('bot', chat.bot);
            });
        }
    }

    function resetChat() {
        localStorage.removeItem('chatHistory');
        chatHistory = [];
        $('#chat-body').empty();
    }

    $('#sendButton').click(sendMessage);
    $('#userMessage').on('keypress', function(event) {
        if (event.which === 13 && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });
    $('#resetButton').click(resetChat);

    loadChatHistory();
});
