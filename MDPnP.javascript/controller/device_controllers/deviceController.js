/**
 * an abstract device controller
 * @constructor
 * @param {String} type the string representation of the type that this device controller is
 * @author Charlie Meyer
 */
mdpnp.DeviceController = function(type){
	var timer;
	var that = this;
	
	/**
	 * registers this device controller with the ICE
	 */
	this.register = function(){
		mdpnp.log("starting device controller registration for "+type);
		timer = setInterval(that._register,1000);
	};
	
	/**
	 * tries to get the controller. if it can get it, we register with it, otherwise
	 * we fail silently. since this function is called on an interval timer, it will
	 * continue to be called until it succeeds. when it succeeds, the timer is canceled.
	 * @private
	 */
	this._register = function(){
		try{
			var controller = mdpnp.getEnv().getController();
			clearTimeout(timer);
			controller.registerDeviceController(that);
		} catch(err){
		}
	};
	
	/**
	 * gets the type of this DeviceController
	 * @return {String} the type of this DeviceController
	 */
	this.getType = function(){
		return type;
	};
	
	/**
	 * probes for devices that are specific for the type of device that the particular
	 * subclass of DeviceController is programmed to detect
	 */
	this.probe = function(){};
};

mdpnp.DeviceController.get = function(){
	return mdpnp._deviceController = mdpnp._deviceController || new mdpnp.DeviceController();
};