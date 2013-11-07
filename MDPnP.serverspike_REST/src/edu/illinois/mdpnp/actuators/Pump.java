package edu.illinois.mdpnp.actuators;

import java.io.IOException;
import java.util.Collection;
import java.util.HashMap;

import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.JSONObject;

import edu.illinois.mdpnp.actuators.impl.NE500PumpImpl;
import gnu.io.PortInUseException;
import gnu.io.UnsupportedCommOperationException;

/**
 * Defines the interface and a factory for pumps. Currently, only one model of pump
 * is supported, but others can extend this class and implement the interface as well in the future.
 * <br><br>
 * The static {@link Pump#getPump(int)} method provides a factory interface for getting a specific
 * Pump. Once {@link Pump#getPump(int)} is called for a specific pump number, that pump is instantiated
 * and stored in memory so subsequent calls to {@link Pump#getPump(int)} for that pump number will not
 * cause that pump to be constructed again.
 * 
 * <br><br>
 * 
 * $Rev$:     Revision of last commit<br>
 * $Author$:  Author of last commit<br>
 * $Date$:    Date of last commit<br>
 * @author Charlie Meyer  --  cemeyer2@illinois.edu
 */
public abstract class Pump
{	
	private static HashMap<Integer, Pump> pumps;
	private static final Logger logger = Logger.getLogger(Pump.class);
	
	/**
	 * Sets the amount of liquid that the pump should infuse or withdraw (depending on the direction
	 * the pump is set).
	 * @param amount the amount of liquid to infuse or withdraw, as a double
	 * @param units must be either "UL" or "ML"
	 * @return the status of the pump after the volume is set
	 * @see Pump#getStatus()
	 */
	public abstract JSONObject setVolumeToPump(double amount, String units);
	
	/**
	 * Sets the rate that the pump will infuse or withdraw liquid. The units parameter
	 * is only valid if the status of the pump is "stopped", otherwise the units will remain
	 * as they were before setRate() was called and the rate will change to be just the
	 * value of the rate parameter (with the old units)
	 * @param rate the rate to set
	 * @param units the units of the new rate, must be one of the following: "UM", "MM", "UH", or "MH"
	 * @return the status of the pump after the rate is set
	 * @see Pump#getStatus()
	 */
	public abstract JSONObject setRate(double rate, String units);
	
	/**
	 * turns on the buzzer on the pump. has no effect if the buzzer is already on
	 * @return the status of the pump after the buzzer is turned on
	 * @see Pump#getStatus()
	 */
	public abstract JSONObject buzzOn();
	
	/**
	 * turns off the buzzer on the pump. has no effect if the buzzer is already off.
	 * @return the status of the pump after the buzzer is turned off
	 * @see Pump#getStatus()
	 */
	public abstract JSONObject buzzOff();
	
	/**
	 * Starts the pump either infusing or withdrawing depending on the direction that is set. The pump will
	 * continue pumping until either the volume infused or withdrawn is equal to the next largest positive multiple
	 * of the volume to pump. If the pump is in a paused state (ie the volume infused or withdrawn depending on 
	 * the direction set on the pump is greater than 0 and less than the volume to pump and the state is "paused"), 
	 * calling run will cause the pump to resume pumping until the volume pumped is equal to the volume to dispense.
	 * @return the status of the pump after run() was called
	 * @see Pump#getStatus()
	 */
	public abstract JSONObject run();
	
	/**
	 * Stops or pauses the pump. If the pump status is "withdrawing" or "infusing", then calling stop will stop
	 * the pump from pumping and set the pump status to "paused" and the internal counter of the amount dispensed
	 * will not be reset. If stop() is called when the pump status is "paused", then the pump status will be changed
	 * to "stopped" and the volume dispensed counter will be reset to zero. Calling stop when the status is "stopped"
	 * has no effect.
	 * @return the status of the pump after stop() was called
	 * @see Pump#getStatus()
	 */
	public abstract JSONObject stop();
		
	/**
	 * Sets the direction that the pump syringe will move.
	 * @param infuse set to true to have the pump infuse, false to have it withdraw
	 * @return the status of the pump after {@link Pump#setDirection(boolean)} was called
	 * @see Pump#getStatus()
	 */
	public abstract JSONObject setDirection(boolean infuse);
	
	/**
	 * Sets the diameter of the syringe in the pump. This has no effect if
	 * the status of the pump is "paused", "withdrawing", or "infusing"
	 * @param diameter the new diameter of the syringe in mm
	 * @return the status of the pump after {@link Pump#setDiameter(double)} was called
	 * @see Pump#getStatus()
	 */
	public abstract JSONObject setDiameter(double diameter);
		
	/**
	 * Returns a JSON object containing all of the different properties of the pump at the
	 * time that {@link Pump#getStatus()} was called. Currently, the format of the JSON object
	 * returned is as follows:
	 * <br><br>
	 * obj.volumeToPump.amount<br>
	 * obj.volumeToPump.units<br>
	 * obj.diameter.amount<br>
	 * obj.diameter.units<br>
	 * obj.rate.amount<br>
	 * obj.rate.units<br>
	 * obj.status<br>
	 * obj.direction<br>
	 * obj.firmwareVersion<br>
	 * obj.buzzing<br>
	 * obj.pumpNumber<br>
	 * obj.volumeDispensed.inf.amount<br>
	 * obj.volumeDispensed.inf.units<br>
	 * obj.volumeDispensed.wdr.amount<br>
	 * obj.volumeDispensed.wdr.units<br>
	 * *optional* obj.error<br>
	 * @return the JSON object as described above
	 */
	public abstract JSONObject getStatus();
	
