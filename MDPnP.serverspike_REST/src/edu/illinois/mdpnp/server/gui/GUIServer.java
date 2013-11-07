package edu.illinois.mdpnp.server.gui;

import java.awt.Dimension;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JPanel;

import edu.illinois.mdpnp.server.RESTServer;

public class GUIServer implements ActionListener
{
	RESTServer server;
	JButton start, stop, exit;
	JFrame frame;
	
	
	public GUIServer() throws Exception
	{
		final LoggerWindow lw = new LoggerWindow();
		lw.show();
		
		server = new RESTServer(9122);
		
		final JPanel panel = new JPanel();
		panel.setSize(new Dimension(500,100));
		panel.setLayout(new GridLayout(1,3));
		
		start = new JButton("Start Server");
		stop = new JButton("Stop Server");
		stop.setEnabled(false);
		exit = new JButton("Exit");
		
		start.addActionListener(this);
		stop.addActionListener(this);
		exit.addActionListener(this);
		
		panel.add(start);
		panel.add(stop);
		panel.add(exit);
		
		frame = new JFrame("MDPnP Server");
		frame.setContentPane(panel);
		frame.setSize(new Dimension(500,100));
		frame.setVisible(true);
		
		
	}


	@Override
	public void actionPerformed(final ActionEvent e)
	{
		if(e.getSource().equals(start))
		{
			server.start();
			start.setEnabled(false);
			stop.setEnabled(true);
			start.setText("Server Running");
		}
		else if(e.getSource().equals(stop))
		{
			server.stop();
			stop.setEnabled(false);
			start.setEnabled(true);
			start.setText("Start Server");
		}
		else if(e.getSource().equals(exit))
		{
			frame.setVisible(false);
			System.exit(0);
		}
		
	}
	
	public static void main(final String[] args) throws Exception
	{
		new GUIServer();
	}
}
