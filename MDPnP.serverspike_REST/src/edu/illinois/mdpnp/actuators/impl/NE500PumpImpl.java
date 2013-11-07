package edu.illinois.mdpnp.actuators.impl;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Enumeration;

import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.JSONObject;

import edu.illinois.mdpnp.actuators.Pump;
import gnu.io.CommPortIdentifier;
import gnu.io.PortInUseException;
import gnu.io.RXTXVersion;
import gnu.io.SerialPort;
import gnu.io.UnsupportedCommOperationException;


/**
 * an implementation of a Pump. This class can control a
 * NE-500 Syringe Pump.
 * 
 * <br><br>
 * 
 * $Rev$:     Revision of last commit<br>
 * $Author$:  Author of last commit<br>
 * $Date$:    Date of last commit<br>
 * @author Charlie Meyer  --  cemeyer2@illinois.edu
 */
public class NE500PumpImpl extends Pump
{
	private static SerialPort serialPort;
	private static OutputStream outputStream;
	private static InputStream inputStream;
	private static final Logger logger = Logger.getLogger(NE500PumpImpl.class);
	private static boolean hasInited = false;
	private final int pumpNumber;

	//properties of pump
	private boolean buzzing = false;

	private String alarmCondition = "";


	/**
	 * Constructor for this object.
	 * @param serialPort the path to the serial port (linux: /dev/tty*, win32: COM*)
	 * @throws PortInUseException if the port is in use by another application
	 * @throws UnsupportedCommOperationException if an illegal operation is sent to the pump
	 * @throws IOException if there is a problem reading or writing from/to the pump
	 */
	public NE500PumpImpl(final String serialPort, final int pumpNumber) throws PortInUseException, UnsupportedCommOperationException, IOException
	{
		this.pumpNumber = pumpNumber;
		init(serialPort);
	}

	private static void init(final String port) throws PortInUseException, UnsupportedCommOperationException, IOException
	{
		if(!hasInited)
		{
			final Enumeration portList = CommPortIdentifier.getPortIdentifiers();

			while (portList.hasMoreElements()) 
			{
				final CommPortIdentifier portId = (CommPortIdentifier) portList.nextElement();

				if (portId.getPortType() == CommPortIdentifier.PORT_SERIAL) 
				{
					if (portId.getName().equals(port)) 
					{
						logger.info("found port: "+port);
						try 
						{
							serialPort = (SerialPort) portId.open(NE500PumpImpl.class.getName(),2000);
						} 
						catch (final PortInUseException e) 
						{
							logger.error("Port ("+port+") in use",e);
							throw e;
						} 

						try 
						{
							serialPort.setSerialPortParams(19200, SerialPort.DATABITS_8, SerialPort.STOPBITS_1, SerialPort.PARITY_NONE);
							serialPort.setFlowControlMode(SerialPort.FLOWCONTROL_NONE);
							serialPort.setDTR(true);
							serialPort.setRTS(true);
						} 
						catch (final UnsupportedCommOperationException e) 
						{
							logger.error("Error setting up port ("+port+")",e);
							throw e;
						}

						try 
						{
							outputStream = serialPort.getOutputStream();
							inputStream = serialPort.getInputStream();
						} 
						catch (final IOException e) 
						{
							logger.error("Error getting io streams for port ("+port+")",e);
							throw e;
						}

						serialPort.notifyOnOutputEmpty(true);
					}
				}
			}
		}
		hasInited = true;
	}

	/**
	 * @see Pump#existsInNetwork()
	 */
	@Override
	public boolean existsInNetwork()
	{
		try
		{
			final String data = this.getPumpNumber()+" *";
			outputStream.write(data.getBytes());
			Thread.sleep(50); //sleep long enough so that we can tell if there is data on the stream to read
			final int available = inputStream.available();
			if(available == 0)
				return false;
			else
			{
				//we need to read off the stream to clear it if there is stuff there
				int read = 0;
				while(read != 2) 
				{ // read until stx
					read = inputStream.read();
				}
				read = inputStream.read();
				while(read != 3) 
				{ // read until etx
					read = inputStream.read();
				}
				return true;
			}
		}
		catch(final Exception e)
		{
			logger.error("io error determining if pump "+pumpNumber+" exists",e);
		}
		return false;
	}

