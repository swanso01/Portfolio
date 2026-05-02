import java.awt.EventQueue;

import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.border.EmptyBorder;
import javax.swing.JLabel;
import java.awt.Font;
import javax.swing.JTextField;
import javax.swing.JButton;
import java.awt.event.ActionListener;
import java.awt.event.ActionEvent;

public class ExamplesGUI extends JFrame {

	private static final long serialVersionUID = 1L;
	private JPanel contentPane;

	/**
	 * Launch the application.
	 */
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					ExamplesGUI frame = new ExamplesGUI();
					frame.setVisible(true);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		});
	}

	/**
	 * Create the frame.
	 */
	public ExamplesGUI() {
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		setBounds(100, 100, 450, 300);
		contentPane = new JPanel();
		contentPane.setBorder(new EmptyBorder(5, 5, 5, 5));

		setContentPane(contentPane);
		contentPane.setLayout(null);
		
		JLabel Examples = new JLabel("Examples:");
		Examples.setFont(new Font("Tahoma", Font.BOLD, 14));
		Examples.setBounds(10, -1, 86, 13);
		contentPane.add(Examples);
		
		JButton btnNewButton = new JButton("Prev");
		btnNewButton.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				ClientGUI frame = new ClientGUI();
				frame.setVisible(true);
				dispose();
			}
		});
		btnNewButton.setBounds(0, 233, 85, 21);
		contentPane.add(btnNewButton);
		
		JLabel labelgiveExamplePrompts = new JLabel("GET_WEATHER:city_name\r\n");
		labelgiveExamplePrompts.setBounds(70, 22, 306, 21);
		contentPane.add(labelgiveExamplePrompts);
		
		JLabel lblNewLabel = new JLabel("GET_FACTORIAL:5");
		lblNewLabel.setBounds(70, 53, 230, 13);
		contentPane.add(lblNewLabel);
		
		JLabel lblNewLabel_1 = new JLabel("GET_VERSE:Psalms 23:1-6");
		lblNewLabel_1.setBounds(70, 76, 160, 13);
		contentPane.add(lblNewLabel_1);
	}

}
