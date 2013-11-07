package edu.illinois.mdpnp.server;

import java.io.IOException;
import java.net.InetSocketAddress;

import org.apache.log4j.Logger;

import com.sun.net.httpserver.HttpContext;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

/**
 * A simple http server that listens for requests on the context "/"
 * and replies back with JSON objects for client side parsing. The default
 * main method starts the server on port 9122, but it can run on any port >
 * 1024 without superuser rights. See the file ajax.html located in the root
 * directory of this project for an example of how javascript can interact with
 * this server.<br><br>
 * 
 * $Rev$:     Revision of last commit<br>
 * $Author$:  Author of last commit<br>
 * $Date$:    Date of last commit<br>
 * @author Charlie Meyer  --  cemeyer2@illinois.edu
 * @see ServerHandler.java
 */
public class Server
{
	private HttpServer server; //the instance of the underlying server engine
	private HttpContext context; //the context we are listening on --> "/"
	private HttpHandler handler; //the handler, implemented by an instance of ServerHandler
	private final int port;
	private static final Logger LOGGER = Logger.getLogger(Server.class);
	
	public Server(final int port) throws IOException
	{
		this.port = port;
		init();
	}
	
	private void init() throws IOException
	{
		final InetSocketAddress address = new InetSocketAddress("localhost",port);
		LOGGER.info("Initializing server on address: "+address);
		server = HttpServer.create(address, 0);
		context = server.createContext("/");
		handler = new ServerHandler();
		context.setHandler(handler);
	}
	
	public boolean start()
	{
		LOGGER.info("Starting server");
		server.start();
		return true;
	}
	
	public boolean stop()
	{
		final int wait = 30;
		LOGGER.info("Server shutdown initialized, waiting "+wait+" seconds for current exchanges to complete");
		server.stop(wait);
		LOGGER.info("Server shutdown completed");
		return true;
	}
	
	public static void main(final String[] args) throws IOException
	{
		final int port = 9122;
		final Server server = new Server(port);
		if(!server.start())
			LOGGER.error("Error starting server");
	}
}
