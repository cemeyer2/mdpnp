package edu.illinois.mdpnp.sensors;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.JSONObject;

import edu.illinois.mdpnp.sensors.impl.MockPulseOximeter;
import edu.illinois.mdpnp.sensors.impl.NO4100PulseOximeterImpl;
import edu.illinois.mdpnp.server.util.SerialPortUtil;
import gnu.io.PortInUseException;
import gnu.io.SerialPort;
import gnu.io.UnsupportedCommOperationException;

public abstract class PulseOximeter
{
	private static Map<String, PulseOximeter> pulseOximeters;
	private static final Logger logger = Logger.getLogger(PulseOximeter.class);
	
	private static Map<String, SerialPort> serialPorts;
	
	/**
	 * gets the most recently taken measurement from this PulseOximeter
	 * @return the most recently taken measurement from this PulseOximeter
	 * @see PulseOximeterMeasurement
	 */
	public abstract PulseOximeterMeasurement getMostRecentMeasurement();
	
	/**
	 * gets all the measurements taken from this PulseOximeter.
	 * The underlying implementation of the returned List is left up
	 * to the classes that extend this class.
	 * @return a List of all the measurements taken from this PulseOximeter.
	 * @see PulseOximeterMeasurement
	 */
	public abstract List<PulseOximeterMeasurement> getAllMeasurements();
	
	/**
	 * gets the most recent measurements from this PulseOximeter
	 * @param howMany the number of measurements to fetch
	 * @return a list of PulseOximeterMeasurments
	 * @see PulseOximeterMeasurement
	 */
	public abstract List<PulseOximeterMeasurement> getMostRecentMeasurement(int howMany);
	
	/**
	 * The first time a pulse oximeter is constructed, a timestamp is taken. Each time this method completes,
	 * that timestamp is updated to the current time. When this method is called, it returns all of the measurements
	 * that were taken by the pulse oximeter since the previous timestamp
	 * @return a list of {@link PulseOximeterMeasurement}
	 * @see PulseOximeterMeasurement
	 */
	public abstract List<PulseOximeterMeasurement> getMeasurementsSinceLastPoll();
	
	public abstract void close();
	
	public JSONObject measurementListToJSON(final List<PulseOximeterMeasurement> measurements)
	{
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
				logger.error("Error adding to JSONObject",e);
			}
		}
		return object;
	}
	
	public static JSONObject getAvailablePulseOximeters()
	{
		if(pulseOximeters == null)
			pulseOximeters = new HashMap<String, PulseOximeter>();
		if(serialPorts == null)
			serialPorts = new HashMap<String, SerialPort>();
		logger.debug("getting available pulse oximeters");
		final SerialPort[] ports = SerialPortUtil.getSP02SerialPorts();
		for(final SerialPort sp : ports)
			addSerialPort(sp);
		logger.debug("available ports: "+Arrays.toString(ports));
		final JSONObject json = new JSONObject();
		try
		{
			int i = 0;
			for(final String key : serialPorts.keySet())
			{
				json.put("pulseOximeter"+i, serialPorts.get(key).getName().substring(9));
				i++;
			}
			for(final String key : pulseOximeters.keySet())
			{
				logger.debug("key: "+key);
				if(key.contains("mock"))
				{
					json.put("pulseOximeter"+i, key.substring(9));
					i++;
				}
			}
		}
		catch(final JSONException jsone)
		{
			logger.error("error adding to json object",jsone);
		}
		logger.debug("returning: "+json.toString());
		return json;
	}
	
	public static void addMock()
	{
		if(pulseOximeters == null)
			pulseOximeters = new HashMap<String, PulseOximeter>();
		int i = 0;
		String id = "mock"+i;
		boolean foundid = false;
		while(!foundid)
		{
			final PulseOximeter value = pulseOximeters.get(id);
			if(value == null)
				foundid = true;
			else
			{
				i++;
				id = "mock"+i;
			}
		}
		pulseOximeters.put("/dev/tty."+id, new MockPulseOximeter());
	}
	
	public static PulseOximeter getPulseOximeter(final String id)
	{
		if(pulseOximeters == null)
			pulseOximeters = new HashMap<String, PulseOximeter>();
		final String port = "/dev/tty."+id;
		PulseOximeter pulseOximeter = pulseOximeters.get(port);
		if(pulseOximeter == null)
		{
			try
			{
				final SerialPort sp = getSerialPort(id);
				if(sp != null)
					pulseOximeter = new NO4100PulseOximeterImpl(sp);
				else
					return null;
			} 
			catch (final PortInUseException e)
			{
				logger.error("error creating PulseOximeter",e);
				return null;
			} 
			catch (final UnsupportedCommOperationException e)
			{
				logger.error("error creating PulseOximeter",e);
				return null;
			} 
			catch (final IOException e)
			{
				logger.error("error creating PulseOximeter",e);
				return null;
			}
			pulseOximeters.put(port, pulseOximeter);
		}
		return pulseOximeter;
	}
	
	public static final Collection<PulseOximeter> getActivePulseOximeters()
	{
		if(pulseOximeters == null)
			pulseOximeters = new HashMap<String, PulseOximeter>();
		return pulseOximeters.values();
	}
	
	public static void addSerialPort(final SerialPort sp)
	{
		if(serialPorts == null)
			serialPorts = new HashMap<String, SerialPort>();
		serialPorts.put(sp.getName(), sp);
	}
	
	public static SerialPort getSerialPort(final String id)
	{
		for(final String name : serialPorts.keySet())
		{
			final SerialPort sp = serialPorts.get(name);
			if(name.contains(id))
				return sp;
		}
		return null;
	}
}
