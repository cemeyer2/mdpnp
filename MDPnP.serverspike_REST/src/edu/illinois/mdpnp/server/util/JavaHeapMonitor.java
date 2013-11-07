package edu.illinois.mdpnp.server.util;

import org.apache.log4j.Logger;

/**
 * Monitor the size of the java using the methods from java.util.Runtime.
 * 
 * @author Charlie Meyer
 * @version 2006/05/29
 */
public class JavaHeapMonitor extends Thread 
{
	private static boolean enabled = true;

	private int delay = 5000;
	
	private static final Logger logger = Logger.getLogger(JavaHeapMonitor.class);

	/**
	 * Create a JavaHeapMonitor class.
	 */
	public JavaHeapMonitor() {
		super();
	}

	/**
	 * Create a JavaHeapMonitor class, using the specified millisecond delay
	 * value for checking the heap size.
	 */
	public JavaHeapMonitor(final int delay) {
		super();
		this.delay = delay;
	}

	/**
	 * Start the thread to check the total and free memory values from
	 * java/util/Runtime.getRuntime().
	 */
	@Override
	public void run() 
	{
		while (true) 
		{
			if (enabled) 
			{
				final long totalMemory = (long)(Runtime.getRuntime().totalMemory()/1024d);
				final long freeMemory = (long)(Runtime.getRuntime().freeMemory()/1024d);
				logger.info("Total memory: " + totalMemory + "kb free: "
						+ freeMemory + "kb used: " + (totalMemory - freeMemory)+"kb");
			}
			try 
			{
				sleep(delay);
			} 
			catch (final Exception e) 
			{
				logger.error("Unable to sleep during GC heap display",e);
			}
		}
	}

	/**
	 * Enable/disable heap checking by setting this flag.
	 */
	public static synchronized void setEnabled(final boolean flag) 
	{
		enabled = flag;
	}
}
