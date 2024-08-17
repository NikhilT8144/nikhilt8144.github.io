// hasher.js

document.getElementById('hashForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const hashInput = document.getElementById('hashInput').value;
    const hashType = document.getElementById('hashType').value;

    const data = {
        hash: hashInput,
        hashType: hashType
    };

    fetch('https://cors-anywhere.herokuapp.com/https://nikhilt8144.great-site.net/hash/index.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        mode: 'cors'
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            document.getElementById('result').innerHTML = `<p class="animate__animated animate__fadeIn">Hashed Result: ${result.hashedResult}</p>`;
        } else {
            document.getElementById('result').innerHTML = '<p class="animate__animated animate__fadeIn">Error: Unable to hash input</p>';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('result').innerHTML = `<p class="animate__animated animate__fadeIn">Error: ${error.message}</p>`;
    });
});
