package edu.illinois.mdpnp.test;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;

import edu.illinois.mdpnp.test.actuators.PumpTests;
import edu.illinois.mdpnp.test.server.actuators.ServerPumpTests;

@RunWith(Suite.class)
@Suite.SuiteClasses(
		{
			PumpTests.class,
			ServerPumpTests.class
		})
public class TestSuite
{

}
