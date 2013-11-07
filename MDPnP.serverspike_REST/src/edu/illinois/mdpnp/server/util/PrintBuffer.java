/**
 * 
 */
package edu.illinois.mdpnp.server.util;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;


/**
 * Loosly wraps around a StringBuffer, but provides greater functionality,
 * such as auto terminating calls to println with a newline character, the
 * ability to print mulitple objects on one call to println or printthrough the 
 * use of varargs, and the various built in write capabilities
 * 
 * @author Charlie Meyer
 * @version $Revision$ $Date$
 */
public class PrintBuffer
{
	private StringBuffer buffer;
	String newline;
	
	public PrintBuffer()
	{
		this(-1, null, false);
	}
	
	public PrintBuffer(final Object initialval,final boolean terminateInitialValWithNewline)
	{
		this(-1, initialval, terminateInitialValWithNewline);
	}
	
	
	public PrintBuffer(final int capacity)
	{
		this(capacity, null, false);
	}
	
	public PrintBuffer(final int capacity, final Object initialval, final boolean terminateInitialValWithNewline)
	{
		newline = System.getProperties().getProperty("line.separator");
		try
		{
			if(capacity != -1)
				buffer = new StringBuffer(capacity);
			else buffer = new StringBuffer();
		}
		catch(final NegativeArraySizeException nase)
		{
			throw new IllegalArgumentException("initial PrintBuffer capacity muse be positive");
		}
		if(initialval != null)
		{
			if(terminateInitialValWithNewline)
				println(initialval);
			else
				print(initialval);
		}
	}

	
	public PrintBuffer println(final Object ... obs)
	{

		if(obs.length == 0)
			buffer.append(newline);
		else
			for(final Object o : obs)
			{
				if( o == null)
					throw new NullPointerException("Cannot print null objects into a PrintBuffer");
				buffer.append(o).append(newline);
			}
		return this;
	}
	
	public PrintBuffer println()
	{
		buffer.append(newline);
		return this;
	}
	
	public PrintBuffer print(final Object ... obs)
	{
		for(final Object o : obs)
		{
			if( o == null)
				throw new NullPointerException("Cannot print null objects into a PrintBuffer");
			buffer.append(o);
		}
		return this;
	}
	
	@Override
	public String toString()
	{
		return buffer.toString();
	}
	
	public StringBuffer toStringBuffer()
	{
		return buffer;
	}
	
	public PrintBuffer insert(final int offset, final Object o)
	{
		if(o == null)
			throw new NullPointerException("cannot insert null objects into a PrintBuffer");
		if(offset < 0)
			throw new IllegalArgumentException("PrintBufferOffsets must be greater than 0");
		if(offset > buffer.length())
			buffer.setLength(offset+o.toString().length());
		buffer.insert(offset, o);
		return this;
	}
	
	public int length()
	{
		return buffer.length();
	}
	
	public PrintBuffer replace(final int start, final int end, final Object o)
	{
		if( o == null)
			throw new NullPointerException("Cannot replace null objects into a PrintBuffer");
		buffer.replace(start, end, o.toString());
		return this;
	}
	
	public String substring(final int start)
	{
		if(start < 0 || start > length())
			throw new IllegalArgumentException("start parameter must be 0 <= start <= length()");
		return buffer.substring(start);
	}
	
	public PrintBuffer substringBuffer(final int start)
	{
		if(start < 0 || start > length())
			throw new IllegalArgumentException("start parameter must be 0 <= start <= length()");
		final PrintBuffer buf = new PrintBuffer(buffer.substring(start),false);
		return buf;
	}
	
	public String substring(final int start, final int end)
	{
		if(end < start)
			throw new IllegalArgumentException("end < start for PrintBuffer substring()");
		if(start < 0 || start > length())
			throw new IllegalArgumentException("start parameter must be 0 <= start <= end <= length()");
		if(end < 0 || end > length())
			throw new IllegalArgumentException("end parameter must be 0 <= start <= end <= length()");
		return buffer.substring(start, end);
	}
	
	public PrintBuffer substringBuffer(final int start, final int end)
	{
		if(end < start)
			throw new IllegalArgumentException("end < start for PrintBuffer substring()");
		if(start < 0 || start > length())
			throw new IllegalArgumentException("start parameter must be 0 <= start <= end <= length()");
		if(end < 0 || end > length())
			throw new IllegalArgumentException("end parameter must be 0 <= start <= end <= length()");
		final PrintBuffer buf = new PrintBuffer(buffer.substring(start, end),false);
		return buf;
	}
	
	public void trimToSize()
	{
		buffer.trimToSize();
	}
	
	public int capacity()
	{
		return buffer.capacity();
	}
	
	public void setLength(final int length)
	{
		if(length < 0)
			throw new IllegalArgumentException("length parameter must be positive");
		buffer.setLength(length);
	}
	
	public void write(final String pathName) throws IOException
	{
		write(new File(pathName));
	}
	
	public void write(final File f) throws IOException
	{
		final PrintWriter out  = new PrintWriter(new FileWriter(f));		
		out.append(buffer.toString());
		out.flush();
		out.close();
	}
	
	public void write(final OutputStream out) throws IOException
	{
		final OutputStreamWriter output = new OutputStreamWriter(out);
		output.write(buffer.toString());
		output.flush();
		output.close();
	}
}
