        function calculate(operation) {
            const input = document.getElementById('inputNumber').value;
            const resultElement = document.getElementById('result');
            
            if (!input) {
                showResult('Please enter a number');
                return;
            }

            const number = parseFloat(input);
            let result;
            let operationText;

            switch(operation) {
                case 'square':
                    result = Math.pow(number, 2);
                    operationText = `${number}² = `;
                    break;
                case 'squareRoot':
                    if (number < 0) {
                        showResult('Cannot calculate square root of a negative number');
                        return;
                    }
                    result = Math.sqrt(number);
                    operationText = `√${number} = `;
                    break;
                case 'cube':
                    result = Math.pow(number, 3);
                    operationText = `${number}³ = `;
                    break;
                case 'cubeRoot':
                    result = Math.cbrt(number);
                    operationText = `∛${number} = `;
                    break;
            }

            showResult(`${operationText}${result.toFixed(4)}`);
        }

        function showResult(text) {
            const resultElement = document.getElementById('result');
            resultElement.textContent = text;
            resultElement.classList.remove('animate-pop');
            void resultElement.offsetWidth; // Trigger reflow
            resultElement.classList.add('animate-pop');
        }

        // Add keyboard support
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                // Default to square root when Enter is pressed
                calculate('squareRoot');
            }
        });
