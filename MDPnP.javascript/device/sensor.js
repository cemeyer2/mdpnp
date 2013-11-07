/*global mdpnp, extend */
/** 
 * Sensor is an abstract class for sensors that inherits from Device 
 * @param {String} name the name of the device
 * @param {Controller} controller the controller of the device
 * @constructor
 * @augments mdpnp.Device
 * @author Stephen Moser
 * @author Charlie Meyer
 */
mdpnp.Sensor = function(name,id,controller){
	
	var type = 'sensor';
	var reading;
	mdpnp.Sensor.superclass.constructor.call(this,name,id,type);
	
	var _controller = controller;
	/**
	 * returns a sensor reading
	 * @return a sensor reading
	 */
	this.getReading = function(){
		//insert reading code here?
		return reading;
	};
};

extend(mdpnp.Sensor, mdpnp.Device);