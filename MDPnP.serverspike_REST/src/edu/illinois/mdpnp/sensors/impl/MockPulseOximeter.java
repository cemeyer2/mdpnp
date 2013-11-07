package edu.illinois.mdpnp.sensors.impl;

import java.io.IOException;
import java.util.LinkedList;
import java.util.List;
import java.util.Stack;

import org.apache.log4j.Logger;

import edu.illinois.mdpnp.sensors.PulseOximeter;
import edu.illinois.mdpnp.sensors.PulseOximeterMeasurement;
import gnu.io.PortInUseException;
import gnu.io.UnsupportedCommOperationException;



/**
 * A mock pulse oximeter that currently always provides valid measurements. Heart rates are in the range
 * of 70-80 bpm and oxigen saturation is between 96-99%. This class should be extended in the future
 * to allow to mock error conditions.
 *
 * <br><br>
 * 
 * $Rev:  $:     Revision of last commit<br> 
 * $Author:  $:  Author of last commit<br>
 * $Date:  $:    Date of last commit<br>
 * @author Charlie Meyer  --  cemeyer2@illinois.edu
 */
public class MockPulseOximeter extends PulseOximeter implements Runnable
{
	private final Stack<PulseOximeterMeasurement> measurements;
	private static final Logger logger = Logger.getLogger(MockPulseOximeter.class);
	long timestamp;
	Thread th;
	
	public MockPulseOximeter()
	{
		measurements = new Stack<PulseOximeterMeasurement>();
		timestamp = System.currentTimeMillis();
		th = new Thread(this);
		th.start();
	}
	
	public void run()
	{
		while(true)
		{
			final int pulse = (int)(Math.random()*10d+70d);
			final int oxigen = (int)(Math.random()*3d+96d);
			final boolean disconnected = false;
			final boolean outOfTrack = false;
			final boolean artifact = false;
			final boolean marginalPerfusion = false;
			final boolean lowPerfusion = false;
			final boolean fromValidSensor = true;
			final PulseOximeterMeasurement m = new PulseOximeterMeasurement(pulse, oxigen, disconnected, outOfTrack,artifact,marginalPerfusion,lowPerfusion,fromValidSensor);
			measurements.push(m);
			try
			{
				final int rand = (int)(500*Math.random());
				Thread.sleep(750+rand);
			}
			catch(final InterruptedException ie)
			{
				logger.error("error sleeping",ie);
			}
		}
	}
	
	@Override
	public List<PulseOximeterMeasurement> getAllMeasurements()
	{
		return measurements;
	}

	@Override
	public PulseOximeterMeasurement getMostRecentMeasurement()
	{
		return measurements.peek();
	}

	@Override
	public List<PulseOximeterMeasurement> getMeasurementsSinceLastPoll()
	{
		final List<PulseOximeterMeasurement> measurements = new LinkedList<PulseOximeterMeasurement>();
		for(int i = getAllMeasurements().size()-1; i>=0; i--)
		{
			final PulseOximeterMeasurement measurement = getAllMeasurements().get(i);
			if(measurement.getMeasurementTime() >= timestamp)
				measurements.add(measurement);
			else
				break;
		}
		timestamp = System.currentTimeMillis();
		return measurements;
	}

	@Override
	public List<PulseOximeterMeasurement> getMostRecentMeasurement(final int howMany)
	{
		final List<PulseOximeterMeasurement> measurements = new LinkedList<PulseOximeterMeasurement>();
		for(int i = getAllMeasurements().size()-1; i>=0; i--)
			measurements.add(this.measurements.get(i));
		return measurements;
	}

	public static void main(final String[] args) throws IOException, PortInUseException, UnsupportedCommOperationException, InterruptedException
	{
		final MockPulseOximeter po = new MockPulseOximeter();
		while(true)
		{
			Thread.sleep(5000);
			System.out.println(po.measurementListToJSON(po.getMeasurementsSinceLastPoll()));
		}
	}

	@Override
	public void close()
	{
		th.stop();
		this.measurements.clear();
		
	}

}
