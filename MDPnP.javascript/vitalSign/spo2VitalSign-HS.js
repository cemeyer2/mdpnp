/*global mdpnp, extend */
/**
 * a vitalsign from a pulse oximeter
 * @constructor
 * @augments mdpnp.VitalSign
 * @author Charlie Meyer
 */
mdpnp.SPO2VitalSign = function(data, from){
	
	var purse = this.enablePrivacy();

	purse.data = data;
	purse.from = from;

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

};

SPO2VitalSign.privilegedMethod("getDataOrThrowError", function(attribute){
	if(this.data[attribute] !== undefined){
		return this.data[attribute];
	} else {
		throw new Error("SPO2VitalSign: Attempted to access invalid data: "+attribute);
	}
});

	/**
	 * @return {Number} the heart rate recorded in this measurement
	 */
	SPO2VitalSign.prototype.getHeartRate = function(){
		return this.getDataOrThrowError("heartRate");
	};

	/**
	 * @return {Number} the oxygen saturation percentage in this measurement
	 */
	SPO2VitalSign.prototype.getOxygenSaturationPercentage = function(){
		return this.getDataOrThrowError("oxygenSaturationPercentage");
	};
	
	/**
	 * @return {Boolean} true if the sensor was disconnected when this measurement
	 * was taken, false otherwise
	 */
	SPO2VitalSign.prototype.isDisconnected = function(){
		return this.getDataOrThrowError("disconnected");
	};
	
	/**
	 * @return {Boolean} true if the sensor was out of track when this measurement
	 * was taken, false otherwise
	 */
	SPO2VitalSign.prototype.isOutOfTrack = function(){
		return this.getDataOrThrowError("outOfTrack");
	};
	
	/**
	 * @return {Boolean} true if the sensor was in an artifact condition when this
	 * measurement was taken, false otherwise
	 */
	SPO2VitalSign.prototype.isArtifact = function(){
		return this.getDataOrThrowError("artifact");
	};
	
	/**
	 * @return {Boolean} true if the sensor had marginal signal quality when
	 * this measurement was taken, false otherwise
	 */
	SPO2VitalSign.prototype.isMarginalPerfusion = function(){
		return this.getDataOrThrowError("marginalPerfusion");
	};
	
	/**
	 * @return {Boolean} true if the sensor had low signal quality when
	 * this measurement was taken, false otherwise
	 */
	SPO2VitalSign.prototype.isLowPerfusion = function(){
		return this.getDataOrThrowError("lowPerfusion");
	};
	
	/**
	 * @return {Boolean} true if this measurement came from a valid
	 * spo2 sensor, false otherwise
	 */
	SPO2VitalSign.prototype.isFromValidSensor = function(){
		return this.getDataOrThrowError("fromValidSensor");
	};
	
	/**
	 * @return {Boolean} true if this measurement reflects valid data,
	 * false otherwise
	 */
	SPO2VitalSign.prototype.isValidMeasurement = function(){
		return 	!this.isDisconnected() &&
				!this.isOutOfTrack() &&
				!this.isArtifact() &&
				this.isFromValidSensor();
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
