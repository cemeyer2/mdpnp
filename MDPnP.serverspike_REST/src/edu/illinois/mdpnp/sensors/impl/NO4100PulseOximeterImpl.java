package edu.illinois.mdpnp.sensors.impl;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.Stack;

import org.apache.log4j.Logger;

import edu.illinois.mdpnp.sensors.PulseOximeter;
import edu.illinois.mdpnp.sensors.PulseOximeterMeasurement;
import edu.illinois.mdpnp.server.util.SerialPortUtil;
import gnu.io.PortInUseException;
import gnu.io.SerialPort;
import gnu.io.UnsupportedCommOperationException;

public class NO4100PulseOximeterImpl extends PulseOximeter
{
	private final Stack<PulseOximeterMeasurement> measurements;
	private static final Logger logger = Logger.getLogger(NO4100PulseOximeterImpl.class);
	private static SerialPort serialPort;
	private static OutputStream outputStream;
	private static InputStream inputStream;
	long timestamp;
	private final NO4100PulseOximeterImplReader reader;


	public NO4100PulseOximeterImpl(final SerialPort serialPort) throws IOException, PortInUseException, UnsupportedCommOperationException
	{
		this.serialPort = serialPort;
		this.measurements = new Stack<PulseOximeterMeasurement>();
		init();
		timestamp = System.currentTimeMillis();
		reader = new NO4100PulseOximeterImplReader();
		new Thread(reader).start();
	}

	private void init() throws IOException, PortInUseException, UnsupportedCommOperationException
	{

		try 
		{
			serialPort.setSerialPortParams(9600, SerialPort.DATABITS_8, SerialPort.STOPBITS_1, SerialPort.PARITY_NONE);
			serialPort.setFlowControlMode(SerialPort.FLOWCONTROL_NONE);
			serialPort.setDTR(true);
			serialPort.setRTS(true);
		} 
		catch (final UnsupportedCommOperationException e) 
		{
			logger.error("Error setting up port ("+serialPort.getName()+")",e);
		}
		logger.debug("serial port ("+serialPort.getName()+") params set");
		try 
		{
			outputStream = serialPort.getOutputStream();
			inputStream = serialPort.getInputStream();
		} 
		catch (final IOException e) 
		{
			logger.error("Error getting io streams for port ("+serialPort.getName()+")",e);
		}
		logger.debug("serial port ("+serialPort.getName()+") streams opened");
		serialPort.notifyOnOutputEmpty(true);
	}


	private class NO4100PulseOximeterImplReader implements Runnable
	{
		boolean shouldRun = true;

		public void stop(){
			shouldRun = false;
		}

		public void run()
		{
			try
			{
				logger.debug("writing bit pattern command to sensor");
				outputStream.write("D1".getBytes());
				final byte ack = (byte)inputStream.read();
				logger.debug("<ACK> received: "+ack);
				if (ack != 0x06) 
				{
					logger.error("Did not get <ACK> from request");
				}

				while(shouldRun)
				{

					final byte[] reply = new byte[3];

					logger.debug("reading 3 bytes from sensor");
					for (int i = 0; i < 3; i++) {
						logger.debug("read byte: "+i);
						reply[i] = (byte)inputStream.read();

					}

					logger.debug("Got the bytes " + reply[0] + ":" + reply[1] + ":" + reply[2]);

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
		if(measurements.size() > 0)
			return measurements.peek();
		return null;
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
		final SerialPort[] ports = SerialPortUtil.getSP02SerialPorts();
		logger.debug("got: "+Arrays.toString(ports));
		logger.debug("ports[0] null: "+ports[0]==null);
		final NO4100PulseOximeterImpl po = new NO4100PulseOximeterImpl(ports[0]);
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
