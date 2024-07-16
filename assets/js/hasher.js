document.getElementById('hashForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const hashInput = document.getElementById('hashInput').value;
    const hashType = document.getElementById('hashType').value;

    // Prepare data to send as JSON
    const data = {
        hash: hashInput,
        hashType: hashType
    };

    // Fetch API endpoint with POST method to your PHP backend
    fetch('https://your-backend-server.com/managehash/index.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        // Update UI with success message or result if applicable
        if (result.success) {
            document.getElementById('result').innerHTML = `<p class="animate__animated animate__fadeIn">Hashed Result: ${result.hashedResult}</p>`;
        } else {
            document.getElementById('result').innerHTML = '<p class="animate__animated animate__fadeIn">Error: Unable to hash input</p>';
        }
    })
    .catch(error => {
        // Handle error here
        console.error('Error:', error);
        // Update UI with error message
        document.getElementById('result').innerHTML = `<p class="animate__animated animate__fadeIn">Error: ${error.message}</p>`;
    });
});
