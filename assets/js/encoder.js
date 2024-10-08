document.getElementById('hashForm').addEventListener('submit', function(e) {
    e.preventDefault();  // Prevent form from submitting and reloading the page

    const hashInput = document.getElementById('hashInput').value;
    const hashType = document.getElementById('hashType').value;
    const submitButton = e.target.querySelector('button[type="submit"]');

    // Disable the submit button to prevent multiple submissions
    submitButton.disabled = true;

    const data = {
        hash: hashInput,
        hashType: hashType
    };

    // Send input data to the backend PHP script for hashing and storing in the database
    fetch('https://nikhilt8144.serv00.net/encode/index.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(result => {
        if (result.success) {
            document.getElementById('result').innerHTML = `<p class="animate__animated animate__fadeIn">Hashed Result: ${result.hashedResult}</p>`;
            // Do not clear the input field unless you want to manually
        } else {
            document.getElementById('result').innerHTML = `<p class="animate__animated animate__fadeIn">Error: ${result.error}</p>`;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('result').innerHTML = `<p class="animate__animated animate__fadeIn">Error: ${error.message}</p>`;
    })
    .finally(() => {
        // Re-enable the submit button after processing is done
        submitButton.disabled = false;
    });
});
