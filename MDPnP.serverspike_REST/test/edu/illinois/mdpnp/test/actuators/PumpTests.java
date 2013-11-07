package edu.illinois.mdpnp.test.actuators;

import static org.junit.Assert.assertEquals;

import org.json.JSONException;
import org.json.JSONObject;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;

import edu.illinois.mdpnp.actuators.Pump;

/**
 * This is a collection of tests for the Pump class. Before running these tests,
 * it is assumed that exactly one pump is hooked up to the serial port and has
 * the address of 0. 
 *
 * <br><br>
 * 
 * $Rev$:     Revision of last commit<br>
 * $Author$:  Author of last commit<br>
 * $Date$:    Date of last commit<br>
 * @author Charlie Meyer  --  cemeyer2@illinois.edu
 */
public class PumpTests
{
	private static JSONObject initialStatus;
	
	@BeforeClass
	public static void setUp()
	{
		final Pump pump = Pump.getPump(0);
		initialStatus = pump.getStatus();
	}
	
	@AfterClass
	public static void tearDown() throws JSONException
	{
		final Pump pump = Pump.getPump(0);
		final String vola = initialStatus.getJSONObject("volumeToPump").getString("amount");
		final String volu = initialStatus.getJSONObject("volumeToPump").getString("units");
		final String dia = initialStatus.getJSONObject("diameter").getString("amount");
		final String rata = initialStatus.getJSONObject("rate").getString("amount");
		final String ratu = initialStatus.getJSONObject("rate").getString("units");
		final boolean dir = (initialStatus.getString("direction").equals("INF"))?true:false;
		
		pump.clearDispensedCounter(true);
		pump.clearDispensedCounter(false);
		pump.stop();
		pump.stop();
		pump.setVolumeToPump(Double.parseDouble(vola), volu);
		pump.setDiameter(Double.parseDouble(dia));
		pump.setRate(Double.parseDouble(rata), ratu);
		pump.setDirection(dir);
	}
	
	/**
	 * Tests each individual pump in the network to see if it is there.
	 * The only one that should report true is pump 0
	 */
	@Test(timeout=10000)
	public void pumpNetworkNoJson()
	{
		Pump pump = Pump.getPump(0);
		assertEquals(true, pump.existsInNetwork());
		for(int i = 1; i < 100; i++)
		{
			pump = Pump.getPump(i);
			assertEquals(false, pump.existsInNetwork());
		}
	}
	
	/**
	 * Tests the pump network to probe for the existance of pumps, this time
	 * using the json object that is created
	 * @throws JSONException this shouldnt be thrown
	 */
	@Test(timeout=10000)
	public void pumpNetworkJson() throws JSONException
	{
		final JSONObject json = Pump.getPumpsInNetwork();
		assertEquals(true, json.getBoolean("pump0"));
		for(int i = 1; i < 100; i++)
		{
			assertEquals(false, json.getBoolean("pump"+i));
		}
	}
	
	@Test
	public void setPumpDirection() throws JSONException
	{
		final Pump pump = Pump.getPump(0);
		pump.setDirection(true);
		String dir = pump.getStatus().getString("direction");
		assertEquals("INF",dir);
		pump.setDirection(false);
		dir = pump.getStatus().getString("direction");
		assertEquals("WDR",dir);
	}
	
	@Test
	public void pumpRunPauseStop() throws JSONException
	{
		final Pump pump = Pump.getPump(0);
		//call stop twice to ensure that we are stopped and not paused
		pump.stop();
		pump.stop();
		pump.setDirection(false); //set dir to wdr
		String status = pump.getStatus().getString("status");
		assertEquals("stopped",status);
		pump.run();
		status = pump.getStatus().getString("status");
		assertEquals("withdrawing",status);
		pump.stop();
		status = pump.getStatus().getString("status");
		assertEquals("paused",status);
		pump.stop();
		status = pump.getStatus().getString("status");
		assertEquals("stopped",status);
	}
	
	@Test
	public void setPumpVolume() throws JSONException
	{
		final Pump pump = Pump.getPump(0);
		pump.setVolumeToPump(0.75, "UL");
		String vol = pump.getStatus().getJSONObject("volumeToPump").getString("amount");
		assertEquals("0.750", vol);
		String units = pump.getStatus().getJSONObject("volumeToPump").getString("units");
		assertEquals("UL",units);
		
		pump.setVolumeToPump(0.5, "ML");
		vol = pump.getStatus().getJSONObject("volumeToPump").getString("amount");
		assertEquals("0.500",vol);
		units = pump.getStatus().getJSONObject("volumeToPump").getString("units");
		assertEquals("ML",units);
	}
	
