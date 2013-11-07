var PulseOximeter = function(serverUrl)
{
	
	this.getRemoteReadings = function()
	{
		YUI({base:"yui/build/"}).use("io-xdr","node", "substitute","json-parse", function(Y)
		{
			var xdrConfig = {
					id:'flash',
					yid: Y.id,
					src:'yui/build/io/io.swf'
				};
				Y.io.transport(xdrConfig);

				var handleStart = function(id, a) 
				{
					Y.log("start firing for url"+serverUrl+".", "info", "io");
				}
				
				/* id = the transaction id
				 * o = the response object
				 * a = arguments passed back
				 * 
				 * response object:
				 * o.status = http status code of transaction
				 * o.statusText = the http status message
				 * o.getResponseHeader(headername) = gets the specified header
				 * o.getAllResponseHeaders = all headers as a string, separated by newlines
				 * o.responseText = the response data as a string
				 * o.responseXML = the response data as an xml document object
				 */
				var handleSuccess = function(id, o, a) {
					var text = o.responseText;
					var readings = Y.JSON.parse(text);
					
					var statusDiv = Y.get('#status');
					statusDiv.set('innerHTML',text);
				}		

				var handleFailure = function(id, o, a) {
					Y.log("Error "+id+" " +a+", check to see if server is running","info","io");
				}

				var cfg = {
					method: "GET",
					xdr: {
						use:'flash',
						responseXML:false
					},
					on: {
						start: handleStart,
						success: handleSuccess,
						failure: handleFailure
					}
				};

				var doGet = function() {
					Y.log("starting fetch to "+url, "info", "io");
					Y.io(serverUrl+"?type=sensor&sensor=pulseOximeter&action=allMeasurements", cfg);
				}
				Y.on("io:xdrReady", doGet);
		});
	};
	
	var loop = function()
	{
		getRemoteReadings();
		setTimeout(loop(),10000);
	}
	
	//loop();
}