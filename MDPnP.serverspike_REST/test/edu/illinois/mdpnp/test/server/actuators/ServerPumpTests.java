package edu.illinois.mdpnp.test.server.actuators;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;

import edu.illinois.mdpnp.test.util.ServerRunnable;
import edu.illinois.mdpnp.test.util.TestUtil;

//TODO add checks for errors on invalid parameters sent to server
public class ServerPumpTests
{
	private static JSONObject initialStatus;
	private static ServerRunnable sr;
	private static Thread th;
	private static int port;
	
	private static final Logger logger = Logger.getLogger(ServerPumpTests.class);
	
	@BeforeClass
	public static void setUp()
	{
		port = 9122;
		sr = new ServerRunnable(port);
		th = new Thread(sr);
		th.start();
		initialStatus = TestUtil.toJSON(TestUtil.getStringFromServer("/actuators/pump/0/status", port));
	}
	
	@AfterClass
	public static void tearDown() throws JSONException
	{
		final String vola = initialStatus.getJSONObject("volumeToPump").getString("amount");
		final String volu = initialStatus.getJSONObject("volumeToPump").getString("units");
		final String dia = initialStatus.getJSONObject("diameter").getString("amount");
		final String rata = initialStatus.getJSONObject("rate").getString("amount");
		final String ratu = initialStatus.getJSONObject("rate").getString("units");
		final String dir = initialStatus.getString("direction");
		
		final String volp = "/actuators/pump/0/set_volume/"+vola+"/"+volu;
		final String diap = "/actuators/pump/0/set_diameter/"+dia;
		final String dirp = "/actuators/pump/0/set_direction/"+dir;
		final String ratp = "/actuators/pump/0/set_rate/"+rata+"/"+ratu;
		final String stpp = "/actuators/pump/0/stop";
		
		TestUtil.getStringFromServer(volp, port);
		TestUtil.getStringFromServer(diap, port);
		TestUtil.getStringFromServer(dirp, port);
		TestUtil.getStringFromServer(ratp, port);
		TestUtil.getStringFromServer(stpp, port);
		TestUtil.getStringFromServer(stpp, port);
		
		sr.stopServer();
	}
	
	@Test
	public void pumpNetworkJson() throws JSONException
	{
		final JSONObject json = TestUtil.toJSON(TestUtil.getStringFromServer("/actuators/pump/pumps_in_network", port));
		assertEquals(true, json.getBoolean("pump0"));
		for(int i = 1; i < 100; i++)
		{
			assertEquals(false, json.getBoolean("pump"+i));
		}
	}
	
	@Test
	public void setPumpDirection() throws JSONException
	{
		JSONObject status = TestUtil.toJSON(TestUtil.getStringFromServer("/actuators/pump/0/set_direction/inf", port));
		String dir = status.getString("direction");
		assertEquals("INF",dir);
		status = TestUtil.toJSON(TestUtil.getStringFromServer("/actuators/pump/0/set_direction/wdr", port));
		dir = status.getString("direction");
		assertEquals("WDR",dir);
		
		//test for invalid
		status = TestUtil.toJSON(TestUtil.getStringFromServer("/actuators/pump/0/set_direction/abc/", port));
		assertTrue(status.has("error"));
	}
	
	@Test
	public void returnStatusOnInvalidCommand()
	{
		final JSONObject status = TestUtil.toJSON(TestUtil.getStringFromServer("/actuators/pump/0/asdf", port));
		assertTrue(status.has("direction"));
		assertTrue(status.has("status"));
		assertTrue(status.has("error"));
	}
	
