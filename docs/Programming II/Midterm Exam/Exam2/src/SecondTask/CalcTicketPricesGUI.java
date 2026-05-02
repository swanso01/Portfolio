package Second;

import java.awt.EventQueue;

import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.border.EmptyBorder;
import javax.swing.JLabel;
import java.awt.Font;
import javax.swing.JTextField;
import javax.swing.JRadioButton;
import javax.swing.JCheckBox;
import javax.swing.JButton;
import java.awt.event.ActionListener;
import java.awt.event.ActionEvent;
import java.awt.Color;

public class CalcTicketPricesGUI extends JFrame {

	private static final long serialVersionUID = 1L;
	private JPanel contentPane;
	private JTextField FieldNumOfTickets;
	private JTextField FieldDisplayPriceEachTicket;
	private JTextField DisplayTotalCost;

	/**
	 * Launch the application.
	 */
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					CalcTicketPricesGUI frame = new CalcTicketPricesGUI();
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
	public CalcTicketPricesGUI() {
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		setBounds(100, 100, 450, 300);
		contentPane = new JPanel();
		contentPane.setBackground(new Color(0, 0, 0));
		contentPane.setBorder(new EmptyBorder(5, 5, 5, 5));

		setContentPane(contentPane);
		contentPane.setLayout(null);
		
		JLabel lblNumTickets = new JLabel("Num Tickets");
		lblNumTickets.setForeground(new Color(0, 0, 255));
		lblNumTickets.setFont(new Font("Tahoma", Font.BOLD, 12));
		lblNumTickets.setBounds(10, 4, 95, 13);
		contentPane.add(lblNumTickets);
		
		FieldNumOfTickets = new JTextField();
		FieldNumOfTickets.setFont(new Font("TI-83p Mini Sans", Font.BOLD, 10));
		FieldNumOfTickets.setForeground(new Color(0, 255, 255));
		FieldNumOfTickets.setBounds(87, 3, 96, 19);
		contentPane.add(FieldNumOfTickets);
		FieldNumOfTickets.setColumns(10);
		
		JRadioButton rdbtnOrchestra = new JRadioButton("Orchestra");
		rdbtnOrchestra.setForeground(new Color(0, 0, 255));
		rdbtnOrchestra.setBounds(10, 26, 103, 21);
		contentPane.add(rdbtnOrchestra);
		
		JRadioButton rdbtnMezzanine = new JRadioButton("Mezzanine");
		rdbtnMezzanine.setForeground(new Color(0, 0, 255));
		rdbtnMezzanine.setBounds(10, 65, 103, 21);
		contentPane.add(rdbtnMezzanine);
		
		JRadioButton rdbtnBalcony = new JRadioButton("Balcony");
		rdbtnBalcony.setForeground(new Color(0, 0, 255));
		rdbtnBalcony.setBounds(10, 102, 103, 21);
		contentPane.add(rdbtnBalcony);
		
		JCheckBox chckbxMatinee = new JCheckBox("Matinee");
		chckbxMatinee.setFont(new Font("Tahoma", Font.BOLD, 10));
		chckbxMatinee.setForeground(new Color(0, 0, 255));
		chckbxMatinee.setBounds(234, 1, 93, 21);
		contentPane.add(chckbxMatinee);
		
		JLabel lblPriceEach = new JLabel("Price For Each Ticket:");
		lblPriceEach.setForeground(new Color(0, 0, 255));
		lblPriceEach.setBackground(new Color(0, 0, 255));
		lblPriceEach.setFont(new Font("Tahoma", Font.BOLD, 11));
		lblPriceEach.setBounds(200, 184, 127, 13);
		contentPane.add(lblPriceEach);
		
		FieldDisplayPriceEachTicket = new JTextField();
		FieldDisplayPriceEachTicket.setFont(new Font("TI-83p Mini Sans", Font.PLAIN, 10));
		FieldDisplayPriceEachTicket.setBounds(330, 182, 96, 19);
		contentPane.add(FieldDisplayPriceEachTicket);
		FieldDisplayPriceEachTicket.setColumns(10);
		
		JLabel lblNewLabel = new JLabel("Total:");
		lblNewLabel.setForeground(new Color(0, 0, 255));
		lblNewLabel.setBackground(new Color(189, 190, 189));
		lblNewLabel.setFont(new Font("Tahoma", Font.BOLD, 11));
		lblNewLabel.setBounds(288, 210, 32, 13);
		contentPane.add(lblNewLabel);
		
		DisplayTotalCost = new JTextField();
		DisplayTotalCost.setFont(new Font("TI-83p Mini Sans", Font.PLAIN, 10));
		DisplayTotalCost.setBounds(330, 208, 96, 19);
		contentPane.add(DisplayTotalCost);
		DisplayTotalCost.setColumns(10);
		
		JButton btnCalcPriceAndTotal = new JButton("Calc Price");
		btnCalcPriceAndTotal.setForeground(new Color(0, 0, 255));
		btnCalcPriceAndTotal.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {		
				int numTickets = Integer.parseInt(FieldNumOfTickets.getText());
				double price = 0;
				double total = 0;

				if (rdbtnOrchestra.isSelected()) {
					price = 85;
				} else if (rdbtnMezzanine.isSelected()) {
					price = 70;
				} else if (rdbtnBalcony.isSelected()) {
					price = 45;
				}

				if (chckbxMatinee.isSelected()) {
					//This is the same as 15% 
					price = price * 0.85;
				}

				total = price * numTickets;

				FieldDisplayPriceEachTicket.setText(String.valueOf(price));
				DisplayTotalCost.setText(String.valueOf(total));
				
				//i added this to clear selections afteryou click the calc button
				rdbtnOrchestra.setSelected(false);
				rdbtnMezzanine.setSelected(false);
				rdbtnBalcony.setSelected(false);
				chckbxMatinee.setSelected(false);
					
				
				
				
						

				
			}
		});
		btnCalcPriceAndTotal.setBounds(20, 147, 85, 21);
		contentPane.add(btnCalcPriceAndTotal);
	}
}

