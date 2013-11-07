package edu.illinois.mdpnp.server.util;

/**
 * a simple exception
 *
 * <br><br>
 *
 * $Rev$:     Revision of last commit<br>
 * $Author$:  Author of last commit<br>
 * $Date$:    Date of last commit<br>
 * @author Charlie Meyer  --  cemeyer2@illinois.edu
 */
public class HandlerChildrenLockedException extends Exception
{
	public HandlerChildrenLockedException()
	{
		super("Handler children are locked, cannot add new children");
	}
}