	@Test
	public void runPauseStop() throws JSONException
	{
		
		//call stop twice to ensure that we are stopped and not paused
		TestUtil.getStringFromServer("/actuators/pump/0/stop", port);
		TestUtil.getStringFromServer("/actuators/pump/0/stop", port);
		TestUtil.getStringFromServer("/actuators/pump/0/set_direction/wdr", port);
		JSONObject json = TestUtil.toJSON(TestUtil.getStringFromServer("/actuators/pump/0/status", port));
		String status = json.getString("status");
		assertEquals("stopped",status);
		json = TestUtil.toJSON(TestUtil.getStringFromServer("/actuators/pump/0/run", port));
		status = json.getString("status");
		assertEquals("withdrawing",status);
		json = TestUtil.toJSON(TestUtil.getStringFromServer("/actuators/pump/0/stop", port));
		status = json.getString("status");
		assertEquals("paused",status);
		json = TestUtil.toJSON(TestUtil.getStringFromServer("/actuators/pump/0/stop", port));
		status = json.getString("status");
		assertEquals("stopped",status);
	}
	
	@Test
	public void setPumpVolume() throws JSONException
	{
		JSONObject json = TestUtil.toJSON(TestUtil.getStringFromServer("/actuators/pump/0/set_volume/0.75/UL", port));
		String vol = json.getJSONObject("volumeToPump").getString("amount");
		assertEquals("0.750", vol);
		String units = json.getJSONObject("volumeToPump").getString("units");
		assertEquals("UL",units);
		
		json = TestUtil.toJSON(TestUtil.getStringFromServer("/actuators/pump/0/set_volume/0.5/ML", port));
		vol = json.getJSONObject("volumeToPump").getString("amount");
		assertEquals("0.500",vol);
		units = json.getJSONObject("volumeToPump").getString("units");
		assertEquals("ML",units);
		
		json = TestUtil.toJSON(TestUtil.getStringFromServer("/actuators/pump/0/set_volume/abc/ML", port));
		assertTrue(json.has("error"));
		
		json = TestUtil.toJSON(TestUtil.getStringFromServer("/actuators/pump/0/set_volume/0.5/abc", port));
		assertTrue(json.has("error"));
	}
	
	@Test
	public void setPumpRate() throws JSONException
	{
		JSONObject json = TestUtil.toJSON(TestUtil.getStringFromServer("/actuators/pump/0/set_rate/10.12/UM", port));
		String rate = json.getJSONObject("rate").getString("amount");
		String units = json.getJSONObject("rate").getString("units");
		assertEquals("10.12",rate);
		assertEquals("UM",units);
		
		json = TestUtil.toJSON(TestUtil.getStringFromServer("/actuators/pump/0/set_rate/1/MM", port));
		rate = json.getJSONObject("rate").getString("amount");
		units = json.getJSONObject("rate").getString("units");
		assertEquals("1.000",rate);
		assertEquals("MM",units);
		
		//should cause error since rate is too high for pump
		json = TestUtil.toJSON(TestUtil.getStringFromServer("/actuators/pump/0/set_rate/50/MM", port));
		final boolean hasError = json.has("error");
		assertTrue(hasError);
		
		json = TestUtil.toJSON(TestUtil.getStringFromServer("/actuators/pump/0/set_rate/12.34/UH", port));
		rate = json.getJSONObject("rate").getString("amount");
		units = json.getJSONObject("rate").getString("units");
		assertEquals("12.34",rate);
		assertEquals("UH",units);
		
		json = TestUtil.toJSON(TestUtil.getStringFromServer("/actuators/pump/0/set_rate/13.45/MH", port));
		rate = json.getJSONObject("rate").getString("amount");
		units = json.getJSONObject("rate").getString("units");
		assertEquals("13.45",rate);
		assertEquals("MH",units);
		
		json = TestUtil.toJSON(TestUtil.getStringFromServer("/actuators/pump/0/set_rate/100/MH", port));
		rate = json.getJSONObject("rate").getString("amount");
		units = json.getJSONObject("rate").getString("units");
		assertEquals("100.0",rate);
		assertEquals("MH",units);
		
		json = TestUtil.toJSON(TestUtil.getStringFromServer("/actuators/pump/0/set_rate/abc/MH", port));
		assertTrue(json.has("error"));
		
		json = TestUtil.toJSON(TestUtil.getStringFromServer("/actuators/pump/0/set_rate/100/abc", port));
		assertTrue(json.has("error"));
	}
	
