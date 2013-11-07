/*global mdpnp */
/** 
 * A patient in the system
 * @param {String} _name the name of the patient
 * @param {String} _sex the sex of the patient, either M or F
 * @param {Date} _dateOfBirth the dob of the patient as a Javascript Date object
 * @constructor
 * @author Charlie Meyer
 */
mdpnp.Patient = function(_name, _sex, _dateOfBirth){
	
	/**
	 * VitalSigns object
	 */
	var _vitals;
	
	/**
	 * returns the name of the patient
	 * @return the name of the patient
	 */
	this.getName = function(){
		return _name;
	};
	
	/**
	 * returns the date of birth of the patient
	 * @return the date of birth of the patient as a Javascript Date object
	 */
	this.getDateOfBirth = function(){
		return _dateOfBirth;
	};
	
	/**
	 * returns the sex of the patient, either M or F
	 * @return the sex of the patient
	 */
	this.getSex = function(){
		return _sex;
	};
	
	/**
	 * Adds a vital to this patient's vital signs
	 * @param {VitalSign} vital the vitalsign to add
	 * @return void
	 * @see mdpnp.VitalSigns#addVitalSign
	 */
	this.addVitalSign = function(vital){
		this.getVitalSigns().addVitalSign(vital);
	};
	
	/**
	 * gets vital signs of a specific type from this patient
	 * @param {String} type the type of vital signs to fetch. This
	 * should be retrieved from calling a static getType() function
	 * on a specific vitalsign class or should be an element of
	 * the array return from getTypesOfVitalSignsStored
	 * @return {Array} an array of VitalSigns
	 * @see mdpnp.Patient#getTypesOfVitalSignsStored
	 * @see mdpnp.VitalSigns#getVitalSigns
	 */
	this.getVitalSigns = function(type){
		if(type === undefined){
			return _vitals;
		}
		else{
			return _vitals.getVitalSigns(type);
		}
	};
	
	/**
	 * gets the types of vital signs that this patient has stored
	 * @return {Array} an array of Strings, with each one
	 * corresponding to a type of vital sign that this patient has
	 * stored. These values can be used in getVitalSigns
	 * @see mdpnp.Patient#getVitalSigns
	 * @see mdpnp.VitalSigns#getVitalSigns
	 */
	this.getTypesOfVitalSignsStored = function(){
		return this.getVitalSigns().getAvailableTypes();
	};
	
	/**
	 * returns the age in years of the patient
	 * @return the age in years of the patient
	 */
	this.getAge = function(){
		var now = new Date().getTime();
		var then = this.getDateOfBirth().getTime();
		var difference = now-then;
		var millisInOneYear = 86400000*365;
		var yearsOld = difference / millisInOneYear;
		return Math.floor(yearsOld);
	};
	
	//constructor code
	if(!(_dateOfBirth.constructor==Date)){
		throw new Error("dateOfBirth parameter must be a Javascript Date object");
	}
	
	if((_sex != "M") && (_sex != "F")){
		throw new Error("sex must be either 'M' or 'F'");
	}
	
	_vitals = new mdpnp.VitalSigns();
};