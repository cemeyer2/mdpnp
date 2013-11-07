/**
 * device controller for mock devices (js implemented mock devices)
 * @constructor
 * @augments mdpnp.DeviceController
 * @author Charlie Meyer
 */
mdpnp.MockController = function(){
	
	var id_nums = [];
	
	mdpnp.MockController.superclass.constructor.call(this,"Mock Controller");
	
	this.addMockSPO2 = function(){
		
		var num;
		if(id_nums[mdpnp.MockPulseOximeter] == undefined){
			id_nums[mdpnp.MockPulseOximeter] = -1;
		}	
		id_nums[mdpnp.MockPulseOximeter] = id_nums[mdpnp.MockPulseOximeter]+1;
		num = id_nums[mdpnp.MockPulseOximeter];
		
		var sensor_id = "mockSPO2_"+num;
		var spo2 = new mdpnp.MockPulseOximeter(sensor_id,mdpnp.getEnv().getController());
		spo2.startPolling();
		mdpnp.getEnv().getController()._addDevice(spo2);
		mdpnp.Event._fire("controller:deviceAdded",mdpnp.getEnv().getController(),spo2);
	};
	
	this.register();
};

/**
 * singleton accessor method
 * @return {mdpnp.MockController} the singleton instance of a MockController
 * @static
 */
mdpnp.MockController.get = function(){
	return mdpnp._mockController = mdpnp._mockController || new mdpnp.MockController();
};

extend(mdpnp.MockController, mdpnp.DeviceController);

mdpnp.MockController.get();