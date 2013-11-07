/**
 * device controller for SPO2 sensors
 * @constructor
 * @augments mdpnp.DeviceController
 * @author Charlie Meyer
 */
mdpnp.SPO2Controller = function(){
	
	mdpnp.SPO2Controller.superclass.constructor.call(this,"SPO2 Controller");
	
	this.probe = function(){
		var ajax = new flensed.flXHR({ autoUpdatePlayer:true, instanceId:"spo2ControllerProxy", xmlResponseText:false});

		var pollSuccess = function(loadObj){
			if (loadObj.readyState == 4) {
				var json = json_parse(loadObj.responseText);
				for(var key in json){
					if(json.hasOwnProperty(key)) {
						var sensor_id = json[key];
						var controller = mdpnp.getEnv().getController();
						
						var spo2 = new mdpnp.PulseOximeter(sensor_id,controller);
						spo2.startPolling();
						controller._addDevice(spo2);
					}
				}
			}
			return;
		};

		var pollError = function(errObj){
			mdpnp.log("Error:"+errObj.number+" type:"+errObj.name+" Description:"+errObj.description+" Source: "+errObj.srcElement.instanceId+"<br>");
		};

		ajax.onreadystatechange = pollSuccess;
		ajax.onerror = pollError;

		ajax.open("POST","http://nurburgring.cs.uiuc.edu:9122/sensors/spo2/available_sensors");
		ajax.send();
	};
	
	this.register();
};

/**
 * singleton accessor method
 * @return {mdpnp.SPO2Controller} the singleton instance of a SPO2Controller
 * @static
 */
mdpnp.SPO2Controller.get = function(){
	return mdpnp._spo2Controller = mdpnp._spo2Controller || new mdpnp.SPO2Controller();
};

extend(mdpnp.SPO2Controller, mdpnp.DeviceController);

mdpnp.SPO2Controller.get();