	/**
	 * Sends a string over the serial port to the pump. The string will automatically
	 * be prefixed with the pump number and suffixed with a * and a return
	 * @param sendData the string to send
	 * @param pumpNumber the number of the pump in the pump network to send the string to
	 * @return a String with the data received back from the pump
	 */
	private static synchronized String sendToSerial(String sendData, final int pumpNumber) 
	{
		String recvData = "";
		String allRecvData = "";

		sendData = pumpNumber + " " + sendData + " *";
		logger.info("writing: "+sendData);
		try 
		{
			outputStream.write(sendData.getBytes());
		} 
		catch (final IOException e) 
		{
			logger.error("error writing to pump",e);
		}

		try 
		{
			int read = 0;
			while(read != 2) 
			{ // read until stx
				read = inputStream.read();
				allRecvData += (char)read;
			}
			read = inputStream.read();
			while(read != 3) 
			{ // read until etx
				recvData = recvData + (char) read;
				allRecvData += (char)read;
				logger.debug("Received: "+(char)read);
				read = inputStream.read();
			}
			allRecvData += read;
		} 
		catch (final Exception e) 
		{
			logger.error("error reading from pump", e);
		}

		logger.debug("Sent: " + sendData + "   Received: " + recvData);
		logger.info("received: "+recvData);
		//ogger.info("all received: "+allRecvData);
		return recvData;
	}

	/**
	 * Closes the io streams to/from the pump and closes the serial port
	 */
	@Override
	public void close()
	{
		try
		{
			inputStream.close();
			outputStream.close();
			serialPort.close();
			hasInited = false;
		}
		catch(final IOException ioe)
		{
			logger.error("error closing pump",ioe);
		}
	}

	/**
	 * @see Pump#getPumpNumber()
	 */
	@Override
	public int getPumpNumber()
	{
		return this.pumpNumber;
	}

	/**
	 * @see Pump#run(boolean)
	 */
	@Override
	public JSONObject run()
	{
		sendToSerial("RUN",getPumpNumber());
		return getStatus();
		//return null;
	}

	/**
	 * @see Pump#stop()
	 */
	@Override
	public JSONObject stop()
	{
		final String status = this.getPumpStatus();
		sendToSerial("STP",this.getPumpNumber());
		return getStatus();
	}

	/**
	 * @see edu.illinois.mdpnp.actuators.Pump#buzzOn()
	 */
	@Override
	public JSONObject buzzOn()
	{
		sendToSerial("BUZ 1",getPumpNumber());
		buzzing = true;
		return getStatus();
	}

	/**
	 * @see Pump#buzzOff()
	 */
	@Override
	public JSONObject buzzOff()
	{
		sendToSerial("BUZ 0", getPumpNumber());
		buzzing = false;
		return getStatus();
	}

	private String getPumpStatus()
	{
		String status = sendToSerial("",this.getPumpNumber());
		if(status.length() == 3) //normal condition
		{
			status = status.substring(2);
			if(status.equals("I"))
				return "infusing";
			else if(status.equals("W"))
				return "withdrawing";
			else if(status.equals("P"))
				return "paused";
			else if(status.equals("S"))
				return "stopped";
			else if(status.equals("T"))
				return "pause phase";
			else if(status.equals("U"))
				return "user wait";
			else if(status.equals("X"))
				return "purging";
		}
		else if(status.length() == 5)
		{
			status = status.substring(4);
			if(status.equals("R"))
			{
				alarmCondition = "reset";
				return "reset";
			}
			else if(status.equals("S"))
			{
				alarmCondition = "stalled";
				return "stalled";
			}
			else if(status.equals("T"))
			{
				alarmCondition = "timeout";
				return "timeout";
			}
			else if(status.equals("E"))
			{
				alarmCondition = "program error";
				return "program error";
			}
			else if(status.equals("O"))
			{
				alarmCondition = "phase error";
				return "phase error";
			}
		}
		return "undefined";
	}

