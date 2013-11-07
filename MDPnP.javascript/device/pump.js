/*global mdpnp, extend, flensed, document, json_parse, console */
/** 
 * Pump is a class for pumps that inherits from Device 
 * @param {Number} _pumpId the id of the pump
 * @constructor
 * @augments mdpnp.Actuator
 * @requires mdpnp.Actuator
 * @requires mdpnp.Controller
 * @author Charlie Meyer
 * @author Stephen Moser
 */
mdpnp.Pump = function(_pumpId, controller){
	
	/**
	 * fired when the pump is disabled
	 * @name mdpnp.Pump#pump:pumpDisabled
	 * @event
	 * @param {mdpnp.Pump} source the pump that fired the event
	 */
	/**
	 * fired when the pump is enabled
	 * @name mdpnp.Pump#pump:pumpEnabled
	 * @event
	 * @param {mdpnp.Pump} source the pump that fired the event
	 */
	/**
	 * fired when there is a communications failure with the pump
	 * @name mdpnp.Pump#pump:commFailure
	 * @event
	 * @param {mdpnp.Pump} source the pump that fired this event
	 * @param {Number} code the flxhr error code
	 * @param {String} name the name of the error
	 * @param {String} description the description of the error
	 * @param source the source element causing the error
	 * @param {String} url the url that was trying to be called
	 * @param {Function} the callback that would have been executed if there was no failure
	 */
	/**
	 * fired when the pump is requested to run
	 * @name mdpnp.Pump#pump:requestToRun
	 * @event
	 * @param {mdpnp.Pump} the pump that is making the request
	 * @param {Function} the requested callback function
	 */
	
	mdpnp.Pump.superclass.constructor.call(this,"pump",_pumpId,controller);

	var _diameter;
	var _buzzing;
	var _rate;
	var _volInfused;
	var _volWithdrawn;
	var _volToPump;
	var _status;
	var _direction;
	var _error;
	var _mostRecentRunTime;
	var _lowBattery = false;
	
	var _enabled = false;
	var pump = this;
	var _isRequestingToRun = false;
	var _requestedCallback;

	var baseAddr = "http://nurburgring.cs.uiuc.edu:9122/actuators/pump/";

	/**
	 * Responsible for sending the pump messages
	 * @return a pump reading
	 */
	this._pumpAjax = function(url, callback){

		var ajax = new flensed.flXHR({ autoUpdatePlayer:true, instanceId:"pumpproxy1", xmlResponseText:false});
		
		var success = function(loadObj){
			if (loadObj.readyState == 4) {
				var json = json_parse(loadObj.responseText);
				
				json.enabled = pump.isEnabled();
				json.mostRecentRunTime = pump.getMostRecentRunTime();
				json.lowBattery = pump.getLowBattery();
				if(callback){
					callback(json);
				}
			}
			return;
		};
		
		var error = function(errObj){
			mdpnp.log("Error:"+errObj.number+" type:"+errObj.name+" Description:"+errObj.description+" Source: "+errObj.srcElement.instanceId+" URL:"+url+"<br>");
			mdpnp.Event._fire("pump:commFailure",pump,errObj.number, errObj.name, errObj.description, errObj.srcElement.instanceId, url, callback);
		};

		ajax.onreadystatechange = success;
		ajax.onerror = error;

		ajax.open("POST",url);
		ajax.send();
	};

	/**
	 * Starts the pump either infusing or withdrawing depending on the direction that is set. 
	 * @param {Function} callback a function that takes a single parameter. The function
	 * will be executed as soon as the data from the pump is available. The parameter passed
	 * back to the callback function will contain all status info about the pump
	 * @return void
	 */
	this.run = function(callback){
		if(callback === undefined){
			callback = _requestedCallback;
		}
		if(_enabled === true){
			//wrap the caller supplied callback in a function
			//that sets the most recent run time to the
			//current time. its wrapped in the callback so that
			//it is only set if the command was successful
			var cback = function(json){
				_mostRecentRunTime = new Date();
				_isRequestingToRun = false;
				if(callback){
					callback(json);
				}
			};
			this._pumpAjax(baseAddr+this.getPumpId()+"/run", cback);
		}
	};
	
	/**
	 * requests that the pump should run. This fires the pump:requestToRun event.
	 * A rule should be made that attaches to this event and calls the pump run function
	 * if the rule is successful. This is preferred over calling the run function
	 * directly
	 * @param {Function} callback the function to be executed if the pump actually runs
	 * @return void
	 */
	this.requestToRun = function(callback){
		_isRequestingToRun = true;
		_requestedCallback = callback;
		mdpnp.Event._fire("pump:requestToRun",pump,callback);
	};

	/**
	 * Sets the pump to 'pause' it is infusing or withdrawing and 'stop' if it is paused
	 * @param {Function} callback a function that takes a single parameter. The function
	 * will be executed as soon as the data from the pump is available. The parameter passed
	 * back to the callback function will contain all status info about the pump
	 * @return void
	 */
	this.stop = function(callback){
		this._pumpAjax(baseAddr+this.getPumpId()+"/stop", callback);
	};


	this._updateStatus = function(callback){
		this._pumpAjax(baseAddr+this.getPumpId()+"/status", callback);
	};

	/**
	 * Sets the rate that the pump will infuse or withdraw liquid.
	 * @param {Double} rate the magnitude of the rate
	 * @param {String} units the units of measure
	 * @param {Function} callback a function that takes a single parameter. The function
	 * will be executed as soon as the data from the pump is available. The parameter passed
	 * back to the callback function will contain all status info about the pump
	 * @return void
	 */
	this.setRate = function(rate,units,callback){
		this._pumpAjax(baseAddr+this.getPumpId()+"/set_rate/"+rate+"/"+units, callback);
	};

	/**
	 * Sets the Volume that the pump will infuse or withdraw.
	 * @param {Double} amount the magitude of the volume
	 * @param {String} units the units of measure
	 * @param {Function} callback a function that takes a single parameter. The function
	 * will be executed as soon as the data from the pump is available. The parameter passed
	 * back to the callback function will contain all status info about the pump
	 * @return void
	 */
	this.setVolumeToPump = function(amount,units,callback){
		this._pumpAjax(baseAddr+this.getPumpId()+"/set_volume/"+amount+"/"+units, callback);
	};

	/**
	 * Turns on the buzzer on the pump.
	 * @param {Function} callback a function that takes a single parameter. The function
	 * will be executed as soon as the data from the pump is available. The parameter passed
	 * back to the callback function will contain all status info about the pump
	 * @return void
	 */
	this.buzzOn = function(callback){
		this._pumpAjax(baseAddr+this.getPumpId()+"/buzz_on/", callback);
	};

	/**
	 * Turns off the buzzer on the pump.
	 * @param {Function} callback a function that takes a single parameter. The function
	 * will be executed as soon as the data from the pump is available. The parameter passed
	 * back to the callback function will contain all status info about the pump
	 * @return void
	 */
	this.buzzOff = function(callback){
		this._pumpAjax(baseAddr+this.getPumpId()+"/buzz_off/", callback);
	};

	/**
	 * Sets the diameter of the pump in mm.
	 * @param {Double} diameter the new diameter of the syringe in mm
	 * @param {Function} callback a function that takes a single parameter. The function
	 * will be executed as soon as the data from the pump is available. The parameter passed
	 * back to the callback function will contain all status info about the pump
	 * @return void
	 */
	this.setDiameter = function(diameter,callback){
		this._pumpAjax(baseAddr+this.getPumpId()+"/set_diameter/"+diameter, callback);
	};

	/**
	 * Sets the direction that the pump syringe will move.
	 * @param {String} dir wdr for withdraw, inf for infuse
	 * @param {Function} callback a function that takes a single parameter. The function
	 * will be executed as soon as the data from the pump is available. The parameter passed
	 * back to the callback function will contain all status info about the pump
	 * @return void
	 */
	this.setDirection = function(dir,callback){
		this._pumpAjax(baseAddr+this.getPumpId()+"/set_direction/"+dir, callback);
	};
	
	/**
	 * Sets the status of the battery
	 * @param {Boolean} true for low battery
	 * @return void
	 */
	this.setLowBattery = function(battery){
		_lowBattery = battery;
	};

	/**
	 * Clears the volume dispensed counters back to zero for both the volume infused and withdrawn
	 * @param {Function} callback a function that takes a single parameter. The function
	 * will be executed as soon as the data from the pump is available. The parameter passed
	 * back to the callback function will contain all status info about the pump
	 * @return void
	 */
	this.clearVolumeDispensedCounters = function(callback){
		this._pumpAjax(baseAddr+this.getPumpId()+"/clear", callback);
	};

	/**
	 * gets the error of the pump, may be undefined
	 * @param {Function} callback a function that takes a single parameter. The function
	 * will be executed as soon as the data from the pump is available. The parameter passed
	 * back to the callback function will contain all status info about the pump
	 * @return void
	 */
	this.getStatus = function(callback){
		this._updateStatus(callback);
	};
	
	/**
	 * enables the pump to run
	 * @return void
	 */
	this.enablePump = function(){
		mdpnp.Event._fire("pump:pumpEnabled",pump);
		_enabled= true;
	};
	
	/**
	 * disabled the pump from running
	 * @return void
	 */
	this.disablePump = function(){
		mdpnp.Event._fire("pump:pumpDisabled",pump);
		_enabled = false;
	};
	
	/**
	 * gets the enabled/disabled status of this pump
	 * @return {Boolean} true if the pump is enabled, false otherwise
	 */
	this.isEnabled = function(){
		return _enabled;
	};
	
	/**
	 * gets the requesting to run status of this pump
	 * @return {Boolean} true if the pump is requesting to run, false otherwise
	 */
	this.isRequestingToRun = function(){
		return _isRequestingToRun;
	};

	/**
	 * returns true if this pump is requesting to run, false otherwise
	 * @return {Boolean} true if this pump is requesting to run, false otherwise
	 */
	this.isRequestingToRun = function(){
		return _isRequestingToRun;
	};
	
	/**
	 * gets the time that the pump was last run
	 * @return {Date} the time that the pump was most recently run, undefined if
	 * the pump has not been run yet
	 */
	this.getMostRecentRunTime = function(){
		return _mostRecentRunTime;
	};
	
	/**
	 * gets the status of the pump's battery
	 * @return {Boolean} the status of pump batter, true is low
	 * the pump has not been run yet
	 */
	this.getLowBattery = function(){
		return _lowBattery;
	};
};



extend(mdpnp.Pump, mdpnp.Actuator);

mdpnp.Pump.registerEvents = function(){
	mdpnp.Event.registerEvent("pump:pumpEnabled","fired when a pump is enabled");
	mdpnp.Event.registerEvent("pump:pumpDisabled","fired when a pump is disabled");
	mdpnp.Event.registerEvent("pump:commFailure","fired when there is a communications failure with the pump");
	mdpnp.Event.registerEvent("pump:requestToRun","fired when the pump is requested to run");
};