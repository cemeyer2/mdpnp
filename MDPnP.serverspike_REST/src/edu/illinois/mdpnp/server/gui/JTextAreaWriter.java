package edu.illinois.mdpnp.server.gui;

import java.io.IOException;
import java.io.Writer;

import javax.swing.JTextArea;

public class JTextAreaWriter extends Writer
{
	JTextArea area;
	
	public JTextAreaWriter(final JTextArea area)
	{
		this.area = area;
	}

	@Override
	public void close() throws IOException
	{
		// TODO Auto-generated method stub
		
	}

	@Override
	public void flush() throws IOException
	{
		// TODO Auto-generated method stub
		
	}

	@Override
	public void write(final char[] cbuf, final int off, final int len) throws IOException
	{
		String str = "";
		for(int i = off; i < off+len; i++)
			str += cbuf[i];
		area.append(str);
		
	}
	
	
}