	private JSONObject getRate()
	{
		final String rat = sendToSerial("RAT", getPumpNumber());
		final JSONObject json = new JSONObject();
		try
		{
			int end = rat.indexOf("MH");
			if(end == -1)
				end = rat.indexOf("UH");
			if(end == -1)
				end = rat.indexOf("MM");
			if(end == -1)
				end = rat.indexOf("UM");
			//we didnt find a units
			if(end == -1)
			{
				json.put("amount", "undefined");
				json.put("units", "undefined");
			}
			//we found units
			else if(end != -1)
			{
				json.put("amount", rat.substring(3,end));
				json.put("units", rat.substring(end,end+2));
			}
		}
		catch(final JSONException jsone)
		{
			logger.error("error creating rate json object",jsone);
		}
		return json;
	}

	/**
	 * @see edu.illinois.mdpnp.actuators.Pump#setRate(double)
	 */
	@Override
	public JSONObject setRate(final double rate, final String units)
	{
		final String status = this.getPumpStatus();
		String response = "";
		if(status.equals("infusing") || status.equals("withdrawing") || status.equals("paused"))
			response = sendToSerial("RAT "+rate,this.getPumpNumber());
		else if(status.equals("stopped"))
			response = sendToSerial("RAT "+rate+" "+units,getPumpNumber());
		final JSONObject json = getStatus();
		if(response.contains("OOR"))
		{
			try
			{
				json.put("error", "rate value out of range for specified units, rate not changed");
			}
			catch(final JSONException jsone)
			{
				logger.error("error adding error to json object",jsone);
			}
		}
		return json;
	}

	private String getDirection()
	{
		final String dir = sendToSerial("DIR", this.getPumpNumber());
		if(dir.length()>3)
			return dir.substring(3,6);
		else
			return "undefined";
	}

	/**
	 * @see Pump#setDirection(boolean)
	 */
	@Override
	public JSONObject setDirection(final boolean infuse)
	{
		sendToSerial("DIR "+(infuse?"INF":"WDR"),this.getPumpNumber());
		return getStatus();
	}

	private JSONObject getDiameter()
	{
		final String dia = sendToSerial("DIA",this.getPumpNumber());
		final JSONObject json = new JSONObject();
		try
		{
			if(dia.length() == 21)
			{
				json.put("amount", dia.substring(3, dia.length()-4));
				json.put("units", "MM");
			}
			if(dia.length() == 12)
			{
				json.put("amount", dia.substring(3,dia.length()-4));
				json.put("units", "MM");
			}
			if(dia.length() < 12 && dia.length()>3)
			{
				json.put("amount", dia.substring(3));
				json.put("units", "MM");
			}
			else
			{
				json.put("amount", "undefined");
				json.put("units", "undefined");
			}
		}
		catch(final JSONException jsone)
		{
			logger.error("Error creating diameter json object",jsone);
		}
		return json;
	}

	/**
	 * @see Pump#setDiameter(double)
	 */
	@Override
	public JSONObject setDiameter(final double diameter)
	{
		sendToSerial("DIA "+diameter,this.getPumpNumber());
		return getStatus();
	}

	private JSONObject getVolumeToPump()
	{
		String vol = sendToSerial("VOL",this.getPumpNumber());
		final int end = vol.indexOf('L')+1;
		final JSONObject json = new JSONObject();
		try
		{
			if(vol.length()>4 && end != -1)
			{
				vol = vol.substring(3,end);
				json.put("amount", vol.substring(0,vol.length()-2));
				json.put("units", vol.substring(vol.length()-2));
			}
			else
			{
				json.put("amount", "undefined");
				json.put("units","undefined");
			}		
		}
		catch(final JSONException jsone)
		{
			logger.error("error creating volume to pump json object",jsone);
		}
		return json;
	}

	/**
	 * @see Pump#setVolumeToPump(double, String)
	 */
	@Override
	public JSONObject setVolumeToPump(final double amount, final String units)
	{
		sendToSerial("VOL "+amount,this.getPumpNumber());
		sendToSerial("VOL "+units, this.getPumpNumber());
		return getStatus();
	}

