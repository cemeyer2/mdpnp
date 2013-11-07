package edu.illinois.mdpnp.server.handlers.sensors;

import java.io.IOException;

import com.sun.net.httpserver.HttpContext;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import edu.illinois.mdpnp.server.handlers.DefaultHandler;

/**
 * This is a handler that serves the '/sensors' context in the server.
 * It is designed to be flexible enough to have multiple children contexts
 * for each sensor (one per sensor or one per type of sensor depending
 * on implementation) attached to it. Eventually, it will also have a command
 * attached to it that will enumerate all attached sensors back to the client. 
 *
 * <br><br>
 *
 * $Rev$:     Revision of last commit<br>
 * $Author$:  Author of last commit<br>
 * $Date$:    Date of last commit<br>
 * @author Charlie Meyer  --  cemeyer2@illinois.edu
 */
public class SensorHandler extends DefaultHandler implements HttpHandler
{

	/**
	 * Default constructor. This handler attaches itself to the context supplied as a
	 * parameter, so do not manually attach it after it is constructed because an exception
	 * will be thrown.
	 * @param context the context that this handler will handle
	 * @see DefaultHandler#DefaultHandler(HttpContext)
	 */
	public SensorHandler(final HttpContext context)
	{
		super(context);
	}
	
	/**
	 * currently only prints out urls that this hander and its children serve
	 * @see DefaultHandler#printHandler(HttpExchange)
	 */
	@Override
	public void handle(final HttpExchange exchange) throws IOException
	{
		super.printHandler(exchange);
	}
	
	/**
	 * @see DefaultHandler#getCommands()
	 */
	@Override
	public String getCommands()
	{
		return "";
	}

}
