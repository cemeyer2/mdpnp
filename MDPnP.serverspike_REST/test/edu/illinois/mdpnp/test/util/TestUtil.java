package edu.illinois.mdpnp.test.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;

import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.JSONObject;

public class TestUtil
{
	private static final Logger logger = Logger.getLogger(TestUtil.class);
	/**
	 * Gets a String of text from the server at the given path.
	 * Paths should start with a / and end without one.
	 * This method assumes the server is running locally.
	 * @param path the path to which we are probing
	 * @param port the port the server is running on
	 * @return the text received from the server
	 */
	public static String getStringFromServer(final String path, final int port)
	{
		final String url = "http://localhost:"+port+path;
		try
		{
			String retval = "";
			final URLConnection conn = (new URL(url)).openConnection();
			conn.connect();
			final BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
			String str = null;
			while((str = in.readLine())!=null)
			{
				retval += str;
			}
			in.close();
			return retval;
		}
		catch(final IOException ioe)
		{
			logger.error("error fetching from url: "+url,ioe);
		}
		return null;
	}
	
	public static JSONObject toJSON(final String str)
	{
		try
		{
			return new JSONObject(str);
		}
		catch(final JSONException jsone)
		{
			logger.error("error creating json object for string: "+str,jsone);
			return null;
		}
	}
}
