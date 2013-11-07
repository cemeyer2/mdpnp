package edu.illinois.mdpnp.server.handlers;

import java.io.BufferedWriter;
import java.io.IOException;
import java.io.OutputStreamWriter;

import com.sun.net.httpserver.HttpContext;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

/**
 * A dummy handler that sends the context that it is attached to
 * as well as the url that it is currently serving back to the client 
 *
 * <br><br>
 *
 * $Rev$:     Revision of last commit<br>
 * $Author$:  Author of last commit<br>
 * $Date$:    Date of last commit<br>
 * @author Charlie Meyer  --  cemeyer2@illinois.edu
 */
public class DummyHandler implements HttpHandler
{
	HttpContext parentContext;
	
	public DummyHandler(final HttpContext context)
	{
		this.parentContext = context;
	}
	
	
	@Override
	public void handle(final HttpExchange exchange) throws IOException
	{
		final String str = parentContext.getPath()+"\n"+exchange.getRequestURI().toString();
		exchange.sendResponseHeaders(200, str.getBytes().length);
		final BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(exchange.getResponseBody()));
		writer.write(str);
		writer.flush();
		writer.close();
	}

}
