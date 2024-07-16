document.getElementById('hashForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const hashInput = document.getElementById('hashInput').value;
    const hashType = document.getElementById('hashType').value;
    const serverUrl = 'https://nikhilt8144.great-site.net/managehash';

    // Display the hash locally
    let hashedResult = '';

    try {
        switch (hashType) {
            case 'md5':
                hashedResult = CryptoJS.MD5(hashInput).toString(CryptoJS.enc.Hex);
                break;
            case 'sha1':
                hashedResult = CryptoJS.SHA1(hashInput).toString(CryptoJS.enc.Hex);
                break;
            case 'sha256':
                hashedResult = CryptoJS.SHA256(hashInput).toString(CryptoJS.enc.Hex);
                break;
            default:
                hashedResult = 'Unsupported hash type';
        }
    } catch (error) {
        hashedResult = 'Error hashing input';
    }

    // Display the result locally
    document.getElementById('result').innerHTML = `<p class="animate__animated animate__fadeIn">${hashedResult}</p>`;

    // Prepare data to be sent to the server
    const data = {
        hash: hashInput,
        hashType: hashType,
        hashedResult: hashedResult
    };

    // Send data to the server using fetch
    fetch(serverUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
