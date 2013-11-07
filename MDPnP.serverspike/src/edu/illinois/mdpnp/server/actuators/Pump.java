package edu.illinois.mdpnp.server.actuators;

import java.io.IOException;
import java.util.HashMap;

import org.json.JSONObject;

import gnu.io.PortInUseException;
import gnu.io.UnsupportedCommOperationException;

/**
 * 
 * 
 * $Rev$:     Revision of last commit<br>
 * $Author$:  Author of last commit<br>
 * $Date$:    Date of last commit<br>
 * @author Charlie Meyer  --  cemeyer2@illinois.edu
 */
public abstract class Pump
{	
	private static HashMap<Integer, Pump> pumps;
	
	public abstract JSONObject pump(double amount);
	
	public abstract JSONObject getInitialCapacity();
	
	public abstract JSONObject getAmountDelivered();
	
	public abstract JSONObject getRate();
	
	public abstract JSONObject setRate(double rate);
	
	public abstract JSONObject buzzOn();
	
	public abstract JSONObject buzzOff();
	
	public abstract JSONObject run();
	
	public abstract JSONObject stop();
	
	public abstract JSONObject getDirection();
	
	//true to infuse, false to withdraw
	public abstract JSONObject setDirection(boolean infuse);
	
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
}
