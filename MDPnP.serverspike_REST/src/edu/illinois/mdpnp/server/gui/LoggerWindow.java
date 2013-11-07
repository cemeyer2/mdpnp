package edu.illinois.mdpnp.server.gui;

import java.awt.Dimension;
import java.awt.GridLayout;

import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.text.DefaultCaret;

import org.apache.log4j.Logger;



public class LoggerWindow
{
	JFrame frame;
	JTextArea area;
	
	public LoggerWindow() throws Exception
	{
		area = new JTextArea(10,200);
		area.setEditable(true);
		final JScrollPane pane = new JScrollPane(area);
		final DefaultCaret caret = (DefaultCaret)area.getCaret();
		caret.setUpdatePolicy(DefaultCaret.ALWAYS_UPDATE);
		final JPanel panel = new JPanel();
		panel.setLayout(new GridLayout(1,1));
		panel.add(pane);
		frame = new JFrame("Server Log");
		frame.setContentPane(panel);
		frame.setSize(new Dimension(900,250));
		final JTextAreaWriter writer = new JTextAreaWriter(area);
		Logger.getRootLogger().addAppender(new JTextAreaAppender(writer));
	}
	
	public void show()
	{
		frame.setVisible(true);
	}
	
	public void hide()
	{
		frame.setVisible(false);
	}
}
