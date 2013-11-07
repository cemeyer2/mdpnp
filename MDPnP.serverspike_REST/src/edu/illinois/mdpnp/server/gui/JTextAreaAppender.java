package edu.illinois.mdpnp.server.gui;

import java.io.IOException;
import java.io.PrintWriter;

import org.apache.log4j.PatternLayout;
import org.apache.log4j.WriterAppender;
import org.apache.log4j.spi.LoggingEvent;
import org.apache.log4j.spi.ThrowableInformation;

public class JTextAreaAppender extends WriterAppender
{	
	JTextAreaWriter w;
	
	public JTextAreaAppender(final JTextAreaWriter w)
	{	
		super(new PatternLayout("%d{ABSOLUTE} %5p %c{1}:%M:%L - %t - %m%n"), w);
		this.w = w;
	}
	
	@Override
	public void append(final LoggingEvent e)
	{
		final String str = getLayout().format(e);
		final ThrowableInformation info = e.getThrowableInformation();
		try
		{
			w.write(str);
			if(info != null)
			{
				final Throwable t = info.getThrowable();
				t.printStackTrace(new PrintWriter(w));
			}
		} 
		catch (final IOException e1)
		{
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
	}
}
