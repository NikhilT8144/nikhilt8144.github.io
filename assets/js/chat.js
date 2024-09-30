document.addEventListener("DOMContentLoaded", () => {
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-btn');
    const messagesDiv = document.getElementById('messages');
    const alertArea = document.getElementById('alert-area');
    const loadingDiv = document.getElementById('loading');

    let userName = '';
    const takenUsernames = new Set(); // Set to track taken usernames

    // Function to ask for a unique username
    function requestUsername() {
        const namePrompt = document.createElement('div');
        namePrompt.className = 'input-group mb-3';
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control';
        input.placeholder = 'Enter your username...';
        const submitButton = document.createElement('button');
        submitButton.className = 'btn btn-primary';
        submitButton.textContent = 'Submit';

        submitButton.addEventListener('click', () => {
            const enteredName = input.value.trim();
            if (enteredName && !takenUsernames.has(enteredName)) {
                userName = enteredName;
                takenUsernames.add(userName);
                localStorage.setItem('userName', userName);
                showAlert(`Welcome, ${userName}!`, 'success');
                namePrompt.remove(); // Remove the prompt
                loadMessages();
            } else if (takenUsernames.has(enteredName)) {
                showAlert('Username already taken. Please choose another.', 'danger');
            } else {
                showAlert('Please enter a valid username.', 'warning');
            }
        });

        namePrompt.appendChild(input);
        namePrompt.appendChild(submitButton);
        document.body.insertBefore(namePrompt, document.body.firstChild);
    }

    // Check if username is already stored
    userName = localStorage.getItem('userName');
    if (!userName) {
        requestUsername();
    } else {
        takenUsernames.add(userName); // Mark the existing user name as taken
        showAlert(`Welcome back, ${userName}!`, 'success');
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
        loadingDiv.classList.remove('d-none'); // Show loading animation
        fetch('https://nikhilt8144.serv00.net/server.php')
            .then(response => response.json())
            .then(data => {
                messagesDiv.innerHTML = '';
                data.forEach(msg => {
                    const messageDiv = document.createElement('div');
                    messageDiv.className = `message ${msg.name === userName ? 'user' : 'other'} animate__animated animate__fadeIn`;
                    
                    const nameSpan = document.createElement('span');
                    nameSpan.textContent = `${msg.name}`;
                    
                    // Check for verified users
                    if (['Admin', 'Nikhil', 'System', 'NikhilT8144'].includes(msg.name)) {
                        nameSpan.classList.add('verified');
                        nameSpan.innerHTML += ' <i class="fas fa-check-circle"></i>'; // Add check mark icon
                    }

                    const textSpan = document.createElement('span');
                    textSpan.textContent = `: ${msg.text}`;

                    messageDiv.appendChild(nameSpan);
                    messageDiv.appendChild(textSpan);
                    messagesDiv.appendChild(messageDiv);
                });
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
                loadingDiv.classList.add('d-none'); // Hide loading animation
            })
            .catch(error => {
                showAlert('Error loading messages. Please try again.', 'danger');
                loadingDiv.classList.add('d-none'); // Hide loading animation
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

});
