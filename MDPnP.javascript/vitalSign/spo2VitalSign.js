/*global mdpnp, extend */
/**
 * a vitalsign from a pulse oximeter
 * @constructor
 * @augments mdpnp.VitalSign
 * @author Charlie Meyer
 */
mdpnp.SPO2VitalSign = function(data, from){
	
	var time = data.measurementTime;
	
	var date = new Date();
	date.setTime(time);
	
	var type = mdpnp.SPO2VitalSign.getType();
	
	mdpnp.SPO2VitalSign.superclass.constructor.call(this,data,date,from,type);
	
	/*
	 * JSON Layout for this vital sign:<br><br>
	 * obj.type - String<br>
	 * obj.measurementType - String<br>
	 * obj.heartRate - Number<br>
	 * obj.oxygenSaturationPercentage - Number<br>
	 * obj.disconnected - boolean<br>
	 * obj.outOfTrack - boolean<br>
	 * obj.artifact - boolean<br>
	 * obj.marginalPerfusion - boolean<br>
	 * obj.lowPerfusion - boolean<br>
	 * obj.fromValidSensor - boolean<br>
	 */
	
	var getDataOrThrowError = function(attribute){
		if(data[attribute] !== undefined){
			return data[attribute];
		} else {
			throw new Error("SPO2VitalSign: Attempted to access invalid data: "+attribute);
		}
	};
	
	/**
	 * @return {Number} the heart rate recorded in this measurement
	 */
	this.getHeartRate = function(){
		return getDataOrThrowError("heartRate");
	};
	
	/**
	 * @return {Number} the oxygen saturation percentage in this measurement
	 */
	this.getOxygenSaturationPercentage = function(){
		return getDataOrThrowError("oxygenSaturationPercentage");
	};
	
	/**
	 * @return {Boolean} true if the sensor was disconnected when this measurement
	 * was taken, false otherwise
	 */
	this.isDisconnected = function(){
		return getDataOrThrowError("disconnected");
	};
	
	/**
	 * @return {Boolean} true if the sensor was out of track when this measurement
	 * was taken, false otherwise
	 */
	this.isOutOfTrack = function(){
		return getDataOrThrowError("outOfTrack");
	};
	
	/**
	 * @return {Boolean} true if the sensor was in an artifact condition when this
	 * measurement was taken, false otherwise
	 */
	this.isArtifact = function(){
		return getDataOrThrowError("artifact");
	};
	
	/**
	 * @return {Boolean} true if the sensor had marginal signal quality when
	 * this measurement was taken, false otherwise
	 */
	this.isMarginalPerfusion = function(){
		return getDataOrThrowError("marginalPerfusion");
	};
	
	/**
	 * @return {Boolean} true if the sensor had low signal quality when
	 * this measurement was taken, false otherwise
	 */
	this.isLowPerfusion = function(){
		return getDataOrThrowError("lowPerfusion");
	};
	
	/**
	 * @return {Boolean} true if this measurement came from a valid
	 * spo2 sensor, false otherwise
	 */
	this.isFromValidSensor = function(){
		return getDataOrThrowError("fromValidSensor");
	};
	
	/**
	 * @return {Boolean} true if this measurement reflects valid data,
	 * false otherwise
	 */
	this.isValidMeasurement = function(){
		return 	!this.isDisconnected() &&
				!this.isOutOfTrack() &&
				!this.isArtifact() &&
				this.isFromValidSensor();
	};
};

/**
 * gets the type of this vitalsign
 * @return {String} the type of SPO2VitalSign objects
 * @static
 */
mdpnp.SPO2VitalSign.getType = function(){
	return "PulseOximeter";
};

extend(mdpnp.SPO2VitalSign, mdpnp.VitalSign);