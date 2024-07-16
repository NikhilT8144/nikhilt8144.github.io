document.getElementById('hashForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const hashInput = document.getElementById('hashInput').value;
    const hashType = document.getElementById('hashType').value;
    let decodedResult = '';

    try {
        switch (hashType) {
            case 'md5':
                decodedResult = CryptoJS.MD5(hashInput).toString(CryptoJS.enc.Hex);
                break;
            case 'sha1':
                decodedResult = CryptoJS.SHA1(hashInput).toString(CryptoJS.enc.Hex);
                break;
            case 'sha256':
                decodedResult = CryptoJS.SHA256(hashInput).toString(CryptoJS.enc.Hex);
                break;
            default:
                decodedResult = 'Unsupported hash type';
        }
    } catch (error) {
        decodedResult = 'Error decoding hash';
    }

    document.getElementById('result').innerHTML = `<p class="animate__animated animate__fadeIn">${decodedResult}</p>`;
});
