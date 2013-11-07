package edu.illinois.mdpnp.server.handlers.sensors;

import java.io.IOException;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

import org.apache.log4j.Logger;
import org.json.JSONObject;

import com.sun.net.httpserver.HttpContext;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import edu.illinois.mdpnp.sensors.PulseOximeter;
import edu.illinois.mdpnp.sensors.PulseOximeterMeasurement;
import edu.illinois.mdpnp.server.handlers.DefaultHandler;
import edu.illinois.mdpnp.server.util.PrintBuffer;

/**
 * This handler handles requests made to the context with path '/sensors/sp02'.
 * Requests made to this handler should be one of the urls specified when
 * viewing this '/sensors/sp02' in a web browser or viewing the source of 
 * getCommands().
 *
 * <br><br>
 *
 * $Rev$:     Revision of last commit<br>
 * $Author$:  Author of last commit<br>
 * $Date$:    Date of last commit<br>
 * @author Charlie Meyer  --  cemeyer2@illinois.edu
 */
public class SPO2Handler extends DefaultHandler implements HttpHandler
{
	
	private static final Logger logger = Logger.getLogger(SPO2Handler.class);

	/**
	 * Default constructor. This handler attaches itself to the context supplied as a
	 * parameter, so do not manually attach it after it is constructed because an exception
	 * will be thrown.
	 * @param context the context that this handler will handle
	 * @see DefaultHandler#DefaultHandler(HttpContext)
	 */
	public SPO2Handler(final HttpContext context)
	{
		super(context);
	}
	
	/**
	 * Handles requests from clients. Has one command that applies without a sensor identifier that
	 * enumerates all available sensors. If a sensor identifier is detected in the request, then
	 * it is parsed. If it is an invalid sensor id, then a single measurement is sent back to the client
	 * with the fromValidSensor field set to false. If the sensor id is valid, then the command is parsed.
	 * If the command parses successfully, then the resulting json object is sent back to the client. If
	 * the command cannot be parsed or a parameter was invalid, then just the most recent measurement is sent
	 * back to the client as a json object. If no command or sensor id is specified or an invalid base command
	 * was specified, the handler prints its available commands back to the client.
	 * @see SPO2Handler#getCommands()
	 * @see DefaultHandler#printHandler(HttpExchange)
	 */
	@Override
	public void handle(final HttpExchange exchange) throws IOException
	{
		final String path = exchange.getRequestURI().getPath();
		final String[] split = path.split("/");
		logger.debug("path: "+path+" split: "+Arrays.toString(split)+" len: "+split.length);
		if(split.length >= 5)
		{
			final String sensorId = split[3];
			logger.debug("sensor id: "+sensorId);
			final PulseOximeter pulseOximeter = PulseOximeter.getPulseOximeter(sensorId);
			if(pulseOximeter == null)
			{
				super.writeJSONToStream(createUndefinedMeasurement(),exchange);
				return;
			}
			JSONObject json = null;
			final String command = split[4];
			logger.debug("command: "+command);
			if(command.toLowerCase().equals("most_recent_reading"))
			{
				final PulseOximeterMeasurement measurement = pulseOximeter.getMostRecentMeasurement();
				if(measurement != null)
					json = measurement.toJSON();
				else
					json = new JSONObject();
			}
			else if(command.toLowerCase().equals("readings_since_last_poll"))
			{
				List<PulseOximeterMeasurement> measurements = new LinkedList<PulseOximeterMeasurement>();
				while(measurements.size() == 0)
				{
					measurements = pulseOximeter.getMeasurementsSinceLastPoll();
					if(measurements.size() == 0)
					{
						try
						{
							Thread.sleep(500);
						}
						catch(final InterruptedException ie){}
					}
				}
				json = pulseOximeter.measurementListToJSON(measurements);
			}
			else if(command.toLowerCase().equals("most_recent_readings"))
			{
				try
				{
					final int readingCount = Integer.parseInt(split[5]);
					json = pulseOximeter.measurementListToJSON(pulseOximeter.getMostRecentMeasurement(readingCount));
				}
				catch(final Exception e)
				{
					json = pulseOximeter.getMostRecentMeasurement().toJSON();
				}
			}
			else if(command.toLowerCase().equals("all_readings"))
			{
				json = pulseOximeter.measurementListToJSON(pulseOximeter.getAllMeasurements());
			}
			logger.debug("through commands json==null: "+(json==null));
			if(json == null)
			{
				final PulseOximeterMeasurement measurement = pulseOximeter.getMostRecentMeasurement();
				if(measurement != null)
					json = measurement.toJSON();
				else
					json = new JSONObject();
			}
			super.writeJSONToStream(json, exchange);
			
		}
		else if(split.length == 4)//base command to this handler
		{
			if(split[3].toLowerCase().equals("available_sensors"))
			{
				logger.debug("handler: available_sensors");
				super.writeJSONToStream(PulseOximeter.getAvailablePulseOximeters(), exchange);
			}
			if(split[3].toLowerCase().equals("add_mock"))
			{
				PulseOximeter.addMock();
				super.writeJSONToStream(PulseOximeter.getAvailablePulseOximeters(), exchange);
			}
		}
		else
		{
			super.printHandler(exchange);
		}
	}

	private JSONObject createUndefinedMeasurement()
	{
		final PulseOximeterMeasurement measurement = new PulseOximeterMeasurement(-1,-1,true,true,true,true,true,false);
		return measurement.toJSON();
	}

	/**
	 * @see DefaultHandler#getCommands()
	 */
	@Override
	public String getCommands()
	{
		final PrintBuffer buffer = new PrintBuffer();
		final HttpContext c = getParentContext();
		
		buffer.println(c.getPath()+"/available_sensors");
		buffer.println(c.getPath()+"/add_mock");
		
		final String p = c.getPath()+"/{sensor_id}/";
		buffer.println(p+"most_recent_reading");
		buffer.println(p+"readings_since_last_poll");
		buffer.println(p+"most_recent_readings/{how_many}");
		buffer.println(p+"all_readings");		
		return buffer.toString();
	}
}
