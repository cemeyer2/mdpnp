var Pump = function(){
	var pumpNumber;
	
	var pumpAjax = function(url)
	{
		YUI({base:"yui/build/"}).use("io-xdr","node", "substitute","json-parse", function(Y){
			var xdrConfig = {
					id:'flash',
					yid: Y.id,
					src:'yui/build/io/io.swf'
				};
				Y.io.transport(xdrConfig);

				var handleStart = function(id, a) {
					Y.log("start firing for url"+url+".", "info", "io");
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
					var pump = Y.JSON.parse(text);
					var message = "Pump Status:<br/><br/><table>";
					message = message + "<tr><td>running:</td><td>"+pump.running+"</td></tr>";
					message = message + "<tr><td>buzzing:</td><td>"+pump.buzzing+"</td></tr>";
					message = message + "<tr><td>rate:</td><td>"+pump.rate+"</td></tr>";
					message = message + "<tr><td>direction:</td><td>"+pump.direction+"</tr></td></table>"
					var statusDiv = Y.get('#status');
					statusDiv.set('innerHTML',message);
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
					Y.io(url, cfg);
				}
				Y.on("io:xdrReady", doGet);
		});
	}
	
	this.getPumpNumber = function()
	{
		return pumpNumber;
	}
	
	this.run = function()
	{
		this.pumpAjax("http://localhost:9122/?type=actuator&actuator=pump&pumpNumber="+this.getPumpNumber()+"&action=run");
	}

	this.stop = function()
	{
		this.pumpAjax("http://localhost:9122/?type=actuator&actuator=pump&pumpNumber="+this.getPumpNumber()+"&action=stop");
	}

	this.getRate = function()
	{
		this.pumpAjax("http://localhost:9122/?type=actuator&actuator=pump&pumpNumber="+this.getPumpNumber()+"&action=getRate");
	}

	this.setRate = function()
	{
		var rate = parseFloat(prompt("What rate would you like to set the pump to?",""));
		this.pumpAjax("http://localhost:9122/?type=actuator&actuator=pump&pumpNumber="+this.getPumpNumber()+"&action=setRate&rate="+rate);
	}

	this.buzzOn = function()
	{
		this.pumpAjax("http://localhost:9122/?type=actuator&actuator=pump&pumpNumber="+this.getPumpNumber()+"&action=buzzOn");
	}

	this.buzzOff = function()
	{
		this.pumpAjax("http://localhost:9122/?type=actuator&actuator=pump&pumpNumber="+this.getPumpNumber()+"&action=buzzOff");
	}
	
	this.setDirection = function()
	{
		var direction = prompt("What direction (INF for infuse or WDR for withdraw)?");
		this.pumpAjax("http://localhost:9122/?type=actuator&actuator=pump&pumpNumber="+this.getPumpNumber()+"&action=setDirection&direction="+direction);
	}
	
	pumpNumber = parseInt(prompt("What pump number?"));
}


