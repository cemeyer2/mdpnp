package edu.illinois.mdpnp.server.actuators;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Enumeration;

import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.JSONObject;

import gnu.io.CommPortIdentifier;
import gnu.io.PortInUseException;
import gnu.io.SerialPort;
import gnu.io.UnsupportedCommOperationException;
/**
 * an implementation of a Pump. Eventually this class should be able
 * to control a NE-500 pump.
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
	private static final Logger LOGGER = Logger.getLogger(NE500PumpImpl.class);
	private static boolean hasInited = false;
	private final int pumpNumber;
	
	//properties of pump
	private boolean running = false;
	private boolean buzzing = false;
	private String rate = "";
	private String direction = "";
	

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
		getRate(); //get the initial rate
		getDirection(); //get the initial direction
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
						LOGGER.info("found port: "+port);
						try 
						{
							serialPort = (SerialPort) portId.open(NE500PumpImpl.class.getName(),2000);
						} 
						catch (final PortInUseException e) 
						{
							LOGGER.error("Port ("+port+") in use",e);
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
							LOGGER.error("Error setting up port ("+port+")",e);
							throw e;
						}

						try 
						{
							outputStream = serialPort.getOutputStream();
							inputStream = serialPort.getInputStream();
						} 
						catch (final IOException e) 
						{
							LOGGER.error("Error getting io streams for port ("+port+")",e);
							throw e;
						}

						serialPort.notifyOnOutputEmpty(true);
					}
				}
			}
		}
		hasInited = true;
	}

	public static synchronized String sendToSerial(String sendData, final int pumpNumber) 
	{
		String recvData = "";
	
		sendData = pumpNumber + " " + sendData + " *\r";
		try 
		{
			outputStream.write(sendData.getBytes());
		} 
		catch (final IOException e) 
		{
			LOGGER.error("error writing to pump",e);
		}
	
		try 
		{
			int read = 0;
			while(read != 2) 
			{ // read until stx
				read = inputStream.read();
			}
			read = inputStream.read();
			while(read != 3) 
			{ // read until etx
				recvData = recvData + (char) read;
				LOGGER.info("Received: "+(char)read);
				read = inputStream.read();
			}
		} 
		catch (final Exception e) 
		{
			LOGGER.error("error reading from pump", e);
		}
	
		LOGGER.info("Sent: " + sendData + "   Received: " + recvData);
		return recvData;
	}

	/**
	 * Closes the io streams to/from the pump and closes the serial port
	 * @throws IOException if there is a problem closing the io streams
	 */
	public void close() throws IOException
	{
		inputStream.close();
		outputStream.close();
		serialPort.close();
		hasInited = false;
	}


	@Override
	public JSONObject getAmountDelivered()
	{
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public JSONObject getInitialCapacity()
	{
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public JSONObject pump(final double amount)
	{
		// TODO Auto-generated method stub
		return null;
	}

	/* (non-Javadoc)
	 * @see edu.illinois.mdpnp.server.actuators.Pump#buzzOff()
	 */
	@Override
	public JSONObject buzzOff()
	{
		sendToSerial("BUZ 0", getPumpNumber());
		buzzing = false;
		return getStatusJSON();
	}

	/**
	 * @see edu.illinois.mdpnp.server.actuators.Pump#buzzOn()
	 */
	@Override
	public JSONObject buzzOn()
	{
		sendToSerial("BUZ 1",getPumpNumber());
		buzzing = true;
		return getStatusJSON();
	}

	/**
	 * @see edu.illinois.mdpnp.server.actuators.Pump#getRate()
	 */
	@Override
	public JSONObject getRate()
	{
		rate = sendToSerial("RAT", getPumpNumber());
		return getStatusJSON();
	}

	/**
	 * @see edu.illinois.mdpnp.server.actuators.Pump#setRate(double)
	 */
	@Override
	public JSONObject setRate(final double rate)
	{
		sendToSerial("RAT "+rate,getPumpNumber());
		return getRate();
	}
	
	public int getPumpNumber()
	{
		return this.pumpNumber;
	}

	/* (non-Javadoc)
	 * @see edu.illinois.mdpnp.server.actuators.Pump#run()
	 */
	@Override
	public JSONObject run()
	{
		sendToSerial("RUN",getPumpNumber());
		running = true;
		return getStatusJSON();
	}

	/* (non-Javadoc)
	 * @see edu.illinois.mdpnp.server.actuators.Pump#stop()
	 */
	@Override
	public JSONObject stop()
	{
		sendToSerial("STP",getPumpNumber());
		running = false;
		return getStatusJSON();
	}
	
	private JSONObject getStatusJSON()
	{
		final JSONObject json = new JSONObject();
		try
		{
			json.put("pumpNumber", getPumpNumber());
			json.put("running", running);
			json.put("buzzing", buzzing);
			json.put("rate", rate);
			json.put("direction", direction);
		}
		catch(final JSONException e)
		{
			LOGGER.error("error creating JSONObject");
		}
		return json;
	}

	/* (non-Javadoc)
	 * @see edu.illinois.mdpnp.server.actuators.Pump#getDirection()
	 */
	@Override
	public JSONObject getDirection()
	{
		final String dir = sendToSerial("DIR", this.getPumpNumber());
		this.direction = dir;
		return getStatusJSON();
	}

	/* (non-Javadoc)
	 * @see edu.illinois.mdpnp.server.actuators.Pump#setDirection(boolean)
	 */
	@Override
	public JSONObject setDirection(final boolean infuse)
	{
		sendToSerial("DIR "+(infuse?"INF":"WDR"),this.getPumpNumber());
		return getDirection();
	}

	public static void main(final String[] args) throws PortInUseException, UnsupportedCommOperationException, IOException
	{
		//uncomment the following line for ubuntu linux
		//final NE500PumpImpl pump0 = new NE500PumpImpl("/dev/ttyUSB0", 0);
		//uncomment the following line for OSX
		final NE500PumpImpl pump0 = new NE500PumpImpl("/dev/tty.PL2303-0000103D",0);
		pump0.run();
		//pump0.getRate();
		//pump0.close();
		System.exit(0);
	}

}
