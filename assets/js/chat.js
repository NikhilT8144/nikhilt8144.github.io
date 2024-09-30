document.addEventListener("DOMContentLoaded", () => {
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-btn');
    const messagesDiv = document.getElementById('messages');
    const alertArea = document.getElementById('alert-area');

    // Get or set user name
    let userName = localStorage.getItem('userName');
    if (!userName) {
        userName = prompt("Please enter your name:");
        if (userName) {
            localStorage.setItem('userName', userName);
            showAlert(`Welcome, ${userName}!`, 'success');
        } else {
            showAlert('Name is required to use the chat.', 'danger');
            return;
        }
    }

    // Function to send message
    function sendMessage() {
        const messageText = messageInput.value.trim();
        if (messageText) {
            const message = {
                name: userName,
                text: messageText,
                time: new Date().toISOString()
            };

            fetch('https://nikhilt8144.serv00.net/server.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(message)
            }).then(response => {
                if (response.ok) {
                    messageInput.value = '';
                    loadMessages();
                } else {
                    showAlert('Error sending message. Please try again.', 'danger');
                }
            });
        } else {
            showAlert('Message cannot be empty.', 'warning');
        }
    }

    // Function to load messages
    function loadMessages() {
        fetch('https://nikhilt8144.serv00.net/server.php')
            .then(response => response.json())
            .then(data => {
                messagesDiv.innerHTML = '';
                data.forEach(msg => {
                    const messageDiv = document.createElement('div');
                    messageDiv.className = `message ${msg.name === userName ? 'user' : 'other'} animate__animated animate__fadeIn`;
                    messageDiv.textContent = `${msg.name}: ${msg.text}`;
                    messagesDiv.appendChild(messageDiv);
                });
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
            })
            .catch(error => {
                showAlert('Error loading messages. Please try again.', 'danger');
            });
    }

    // Function to show alerts
    function showAlert(message, type) {
        alertArea.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
    }

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Load messages every 2 seconds
    setInterval(loadMessages, 2000);

    // Clear messages at midnight
    setInterval(() => {
        const now = new Date();
        if (now.getHours() === 0 && now.getMinutes() === 0) {
            fetch('https://nikhilt8144.serv00.net/server.php', { method: 'DELETE' });
        }
    }, 60000); // Check every minute
});
