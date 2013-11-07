/*global mdpnp, extend */
/** 
 * Device is an abstract base class for actuators and sensors 
 * @param {String} name the name of the device
 * @param {String} type the type of the device, either actuator or sensor
 * @constructor
 * @author Stephen Moser
 */
mdpnp.Device = function(name, id, type){
	
	
	/**
	 * returns the name of the device
	 * @return the name of the device
	 */
	this.getName = function(){
		return name;
	};
	
	/**
	 * returns the id of this device
	 * @return the id of this device
	 */
	this.getId = function(){
		return id;
	};
	
	/**
	 * returns the type of the device, either actuator or sensor
	 * @return the type of the device
	 */
	this.getType = function(){
		return type;
	};
	
	/**
	 * returns true if the decive is an actuator, else it returns false
	 * @return true if the device is an actuator
	 */
	this.isActuator = function(){
		if (type == 'actuator'){
			return true;
		} else {
			return false;
		}
	};
	
	/**
	 * returns true if the decive is a sensor, else it returns false
	 * @return true if the device is a sensor
	 */
	this.isSensor = function(){
		if (type == 'sensor') {
			return true;
		} else {
			return false;
		}
	};
	
	//constructor code
	if((type != "actuator") && (type != "sensor")){
		throw new Error("type must be either 'actuator' or 'sensor'");
	}
	
	if(id === undefined){
		throw new Error("Device was created without an id");
	}
	
	if(name === undefined){
		throw new Error("Device was created without a name");
	}
	
	if(type === undefined){
		throw new Error("Device was created without a type");
	}
};