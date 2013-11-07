package edu.illinois.mdpnp.server;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;
import org.json.JSONObject;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import edu.illinois.mdpnp.server.actuators.Pump;
import edu.illinois.mdpnp.server.sensors.HeartRateGenerator;
import edu.illinois.mdpnp.server.sensors.O2SensorGenerator;
import edu.illinois.mdpnp.server.sensors.PulseOximeter;

/**
 * An implementation of HttpHandler for handling requests from clients.
 * 
 * <br><br> 
 * $Rev$:     Revision of last commit<br>
 * $Author$:  Author of last commit<br>
 * $Date$:    Date of last commit<br>
 * @author Charlie Meyer  --  cemeyer2@illinois.edu
 * @see Server.java
 */
public class ServerHandler implements HttpHandler
{
	
	public static final int RESPONSE_OK = 200;
	
	private static final Logger LOGGER = Logger.getLogger(ServerHandler.class);
	
	/**
	 * Handles a transaction between a client and this server. This method
	 * is called once per each request that any given client sends to this server.
	 * 
	 * @param exchange the HttpExchange object representing the transaction being processed
	 */
	public void handle(final HttpExchange exchange) throws IOException
	{
		
		LOGGER.info("processing request from "+exchange.getRemoteAddress());
		
		if(exchange.getRequestURI().getPath().equals("/crossdomain.xml")) //send crossdomain.xml file
		{
			sendCrossDomain(exchange);
		}
		else
		{
			final JSONObject obj = handleQuery(exchange.getRequestURI().getQuery());
			writeToStream(obj, exchange);
		}
	}
	
	/**
	 * reads the parameters and returns a JSON object for each request
	 * @param query the query portion of the request URI
	 * @return a JSON object for the request
	 */
	private JSONObject handleQuery(final String query)
	{
		final Map<String, String> parameters = parseParameters(query);
		final String type = parameters.get("type");
		if(type.equals("sensor"))
		{
			final String sensor = parameters.get("sensor");
			if(sensor.equals("hr"))
			{
				return HeartRateGenerator.getHeartRate();
			}
			else if(sensor.equals("O2"))
			{
				return O2SensorGenerator.getO2();
			}
			else if(sensor.equals("pulseOximeter"))
			{
				PulseOximeter pulseOximeter = null;
				final String os = System.getProperty("os.name");
				if(os.equals("Mac OS X"))
				{
					pulseOximeter = PulseOximeter.getPulseOximeter("/dev/tty.Nonin_Medical_Inc-1");
				}
				final String action = parameters.get("action");
				if(action.equals("mostRecentMeasurement"))
				{
					return pulseOximeter.getMostRecentMeasurement().toJSON();
				}
				else if(action.equals("allMeasurements"))
				{
					return pulseOximeter.getAllMeasurementsJSON();
				}
				
			}
		}
		if(type.equals("actuator"))
		{
			final String actuator = parameters.get("actuator");
			if(actuator.equals("pump"))
			{
				final int pumpNumber = Integer.parseInt(parameters.get("pumpNumber"));
				final Pump pump = Pump.getPump(pumpNumber);
				final String action = parameters.get("action");
				if(action.equals("buzzOn"))
				{
					return pump.buzzOn();
				}
				else if(action.equals("buzzOff"))
				{
					return pump.buzzOff();
				}
				else if(action.equals("run"))
				{
					return pump.run();
				}
				else if(action.equals("stop"))
				{
					return pump.stop();
				}
				else if(action.equals("getRate"))
				{
					return pump.getRate();
				}
				else if(action.equals("setRate"))
				{
					final double rate = Double.parseDouble(parameters.get("rate"));
					return pump.setRate(rate);
				}
				else if(action.equals("getDirection"))
				{
					return pump.getDirection();
				}
				else if(action.equals("setDirection"))
				{
					boolean infuse = true;
					if(parameters.get("direction").toLowerCase().startsWith("wdr"))
						infuse = false;
					return pump.setDirection(infuse);
				}
			}
			
		}
		return null;
	}
	
	/**
	 * parses the query portion of the URI into a map of parameter names and value
	 * pairs. An example string that would be passed into this function would be
	 * something like "type=sensor&sensor=hr". This string would produce a Map with
	 * two entries, the pair (type, sensor) and (sensor, hr)
	 * @param query the query string to parse
	 * @return a Map of key value pairs for each parameter from the query string
	 */
	private Map<String, String> parseParameters(final String query)
	{
		final Map<String, String> parameters = new HashMap<String, String>();
		final String[] params = query.split("&");
		for(final String param : params)
		{
			final String[] split = param.split("=");
			parameters.put(split[0], split[1]);
		}
		return parameters;
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
			writeToStream(out,exchange);
		} 
		catch (final IOException e)
		{
			LOGGER.error("Error sending crossdomain.xml",e);
		}
	}
	
	private void writeToStream(final JSONObject json, final HttpExchange exchange) throws IOException
	{
		writeToStream(json.toString(), exchange);
	}
	
	/**
	 * Write a string to the response output stream for an HttpExchange
	 * @param str the string to write out
	 * @param exchange the exchange we are processing
	 * @throws IOException if there is a problem writing to the stream
	 */
	private void writeToStream(final String str, final HttpExchange exchange) throws IOException
	{
		exchange.sendResponseHeaders(ServerHandler.RESPONSE_OK, str.getBytes().length);
		final BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(exchange.getResponseBody()));
		writer.write(str);
		writer.flush();
		writer.close();
	}

}