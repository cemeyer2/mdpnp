package edu.illinois.mdpnp.server.sensors;

import java.util.Date;

import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Represents one measurement from a PulseOximeter
 *
 * <br><br>
 * 
 * $Rev$:     Revision of last commit<br>
 * $Author$:  Author of last commit<br>
 * $Date$:    Date of last commit<br>
 * @author Charlie Meyer  --  cemeyer2@illinois.edu
 */
public class PulseOximeterMeasurement
{
	private int heartRate;
	private int oxygenSatuationPercentage;
	private final long measurementTime;
	
	private static final Logger LOGGER = Logger.getLogger(PulseOximeterMeasurement.class);
	
	private PulseOximeterMeasurement()
	{
		this.measurementTime = System.currentTimeMillis();
	}
	
	public PulseOximeterMeasurement(final int heartRate, final int oxygenSaturationPercentage)
	{
		this();
		this.heartRate = heartRate;
		this.oxygenSatuationPercentage = oxygenSaturationPercentage;
	}

	public int getHeartRate()
	{
		return heartRate;
	}

	public int getOxygenSatuationPercentage()
	{
		return oxygenSatuationPercentage;
	}

	/**
	 * gets the time of the measurement
	 * @return the number of milliseconds since the epoch when this measurement was created
	 */
	public long getMeasurementTime()
	{
		return measurementTime;
	}
	
	/**
	 * gets the time of the measurement
	 * @return the time that this measurement was created as a Date object
	 */
	public Date getMeasurementTimeAsDate()
	{
		return new Date(getMeasurementTime());
	}
	
	/**
	 * Converts this measurement to a JSONObject
	 * @return a JSONObject representing this measurement
	 */
	public JSONObject toJSON()
	{
		final JSONObject json = new JSONObject();
		try
		{
			json.put("type", "measurement");
			json.put("measurementType", "PulseOximeter");
			json.put("measurementTime", getMeasurementTime());
			json.put("heartRate", getHeartRate());
			json.put("oxygenSaturationPercentage", getOxygenSatuationPercentage());
		} 
		catch (final JSONException e)
		{
			LOGGER.error("Error creating JSONObject",e);
		}
		return json;
	}
	
}
