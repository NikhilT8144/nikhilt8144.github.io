    // Store chat history locally
    let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];

    // Function to send message
    function sendMessage() {
        const message = document.getElementById('userMessage').value.trim();
        if (message !== '') {
            // Display the user's message
            displayMessage('You', message);

            // Send to PHP for response
            fetch('https://nikhilt8144.great-site.net/chatbot.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `userMessage=${encodeURIComponent(message)}`
            })
            .then(response => response.json())
            .then(data => {
                displayMessage('Nite', data.botResponse);
                // Save the chat history locally
                chatHistory.push({ user: message, bot: data.botResponse });
                localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
            })
            .catch(error => console.error('Error:', error));

            // Clear input
            document.getElementById('userMessage').value = '';
        }
    }

    // Function to display message
    function displayMessage(sender, message) {
        const chatBody = document.getElementById('chat-body');
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatBody.appendChild(messageElement);
        chatBody.scrollTop = chatBody.scrollHeight; // Auto-scroll
    }

    // Function to load chat history from local storage
    function loadChatHistory() {
        if (chatHistory.length > 0) {
            chatHistory.forEach(chat => {
                displayMessage('You', chat.user);
                displayMessage('Nite', chat.bot);
            });
        }
    }

    // Function to reset chat history
    function resetChat() {
        localStorage.removeItem('chatHistory');
        chatHistory = [];
        document.getElementById('chat-body').innerHTML = '';
    }

    window.onload = function() {
        loadChatHistory();
    };