	@Test
	public void setPumpRate() throws JSONException
	{
		final Pump pump = Pump.getPump(0);
		pump.setRate(10.12, "UM");
		String rate = pump.getStatus().getJSONObject("rate").getString("amount");
		String units = pump.getStatus().getJSONObject("rate").getString("units");
		assertEquals("10.12",rate);
		assertEquals("UM",units);
		
		pump.setRate(1, "MM");
		rate = pump.getStatus().getJSONObject("rate").getString("amount");
		units = pump.getStatus().getJSONObject("rate").getString("units");
		assertEquals("1.000",rate);
		assertEquals("MM",units);
		
		final JSONObject json = pump.setRate(50, "MM");
		final boolean hasError = json.has("error");
		assertEquals(true, hasError);
		
		
		pump.setRate(12.34, "UH");
		rate = pump.getStatus().getJSONObject("rate").getString("amount");
		units = pump.getStatus().getJSONObject("rate").getString("units");
		assertEquals("12.34",rate);
		assertEquals("UH",units);
		
		pump.setRate(13.45, "MH");	
		rate = pump.getStatus().getJSONObject("rate").getString("amount");
		units = pump.getStatus().getJSONObject("rate").getString("units");
		assertEquals("13.45",rate);
		assertEquals("MH",units);
		
		pump.setRate(100,"MH");
		rate = pump.getStatus().getJSONObject("rate").getString("amount");
		units = pump.getStatus().getJSONObject("rate").getString("units");
		assertEquals("100.0",rate);
		assertEquals("MH",units);
	}
	
	@Test
	public void pumpDispensedCounters() throws JSONException, InterruptedException
	{
		final Pump pump = Pump.getPump(0);
		
		pump.setVolumeToPump(0.1, "ML"); //sets the volume to pump to 0.1 ML
		pump.setDirection(true);
		
		pump.clearDispensedCounter(true);
		pump.clearDispensedCounter(false);
		
		String infa = pump.getStatus().getJSONObject("volumeDispensed").getJSONObject("inf").getString("amount");
		String infu = pump.getStatus().getJSONObject("volumeDispensed").getJSONObject("inf").getString("units");
		String wdra = pump.getStatus().getJSONObject("volumeDispensed").getJSONObject("wdr").getString("amount");
		String wdru = pump.getStatus().getJSONObject("volumeDispensed").getJSONObject("wdr").getString("units");
		
		assertEquals("0.000",infa);
		assertEquals("ML",infu);
		assertEquals("0.000",wdra);
		assertEquals("ML",wdru);
		
		pump.run();
		while(true)
		{
			Thread.sleep(500);
			final String status = pump.getStatus().getString("status");
			if(status.equals("stopped"))
				break;
		}
		infa = pump.getStatus().getJSONObject("volumeDispensed").getJSONObject("inf").getString("amount");
		infu = pump.getStatus().getJSONObject("volumeDispensed").getJSONObject("inf").getString("units");
		assertEquals("0.100",infa);
		assertEquals("ML",infu);
		
		pump.setDirection(false);
		pump.run();
		while(true)
		{
			Thread.sleep(500);
			final String status = pump.getStatus().getString("status");
			if(status.equals("stopped"))
				break;
		}
		wdra = pump.getStatus().getJSONObject("volumeDispensed").getJSONObject("wdr").getString("amount");
		wdru = pump.getStatus().getJSONObject("volumeDispensed").getJSONObject("wdr").getString("units");
		assertEquals("0.100",wdra);
		assertEquals("ML",wdru);
		
		pump.clearDispensedCounter(true);
		pump.clearDispensedCounter(false);
		
		infa = pump.getStatus().getJSONObject("volumeDispensed").getJSONObject("inf").getString("amount");
		infu = pump.getStatus().getJSONObject("volumeDispensed").getJSONObject("inf").getString("units");
		wdra = pump.getStatus().getJSONObject("volumeDispensed").getJSONObject("wdr").getString("amount");
		wdru = pump.getStatus().getJSONObject("volumeDispensed").getJSONObject("wdr").getString("units");
		
		assertEquals("0.000",infa);
		assertEquals("ML",infu);
		assertEquals("0.000",wdra);
		assertEquals("ML",wdru);
	}
	
	@Test
	public void buzzPump() throws JSONException
	{
		final Pump pump = Pump.getPump(0);
		pump.buzzOff();
		boolean buzzing = pump.getStatus().getBoolean("buzzing");
		assertEquals(false, buzzing);
		
		pump.buzzOn();
		buzzing = pump.getStatus().getBoolean("buzzing");
		assertEquals(true, buzzing);
		
		pump.buzzOff();
		buzzing = pump.getStatus().getBoolean("buzzing");
		assertEquals(false, buzzing);
	}
	
	@Test
	public void pumpNumber()
	{
		final Pump pump = Pump.getPump(0);
		assertEquals(0,pump.getPumpNumber());
	}
	
	@Test
	public void setPumpDiameter() throws JSONException
	{
		final Pump pump = Pump.getPump(0);
		pump.setDiameter(21.59);
		
		final String dia = pump.getStatus().getJSONObject("diameter").getString("amount");
		
		assertEquals("21.59",dia);
	}
}