	/**
	 * returns a json object with the same layout as {@link Pump#getStatus()}, except
	 * with all fields undefined
	 * @return a json object with the same layout as #Pump{@link #getStatus()}, except
	 * with all fields undefined
	 */
	public JSONObject getInvalidPumpStatus()
	{
		final JSONObject root = new JSONObject();
		try
		{
			final JSONObject vol = new JSONObject();
			vol.put("amount", "undefined");
			vol.put("units", "undefined");
			root.put("volumeToPump", vol);
			final JSONObject dia = new JSONObject();
			dia.put("amount", "undefined");
			dia.put("units", "undefined");
			root.put("diameter", dia);
			final JSONObject rate = new JSONObject();
			rate.put("amount", "undefined");
			rate.put("units", "undefined");
			root.put("rate", rate);
			root.put("status", "undefined");
			root.put("direction", "undefined");
			root.put("firmwareVersion", "undefined");
			root.put("buzzing", false);
			root.put("pumpNumber", this.getPumpNumber());
			final JSONObject dis = new JSONObject();
			final JSONObject inf = new JSONObject();
			inf.put("amount", "undefined");
			inf.put("units", "undefined");
			dis.put("inf", inf);
			final JSONObject wdr = new JSONObject();
			wdr.put("amount", "undefined");
			wdr.put("units", "undefined");
			dis.put("wdr", wdr);
			root.put("volumeDispensed", dis);
			root.put("error", "pump not in network");
		}
		catch(final JSONException jsone)
		{
			logger.error("error creating json object",jsone);
		}
		return root;
	}
	
	/**
	 * gets the number of this pump
	 * @return the number of this pump
	 */
	public abstract int getPumpNumber();
	
	/**
	 * determines if the pump exists (is hooked up) in the network
	 * @return true if the pump exists in the network, false otherwise
	 */
	public abstract boolean existsInNetwork();
	
	/**
	 * Clears the pump's internal counters of how much liquid has been
	 * either diffused or withdrawn. This method should only be used
	 * from the unit tests, not in the server itself
	 * @param infuse set to true to clear the infuse counter, false to clear the withdraw counter
	 * @return the status of the pump after {@link Pump#clearDispensedCounters()} was called
	 * @see Pump#getStatus()
	 */
	public abstract JSONObject clearDispensedCounter(boolean infuse);
	
	public abstract void close();
	
	/**
	 * determines if a given pump exists (is hooked up) in the network
	 * @param pumpNumber the pump number to check
	 * @return true if the pump exists, false otherwise
	 */
	public static boolean pumpExistsInNetwork(final int pumpNumber)
	{
		final Pump pump = getPump(pumpNumber);
		return pump.existsInNetwork();
	}
	
	/**
	 * Factory method. Returns a pump object corresponding to the pump number supplied
	 * as a parameter. This method first checks memory to see if the pump has already been
	 * constructed and returns it if it has, if it has not, it constructs it, stores it in memory,
	 * and then returns it
	 * @param pumpNumber the pump number
	 * @return a Pump
	 */
	public static Pump getPump(final int pumpNumber)
	{
		if(pumps == null)
			pumps = new HashMap<Integer, Pump>();
		Pump pump = pumps.get(pumpNumber);
		if(pump == null)
		{
			try
			{
				final String os = System.getProperty("os.name");
				if(os.equals("Linux")) //fix this so its correct
				{
					pump = new NE500PumpImpl("/dev/ttyUSB0",pumpNumber);
				}
				else if(os.equals("Mac OS X"))
				{
					pump = new NE500PumpImpl("/dev/tty.PL2303-0000103D",pumpNumber);
				}
			} catch (final PortInUseException e)
			{
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (final UnsupportedCommOperationException e)
			{
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (final IOException e)
			{
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			pumps.put(pumpNumber, pump);
		}
		return pump;
	}
	
	/**
	 * scans the pump network and determines which pumps are actually connected and active
	 * in the network. the format of the json object that is returned is as follows:
	 * <br><br>
	 * obj.pump0: boolean<br>
	 * obj.pump1: boolean<br>
	 * ....<br>
	 * obj.pump99: boolean<br>
	 * @return a json object representing which pumps in the network are connected and active
	 */
	public static JSONObject getPumpsInNetwork()
	{
		final JSONObject json = new JSONObject();
		for(int pump = 0; pump < 100; pump++)
		{
			final boolean exists = Pump.pumpExistsInNetwork(pump);
			try
			{
				if(exists)
					json.put("pump"+pump, "pump"+pump);
			}
			catch(final JSONException jsone)
			{
				logger.error("error creating json object",jsone);
			}
		}
		return json;
	}
	
	public static final Collection<Pump> getActivePumps()
	{
		if(pumps == null)
			pumps = new HashMap<Integer, Pump>();
		return pumps.values();
	}
}
