package edu.illinois.mdpnp.server.sensors;

import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * $Rev$:     Revision of last commit<br>
 * $Author$:  Author of last commit<br>
 * $Date$:    Date of last commit<br>
 * @author Charlie Meyer  --  cemeyer2@illinois.edu
 */
public class HeartRateGenerator
{
	private static final Logger LOGGER = Logger.getLogger(HeartRateGenerator.class);
	
	public static JSONObject getHeartRate()
	{
		final String rate = ((Math.random()*10+80)+"").substring(0,4);
		
		final JSONObject json = new JSONObject();
		
		try
		{
			json.put("type", "heartrate");
			json.put("value", rate);
			return json;
		} 
		catch (final JSONException e)
		{
			LOGGER.error("Error creating JSONObject",e);
		}
		return null;		
	}
}
