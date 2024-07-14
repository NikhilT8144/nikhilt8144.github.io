function decodeHash() {
    var hash = document.getElementById('hashInput').value.trim();

    // Simulate decoding process
    var decodedResult = `Decoded hash: ${hash}`;

    document.getElementById('decodedResult').innerHTML = decodedResult;
}
