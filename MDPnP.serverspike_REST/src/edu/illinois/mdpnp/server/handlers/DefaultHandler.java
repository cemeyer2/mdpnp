package edu.illinois.mdpnp.server.handlers;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.LinkedList;
import java.util.List;

import org.apache.log4j.Logger;
import org.json.JSONObject;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpContext;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import edu.illinois.mdpnp.server.util.HandlerChildrenLockedException;
import edu.illinois.mdpnp.server.util.PrintBuffer;

/**
 * This is a class that implements the HttpHandler interface and serves as the
 * base class from which all other handlers in this server inherit. It serves a few
 * main purposes. First, it is the handler assigned to the '/' context in the server, and
 * in serving this context, it is responsible for serving the crossdomain.xml file that
 * flash xdr clients will request. Second, it provides utility methods to write Strings
 * back out to clients. Lastly, it provides the methods necessary for this handler and each
 * of the other handlers that inherit from this handler to print out all valid urls that
 * they will serve. 
 *
 * <br><br>
 *
 * $Rev$:     Revision of last commit<br>
 * $Author$:  Author of last commit<br>
 * $Date$:    Date of last commit<br>
 * @author Charlie Meyer  --  cemeyer2@illinois.edu
 */
public class DefaultHandler implements HttpHandler
{
	private static final int RESPONSE_OK = 200;
	private static final Logger logger = Logger.getLogger(DefaultHandler.class);
	private final HttpContext context;
	private final List<HttpContext> childContexts;
	
	private boolean childrenLocked = false;
	
	/**
	 * Default Constructor. The parameter context object should be the context to
	 * which you would like this handler to attach. DO NOT attach this handler to
	 * that context after creating this handler, since this hander will automatically
	 * attach itself to the context and subsequent assignments will cause an exception
	 * to be thrown.
	 * @param context the context to which this handler should attach
	 */
	public DefaultHandler(final HttpContext context)
	{
		this.context = context;
		this.childContexts = new LinkedList<HttpContext>();
		context.setHandler(this);
	}
	
	@Override
	public void handle(final HttpExchange exchange) throws IOException
	{
		logger.info("default handler processing request from "+exchange.getRemoteAddress());
		
		if(exchange.getRequestURI().getPath().equals("/crossdomain.xml")) //send crossdomain.xml file
		{
			sendCrossDomain(exchange);
		}
		else
		{
			printHandler(exchange);
		}
	}
	
	/**
	 * Prints out all valid urls that this handler understands back to the requesting client.
	 * This method should only be called from either this handler or a handler that inherits
	 * from this handler in the handle(final HttpExchange exchange) method
	 * @param exchange the exchange that the handler is currently serving
	 * @throws IOException if there is an issue writing back out to the client
	 * @see DefaultHandler#handle(HttpExchange)
	 */
	public void printHandler(final HttpExchange exchange) throws IOException
	{
		final PrintBuffer buffer = new PrintBuffer();
		buffer.print(recurseContext(getParentContext()));
		writeTextToStream(buffer.toString(), exchange);
	}
	
	private String recurseContext(final HttpContext context)
	{
		final PrintBuffer buffer = new PrintBuffer();
		buffer.println(context.getPath());
		final DefaultHandler handler = (DefaultHandler)context.getHandler();
		buffer.print(handler.getCommands());
		for(final HttpContext c : handler.getChildContexts())
		{
			buffer.print(recurseContext(c));
		}
		return buffer.toString();
	}
	
	/**
	 * Gets a string that contains each of the url commands that this handler serves,
	 * with each separated by a newline. If the handler does not serve any commands, an
	 * empty String object should be returned. Each command should contain the complete path
	 * needed to run that command. Parameters in each command should be surrounded by
	 * {curly braces}. Each handler that inherits from this handler should override this
	 * method and supply the commands that it handles.
	 * @return a String containing the commands that this handler serves
	 */
	public String getCommands()
	{
		return "";
	}
	
	public void writeJSONToStream(final JSONObject json, final HttpExchange exchange) throws IOException
	{
		logger.debug("json write: "+json.toString());
		writeToStream(json.toString(),exchange,"application/json");
	}
	
	/**
	 * Write a string to the response output stream for an HttpExchange
	 * @param str the string to write out
	 * @param exchange the exchange we are processing
	 * @throws IOException if there is a problem writing to the stream
	 */
	public void writeTextToStream(final String str, final HttpExchange exchange) throws IOException
	{
		writeToStream(str,exchange,"text/plain");
	}
	
	private void writeToStream(final String str, final  HttpExchange exchange, final String contentType) throws IOException
	{
		final Headers responseHeaders = exchange.getResponseHeaders();
		responseHeaders.set("Content-Type", contentType);
		exchange.sendResponseHeaders(DefaultHandler.RESPONSE_OK, str.getBytes().length);
		final OutputStreamWriter out = new OutputStreamWriter(exchange.getResponseBody());
		out.write(str);
		out.flush();
		exchange.close();
	}
	
	/**
	 * Sends the crossdomain.xml file to the client. This is needed because
	 * if we use the flash xdr transport for cross domain async calls from javascript,
	 * flash first requests this xml file to see if it is allowed to contact that
	 * server for data requests. This particular crossdomain.xml file has been crafted
	 * to allow any flash host to make requests to this server
	 * @param exchange the exchange we are processing
	 */
	private void sendCrossDomain(final HttpExchange exchange)
	{
		try
		{
			final BufferedReader in = new BufferedReader(new FileReader(new File("crossdomain.xml")));
			String str = "";
			String out = "";
			while((str = in.readLine())!= null)
				out+=str;
			writeToStream(out,exchange, "text/xml");
		} 
		catch (final IOException e)
		{
			logger.error("Error sending crossdomain.xml",e);
		}
	}
	
	/**
	 * Returns a list containing all of the contexts that are children of this handler's context.
	 * A context is a child of this handler if its path contains this handler's context's path
	 * as a substring. For example, a context with path '/a/b/c' is a child of a handler with
	 * context '/a/b'. The returned list only contains the contexts that are the most direct children
	 * of this handler, so if we had the following contexts with paths '/a' '/a/b' '/a/b/c' /a/d/c', '/a' would
	 * have two children, '/a/b' would have one child.
	 * @return the list containing each of the contexts that are the most direct children of this handler
	 */
	public final List<HttpContext> getChildContexts()
	{
		return childContexts;
	}
	
	/**
	 * A context is the parent of this handler if this handler is attached to that context
	 * @return the context that this handler is attached to
	 */
	public HttpContext getParentContext()
	{
		return context;
	}
	
	/**
	 * Adds a context to the children of this handler. This method should only be called when the server
	 * is being set up. After the server is initialized and set up, lockChildren should be called to
	 * avoid any unintended side effects.
	 * @param child the child context to add to this handler's children
	 * @throws HandlerChildrenLockedException if this handler's children are already locked
	 * @see DefaultHandler#lockChildren()
	 */
	public void addChildContext(final HttpContext child) throws HandlerChildrenLockedException
	{
		if(!childrenLocked)
			childContexts.add(child);
		else
			throw new HandlerChildrenLockedException();
	}
	
	/**
	 * Locks this handler's children so that they cannot be modified
	 */
	public void lockChildren()
	{
		childrenLocked = true;
	}

}
