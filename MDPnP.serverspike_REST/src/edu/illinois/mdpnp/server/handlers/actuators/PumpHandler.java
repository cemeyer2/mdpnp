package edu.illinois.mdpnp.server.handlers.actuators;

import java.io.IOException;

import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.JSONObject;

import com.sun.net.httpserver.HttpContext;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import edu.illinois.mdpnp.actuators.Pump;
import edu.illinois.mdpnp.server.handlers.DefaultHandler;
import edu.illinois.mdpnp.server.util.PrintBuffer;
import edu.illinois.mdpnp.server.util.SerialPortUtil;

/**
 * This is a handler that serves urls for interacting with pumps. The way it is currently
 * implemented, there is only one handler attached to the '/actuators/pump' context, and this
 * handler serves requests for all pumps. In the future, it may be worthwhile to have one
 * handler and one context for each attached pump, but for now I felt it best to have one handler
 * and one context because I feel it makes the system more flexible (pumps can be added at
 * runtime instead of having to be present when the server is initialized). 
 *
 * <br><br>
 *
 * $Rev$:     Revision of last commit<br>
 * $Author$:  Author of last commit<br>
 * $Date$:    Date of last commit<br>
 * @author Charlie Meyer  --  cemeyer2@illinois.edu
 */
public class PumpHandler extends DefaultHandler implements HttpHandler
{
	private static final Logger logger = Logger.getLogger(PumpHandler.class);

	private static final Object mutex = new Object();
	/**
	 * Creates a pump handler. This handler automatically attaches itself to the 
	 * provided context, so do not manually attach it as it will cause an exception
	 * to be thrown.
	 * @see DefaultHandler#DefaultHandler(HttpContext)
	 * @see SerialPortUtil#getPumpSerialPort()
	 * @param context the context that this handler will handle
	 * @param serialPortName the serial port name that the pump network is attached to.
	 * Generally, it is safe to use the PumpUtil.getPumpSerialPort() method to auto-detect
	 * the serial port that the pump network is attached to and pass that value into this
	 * constructor
	 */
	public PumpHandler(final HttpContext context, final String serialPortName)
	{
		super(context);
	}

	/**
	 * Handles requests. Request urls should be of the form specified in getCommands().
	 * Requests will be served as follows: if the url has a valid pump number, then 
	 * this handler will parse the url for a command. if there is a valid command, then that
	 * command will be executed and a json object representing the status of the pump will be
	 * sent back to the client. If the command is not recognized, then no command will be executed
	 * and a status json will be sent back to the client. It is up to the client to determine
	 * based off of the status json object if a command was actually run. It is also up to the
	 * client to determine if the status json represents the status of an actual pump, since the
	 * pump network will return 00P for all fields if a command was sent to a pump that does
	 * not exist on the network. This server will send any command to any pump and not check what
	 * was returned.
	 * @see PumpHandler#getCommands()
	 */
	@Override
	public void handle(final HttpExchange exchange) throws IOException
	{
		synchronized(mutex)
		{
			final String path = exchange.getRequestURI().getPath();
			final String[] split = path.split("/");
			if(split.length == 4) //generic pump command, not for a specific pump
			{
				final String command = split[3];
				if(command.equals("pumps_in_network"))
				{
					super.writeJSONToStream(Pump.getPumpsInNetwork(), exchange);
				}
				else
					super.printHandler(exchange);
			}
			else if(split.length >= 5)
			{
				try
				{
					final int pumpNumber = Integer.parseInt(split[3].substring(split[3].length()-1));
					if(split.length == 5) //for commands that do not take a parameter
						processCommand(pumpNumber, split[4], null, null, exchange);
					else if(split.length == 6) //for commands that take a parameter
						processCommand(pumpNumber, split[4], split[5], null, exchange);
					else if(split.length == 7)
						processCommand(pumpNumber, split[4], split[5], split[6], exchange);

				}
				catch(final NumberFormatException e)
				{
					super.printHandler(exchange);
				}
			}
			else
			{
				super.printHandler(exchange);
			}
		}
	}

