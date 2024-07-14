document.getElementById('hashForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const hashInput = document.getElementById('hashInput').value.trim();
    const resultsDiv = document.getElementById('results');
    const loadingSpinner = document.getElementById('loadingSpinner');

    if (!hashInput) {
        resultsDiv.innerHTML = '<div class="alert alert-danger">Please enter a hash.</div>';
        return;
    }

    resultsDiv.innerHTML = '';
    loadingSpinner.style.display = 'inline-block';

    // Example known hashes (In a real scenario, this should come from a server or a larger database)
    const knownHashes = {
        '5d41402abc4b2a76b9719d911017c592': 'hello',
        '098f6bcd4621d373cade4e832627b4f6': 'test',
        'e99a18c428cb38d5f260853678922e03': 'abc123'
    };

    setTimeout(() => {
        loadingSpinner.style.display = 'none';

        if (knownHashes[hashInput]) {
            resultsDiv.innerHTML = `<div class="alert alert-success">Hash matches with: <strong>${knownHashes[hashInput]}</strong></div>`;
        } else {
            resultsDiv.innerHTML = '<div class="alert alert-warning">No match found for the given hash.</div>';
        }
    }, 1000);
});
