/*global mdpnp */
/**
 * VitalSign is an abstract base class for various sensor data
 * @param {Date} timestamp the time of the collected vitalSign
 * @param data the payload of this vital sign, should be a json object
 * @param {String} from the origin of this vitalsign
 * @param {String} type the type of this vitalsign
 * @constructor
 * @author Charlie Meyer
 * @author Stephen Moser
 */
mdpnp.VitalSign = function (datum, timestamp, source, type) {
	this._pp = {
		datum: datum,
		timestamp: timestamp,
		source: source,
		type
	};
	
	/**
     * gets the payload of the vital sign
     * @return a json object containing the data for this vitalsign
     */
    this.datum = function() {return this._pp.datum;};  // getData
	
    /**
     * gets a string type of this vital sign
     * @return {String} the type of this vitalsign
     */
    this.type = function() {return this._pp.type;};  // getType

	
    /**
     * gets the timestamp of this VitalSign
     * @return {Date} the timestamp as this VitalSign
     */
	this.timestamp = function() {return this._pp.timestamp;};  // getTimestamp

    /**
     * gets the origin of this vitalsign
     * @return {String} the origin of this vitalsign
     */
	this.source = function() {return this._pp.source;};  // getFrom

};

/*
mdpnp.VitalSign = function (datum, timestamp, source, type) {
	var protectedProperties = this.enablePrivacy();
	protectedProperties._datum = datum;
	protectedProperties._timestamp = timestamp;
	protectedProperties._source = source;
	protectedProperties._type = type;
};

VS = mdpnp.VitalSign;
VS.priviledgedMethod("type", function () {return this._pp.type;})
VS.priviledgedMethod("datum", function () {return this._pp._datum;})
VS.priviledgedMethod("timestamp", function () {return this._pp._timestamp;})
VS.priviledgedMethod("source", function () {return this._pp._source;})
*/