
// Check if a number is prime
function isPrime(n) {
    if (n <= 1) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) return false;
    }
    return true;
}

// Calculate primes and display results dynamically
function calculatePrimes() {
    const lowerLimit = parseInt(document.getElementById('lowerLimit').value);
    const upperLimit = parseInt(document.getElementById('upperLimit').value);
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    // Validate user input
    if (isNaN(lowerLimit) || isNaN(upperLimit)) {
        resultDiv.innerHTML = '<div class="alert alert-danger">Please enter valid integers.</div>';
        return;
    }

    if (lowerLimit < 0) {
        resultDiv.innerHTML = '<div class="alert alert-danger">Lower limit must be greater than or equal to 0.</div>';
        return;
    }

    if (upperLimit < lowerLimit) {
        resultDiv.innerHTML = '<div class="alert alert-danger">Upper limit must be greater than or equal to lower limit.</div>';
        return;
    }

    let primeCount = 0;
    let index = 1;

    // Loop through the range to find primes
    for (let num = lowerLimit; num <= upperLimit; num++) {
        if (isPrime(num)) {
            const primeItem = document.createElement('div');
            primeItem.className = 'result-item animate__animated animate__fadeInLeft';
            primeItem.innerHTML = `${index}. ${num}`;
            resultDiv.appendChild(primeItem);
            index++;
            primeCount++;
        }
    }

    // Display message if no primes found
    if (primeCount === 0) {
        resultDiv.innerHTML = '<div class="alert alert-info">No prime numbers found in the given range.</div>';
    } else {
        const countMsg = document.createElement('div');
        countMsg.className = 'mt-3';
        countMsg.innerHTML = `<strong>Total primes found: ${primeCount}</strong>`;
        resultDiv.appendChild(countMsg);
    }
}
