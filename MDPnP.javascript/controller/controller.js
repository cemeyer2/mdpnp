/*global mdpnp, console, flensed, json_parse, setTimeout */
/** 
 * The controller for one patient and many devices
 * @param {mdpnp.Patient} the patient that this controller is attached to
 * @requires mdpnp.Patient
 * @requires mdpnp.PulseOximeter
 * @requires mdpnp.Pump
 * @constructor
 * @author Charlie Meyer
 * @author Stephen Moser
 */
mdpnp.Controller = function(_patient){

	//events comments
	/**
	 * fires when a rule has completed evaluation and was successful
	 * @name mdpnp.Controller#controller:ruleSuccess
	 * @event
	 * @param {mdpnp.Controller} controller the controller that handled the rule evaluation
	 * @param {mdpnp.rules.Rule} rule the Rule that fired the event
	 */
	/**
	 * fires when a rule has completed evaluation and was not successful
	 * @name mdpnp.Controller#controller:ruleFailure
	 * @event
	 * @param {mdpnp.Controller} controller the controller that handled the rule evaluation
	 * @param {mdpnp.rules.Rule} rule the Rule that fired the event
	 */
	/**
	 * fires when the controller receives a vital sign from a sensor
	 * @name mdpnp.Controller#controller:vitalSignAdded
	 * @event
	 * @param {mdpnp.Controller} controller the controller receiving the vital sign
	 * @param {mdpnp.VitalSign} vitalSign the vital sign that the controller received
	 */
	/**
	 * fires when a device was detected and attached to the controller
	 * @name mdpnp.Controller#controller:deviceAdded
	 * @event
	 * @param {mdpnp.Controller} controller the controller that fired the event
	 * @param {mdpnp.Device} device the device that was added
	 */
	/**
	 * fires when an alert is sent through the controller
	 * @name mdpnp.Controller#controller:alertSent
	 * @event
	 * @param {String} message the content of the alert that was sent
	 */
	/**
	 * fires when the controller is initialized, often before any devices are
	 * detected
	 * @name mdpnp.Controller#controller:initialized
	 * @event
	 * @param {mdpnp.Controller} controller the controller that fired the event
	 */
	
	var _devices = [];
	var _deviceControllers = [];
	var _rules = [];
	var MS_BETWEEN_DEVICE_PROBES = 300000; //5 minutes
	var controller = this;
	var alarmHistory = [];
	
	/**
	 * returns the number of rules in the controller
	 * @returns void
	 */
	this.getRuleCount = function(){
		return _rules.length;
	};
	
	var _evaluateRule = function(rule){
		var pass = rule.evaluate();
		if(pass === true){
			mdpnp.Event._fire("controller:ruleSuccees",controller, rule);
		} else {
			mdpnp.Event._fire("controller:ruleFailure",controller, rule);
		}
	};
	
	/**
	 * adds a rule to the controller
	 * @param {String} the event on which this rule should be evaluated
	 * @param {mdpnp.rules.RuleWrapper} rule the rule to add
	 * @returns number of rules in controller
	 */
	this.addRule = function(event, rule){
		if(arguments.length != 2){
			throw new Error("must supply 2 arguments when adding a rule to a controller");
		};
		if(arguments[0].constructor != String){
			throw new Error("first argument supplied to addRule must be a String");
		};
		var ruleClosure = (function(){
			var closure = function(){
				_evaluateRule(rule);
			};
			closure.rule = rule;
			closure.event = event;
			return closure;
		}());
		mdpnp.Event.on(event, controller, ruleClosure);
		_rules.push(ruleClosure);
	};
	
	/**
	 * returns a rule at the given index
	 * @param index the index of the rule to return
	 * @returns a rule closure at the given index
	 * @example
	 * var ruleClosure = controller.getRule(0);
	 * var event = ruleClosure.event;
	 * var ruleObj = ruleClosure.rule;
	 */
	this.getRule = function(index){
		return _rules[index];
	};
	
	/**
	 * removes a rule from the controller and the events subsystem
	 * @param {Function} ruleClosure the rule closure to remove, should be gotten
	 * using mdpnp.Controller#getRule
	 * @return true if the rule was removed, false otherwise
	 */
	this.removeRule = function(ruleClosure){
		for(var i = 0; i < _rules.length; i++){
			if(_rules[i]===ruleClosure){
				mdpnp.Event.remove(ruleClosure.event, ruleClosure);
				_rules.remove(i);
				return true;
			}
		}
		return false;
	};
	
	/**
	 * returns the patient
	 * @returns the patient
	 */
	this.getPatient = function(){
		return _patient;
	};
	
	/**
	 * gets the available device ids of devices that are attached to this controller
	 * @return {Array} an array of device ids
	 */
	this.getDeviceIds = function(){
		var retval = [];
		for(var key in _devices) {
			if(_devices.hasOwnProperty(key)) {
				retval.push(key);
			}
		}
		return retval;
	};
	
	/**
	 * gets a specific device by id
	 * @param id the id of the device to fetch
	 * @return {mdpnp.Device} the device with the given id or undefined if it does not exist
	 */
	this.getDevice = function(id){
		return _devices[id];
	};
	
	/**
	 * adds a vital sign to the records for
	 * the patient that this controller is attached to.
	 * This function is basically to avoid having a long
	 * method chain in the devices when they want to add
	 * vital signs
	 * @param {mdpnp.VitalSign} vital the vital to add
	 * @return void
	 */
	this.addVitalSign = function(vital){
		this.getPatient().getVitalSigns().addVitalSign(vital);
		mdpnp.Event._fire("controller:vitalSignAdded", controller, vital);
	};
	
	/**
	 * gets the vitalsigns object for this patient
	 * @param {String} type the type of vitalsigns to fetch. if this param is omitted, then
	 * the entire vitalsigns object is returned
	 * @return {mdpnp.VitalSigns|Array} the vital signs for the patient attached to this controller
	 */
	this.getVitalSigns = function(type){
		if(type === undefined){
			return this.getPatient().getVitalSigns();
		}
		else{
			return this.getPatient().getVitalSigns().getVitalSigns(type);
		}
	};
	
	/**
	 * mocks sending an alert to the clinical staff
	 * @param {String} message the message to send
	 * @return void
	 */
	this.sendAlert = function(message){
		alert("Alert:\n\n"+message);
		mdpnp.log("Alert: "+message);
		mdpnp.Event._fire("controller:alertSent",message);
		var alarm = {
						message:message,
						timestamp:new Date()
					};
		alarmHistory.push(alarm);
	};
	
	/**
	 * gets the number of alarm messages
	 * @param {Date} since optional parameter specifying the maximum age of alarms to count
	 * @return {Number} the number of alarm messages
	 */
	this.getAlarmCount = function(since){
		if(since === undefined){
			return alarmHistory.length;
		}
		var after = function(date1, date2){
			var t1 = date1.getTime();
			var t2 = date2.getTime();
			return t1 >= t2;
		};
		var count = 0;
		for(var i = 0; i < alarmHistory.length; i++){
			if(after(alarmHistory[i].timestamp.getTime,since.getTime())){
				count = count + 1;
			}
		}
		return count;
	};
	
	/**
	 * gets the alarm messages that have passed through this controller
	 * @return {Array} an array of object literals containing the alarm history
	 * @example
	 * var arr = controller.getAlarmMessages();
	 * var text = arr[0].message;
	 * var timestamp = arr[0].timestamp;
	 */
	this.getAlarmMessages = function(){
		return alarmHistory;
	};
	
	var checkForNewDevices = function(){
		var i = 0;
		for(i = 0; i < _deviceControllers.length; i++){
			_deviceControllers[i].probe();
		}
		setTimeout(checkForNewDevices, MS_BETWEEN_DEVICE_PROBES);
	};
	
	/**
	 * registers a new device controller with this controller
	 * @param {mdpnp.DeviceController} deviceController the device controller to register
	 * @return void
	 */
	this.registerDeviceController = function(deviceController){
		mdpnp.log("registering new device controller of type "+deviceController.getType());
		_deviceControllers.push(deviceController);
		deviceController.probe();
	};
	
	/**
	 * adds a device to this controller, should only be called by a registered device controller.
	 * only adds the device if it doesnt already exist
	 * @param {mdpnp.Device} device the device to add
	 * @return void
	 * @private
	 */
	this._addDevice = function(device){
		if(_devices[device.getId()] === undefined){
			_devices[device.getId()] = device;
			mdpnp.log("controller: device added: "+device.getId());
			mdpnp.Event._fire("controller:deviceAdded", controller, device);
		}
	};
	
	
	
	checkForNewDevices();
	mdpnp.Event._fire("controller:initialized",this);
};

mdpnp.Controller.registerEvents = function(){
	mdpnp.Event.registerEvent("controller:ruleSuccess","fired when a rule successfully evaluates in the controller");
	mdpnp.Event.registerEvent("controller:ruleFailure","fired when a rule fails evaluation in the controller")
	mdpnp.Event.registerEvent("controller:vitalSignAdded","fired when a vital sign is added through the controller");
	mdpnp.Event.registerEvent("controller:deviceAdded","fired when a device is detected and attached to the controller");
	mdpnp.Event.registerEvent("controller:alertSent", "fired when an alert is sent through the controller");
	mdpnp.Event.registerEvent("controller:initialized","fired when the controller is initialized, this is often before any devices are detected");
};