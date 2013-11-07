/**
 * a simple logging framework. this function logs to the non-standard console
 * object if it exists (it does in safari and in firefox if firebug is installed).
 * it also saves each message in memory with a timestamp and the source of the message
 * if that data is available (retrieved using the depreciated arguments.caller property)
 * @param {String} message the message to log
 * @return void
 * @author Charlie Meyer
 */
mdpnp.log = function(message){
	if(console !== undefined){
		console.log(message);
	}
	mdpnp.log._logMessages.push(new mdpnp.log.LogMessage(message, mdpnp.log.caller));
};

mdpnp.log._logMessages = [];

/**
 * returns the number of log messages stored
 * @return the number of log messages stored
 */
mdpnp.log.getLogMessageCount = function(){
	return mdpnp.log._logMessages.length;
};

/**
 * gets a particular log message stored in the system
 * @param {Number} index the index number of the message to retrieve
 * @return {mdpnp.log.LogMessage} a LogMessage object representing the message requested 
 * or undefined if an invalid index is specified.
 */
mdpnp.log.getLogMessage = function(index){
	return mdpnp.log._logMessages[index];
};

/**
 * represents one message that has passed through the logging framework
 * @constructor
 * @param {String} message the message that was logged
 * @param {String} source the source of this message, may be undefined if this information is not available
 * @author Charlie Meyer
 */
mdpnp.log.LogMessage = function(message, source){
	var timestamp = new Date();
	
	/**
	 * gets the message that was logged
	 * @return {String} the message that was logged
	 */
	this.getMessage = function(){
		return message;
	};
	
	/**
	 * gets the timestamp of this message
	 * @return {Date} the timestamp of this message
	 */
	this.getTimestamp = function(){
		return timestamp;
	};
	
	/**
	 * gets the source of this message
	 * @return {String} the name of the source of this message, may be undefined if this data was not available
	 */
	this.getSource = function(){
		return source;
	};
};