	@Test
	public void pumpDispensedCounters() throws JSONException, InterruptedException
	{
		
		TestUtil.getStringFromServer("/actuators/pump/0/set_volume/0.1/ML", port);
		TestUtil.getStringFromServer("/actuators/pump/0/set_direction/inf", port);
		TestUtil.getStringFromServer("/actuators/pump/0/stop", port);
		TestUtil.getStringFromServer("/actuators/pump/0/stop", port);
		
		JSONObject json = TestUtil.toJSON(TestUtil.getStringFromServer("/actuators/pump/0/status", port));
		
		String infa = json.getJSONObject("volumeDispensed").getJSONObject("inf").getString("amount");
		String infu = json.getJSONObject("volumeDispensed").getJSONObject("inf").getString("units");
		String wdra = json.getJSONObject("volumeDispensed").getJSONObject("wdr").getString("amount");
		String wdru = json.getJSONObject("volumeDispensed").getJSONObject("wdr").getString("units");
		
		assertEquals("0.000",infa);
		assertEquals("ML",infu);
		assertEquals("0.000",wdra);
		assertEquals("ML",wdru);
		
		TestUtil.getStringFromServer("/actuators/pump/0/run", port);
		while(true)
		{
			Thread.sleep(500);
			final String status = TestUtil.toJSON(TestUtil.getStringFromServer("/actuators/pump/0/status", port)).getString("status");
			if(status.equals("stopped"))
				break;
		}
		json = TestUtil.toJSON(TestUtil.getStringFromServer("/actuators/pump/0/status", port));
		infa = json.getJSONObject("volumeDispensed").getJSONObject("inf").getString("amount");
		infu = json.getJSONObject("volumeDispensed").getJSONObject("inf").getString("units");
		assertEquals("0.100",infa);
		assertEquals("ML",infu);
		
		TestUtil.getStringFromServer("/actuators/pump/0/set_direction/wdr", port);
		TestUtil.getStringFromServer("/actuators/pump/0/run", port);
		while(true)
		{
			Thread.sleep(500);
			final String status = TestUtil.toJSON(TestUtil.getStringFromServer("/actuators/pump/0/status", port)).getString("status");
			if(status.equals("stopped"))
				break;
		}
		json = TestUtil.toJSON(TestUtil.getStringFromServer("/actuators/pump/0/status", port));
		wdra = json.getJSONObject("volumeDispensed").getJSONObject("wdr").getString("amount");
		wdru = json.getJSONObject("volumeDispensed").getJSONObject("wdr").getString("units");
		assertEquals("0.100",wdra);
		assertEquals("ML",wdru);
		
		json = TestUtil.toJSON(TestUtil.getStringFromServer("/actuators/pump/0/clear", port));
		
		infa = json.getJSONObject("volumeDispensed").getJSONObject("inf").getString("amount");
		infu = json.getJSONObject("volumeDispensed").getJSONObject("inf").getString("units");
		wdra = json.getJSONObject("volumeDispensed").getJSONObject("wdr").getString("amount");
		wdru = json.getJSONObject("volumeDispensed").getJSONObject("wdr").getString("units");
		
		assertEquals("0.000",infa);
		assertEquals("ML",infu);
		assertEquals("0.000",wdra);
		assertEquals("ML",wdru);
		
		//same test again with UL
		TestUtil.getStringFromServer("/actuators/pump/0/set_volume/100/UL", port);
		TestUtil.getStringFromServer("/actuators/pump/0/set_direction/inf", port);
		TestUtil.getStringFromServer("/actuators/pump/0/stop", port);
		TestUtil.getStringFromServer("/actuators/pump/0/stop", port);
		
		json = TestUtil.toJSON(TestUtil.getStringFromServer("/actuators/pump/0/status", port));
		
		infa = json.getJSONObject("volumeDispensed").getJSONObject("inf").getString("amount");
		infu = json.getJSONObject("volumeDispensed").getJSONObject("inf").getString("units");
		wdra = json.getJSONObject("volumeDispensed").getJSONObject("wdr").getString("amount");
		wdru = json.getJSONObject("volumeDispensed").getJSONObject("wdr").getString("units");
		
		assertEquals("0.000",infa);
		assertEquals("UL",infu);
		assertEquals("0.000",wdra);
		assertEquals("UL",wdru);
		
		TestUtil.getStringFromServer("/actuators/pump/0/run", port);
		while(true)
		{
			Thread.sleep(500);
			final String status = TestUtil.toJSON(TestUtil.getStringFromServer("/actuators/pump/0/status", port)).getString("status");
			if(status.equals("stopped"))
				break;
		}
		json = TestUtil.toJSON(TestUtil.getStringFromServer("/actuators/pump/0/status", port));
		infa = json.getJSONObject("volumeDispensed").getJSONObject("inf").getString("amount");
		infu = json.getJSONObject("volumeDispensed").getJSONObject("inf").getString("units");
		assertEquals("100.0",infa);
		assertEquals("UL",infu);
		
		TestUtil.getStringFromServer("/actuators/pump/0/set_direction/wdr", port);
		TestUtil.getStringFromServer("/actuators/pump/0/run", port);
		while(true)
		{
			Thread.sleep(500);
			final String status = TestUtil.toJSON(TestUtil.getStringFromServer("/actuators/pump/0/status", port)).getString("status");
			if(status.equals("stopped"))
				break;
		}
		json = TestUtil.toJSON(TestUtil.getStringFromServer("/actuators/pump/0/status", port));
		wdra = json.getJSONObject("volumeDispensed").getJSONObject("wdr").getString("amount");
		wdru = json.getJSONObject("volumeDispensed").getJSONObject("wdr").getString("units");
		assertEquals("100.0",wdra);
		assertEquals("UL",wdru);
		
		json = TestUtil.toJSON(TestUtil.getStringFromServer("/actuators/pump/0/clear", port));
		
		infa = json.getJSONObject("volumeDispensed").getJSONObject("inf").getString("amount");
		infu = json.getJSONObject("volumeDispensed").getJSONObject("inf").getString("units");
		wdra = json.getJSONObject("volumeDispensed").getJSONObject("wdr").getString("amount");
		wdru = json.getJSONObject("volumeDispensed").getJSONObject("wdr").getString("units");
		
		assertEquals("0.000",infa);
		assertEquals("UL",infu);
		assertEquals("0.000",wdra);
		assertEquals("UL",wdru);
	}
	
