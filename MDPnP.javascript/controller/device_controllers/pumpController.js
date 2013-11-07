/**
 * device controller for pumps
 * @constructor
 * @augments mdpnp.DeviceController
 * @author Charlie Meyer
 */
mdpnp.PumpController = function(){
	
	mdpnp.PumpController.superclass.constructor.call(this,"Pump Controller");
	
	
	this.probe = function(){
		var ajax = new flensed.flXHR({ autoUpdatePlayer:true, instanceId:"pumpControllerProxy", xmlResponseText:false});

		var pollSuccess = function(loadObj){
			if (loadObj.readyState == 4) {
				var json = json_parse(loadObj.responseText);
				for(var key in json){
					if(json.hasOwnProperty(key)) {
						var pump_id = json[key];
						var controller = mdpnp.getEnv().getController();
						var pump = new mdpnp.Pump(pump_id,controller);
						controller._addDevice(pump);
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

		ajax.open("POST","http://nurburgring.cs.uiuc.edu:9122/actuators/pump/pumps_in_network");
		ajax.send();
	};
	
	this.register();
};

/**
 * singleton accessor method
 * @return {mdpnp.PumpController} the singleton instance of a PumpController
 * @static
 */
mdpnp.PumpController.get = function(){
	return mdpnp._pumpController = mdpnp._pumpController || new mdpnp.PumpController();
};

extend(mdpnp.PumpController, mdpnp.DeviceController);

mdpnp.PumpController.get();