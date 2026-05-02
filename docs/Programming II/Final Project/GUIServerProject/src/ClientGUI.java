import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

public class ClientGUI extends JFrame {
    private static final long serialVersionUID = 1L;
    private JPanel contentPane;
    private JTextField textField;
    private JTextArea textArea;
    private Socket socket;
    private PrintWriter writer;
    private BufferedReader reader;
    private final JButton btnNewButton = new JButton("Click for Example Prompts");

    public static void main(String[] args) {
        EventQueue.invokeLater(() -> {
            try {
                ClientGUI frame = new ClientGUI();
                frame.setVisible(true);
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }

    public ClientGUI() {
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setBounds(100, 100, 450, 300);
        contentPane = new JPanel();
        contentPane.setBorder(BorderFactory.createEmptyBorder(5, 5, 5, 5));
        setContentPane(contentPane);
        contentPane.setLayout(new BorderLayout(0, 0));

        textArea = new JTextArea();
        JScrollPane scrollPane = new JScrollPane(textArea);
        contentPane.add(scrollPane, BorderLayout.CENTER);
        btnNewButton.addActionListener(new ActionListener() {
        	public void actionPerformed(ActionEvent e) {
        		ExamplesGUI frame = new ExamplesGUI();
        		frame.setVisible(true);

        		
        	}
        });
        btnNewButton.setFont(new Font("Tahoma", Font.BOLD, 10));
        scrollPane.setColumnHeaderView(btnNewButton);

        JPanel panel = new JPanel();
        contentPane.add(panel, BorderLayout.SOUTH);
        panel.setLayout(new BorderLayout(0, 0));

        textField = new JTextField();
        panel.add(textField, BorderLayout.CENTER);
        textField.setColumns(10);

        JButton btnSend = new JButton("Send");
        btnSend.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                sendMessage();
            }
        });
        panel.add(btnSend, BorderLayout.EAST);

        connectToServer();
    }

    private void connectToServer() {
        try {
            socket = new Socket("localhost", 8070);
            writer = new PrintWriter(socket.getOutputStream(), true);
            reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            new Thread(this::receiveMessages).start();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void sendMessage() {
        String message = textField.getText();
        if (!message.isEmpty()) {
            writer.println(message);
            textField.setText("");
        }
    }

    private void receiveMessages() {
        try {
            String message;
            while ((message = reader.readLine()) != null) {
                appendMessage(message);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void appendMessage(String message) {
        SwingUtilities.invokeLater(() -> {
            textArea.append(message + "\n");
            textArea.setCaretPosition(textArea.getDocument().getLength());
        });
    }
}
