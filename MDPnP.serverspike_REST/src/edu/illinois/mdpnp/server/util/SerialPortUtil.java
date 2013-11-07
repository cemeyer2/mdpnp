package edu.illinois.mdpnp.server.util;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Enumeration;

import org.apache.log4j.Logger;

import gnu.io.CommPort;
import gnu.io.CommPortIdentifier;
import gnu.io.PortInUseException;
import gnu.io.SerialPort;

public class SerialPortUtil
{
	private static final Logger logger = Logger.getLogger(SerialPortUtil.class);
	
	
	public static String getPumpSerialPort()
	{
		final Enumeration portList = CommPortIdentifier.getPortIdentifiers();
		while(portList.hasMoreElements())
		{
			final CommPortIdentifier portId = (CommPortIdentifier) portList.nextElement();
	
			if (portId.getPortType() == CommPortIdentifier.PORT_SERIAL) 
			{
				final String portName = portId.getName();
				
				//OS X
				if(portName.contains("PL2303"))
					return portName;
				
				//Ubuntu
				if(portName.contains("USB"))
					return portName;
			}
		}
		return "";
	}
	
	public static SerialPort[] getSP02SerialPorts()
	{
		final ArrayList<SerialPort> ports = new ArrayList<SerialPort>();
		final Enumeration portList = CommPortIdentifier.getPortIdentifiers();
		while(portList.hasMoreElements())
		{
			final CommPortIdentifier portId = (CommPortIdentifier) portList.nextElement();
	
			if (portId.getPortType() == CommPortIdentifier.PORT_SERIAL) 
			{
				final String portName = portId.getName();				
				if(portName.contains("Nonin") && portName.contains("tty"))
				{
					try 
					{
	                    final CommPort thePort = portId.open("SerialPortUtil", 500);
	                    Thread.sleep(1000);
	                    logger.debug("port found and opened: "+thePort.getName());
	                    ports.add((SerialPort)thePort);
	                } 
					catch (final PortInUseException e) 
					{
	                } 
					catch (final Exception e) 
					{
	                }
				}
			}
		}
		final SerialPort[] arr = ports.toArray(new SerialPort[]{});
		logger.debug("returning: "+Arrays.toString(arr));
		return arr;
	}
}