	private void processCommand(final int pumpNumber, final String command, final String parameter1, final String parameter2, final HttpExchange exchange)
	{
		final Pump pump = Pump.getPump(pumpNumber);

		JSONObject json = null;
		if(!pump.existsInNetwork())
		{
			json = pump.getInvalidPumpStatus();
		}
		else if(command.toLowerCase().equals("run"))
		{
			json = pump.run();
		}
		else if(command.toLowerCase().equals("stop"))
		{
			json = pump.stop();
		}
		else if(command.toLowerCase().equals("buzz_on"))
		{
			json = pump.buzzOn();
		}
		else if(command.toLowerCase().equals("buzz_off"))
		{
			json = pump.buzzOff();
		}
		//only use for unit tests, which is why this is not documented
		else if(command.toLowerCase().equals("clear"))
		{
			pump.clearDispensedCounter(true);
			pump.clearDispensedCounter(false);
			json = pump.getStatus();
		}
		else if(command.toLowerCase().equals("set_rate"))
		{
			json = setRate(parameter1, parameter2, pump);				
		}
		else if(command.toLowerCase().equals("set_direction"))
		{
			json = setDirection(parameter1, pump);
		}
		else if(command.toLowerCase().equals("set_volume"))
		{
			json = setVolume(parameter1, parameter2, pump);				
		}
		else if(command.equals("set_diameter"))
		{
			json = setDiameter(parameter1, pump);
		}
		else if(command.equals("status"))
		{
			json = pump.getStatus();
		}
		else
		{
			json = pump.getStatus();
			logger.info("invalid command supplied");
			json = addToJSON("error","invalid command supplied",json);
		}
		try
		{
			super.writeJSONToStream(json, exchange);
		}
		catch(final IOException ioe)
		{
			//ignore
		}
	}

	/**
	 * @see DefaultHandler#getCommands()
	 */
	@Override
	public String getCommands()
	{
		final PrintBuffer buffer = new PrintBuffer();
		final HttpContext c = getParentContext();

		buffer.println(c.getPath()+"/pumps_in_network");

		final String p = c.getPath()+"/{pump_id}/";
		buffer.println(p+"run");
		buffer.println(p+"stop");
		buffer.println(p+"buzz_on");
		buffer.println(p+"buzz_off");
		buffer.println(p+"status");
		buffer.println(p+"set_rate/{rate}/{units}");
		buffer.println(p+"set_direction/{dir}");
		buffer.println(p+"set_volume/{amount}/{units}");
		buffer.println(p+"set_diameter/{diameter}");
		buffer.println(p+"clear");
		return buffer.toString();
	}

	private JSONObject addToJSON(final String key, final String value, final JSONObject json)
	{
		try
		{
			json.put(key, value);
		}
		catch(final JSONException jsone)
		{
			logger.error("could not add message to json object",jsone);
		}
		return json;
	}

	private JSONObject setRate(final String parameter1, final String parameter2, final Pump pump)
	{
		JSONObject json;
		try
		{
			final double rate = Double.parseDouble(parameter1);
			if(parameter2.equals("MM") || parameter2.equals("MH") || parameter2.equals("UH") || parameter2.equals("UM"))
			{
				json = pump.setRate(rate, parameter2);
			}
			else
			{
				logger.info("invalid units supplied");
				json = pump.getStatus();
				json = addToJSON("error","invalid units supplied for rate",json);
			}
		}
		catch(final NumberFormatException nfe)
		{
			logger.error("Error parsing rate amount for pump.setRate",nfe);
			json = pump.getStatus();
			json = addToJSON("error","number not supplied for rate",json);
		}
		return json;
	}

	private JSONObject setDirection(final String parameter1, final Pump pump)
	{
		JSONObject json;
		if(parameter1.toUpperCase().equals("WDR") || parameter1.toUpperCase().equals("INF"))
		{
			boolean infuse = true;
			if(parameter1.toUpperCase().equals("WDR"))
				infuse = false;
			json = pump.setDirection(infuse);
		}
		else
		{
			logger.error("invalid direction specified for set_direction: supplied=>"+parameter1+", required INF or WDR");
			json = pump.getStatus();
			json = addToJSON("error","invalid direction supplied",json);
		}
		return json;
	}

	private JSONObject setVolume(final String parameter1, final String parameter2, final Pump pump)
	{
		JSONObject json;
		try
		{
			final double amount = Double.parseDouble(parameter1);
			if(parameter2.toUpperCase().equals("UL") || parameter2.toUpperCase().equals("ML"))
			{
				json = pump.setVolumeToPump(amount, parameter2);
			}
			else
			{
				json = pump.getStatus();
				json = addToJSON("error", "invalid units supplied for volume", json);
				logger.error("invalid units supplied for set_volume: supplied=>"+parameter2+", required UL or ML");
			}
		}
		catch(final NumberFormatException nfe)
		{
			logger.error("error parsing amount for set_volume command",nfe);
			json = pump.getStatus();
			json = addToJSON("error", "number not supplied for volume", json);
		}
		return json;
	}

	private JSONObject setDiameter(final String parameter1, final Pump pump)
	{
		JSONObject json;
		try
		{
			final double dia = Double.parseDouble(parameter1);
			json = pump.setDiameter(dia);
		}
		catch(final NumberFormatException nfe)
		{
			logger.error("error parsing amount for set_diameter command",nfe);
			json = pump.getStatus();
			json = addToJSON("error", "number not supplied for diameter", json);
		}
		return json;
	}
}