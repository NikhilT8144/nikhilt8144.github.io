// Conversion factors for metric, imperial, and other units
const conversionFactors = {
    mm: {
        mm: 1,
        cm: 0.1,
        dm: 0.01,
        m: 0.001,
        dam: 0.0001,
        km: 0.000001,
        in: 0.0393701,
        ft: 0.00328084,
        yd: 0.00109361,
        mi: 6.2137e-7
    },
    cm: {
        mm: 10,
        cm: 1,
        dm: 0.1,
        m: 0.01,
        dam: 0.001,
        km: 0.00001,
        in: 0.393701,
        ft: 0.0328084,
        yd: 0.0109361,
        mi: 0.0000062137
    },
    dm: {
        mm: 100,
        cm: 10,
        dm: 1,
        m: 0.1,
        dam: 0.01,
        km: 0.001,
        in: 3.93701,
        ft: 0.328084,
        yd: 0.109361,
        mi: 0.000062137
    },
    m: {
        mm: 1000,
        cm: 100,
        dm: 10,
        m: 1,
        dam: 0.1,
        km: 0.001,
        in: 39.3701,
        ft: 3.28084,
        yd: 1.09361,
        mi: 0.000621371
    },
    dam: {
        mm: 10000,
        cm: 1000,
        dm: 100,
        m: 10,
        dam: 1,
        km: 0.1,
        in: 393.701,
        ft: 32.8084,
        yd: 10.9361,
        mi: 0.00621371
    },
    km: {
        mm: 1000000,
        cm: 100000,
        dm: 10000,
        m: 1000,
        dam: 100,
        km: 1,
        in: 39370.1,
        ft: 3280.84,
        yd: 1093.61,
        mi: 0.621371
    },
    in: {
        mm: 25.4,
        cm: 2.54,
        dm: 0.254,
        m: 0.0254,
        dam: 0.00254,
        km: 0.0000254,
        in: 1,
        ft: 0.0833333,
        yd: 0.0277778,
        mi: 0.0000157828
    },
    ft: {
        mm: 304.8,
        cm: 30.48,
        dm: 3.048,
        m: 0.3048,
        dam: 0.03048,
        km: 0.0003048,
        in: 12,
        ft: 1,
        yd: 0.333333,
        mi: 0.000189394
    },
    yd: {
        mm: 914.4,
        cm: 91.44,
        dm: 9.144,
        m: 0.9144,
        dam: 0.09144,
        km: 0.0009144,
        in: 36,
        ft: 3,
        yd: 1,
        mi: 0.000568182
    },
    mi: {
        mm: 1609340,
        cm: 160934,
        dm: 16093.4,
        m: 1609.34,
        dam: 160.934,
        km: 1.60934,
        in: 63360,
        ft: 5280,
        yd: 1760,
        mi: 1
    }
};

// Function to clear the placeholder on focus
function clearPlaceholder() {
    const input = document.getElementById("value-input");
    if (input.value === "Enter value here") {
        input.value = "";
        input.style.color = "black";
    }
}

// Function to restore placeholder if input is empty
function restorePlaceholder() {
    const input = document.getElementById("value-input");
    if (input.value === "") {
        input.value = "Enter value here";
        input.style.color = "gray";
    }
}

// Function to convert units
function convert() {
    const inputValue = document.getElementById("value-input").value;
    const fromUnit = document.getElementById("from-unit").value;
    const toUnit = document.getElementById("to-unit").value;
    const result = document.getElementById("result");
    const error = document.getElementById("error");

    // Clear previous results and errors
    result.textContent = "";
    error.textContent = "";

    // Check for empty input or invalid input
    if (inputValue === "" || inputValue === "Enter value here") {
        error.textContent = "Error: Input cannot be empty!";
        return;
    }

    // Try to parse the input as a float
    const value = parseFloat(inputValue);
    
    if (isNaN(value) || value < 0) {
        error.textContent = "Error: Invalid number or negative value!";
        return;
    }

    // Calculate the converted value
    const convertedValue = value * conversionFactors[fromUnit][toUnit];
    
    // Display the result with animation
    result.textContent = `${value} ${fromUnit} is equal to ${convertedValue.toFixed(2)} ${toUnit}`;
    result.classList.add('animate__animated', 'animate__fadeInUp');
}

// Function to check if the Enter key is pressed
function checkEnter(event) {
    if (event.key === 'Enter') {
        convert();
    }
}
