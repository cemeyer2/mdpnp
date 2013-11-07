package edu.illinois.mdpnp.server.sensors;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.JSONObject;

import gnu.io.PortInUseException;
import gnu.io.UnsupportedCommOperationException;

public abstract class PulseOximeter
{
	private static Map<String, PulseOximeter> pulseOximeters;
	private static final Logger LOGGER = Logger.getLogger(PulseOximeter.class);
	
	/**
	 * gets the most recently taken measurement from this PulseOximeter
	 * @return the most recently taken measurement from this PulseOximeter
	 */
	public abstract PulseOximeterMeasurement getMostRecentMeasurement();
	
	/**
	 * gets all the measurements taken from this PulseOximeter.
	 * The underlying implementation of the returned List is left up
	 * to the classes that extend this class.
	 * @return a List of all the measurements taken from this PulseOximeter.
	 */
	public abstract List<PulseOximeterMeasurement> getAllMeasurements();
	
	public JSONObject getAllMeasurementsJSON()
	{
		final List<PulseOximeterMeasurement> measurements = getAllMeasurements();
		final JSONObject object = new JSONObject();
		for(int i = 0; i < measurements.size(); i++)
		{
			final PulseOximeterMeasurement measurement = measurements.get(i);
			try
			{
				object.put(new Integer(i).toString(), measurement.toJSON());
			} 
			catch (final JSONException e)
			{
				LOGGER.error("Error adding to JSONObject",e);
			}
		}
		return object;
	}
	
	public static PulseOximeter getPulseOximeter(final String port)
	{
		if(pulseOximeters == null)
			pulseOximeters = new HashMap<String, PulseOximeter>();
		PulseOximeter pulseOximeter = pulseOximeters.get(port);
		if(pulseOximeter == null)
		{
			try
			{
				pulseOximeter = new NO4100PulseOximeterImpl(port);
			} 
			catch (final PortInUseException e)
			{
				// TODO Auto-generated catch block
				e.printStackTrace();
			} 
			catch (final UnsupportedCommOperationException e)
			{
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (final IOException e)
			{
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			pulseOximeters.put(port, pulseOximeter);
		}
		return pulseOximeter;
		
	}
}
