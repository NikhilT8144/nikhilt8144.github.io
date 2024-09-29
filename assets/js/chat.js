$(document).ready(function() {
    $('#show-signup').click(function() {
        $('#login-form').addClass('d-none');
        $('#signup-form').removeClass('d-none');
    });
    
    $('#show-login').click(function() {
        $('#signup-form').addClass('d-none');
        $('#login-form').removeClass('d-none');
    });

    $('#login-btn').click(function() {
        const username = $('#login-username').val();
        const password = $('#login-password').val();

        if (validateInput(username, password)) {
            $.post('https://nikhilt8144.serv00.net/backend.php', { action: 'login', username, password }, function(response) {
                if (response.success) {
                    localStorage.setItem('username', username);
                    loadChatSection(username);
                } else {
                    alert(response.message);
                }
            }, 'json');
        }
    });

    $('#signup-btn').click(function() {
        const username = $('#signup-username').val();
        const password = $('#signup-password').val();

        if (validateInput(username, password)) {
            $.post('https://nikhilt8144.serv00.net/backend.php', { action: 'signup', username, password }, function(response) {
                if (response.success) {
                    alert('Signup successful! You can now log in.');
                    $('#show-login').click();
                } else {
                    alert(response.message);
                }
            }, 'json');
        }
    });

    $('#logout-btn').click(function() {
        $.post('https://nikhilt8144.serv00.net/backend.php', { action: 'logout' }, function(response) {
            if (response.success) {
                localStorage.removeItem('username');
                location.reload();
            }
        }, 'json');
    });

    $('#send-message').click(function() {
        const message = $('#message-input').val();
        const username = localStorage.getItem('username');
        if (message) {
            $.post('https://nikhilt8144.serv00.net/backend.php', { action: 'send_message', username, message }, function(response) {
                if (response.success) {
                    $('#messages').append(`<div><strong>${username}:</strong> ${message}</div>`);
                    $('#message-input').val('');
                } else {
                    alert(response.message);
                }
            }, 'json');
        }
    });

    // Fetch messages periodically
    setInterval(fetchMessages, 3000); // Fetch messages every 3 seconds

    function fetchMessages() {
        $.post('https://nikhilt8144.serv00.net/backend.php', { action: 'fetch_messages' }, function(response) {
            if (response.success) {
                $('#messages').empty(); // Clear current messages
                response.messages.forEach(function(msg) {
                    $('#messages').append(`<div><strong>${msg.username}:</strong> ${msg.message}</div>`);
                });
                $('#messages').scrollTop($('#messages')[0].scrollHeight); // Auto-scroll to the bottom
            }
        }, 'json');
    }

    function loadChatSection(username) {
        $('#username').text(username);
        $('#auth-section').addClass('d-none');
        $('#chat-section').removeClass('d-none');
        fetchMessages(); // Load messages when the user logs in
    }

    function validateInput(username, password) {
        if (!username || !password) {
            alert("Both fields are required.");
            return false;
        }
        return true;
    }

    // Handle add friend functionality
    $('#add-friend-btn').click(function() {
        const friendUsername = $('#friend-username').val();
        if (friendUsername) {
            $.post('https://nikhilt8144.serv00.net/backend.php', { action: 'add_friend', friend_username: friendUsername }, function(response) {
                alert(response.message);
            }, 'json');
        } else {
            alert("Friend username cannot be empty.");
        }
    });

    // Handle remove friend functionality
    $('#remove-friend-btn').click(function() {
        const friendUsername = $('#friend-username').val();
        if (friendUsername) {
            $.post('https://nikhilt8144.serv00.net/backend.php', { action: 'remove_friend', friend_username: friendUsername }, function(response) {
                alert(response.message);
            }, 'json');
        } else {
            alert("Friend username cannot be empty.");
        }
    });
});
