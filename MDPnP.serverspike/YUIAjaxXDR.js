
/* runs an ajax transaction against the url provided
 * 
 * the handler object must be a singleton of the following form:
 * 
 * var handler = {
 * 		start: function(id, Y){},
 * 		complete: function(id,response, Y){},
 * 		success: function(id,response, Y){},
 * 		failure: function(id,response, Y){}
 * 		abort: function(id,Y){}
 * }
 * 
 */
var YUIAjaxXDR = function(url, handler)
{
	YUI({base:"yui/build/"}).use("io-xdr","node", "substitute","json-parse", function(Y){
		var xdrConfig = {
				id:'flash',
				yid: Y.id,
				src:'yui/build/io/io.swf'
		};
		Y.io.transport(xdrConfig);

		var cfg = {
				method: "GET",
				xdr: {
			use:'flash',
			responseXML:false
		},
		on: {
			start: handler.start,
			success: handler.success,
			failure: handler.failure,
			complete: handler.complete,
			abort: handler.abort
		},
		arguments: {
			start: Y,
			complete: Y,
			success: Y,
			failure: Y,
			abort: Y
		}
		};

		var doGet = function() {
			Y.log("starting fetch to "+url, "info", "io");
			Y.io(url, cfg);
		}
		Y.on("io:xdrReady", doGet);
	});
}