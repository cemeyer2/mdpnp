/*global console, mdpnp */
/** 
 * VitalSigns is a container for vitalsign objects
 * @constructor
 * @author Charlie Meyer
 * @author Stephen Moser
 */
mdpnp.VitalSigns = function(){
	
	/**
	 * fired when a vitalsign is added to the patient's vitalsigns storage
	 * @name mdpnp.VitalSigns#VitalSigns:vitalAdded
	 * @event
	 * @param {mdpnp.VitalSigns} vitalsigns the vitalsigns object that fired the event
	 * @param {mdpnp.VitalSign} the vitalsign that was added
	 */
	
	/**
	 * this is a 2D array of vital signs
	 */
	var _vitalsigns = [];
	var vitals = this;
	
	/**
	 * adds a vital sign to the collection of vital signs
	 * @param vital the vital sign to add
	 * @return void
	 */
	this.addVitalSign = function(vital){
		if(!_vitalsigns[vital.getType()]){
			_vitalsigns[vital.getType()] = [];
		}
		_vitalsigns[vital.getType()].push(vital);
		mdpnp.Event._fire("VitalSigns:vitalAdded", vitals, vital);
	};
	
	/**
	 * gets the types of vital signs recorded thus far
	 * @return {Array} an array of String types
	 */
	this.getAvailableTypes = function(){
		var retval = [];
		for(var type in _vitalsigns){
			if(_vitalsigns.hasOwnProperty(type)){
				retval.push(type);
			}
		}
		return retval;
	};
	
	/**
	 * gets the vital signs for a specific type
	 * @param {String} type the type of vital sign to get, valid types would be PulseOximeter, etc
	 * @return {Array} an array of vital signs
	 */
	this.getVitalSigns = function(type){
		if(_vitalsigns[type] === undefined) {
			_vitalsigns[type] = [];
		}
		return _vitalsigns[type];
	};
};

mdpnp.VitalSigns.registerEvents = function(){
	mdpnp.Event.registerEvent("VitalSigns:vitalAdded","fired when a vital sign is added to the patient model");
};