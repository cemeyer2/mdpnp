package edu.illinois.mdpnp.server;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.Iterator;

import org.apache.log4j.Logger;

import com.sun.net.httpserver.HttpContext;
import com.sun.net.httpserver.HttpServer;

import edu.illinois.mdpnp.actuators.Pump;
import edu.illinois.mdpnp.sensors.PulseOximeter;
import edu.illinois.mdpnp.server.handlers.DefaultHandler;
import edu.illinois.mdpnp.server.handlers.actuators.ActuatorHandler;
import edu.illinois.mdpnp.server.handlers.actuators.PumpHandler;
import edu.illinois.mdpnp.server.handlers.sensors.SPO2Handler;
import edu.illinois.mdpnp.server.handlers.sensors.SensorHandler;
import edu.illinois.mdpnp.server.util.HandlerChildrenLockedException;
import edu.illinois.mdpnp.server.util.JavaHeapMonitor;
import edu.illinois.mdpnp.server.util.SerialPortUtil;

/**
 * a http server implementing a REST-like interface. It doesnt exactly implement all features of REST,
 * such as CRUD using http get and posts, but it does expose an interface with the "URL as the UI"
 * design pattern. The default main that ships with this server will listen on port 9122. Once started,
 * you can open up a web browser to <a href='http://localhost:9122/'>http://localhost:9122/</a> and the
 * server will display a list of all valid paths that it accepts. Mutable parameters in the paths displayed
 * will be surrounded in {curly braces}.  
 *
 * <br><br>
 *
 * $Rev$:     Revision of last commit<br>
 * $Author$:  Author of last commit<br>
 * $Date$:    Date of last commit<br>
 * @author Charlie Meyer  --  cemeyer2@illinois.edu
 */
public class RESTServer
{
	private final int port;
	private HttpServer server;
	private static final Logger logger = Logger.getRootLogger();
	private HttpContext rootContext;
	
	/**
	 * Creates a non-running instance
	 * @param port the port to listen on
	 * @throws IOException if there is a problem creating the sockets
	 */
	public RESTServer(final int port) throws IOException
	{
		this.port = port;
	}
	
	private void init() throws IOException
	{
		//start the heap monitor
		new JavaHeapMonitor(15000).start();
		
		final InetSocketAddress address = new InetSocketAddress("0.0.0.0",port);
		logger.info("Initializing server on address: "+address);
		server = HttpServer.create(address, 0);
		
		try
		{
			rootContext = server.createContext("/");
			final DefaultHandler rootHandler = new DefaultHandler(rootContext);
			
			final HttpContext actuatorContext = server.createContext("/actuators");
			final ActuatorHandler actuatorHandler = new ActuatorHandler(actuatorContext);
			rootHandler.addChildContext(actuatorContext);
			
			final HttpContext pumpContext = server.createContext("/actuators/pump");
			final PumpHandler pumpHandler = new PumpHandler(pumpContext, SerialPortUtil.getPumpSerialPort());
			actuatorHandler.addChildContext(pumpContext);
			
			final HttpContext sensorContext = server.createContext("/sensors");
			final SensorHandler sensorHandler = new SensorHandler(sensorContext);
			rootHandler.addChildContext(sensorContext);
			
			final HttpContext sp02Context = server.createContext("/sensors/spo2");
			final SPO2Handler sp02Handler = new SPO2Handler(sp02Context);
			sensorHandler.addChildContext(sp02Context);
			
			rootHandler.lockChildren();
			actuatorHandler.lockChildren();
			pumpHandler.lockChildren();
			sensorHandler.lockChildren();
			sp02Handler.lockChildren();
		}
		catch(final HandlerChildrenLockedException hcle)
		{
			logger.error("Handler children were prematurely locked, init failed",hcle);
		}
		
	}
		
	/**
	 * starts the server listening to requests from clients
	 */
	public void start()
	{
		
		logger.info("Starting server");
		try
		{
			init();
			server.start();
		}
		catch(final Exception e)
		{
			logger.error("Error starting server",e);
		}
		logger.info("server started");
	}
	
	/**
	 * stops the server from listening to requests from clients.
	 * From the time that this method is called, there is a 5 second
	 * timeout that the server will start for all sessions to gracefully
	 * end on their own before the server will close them. If all requests
	 * are satisfied before the timeout expires, the server will stop immediately.
	 */
	public void stop()
	{
		server.stop(5);
		
		final Iterator<Pump> iter1 = Pump.getActivePumps().iterator();
		while(iter1.hasNext())
			iter1.next().close();
		
		final Iterator<PulseOximeter> iter2 = PulseOximeter.getActivePulseOximeters().iterator();
		while(iter2.hasNext())
			iter2.next().close();
	}
	
	public static void main(final String[] args) throws IOException
	{
		final RESTServer server = new RESTServer(9122);
		server.start();
	}
}