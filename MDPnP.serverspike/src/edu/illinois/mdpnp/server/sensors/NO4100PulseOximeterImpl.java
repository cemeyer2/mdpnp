package edu.illinois.mdpnp.server.sensors;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Enumeration;
import java.util.List;
import java.util.Stack;

import org.apache.log4j.Logger;

import edu.illinois.mdpnp.server.actuators.NE500PumpImpl;

import gnu.io.CommPortIdentifier;
import gnu.io.PortInUseException;
import gnu.io.SerialPort;
import gnu.io.UnsupportedCommOperationException;

public class NO4100PulseOximeterImpl extends PulseOximeter
{
	private final String port;
	private final Stack<PulseOximeterMeasurement> measurements;
	private static final Logger LOGGER = Logger.getLogger(NO4100PulseOximeterImpl.class);
	private static SerialPort serialPort;
	private static OutputStream outputStream;
	private static InputStream inputStream;


	public NO4100PulseOximeterImpl(final String serialPort) throws IOException, PortInUseException, UnsupportedCommOperationException
	{
		this.port = serialPort;
		this.measurements = new Stack<PulseOximeterMeasurement>();
		init();
		new Thread(new NO4100PulseOximeterImplReader()).start();
	}

	private void init() throws IOException, PortInUseException, UnsupportedCommOperationException
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
						serialPort.setSerialPortParams(9600, SerialPort.DATABITS_8, SerialPort.STOPBITS_1, SerialPort.PARITY_NONE);
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

	private class NO4100PulseOximeterImplReader implements Runnable
	{
		public void run()
		{
			try
			{
				while(true)
				{
					final byte[] request = { (byte) 0x44, (byte) 0x31 }; //D1
					outputStream.write(request);
					final byte ack = (byte)inputStream.read();

					if (ack != 0x06) 
					{
						LOGGER.debug("Did not get <ACK> from request");
					}

					final byte[] reply = new byte[3];

					for (int i = 0; i < 3; i++) {

						reply[i] = (byte)inputStream.read();

					}

					LOGGER.debug("Got the bytes " + reply[0] + ":" + reply[1] + ":" + reply[2]);

					final boolean msb1stByteIsOne = ((reply[0] & (1 << 7)) != 0) ? true

							: false;

					final boolean sensorDisconnect = ((reply[0] & (1 << 6)) != 0) ? true

							: false;

					final boolean outOfTrack = ((reply[0] & (1 << 5)) != 0) ? true : false;

					final boolean lowPerfusion = ((reply[0] & (1 << 4)) != 0) ? true : false;

					final boolean marginalPerfusion = ((reply[0] & (1 << 3)) != 0) ? true

							: false;

					final boolean artifact = ((reply[0] & (1 << 2)) != 0) ? true : false;

					int heartRate = ((reply[0] & 0x3));

					heartRate = (heartRate << 7) | (reply[1] & 0x7F);

					final int oxygenSatuationPercentage = reply[2] & 0x7F;



					if (sensorDisconnect) {

						LOGGER.error("Sensor is disconnected");

					}

					else if (outOfTrack) {

						LOGGER.debug("Sensor is out of track");

					}

					else if (artifact) {

						LOGGER.debug("Sensor is in artifact condition!");

					}

					else if (marginalPerfusion) {

						LOGGER.debug("Sensor has marginal signal quality!");

					}

					else if (lowPerfusion) {

						LOGGER.debug("Sensor has low signal quality!");

					}

					else if (!msb1stByteIsOne) {

						LOGGER.debug("First byte of response is not one");

					}

					else if (msb1stByteIsOne && !(sensorDisconnect) && !(outOfTrack)

							&& !(lowPerfusion) && !(artifact)) 
					{

						LOGGER.info("Collected measurement: Heart Rate = " + heartRate + ", Oxygen Saturation = " + oxygenSatuationPercentage + "%");
						final PulseOximeterMeasurement measurement = new PulseOximeterMeasurement(heartRate, oxygenSatuationPercentage);
						measurements.push(measurement);
					}

				}
			}
			catch(final IOException ioe)
			{
				LOGGER.error("Error reading from NO4100 pulse oximeter",ioe);
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

	public static void main(final String[] args) throws IOException, PortInUseException, UnsupportedCommOperationException
	{
		new NO4100PulseOximeterImpl("/dev/tty.Nonin_Medical_Inc-1");
	}
}
