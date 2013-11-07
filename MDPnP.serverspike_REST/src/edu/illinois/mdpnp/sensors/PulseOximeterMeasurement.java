package edu.illinois.mdpnp.sensors;

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
	boolean disconnected;
	boolean outOfTrack;
	boolean artifact;
	boolean marginalPerfusion;
	boolean lowPerfusion;
	boolean fromValidSensor;
	
	private static final Logger LOGGER = Logger.getLogger(PulseOximeterMeasurement.class);
	
	private PulseOximeterMeasurement()
	{
		this.measurementTime = System.currentTimeMillis();
	}
	
	public PulseOximeterMeasurement(final int heartRate, final int oxygenSaturationPercentage, final boolean disconnected, final boolean outOfTrack, final boolean artifact, final boolean marginalPerfusion, final boolean lowPerfusion, final boolean fromValidSensor)
	{
		this();
		this.heartRate = heartRate;
		this.oxygenSatuationPercentage = oxygenSaturationPercentage;
		this.disconnected = disconnected;
		this.outOfTrack = outOfTrack;
		this.artifact = artifact;
		this.marginalPerfusion = marginalPerfusion;
		this.lowPerfusion = lowPerfusion;
		this.fromValidSensor = fromValidSensor;
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
	
	public boolean isDisconnected()
	{
		return disconnected;
	}

	public boolean isOutOfTrack()
	{
		return outOfTrack;
	}

	public boolean isArtifact()
	{
		return artifact;
	}

	public boolean isMarginalPerfusion()
	{
		return marginalPerfusion;
	}

	public boolean isLowPerfusion()
	{
		return lowPerfusion;
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
			json.put("disconnected", isDisconnected());
			json.put("outOfTrack", isOutOfTrack());
			json.put("artifact", isArtifact());
			json.put("marginalPerfusion", isMarginalPerfusion());
			json.put("lowPerfusion", isLowPerfusion());
			json.put("fromValidSensor", isFromValidSensor());
		} 
		catch (final JSONException e)
		{
			LOGGER.error("Error creating JSONObject",e);
		}
		return json;
	}
	
	public boolean isFromValidSensor()
	{
		return fromValidSensor;
	}
	
}
