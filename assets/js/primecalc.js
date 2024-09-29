// Check if a number is prime
function isPrime(n) {
    if (n <= 1) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) return false;
    }
    return true;
}

// Validate inputs and update button state
function validateInputs() {
    const lowerLimit = document.getElementById('lowerLimit').value;
    const upperLimit = document.getElementById('upperLimit').value;
    const calculateButton = document.getElementById('calculateButton');

    // Enable button if both inputs are filled
    calculateButton.disabled = !(lowerLimit && upperLimit);
}

// Calculate primes and display results dynamically
function calculatePrimes() {
    const lowerLimit = parseInt(document.getElementById('lowerLimit').value);
    const upperLimit = parseInt(document.getElementById('upperLimit').value);
    const errorContainer = document.getElementById('errorContainer');

    errorContainer.innerHTML = ''; // Clear previous messages

    // Validate user input
    if (isNaN(lowerLimit) || isNaN(upperLimit)) {
        displayError('Please enter valid integers.');
        return;
    }

    if (lowerLimit < 0) {
        displayError('Lower limit must be greater than or equal to 0.');
        return;
    }

    if (upperLimit < lowerLimit) {
        displayError('Upper limit must be greater than or equal to lower limit.');
        return;
    }

    let primeCount = 0;
    let resultsHTML = ''; // Store results in a variable

    // Loop through the range to find primes
    for (let num = lowerLimit; num <= upperLimit; num++) {
        if (isPrime(num)) {
            resultsHTML += `<div class="result-item animate__animated animate__fadeIn">${num}</div>`;
            primeCount++;
        }
    }

    // Display results inside errorContainer
    if (resultsHTML) {
        errorContainer.innerHTML += resultsHTML; // Append results to the container
    } else {
        errorContainer.innerHTML += '<div class="alert alert-info animate__animated animate__fadeIn"><i class="fas fa-info-circle"></i> No prime numbers found in the given range.</div>';
    }

    // Display total prime count
    const primeCountSpan = document.getElementById('primeCount');
    primeCountSpan.innerHTML = `<i class="fas fa-hashtag"></i> Total Primes: ${primeCount}`;
}

// Display error message with red cross icon
function displayError(message) {
    const errorContainer = document.getElementById('errorContainer');
    const errorMsg = `<div class="error-message animate__animated animate__fadeIn"><i class="fas fa-times-circle"></i> ${message}</div>`;
    errorContainer.innerHTML += errorMsg; // Append error message
}

// Add event listeners for input changes
document.getElementById('lowerLimit').addEventListener('input', validateInputs);
document.getElementById('upperLimit').addEventListener('input', validateInputs);
