import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Stack;

public class AdvancedCalculator extends JFrame implements ActionListener {
    // Components
    private JTextField displayField;
    private JButton[] numberButtons;
    private JButton[] operationButtons;
    private JButton[] functionButtons;
    private JButton equalsButton, clearButton, backButton;
    private double num1, num2, result;
    private char operator;
    private Stack<String> history;

    // Constructor
    public AdvancedCalculator() {
        setTitle("Advanced Calculator");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(400, 500);
        setResizable(false);
        setLocationRelativeTo(null);

        // Initialize components
        displayField = new JTextField();
        displayField.setEditable(false);
        displayField.setHorizontalAlignment(JTextField.RIGHT);

        numberButtons = new JButton[10];
        operationButtons = new JButton[6];
        functionButtons = new JButton[10];

        for (int i = 0; i < 10; i++) {
            numberButtons[i] = new JButton(String.valueOf(i));
            numberButtons[i].addActionListener(this);
        }

        String[] operationNames = {"+", "-", "*", "/", ".", "="};
        for (int i = 0; i < 6; i++) {
            operationButtons[i] = new JButton(operationNames[i]);
            operationButtons[i].addActionListener(this);
        }

        String[] functionNames = {"sqrt", "x^2", "sin", "cos", "tan", "exp", "log", "M+", "MR", "C"};
        for (int i = 0; i < 10; i++) {
            functionButtons[i] = new JButton(functionNames[i]);
            functionButtons[i].addActionListener(this);
        }

        equalsButton = new JButton("=");
        equalsButton.addActionListener(this);
        clearButton = new JButton("AC");
        clearButton.addActionListener(this);
        backButton = new JButton("←");
        backButton.addActionListener(this);

        // Layout
        JPanel buttonPanel = new JPanel();
        buttonPanel.setLayout(new GridLayout(6, 4, 10, 10));
        buttonPanel.add(backButton);
        buttonPanel.add(clearButton);
        buttonPanel.add(new JLabel(""));
        buttonPanel.add(new JLabel(""));

        for (int i = 1; i <= 9; i++) {
            buttonPanel.add(numberButtons[i]);
        }
        buttonPanel.add(operationButtons[0]); // Addition
        buttonPanel.add(numberButtons[0]);
        buttonPanel.add(operationButtons[1]); // Subtraction
        buttonPanel.add(operationButtons[2]); // Multiplication

        for (int i = 3; i < 6; i++) {
            buttonPanel.add(operationButtons[i]);
        }

        for (int i = 0; i < 10; i++) {
            buttonPanel.add(functionButtons[i]);
        }

        buttonPanel.add(equalsButton);
        add(displayField, BorderLayout.NORTH);
        add(buttonPanel, BorderLayout.CENTER);

        setVisible(true);

        // Initialize history stack
        history = new Stack<>();
    }

    // Action listener
    public void actionPerformed(ActionEvent e) {
        Object source = e.getSource();
        for (int i = 0; i < 10; i++) {
            if (source == numberButtons[i]) {
                displayField.setText(displayField.getText() + i);
                return;
            }
        }

        if (source == operationButtons[5]) {
            num2 = Double.parseDouble(displayField.getText());
            calculate();
            operator = '\0';
            return;
        }

        for (int i = 0; i < 4; i++) {
            if (source == operationButtons[i]) {
                num1 = Double.parseDouble(displayField.getText());
                operator = e.getActionCommand().charAt(0);
                displayField.setText("");
                return;
            }
        }

        for (int i = 0; i < 10; i++) {
            if (source == functionButtons[i]) {
                handleFunction(functionButtons[i].getText());
                return;
            }
        }

        if (source == clearButton) {
            displayField.setText("");
        } else if (source == backButton) {
            String currentText = displayField.getText();
            if (!currentText.isEmpty()) {
                displayField.setText(currentText.substring(0, currentText.length() - 1));
            }
        }
    }

    // Perform calculation based on operator
    private void calculate() {
        switch (operator) {
            case '+':
                result = num1 + num2;
                break;
            case '-':
                result = num1 - num2;
                break;
            case '*':
                result = num1 * num2;
                break;
            case '/':
                if (num2 != 0) {
                    result = num1 / num2;
                } else {
                    displayField.setText("Error: Division by zero");
                    return;
                }
                break;
        }
        displayField.setText(String.valueOf(result));
        history.push(num1 + " " + operator + " " + num2 + " = " + result);
        logCalculation(history.peek());
    }

    // Handle function buttons
    private void handleFunction(String functionName) {
        switch (functionName) {
            case "sqrt":
                num1 = Double.parseDouble(displayField.getText());
                result = Math.sqrt(num1);
                displayField.setText(String.valueOf(result));
                break;
            case "x^2":
                num1 = Double.parseDouble(displayField.getText());
                result = Math.pow(num1, 2);
                displayField.setText(String.valueOf(result));
                break;
            case "sin":
                num1 = Double.parseDouble(displayField.getText());
                result = Math.sin(Math.toRadians(num1));
                displayField.setText(String.valueOf(result));
                break;
            case "cos":
                num1 = Double.parseDouble(displayField.getText());
                result = Math.cos(Math.toRadians(num1));
                displayField.setText(String.valueOf(result));
                break;
            case "tan":
                num1 = Double.parseDouble(displayField.getText());
                result = Math.tan(Math.toRadians(num1));
                displayField.setText(String.valueOf(result));
                break;
            case "exp":
                num1 = Double.parseDouble(displayField.getText());
                result = Math.exp(num1);
                displayField.setText(String.valueOf(result));
                break;
            case "log":
                num1 = Double.parseDouble(displayField.getText());
                result = Math.log(num1);
                displayField.setText(String.valueOf(result));
                break;
            case "M+":
                num1 = Double.parseDouble(displayField.getText());
                history.push(String.valueOf(num1));
                break;
            case "MR":
                if (!history.isEmpty()) {
                    displayField.setText(history.peek());
                }
                break;
            case "C":
                displayField.setText("");
                break;
        }
    }

    // Store recent calculation locally
    private void logCalculation(String calculation) {
        try {
            FileWriter fileWriter = new FileWriter("calculations.txt", true);
            fileWriter.write(calculation + "\n");
            fileWriter.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        new AdvancedCalculator();
    }
}
