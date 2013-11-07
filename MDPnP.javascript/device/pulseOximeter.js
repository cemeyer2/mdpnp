/*global mdpnp, json_parse, clearInterval, setInterval, extend, flensed, console */
/**
 * Constructor for a SPO2 sensor
 * @param {String} sensor_id the id of the sensor on the backend server
 * @param {mdpnp.Controller} controller the controller that this sensor is attached to
 * @constructor
 * @augments mdpnp.Sensor
 * @requires mdpnp.Sensor
 * @requires mdpnp.Controller
 * @requires mdpnp.SPO2VitalSign
 * @author Charlie Meyer
 */
mdpnp.PulseOximeter = function(sensor_id, controller){
	
	/**
	 * fires when the pulse oximeter creates a new vitalsign. this event is fired before
	 * the vitalsign reaches the controller or the patient model
	 * @name mdpnp.PulseOximeter#PulseOximeter:newVitalSign
	 * @event
	 * @param {mdpnp.PulseOximeter} pulseOximeter the pulse oximeter that fired this event
	 * @param {mdpnp.SPO2VitalSign} vital the vital sign that was created
	 */
	
	var name = "PulseOximeter";
	var po = this;

	mdpnp.PulseOximeter.superclass.constructor.call(this,name,sensor_id,controller);

	var timer;

	var pollHardware = function(){
		var ajax = new flensed.flXHR({ autoUpdatePlayer:true, instanceId:"myproxy1", xmlResponseText:false});

		var pollSuccess = function(loadObj){
			if (loadObj.readyState == 4) {
				var json = json_parse(loadObj.responseText);
				for(var key in json)
				{
					if(json.hasOwnProperty(key)){
						var payload = json[key];
						//document.write("heartRate: "+payload.heartRate+ "  --  O2:"+payload.oxygenSaturationPercentage+"<br>");
						var measurement = new mdpnp.SPO2VitalSign(payload, sensor_id);
						mdpnp.Event._fire("PulseOximeter:newVitalSign", po, measurement);
						controller.addVitalSign(measurement);
					}
				}
			}
			return;
		};

		var pollError = function(errObj){
			mdpnp.log("Error:"+errObj.number+" type:"+errObj.name+" Description:"+errObj.description+"<br>");
		};

		ajax.onreadystatechange = pollSuccess;
		ajax.onerror = pollError;

		ajax.open("POST","http://nurburgring.cs.uiuc.edu:9122/sensors/spo2/"+sensor_id+"/readings_since_last_poll");
		ajax.send();
	};

	this.startPolling = function(){
		//poll every 5 seconds, 1 second causes heavy cpu load
		timer = setInterval(pollHardware,5000);
	};

	this.stopPolling = function(){
		clearInterval(timer);
	};
	
	/**
	 * returns the sensor number
	 * @return the sensor number
	 */
	this.getSensorId = function(){
		return sensor_Id;
	};

};

	


extend(mdpnp.PulseOximeter, mdpnp.Sensor);

mdpnp.PulseOximeter.registerEvents = function(){
	mdpnp.Event.registerEvent("PulseOximeter:newVitalSign","fired when the pulse oximeter receives a measurement");
};