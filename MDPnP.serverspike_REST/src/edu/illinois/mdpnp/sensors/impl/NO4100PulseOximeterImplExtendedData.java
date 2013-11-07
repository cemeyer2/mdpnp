package edu.illinois.mdpnp.sensors.impl;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Enumeration;
import java.util.LinkedList;
import java.util.List;
import java.util.Stack;

import org.apache.log4j.Logger;

import edu.illinois.mdpnp.sensors.PulseOximeter;
import edu.illinois.mdpnp.sensors.PulseOximeterMeasurement;
import gnu.io.CommPortIdentifier;
import gnu.io.PortInUseException;
import gnu.io.SerialPort;
import gnu.io.UnsupportedCommOperationException;

public class NO4100PulseOximeterImplExtendedData extends PulseOximeter
{
	private final String port;
	private final Stack<PulseOximeterMeasurement> measurements;
	private static final Logger logger = Logger.getLogger(NO4100PulseOximeterImplExtendedData.class);
	private static SerialPort serialPort;
	private static OutputStream outputStream;
	private static InputStream inputStream;
	long timestamp;
	private final NO4100PulseOximeterImplReader reader;


	public NO4100PulseOximeterImplExtendedData(final String serialPort) throws IOException, PortInUseException, UnsupportedCommOperationException
	{
		this.port = serialPort;
		this.measurements = new Stack<PulseOximeterMeasurement>();
		init();
		timestamp = System.currentTimeMillis();
		reader = new NO4100PulseOximeterImplReader();
		new Thread(reader).start();
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
					logger.info("found port: "+port);
					try 
					{
						serialPort = (SerialPort) portId.open(NO4100PulseOximeterImplExtendedData.class.getName(),2000);
					} 
					catch (final PortInUseException e) 
					{
						logger.error("Port ("+port+") in use",e);
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

	private class NO4100PulseOximeterImplReader implements Runnable
	{
		private boolean shouldRun = true;
		
		public void stop()
		{
			shouldRun = false;
		}
		
		public void run()
		{
			try
			{
				outputStream.write("D8".getBytes());
				final byte ack = (byte)inputStream.read();

				if (ack != 0x06) 
				{
					logger.error("Did not get <ACK> from request");
				}

				while(shouldRun)
				{
					
					final byte[] reply = new byte[4];

					for (int i = 0; i < 4; i++) {

						reply[i] = (byte)inputStream.read();

					}

					//LOGGER.debug("Got the bytes " + reply[0] + ":" + reply[1] + ":" + reply[2]);

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

					final boolean sensorFault = ((reply[3] & (1 << 3)) != 0);
					
					final boolean criticalBattery = ((reply[3] & (1 << 1)) !=0);
					final boolean lowBattery = ((reply[3] & (1 << 0)) != 0);
					
					if(sensorFault)
						logger.error("Sensor Fault!");
					
					if(lowBattery)
						logger.info("Sensor reports low battery");
					
					if(criticalBattery)
						logger.fatal("Sensor reports critical battery");
					

					if (sensorDisconnect) {

						logger.debug("Sensor is disconnected");

					}

					else if (outOfTrack) {

						logger.debug("Sensor is out of track");

					}

					else if (artifact) {

						logger.debug("Sensor is in artifact condition!");

					}

					else if (marginalPerfusion) {

						logger.debug("Sensor has marginal signal quality!");

					}

					else if (lowPerfusion) {

						logger.debug("Sensor has low signal quality!");

					}

					else if (!msb1stByteIsOne) {

						logger.debug("First byte of response is not one");

					}

					

						logger.info("Collected measurement: Heart Rate = " + heartRate + ", Oxygen Saturation = " + oxygenSatuationPercentage + "%");
						final PulseOximeterMeasurement measurement = new PulseOximeterMeasurement(heartRate, oxygenSatuationPercentage, sensorDisconnect, artifact, outOfTrack, marginalPerfusion, lowPerfusion, true);
						measurements.push(measurement);
					

				}
			}
			catch(final IOException ioe)
			{
				logger.error("Error reading from NO4100 pulse oximeter",ioe);
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
		final NO4100PulseOximeterImplExtendedData po = new NO4100PulseOximeterImplExtendedData("/dev/tty.Nonin_Medical_Inc-1");
		while(true)
		{
			Thread.sleep(15000);
			System.out.println(po.measurementListToJSON(po.getMeasurementsSinceLastPoll()));
		}
	}
	
	@Override
	public void close()
	{
		try
		{
			reader.stop();
			Thread.sleep(1500); //sleep long enough for last read to complete
			inputStream.close();
			outputStream.close();
			serialPort.close();
		}
		catch(final Exception e)
		{
			logger.error("error closing spo2 device",e);
		}
	}
}
