import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class SwingGUIApp {

    public static void main(String[] args) {
        JFrame frame = new JFrame("Swing GUI App");
        frame.setSize(400, 300);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setLayout(new GridLayout(3, 1));

        JPanel tempPanel = new JPanel();
        tempPanel.setBorder(BorderFactory.createTitledBorder("Temperature Converter"));

        JTextField tempInput = new JTextField(10);
        JButton cToFButton = new JButton("C to F");
        JButton fToCButton = new JButton("F to C");
        JLabel tempResultLabel = new JLabel("Result: ");

        cToFButton.addActionListener(e -> {
            try {
                double celsius = Double.parseDouble(tempInput.getText());
                double fahrenheit = (celsius * 9 / 5) + 32;
                tempResultLabel.setText("Result: " + fahrenheit + " F");
            } catch (NumberFormatException ex) {
                tempResultLabel.setText("Invalid");
            }
        });

        fToCButton.addActionListener(e -> {
            try {
                double fahrenheit = Double.parseDouble(tempInput.getText());
                double celsius = (fahrenheit - 32) * 5 / 9;
                tempResultLabel.setText("Result: " + celsius + " C");
            } catch (NumberFormatException ex) {
                tempResultLabel.setText("Invalid");
            }
        });

        tempPanel.add(tempInput);
        tempPanel.add(cToFButton);
        tempPanel.add(fToCButton);
        tempPanel.add(tempResultLabel);

        JPanel quadraticPanel = new JPanel();
        quadraticPanel.setBorder(BorderFactory.createTitledBorder("Quadratic Equation Solver"));

        JTextField quadInputA = new JTextField(5);
        JTextField quadInputB = new JTextField(5);
        JTextField quadInputC = new JTextField(5);
        JButton solveQuadButton = new JButton("Solve");
        JLabel quadResultLabel = new JLabel("Result: ");

        solveQuadButton.addActionListener(e -> {
            try {
                double a = Double.parseDouble(quadInputA.getText());
                double b = Double.parseDouble(quadInputB.getText());
                double c = Double.parseDouble(quadInputC.getText());

                double discriminant = b * b - 4 * a * c;

                if (discriminant > 0) {
                    double root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
                    double root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
                    quadResultLabel.setText("Roots: " + root1 + ", " + root2);
                } else if (discriminant == 0) {
                    double root = -b / (2 * a);
                    quadResultLabel.setText("Root: " + root);
                } else {
                    quadResultLabel.setText("No real roots");
                }

            } catch (NumberFormatException ex) {
                quadResultLabel.setText("Invalid input");
            }
        });

        quadraticPanel.add(quadInputA);
        quadraticPanel.add(quadInputB);
        quadraticPanel.add(quadInputC);
        quadraticPanel.add(solveQuadButton);
        quadraticPanel.add(quadResultLabel);

        JPanel payPanel = new JPanel();
        payPanel.setBorder(BorderFactory.createTitledBorder("Pay Calculator"));

        JTextField basePayInput = new JTextField(8);
        JTextField hoursWorkedInput = new JTextField(8);
        JButton calculatePayButton = new JButton("Calculate Pay");
        JLabel payResultLabel = new JLabel("Result: ");

        calculatePayButton.addActionListener(e -> {
            try {
                double basePay = Double.parseDouble(basePayInput.getText());
                double hoursWorked = Double.parseDouble(hoursWorkedInput.getText());

                double overtimePayRate = 1.5;
                double overtimeThreshold = 40;

                double regularPay;
                double overtimePay;

                if (hoursWorked <= overtimeThreshold) {
                    regularPay = basePay * hoursWorked;
                    overtimePay = 0;
                } else {
                    regularPay = basePay * overtimeThreshold;
                    overtimePay = basePay * overtimePayRate * (hoursWorked - overtimeThreshold);
                }

                double totalPay = regularPay + overtimePay;
                payResultLabel.setText("Total Pay: $" + totalPay);
            } catch (NumberFormatException ex) {
                payResultLabel.setText("Invalid input");
            }
        });

        payPanel.add(basePayInput);
        payPanel.add(hoursWorkedInput);
        payPanel.add(calculatePayButton);
        payPanel.add(payResultLabel);

        frame.add(tempPanel);
        frame.add(quadraticPanel);
        frame.add(payPanel);

        frame.setVisible(true);
    }
}
