/*global mdpnp */
/** 
 * The Environment of the system
 * @constructor
 * @author Stephen Moser
 * @author Charlie Meyer
 */
mdpnp.Env = function(){
	
	
	var _controller;
	var _patient;
	
	/**
	 * sets the patient for this environment, this is required before getController will return without
	 * throwing an error. this function will throw an error if the parameter supplied to it is not of type
	 * mdpnp.Patient or if a patient is already associated with this environment
	 * @param {mdpnp.Patient} patient the patient to associate with this environment
	 * @return void
	 * @see mdpnp.Patient
	 */
	this.setPatient = function(patient){
		if(_patient){
			throw new Error("mdpnp.Env#setPatient: patient is already set for this environment");
		}
		if(patient.constructor != mdpnp.Patient){
			throw new Error("mdpnp.Env#setPatient: patient parameter is not of type mdpnp.Patient");
		}
		
		_patient = patient;
	};
	
	/**
	 * returns the patient associated with this env or undefined if a patient is not yet associated
	 * @return {mdpnp.Patient} the patient associated with this env or undefined if a patient is not yet associated
	 */
	this.getPatient = function(){
		return _patient;
	};
	
	/**
 	* Getter for the environment's controller. Ensures one gets created. throws an error if there is no patient
 	* associated with this env yet.
 	* @return {mdpnp.Controller} the singleton instance of the main controller for this env
 	*/
	this.getController = function() {
		if(_patient === undefined){
			throw new Error("mdpnp.Env#getController: Patient must be defined in environment before controller can be accessed");
		}
  		return _controller = _controller || new mdpnp.Controller(_patient);
	};
};

/**
 * singleton accessor for the env
 * @return {mdpnp.Env} the singleton instance of the env
 * @static
 */
mdpnp.getEnv = function(){
	return mdpnp._currentEnv = mdpnp._currentEnv || new mdpnp.Env();
};	