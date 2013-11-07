package edu.illinois.mdpnp.test.util;

import java.io.IOException;

import org.apache.log4j.Logger;

import edu.illinois.mdpnp.server.RESTServer;

/**
 * A simple wrapper around a server that lets it run in a background thread
 * instead of blocking while it runs. Useful for unit tests.
 *
 * <br><br>
 * 
 * $Rev$:     Revision of last commit<br>
 * $Author$:  Author of last commit<br>
 * $Date$:    Date of last commit<br>
 * @author Charlie Meyer  --  cemeyer2@illinois.edu
 */
public class ServerRunnable implements Runnable
{
	RESTServer server;
	public static final Logger logger = Logger.getLogger(ServerRunnable.class);
	boolean shouldRun = true;
	
	public ServerRunnable(final int port)
	{
		try
		{
			server = new RESTServer(port);
		} 
		catch (final IOException e)
		{
			logger.error("could not initialize server",e);
		}
	}
	
	public void run()
	{
		server.start();
		while(shouldRun){}
	}
	
	public void stopServer()
	{
		server.stop();
		shouldRun = false;
	}
}
