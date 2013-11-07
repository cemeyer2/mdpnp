package edu.illinois.mdpnp.actuators.impl;

import org.json.JSONObject;

import edu.illinois.mdpnp.actuators.Pump;

public class MockPump extends Pump
{
	private double volumeToPump;
	private double volumeInfused;
	private double volumeWithdrawn;
	private double rate;
	private double diameter;
	private final double volumeLeftToInfuse;
	private final double volumeLeftToWithdraw;
	
	private String volumeUnits;
	private String rateUnits;
	private String state;
	private String direction;
	
	private boolean buzzing;
	
	private final int pumpNumber;
	
	private long startTime;
	
	public MockPump(final int pumpNumber)
	{
		this.pumpNumber = pumpNumber;
		volumeToPump = 1;
		volumeLeftToInfuse = volumeToPump;
		volumeLeftToWithdraw = volumeToPump;
		volumeInfused = 0;
		volumeWithdrawn = 0;
		rate = 100;
		diameter = 14.43;
		volumeUnits = "ML";
		rateUnits = "MH";
		state = "stopped";
		direction = "INF";
		buzzing = false;
	}
	
	@Override
	public JSONObject buzzOff()
	{
		buzzing = false;
		return this.getStatus();
	}

	@Override
	public JSONObject buzzOn()
	{
		buzzing = true;
		return getStatus();
	}

	@Override
	public JSONObject clearDispensedCounter(final boolean infuse)
	{
		if(!isRunning())
		{
			if(infuse)
				volumeInfused = 0;
			else
				volumeWithdrawn = 0;
		}
		return getStatus();
	}

	@Override
	public boolean existsInNetwork()
	{
		return true;
	}

	@Override
	public int getPumpNumber()
	{
		return pumpNumber;
	}

	@Override
	public JSONObject getStatus()
	{
		updateVolumes();
		return null;
	}

	@Override
	public JSONObject run()
	{
		startTime = System.currentTimeMillis();
		return this.getStatus();
	}

	@Override
	public JSONObject setDiameter(final double diameter)
	{
		if(!isRunning())
		{
			this.diameter = diameter;
		}
		return this.getStatus();
	}

	@Override
	public JSONObject setDirection(final boolean infuse)
	{
		if(!isRunning())
		{
			if(infuse)
				this.direction = "INF";
			else
				this.direction = "WDR";
		}
		return this.getStatus();
	}

	/**
	 * currently doesnt check to see if rate is in bounds, just goes with it
	 */
	@Override
	public JSONObject setRate(final double rate, final String units)
	{
		this.rate = rate;
		this.rateUnits = units;
		return this.getStatus();
	}

	@Override
	public JSONObject setVolumeToPump(final double amount, final String units)
	{
		if(!isRunning())
		{
			this.volumeToPump = amount;
			this.volumeUnits = units;
		}
		return this.getStatus();
	}

	@Override
	public JSONObject stop()
	{
		if(state.equals("running"))
			state = "paused";
		else if(state.equals("paused"))
			state = "stopped";
		return getStatus();
	}
	
	private boolean isRunning()
	{
		if(state.equals("running"))
		{
			final long runTime = calculatePumpRunTime();
			final long now = System.currentTimeMillis();
			if(now < this.startTime+runTime)
				return false;
			else
				return true;
		}
		else
			return false;
	}
	
	private long calculatePumpRunTime()
	{
		if(this.rateUnits.equals("MH") || rateUnits.equals("UH"))
		{
			final double msInOneHour = 3600000;
			final double mlPerMs = this.rate / msInOneHour;
			if(this.direction.equals("WDR"))
			{
				return (long)(this.volumeLeftToWithdraw/mlPerMs);
			}
			else
			{
				return (long)(this.volumeLeftToInfuse/mlPerMs);
			}
		}
		else if(this.rateUnits.equals("MM") || rateUnits.equals("UM"))
		{
			final double msInOneMinute = 60000;
			final double mlPerMs = this.rate / msInOneMinute;
			if(this.direction.equals("WDR"))
			{
				return (long)(this.volumeLeftToWithdraw/mlPerMs);
			}
			else
			{
				return (long)(this.volumeLeftToInfuse/mlPerMs);
			}
		}
		return -1l;
	}
	
	private void updateVolumes()
	{
		final long now = System.currentTimeMillis();
		final long duration = now - this.startTime;
		if(this.rateUnits.equals("MH") || this.rateUnits.equals("UH"))
		{
			
		}
		else if(this.rateUnits.equals("MM") || this.rateUnits.equals("UM"))
		{
			
		}
	}

	@Override
	public void close()
	{
		// TODO Auto-generated method stub
		
	}

}