	@Test
	public void buzzPump() throws JSONException, InterruptedException
	{
		JSONObject json = TestUtil.toJSON(TestUtil.getStringFromServer("/actuators/pump/0/buzz_off", port));
		boolean buzzing = json.getBoolean("buzzing");
		assertEquals(false, buzzing);
		
		json = TestUtil.toJSON(TestUtil.getStringFromServer("/actuators/pump/0/buzz_on", port));
		buzzing = json.getBoolean("buzzing");
		assertEquals(true, buzzing);
		
		Thread.sleep(1000);
		
		json = TestUtil.toJSON(TestUtil.getStringFromServer("/actuators/pump/0/buzz_off", port));
		buzzing = json.getBoolean("buzzing");
		assertEquals(false, buzzing);
	}
	
	@Test
	public void pumpNumber() throws NumberFormatException, JSONException
	{
		final JSONObject json = TestUtil.toJSON(TestUtil.getStringFromServer("/actuators/pump/0/status", port));
		final int pumpNumber = Integer.parseInt(json.getString("pumpNumber"));
		assertEquals(0, pumpNumber);
	}
	
	@Test
	public void pumpDiameter() throws JSONException
	{
		JSONObject json = TestUtil.toJSON(TestUtil.getStringFromServer("/actuators/pump/0/set_diameter/21.59", port));
		final String dia = json.getJSONObject("diameter").getString("amount");
		assertEquals("21.59",dia);
		
		json = TestUtil.toJSON(TestUtil.getStringFromServer("/actuators/pump/0/set_diameter/abc", port));
		assertTrue(json.has("error"));
	}
}
