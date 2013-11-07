/*global mdpnp, extend */
/** 
 * Actuator is an abstract class for actuators that inherits from Device 
 * @param {String} name the name of the device
 * @param {Controller} controller the controller of the device
 * @constructor
 * @augments mdpnp.Device
 * @author Stephen Moser
 * @author Charlie Meyer
 */
mdpnp.Actuator = function(name,id,controller){
	
	var type = 'actuator';
	mdpnp.Actuator.superclass.constructor.call(this,name,id,type);
	var _controller = controller;
};

extend(mdpnp.Actuator, mdpnp.Device);