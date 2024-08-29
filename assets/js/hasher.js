// /assets/js/hasher.js

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

    fetch('https://nikhilt8144.great-site.net/hash/index.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include'  // Include credentials like cookies if needed
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            document.getElementById('result').innerHTML = `<p class="animate__animated animate__fadeIn">Hashed Result: ${result.hashedResult}</p>`;
            document.getElementById('hashInput').value = '';  // Clear the input field
        } else {
            document.getElementById('result').innerHTML = '<p class="animate__animated animate__fadeIn">Error: Unable to hash input</p>';
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
