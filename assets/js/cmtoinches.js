// Function to clear the placeholder on focus
function clearPlaceholder() {
    const input = document.getElementById("centimeter-input");
    if (input.value === "Enter centimeters here") {
        input.value = "";
        input.style.color = "black";
    }
}

// Function to restore placeholder if input is empty
function restorePlaceholder() {
    const input = document.getElementById("centimeter-input");
    if (input.value === "") {
        input.value = "Enter centimeters here";
        input.style.color = "gray";
    }
}

// Function to convert cm to inches
function convert() {
    const input = document.getElementById("centimeter-input").value;
    const result = document.getElementById("result");
    const error = document.getElementById("error");

    // Clear previous results and errors
    result.textContent = "";
    error.textContent = "";

    // Check for empty input
    if (input === "" || input === "Enter centimeters here") {
        error.textContent = "Error: Input cannot be empty!";
        return;
    }

    // Try to parse the input as a float
    const cmValue = parseFloat(input);
    
    if (isNaN(cmValue)) {
        error.textContent = "Error: Invalid number!";
        return;
    }

    // Check if the input is non-negative
    if (cmValue < 0) {
        error.textContent = "Error: Negative value not allowed!";
        return;
    }

    // Calculate inches and display the result with animation
    const inches = cmValue / 2.54;
    result.textContent = `${cmValue} cm in inches is ${inches.toFixed(2)}`;
    result.classList.add('animate__animated', 'animate__fadeInUp');
}

// Function to exit the app (close or redirect)
function exitApp() {
    // Close the window or redirect to another page
    window.close(); // Note: May not work in all browsers
}