	private JSONObject getVolumeDispensed()
	{
		String vol = sendToSerial("DIS",this.getPumpNumber());
		if(vol.length() == 3)//we called it too soon and there is an error
		{
			try
			{
				Thread.sleep(100);
			}
			catch(final InterruptedException ie){}
			return getVolumeDispensed();
		}
		if(vol.length()>=17)
		{
			String inf = "";
			String wdr = "";
			if(vol.length() == 21)//when dis > 0
			{
				vol = vol.substring(3,17);
				//extract out the infuse amount and add the units on
				inf = vol.substring(1,6);
				//extract out the withdraw amount including units
				wdr = vol.substring(7);
			}
			if(vol.length() == 17) //when dis == 0
			{
				vol = vol.substring(4);
				inf = vol.substring(0,vol.indexOf("W"));
				wdr = vol.substring(vol.indexOf("W")+1);
			}
			final JSONObject json = new JSONObject();
			final JSONObject jsoninf = new JSONObject();
			final JSONObject jsonwdr = new JSONObject();
			try
			{
				jsoninf.put("amount", inf);
				jsoninf.put("units", wdr.substring(wdr.length()-2));
				jsonwdr.put("amount", wdr.substring(0, wdr.length()-2));
				jsonwdr.put("units", wdr.substring(wdr.length()-2));
				json.put("inf", jsoninf);
				json.put("wdr", jsonwdr);
			}
			catch(final JSONException jsone)
			{
				logger.error("error creating volume dispensed json object",jsone);
			}
			return json;
		}
		else
		{
			final JSONObject json = new JSONObject();
			try
			{
				json.put("inf", "undefined");
				json.put("wdr", "undefined");
			}
			catch(final JSONException jsone)
			{
				logger.error("error creating volume dispensed json object",jsone);
			}

			return json;
		}
	}

	@Override
	public JSONObject clearDispensedCounter(final boolean infuse)
	{
		sendToSerial("CLD "+(infuse?"INF":"WDR"), this.getPumpNumber());
		return getStatus();
	}

	private String getFirmwareVersion()
	{
		return sendToSerial("VER",this.getPumpNumber()).substring(3);
	}

	/**
	 * @see Pump#getStatus()
	 */
	@Override
	public JSONObject getStatus()
	{
		final JSONObject json = new JSONObject();
		try
		{
			json.put("pumpNumber", getPumpNumber());
			json.put("buzzing", buzzing);
			json.put("rate", this.getRate());
			json.put("direction", this.getDirection());
			json.put("diameter",this.getDiameter());
			json.put("volumeDispensed", this.getVolumeDispensed());
			json.put("volumeToPump", this.getVolumeToPump());
			json.put("firmwareVersion", this.getFirmwareVersion());
			//this bit of logic lets us remember if we saw an alarm condition since the last time
			//we called a function on this object and let it overwrite any normal condition since
			//alarms are only displayed once
			if(alarmCondition.equals(""))
				json.put("status", this.getPumpStatus());
			else
				json.put("status", alarmCondition);
			alarmCondition = "";
		}
		catch(final JSONException e)
		{
			logger.error("error creating JSONObject");
		}
		return json;
	}

	public static void main(final String[] args) throws PortInUseException, UnsupportedCommOperationException, IOException, InterruptedException, JSONException
	{
		System.out.println(RXTXVersion.getVersion());
		//uncomment the following line for ubuntu linux
		//final NE500PumpImpl pump0 = new NE500PumpImpl("/dev/ttyUSB0", 0);
		//uncomment the following line for OSX
		final NE500PumpImpl pump0 = new NE500PumpImpl("/dev/tty.PL2303-0000103D",0);
		pump0.stop();
		pump0.stop();
		//pump0.run(true);
		//System.out.println(pump0.getStatus().toString(4));
		//pump0.buzzOn();
		//Thread.sleep(1000);
		//pump0.buzzOff();
		System.exit(0);
	}

}
