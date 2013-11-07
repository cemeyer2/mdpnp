mdpnp.rules.successFailureFunctions = {};

mdpnp.rules.successFailureFunctions.readyPumps = function(rule){
	var controller;
	try{
		controller = mdpnp.getEnv().getController();
	} catch(err){
		mdpnp.log(err.message);
		return;
	}
	var actuatorIds = controller.getActuatorIds();
	for(var i = 0; i < actuatorIds.length; i++){
		var actuator = controller.getActuator(actuatorIds[i]);
		if(actuator.constructor == mdpnp.Pump){
			actuator.requestToRun();
		}
	}
};

mdpnp.rules.successFailureFunctions.readyPumps.getName = function(){
	return "Ready all pumps to pump";
};

mdpnp.rules.successFailureFunctions.readyPumps.getInfo = function(){
	return "iterates through all devices of type pump attached to the controller and readies them";
};


mdpnp.rules.successFailureFunctions.enablePumps = function(rule){
	var controller;
	try{
		controller = mdpnp.getEnv().getController();
	} catch(err){
		mdpnp.log(err.message);
		return;
	}
	var actuatorIds = controller.getActuatorIds();
	for(var i = 0; i < actuatorIds.length; i++){
		var actuator = controller.getActuator(actuatorIds[i]);
		if(actuator.constructor == mdpnp.Pump){
			actuator.enablePump();
		}
	}
};

mdpnp.rules.successFailureFunctions.enablePumps.getName = function(){
	return "Enable all pumps to pump";
};

mdpnp.rules.successFailureFunctions.enablePumps.getInfo = function(){
	return "iterates through all devices of type pump attached to the controller and enables them";
};

mdpnp.rules.successFailureFunctions.disablePumps = function(rule){
	var controller;
	try{
		controller = mdpnp.getEnv().getController();
	} catch(err){
		mdpnp.log(err.message);
		return;
	}
	var actuatorIds = controller.getActuatorIds();
	for(var i = 0; i < actuatorIds.length; i++){
		var actuator = controller.getActuator(actuatorIds[i]);
		if(actuator.constructor == mdpnp.Pump){
			actuator.disablePump();
		}
	}
};

mdpnp.rules.successFailureFunctions.disablePumps.getName = function(){
	return "Disable all pumps from pumping";
};

mdpnp.rules.successFailureFunctions.disablePumps.getInfo = function(){
	return "iterates through all devices of type pump attached to the controller and disables them";
};

mdpnp.rules.successFailureFunctions.sendMessageToStaff = function(rule){
	var controller;
	try{
		controller = mdpnp.getEnv().getController();
	} catch(err){
		mdpnp.log(err.message);
		return;
	}
	
	var text;
	if(rule.getFailingConditions.length == 0){
		text = "rule evaluated successfully";
	} else {
		var failing = rule.getFailingConditions();
		text = "rule failed:\n\n";
		for(var i = 0; i < failing.length; i++){
			var condition = failing[i];
			var message = condition.getConditionFunction().getName() + " ("+condition.getRecentTestValue()+") "+ condition.getOperatorString() + " "+ condition.getConditionValue();
			text += message + "\n";
		}
	}
	controller.sendAlert(text);
};

mdpnp.rules.successFailureFunctions.sendMessageToStaff.getName = function(){
	return "Send message to the clinical staff";
};

mdpnp.rules.successFailureFunctions.sendMessageToStaff.getInfo = function(){
	return "Sends either a success message or a failure message indicating which conditions of the rule invoking this function caused it to fail.";
};

mdpnp.rules.successFailureFunctions.runPumpsRequestingToRun = function(rule){
	var controller;
	try{
		controller = mdpnp.getEnv().getController();
	} catch(err){
		mdpnp.log(err.message);
		return;
	}
	var actuatorIds = controller.getActuatorIds();
	for(var i = 0; i < actuatorIds.length; i++){
		var actuator = controller.getActuator(actuatorIds[i]);
		if(actuator.constructor == mdpnp.Pump){
			if(actuator.isRequestingToRun()){
				actuator.run();
			}
		}
	}
};

mdpnp.rules.successFailureFunctions.runPumpsRequestingToRun.getName = function(){
	return "Run pumps";
};

mdpnp.rules.successFailureFunctions.runPumpsRequestingToRun.getInfo = function(){
	return "iterates through all devices of type pump attached to the controller and runs them if they have been requested to run.";
};

mdpnp.rules.successFailureFunctions.runGlucosePump = function(rule){
	var controller;
	try{
		controller = mdpnp.getEnv().getController();
	} catch(err){
		mdpnp.log(err.message);
		return;
	}
	//Actuator 0 is the glucose pump
	var actuator = controller.getActuator(0);
	if (actuator.constructor == mdpnp.Pump) {
		if (actuator.isRequestingToRun()) {
			actuator.run();
		}
	}
};

mdpnp.rules.successFailureFunctions.runGlucosePump.getName = function(){
	return "Run Glucose pump";
};

mdpnp.rules.successFailureFunctions.runGlucosePump.getInfo = function(){
	return "Runs pump 0 which is the glucose pump.";
};

mdpnp.rules.successFailureFunctions.runInsulinPump = function(rule){
	var controller;
	try{
		controller = mdpnp.getEnv().getController();
	} catch(err){
		mdpnp.log(err.message);
		return;
	}
	//Actuator 1 is the insulin pump
	var actuator = controller.getActuator(1);
	if (actuator.constructor == mdpnp.Pump) {
		if (actuator.isRequestingToRun()) {
			actuator.run();
		}
	}
};

mdpnp.rules.successFailureFunctions.runInsulinPump.getName = function(){
	return "Run Insulin pump";
};

mdpnp.rules.successFailureFunctions.runInsulinPump.getInfo = function(){
	return "Runs pump 0 which is the insulin pump.";
};