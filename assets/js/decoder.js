document.getElementById('hashForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const hashInput = document.getElementById('hashInput').value;
    const hashType = document.getElementById('hashType').value;
    const submitButton = e.target.querySelector('button[type="submit"]');

    // Disable the submit button to prevent multiple submissions
    submitButton.disabled = true;

    const data = {
        hash: hashInput,
        hashType: hashType
    };

    // Send the hash to the backend for verification and decoding from the database
    fetch('https://nikhilt8144.serv00.net/decoder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include'
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            document.getElementById('result').innerHTML = `<p class="animate__animated animate__fadeIn">Decoded Result: ${result.decodedResult}</p>`;
            document.getElementById('hashInput').value = '';  // Clear the input field
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
