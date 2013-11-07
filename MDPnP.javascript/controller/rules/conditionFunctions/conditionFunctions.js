mdpnp.rules.conditionFunctions = {};

mdpnp.rules.conditionFunctions.getMostRecentValidBloodGlucose = function() {
	var controller;
	try{
		controller = mdpnp.getEnv().getController();
	} catch (err){
		mdpnp.log(err.message);
		return -1;
	}
	var vital;
	var vitals = controller.getVitalSigns(mdpnp.BGVitalSign.getType());
	for(var i = vitals.length-1; i >= 0; i--){
		if(vitals[i].isValidMeasurement()){
			vital = vitals[i];
			break;
		}
	}
	return vital.getBloodGlucose();
};

mdpnp.rules.conditionFunctions.getMostRecentValidBloodGlucose.getInfo = function () {
	return "gets the most recently recorded valid blood glucose measurement from the patient model's vital signs. this evaluates to -1 if there are no recorded vital signs.";
};

mdpnp.rules.conditionFunctions.getMostRecentValidBloodGlucose.getName = function () {
	return "Most Recent Valid Blood Glucose";
};

mdpnp.rules.conditionFunctions.getMostRecentValidHeartRate = function() {
	var controller;
	try{
		controller = mdpnp.getEnv().getController();
	} catch (err){
		mdpnp.log(err.message);
		return -1;
	}
	var vital;
	var vitals = controller.getVitalSigns(mdpnp.spo2VitalSign.getType());
	for(var i = vitals.length-1; i >= 0; i--){
		if(vitals[i].isValidMeasurement()){
			vital = vitals[i];
			break;
		}
	}
	return vital.getHeartRate();
};

mdpnp.rules.conditionFunctions.getMostRecentValidHeartRate.getInfo = function () {
	return "gets the most recently recorded valid heart rate measurement from the patient model's vital signs. this evaluates to -1 if there are no recorded vital signs.";
};

mdpnp.rules.conditionFunctions.getMostRecentValidHeartRate.getName = function () {
	return "Most Recent Valid Heart Rate";
};

mdpnp.rules.conditionFunctions.getMostRecentValidOxygenSaturationPercentage = function() {
	var controller;
	try{
		controller = mdpnp.getEnv().getController();
	} catch (err){
		mdpnp.log(err.message);
		return -1;
	}
	var vital;
	var vitals = controller.getVitalSigns(mdpnp.spo2VitalSign.getType());
	for(var i = vitals.length-1; i >= 0; i--){
		if(vitals[i].isValidMeasurement()){
			vital = vitals[i];
			break;
		}
	}
	return vital.getOxygenSaturationPercentage();
};

mdpnp.rules.conditionFunctions.getMostRecentValidOxygenSaturationPercentage.getInfo = function(){
	return "gets the most recently recorded valid blood oxygen saturation percentage from the patient model. this evaluates to -1 if there are no recorded vital signs.";
}

mdpnp.rules.conditionFunctions.getMostRecentValidOxygenSaturationPercentage.getName = function () {
	return "Most Recent Valid Blood Oxygen Saturation Precentage";
};

mdpnp.rules.conditionFunctions.isMostRecentBGVitalSignValid = function() {
	var controller;
	try{
		controller = mdpnp.getEnv().getController();
	} catch (err){
		mdpnp.log(err.message);
		return -1;
	}
	var vitals = controller.getVitalSigns(mdpnp.bgVitalSign.getType());
	return vitals[vitals.length-1].isValidMeasurement();
};

mdpnp.rules.conditionFunctions.isMostRecentBGVitalSignValid.getInfo = function () {
	return "returns true if the most recent measurement from a blood glucose monitor was valid, false otherwise";
};

mdpnp.rules.conditionFunctions.isMostRecentBGVitalSignValid.getName = function () {
	return "Is Most Recent Blood Glucose Measurement Valid";
};

mdpnp.rules.conditionFunctions.isMostRecentSPO2VitalSignValid = function() {
	var controller;
	try{
		controller = mdpnp.getEnv().getController();
	} catch (err){
		mdpnp.log(err.message);
		return -1;
	}
	var vitals = controller.getVitalSigns(mdpnp.spo2VitalSign.getType());
	return vitals[vitals.length-1].isValidMeasurement();
};

mdpnp.rules.conditionFunctions.isMostRecentSPO2VitalSignValid.getInfo = function () {
	return "returns true if the most recent measurement from a pulse oximeter was valid, false otherwise";
};

mdpnp.rules.conditionFunctions.isMostRecentSPO2VitalSignValid.getName = function () {
	return "Is Most Recent Pulse Oximeter Measurement Valid";
};

mdpnp.rules.conditionFunctions.getSecondsSinceMostRecentPumpRun = function(){
	var controller;
	var pump;
	try{
		controller = mdpnp.getEnv().getController();
		pump = controller.getActuator("pump0");
		if(pump === undefined){
			return -1;
		}
	} catch (err) {
		mdpnp.log(err.message);
		return -1;
	}
	var runTime = pump.getMostRecentRunTime();
	if(runTime === undefined){
		return Number.MAX_VALUE;
	}
	var now = new Date();
	var nowms = now.getTime();
	var thenms = runTime.getTime();
	var diff = nowms - thenms;
	return diff/1000;
};

mdpnp.rules.conditionFunctions.getSecondsSinceMostRecentPumpRun.getInfo = function(){
	return "Gets the time in seconds since the pump with id pump0 was last run. This returns -1 if there is no pump in the environment. This returns Number.MAX_VALUE if the pump has not yet been run.";
};

mdpnp.rules.conditionFunctions.getSecondsSinceMostRecentPumpRun.getName = function () {
	return "Get Time Since Pump Was Last Run";
};

mdpnp.rules.conditionFunctions.getPumpErrors = function(){
	var controller;
	var pump;
	try{
		controller = mdpnp.getEnv().getController();
		pump = controller.getActuator("pump0");
		if(pump === undefined){
			return -1;
		}
	} catch (err) {
		mdpnp.log(err.message);
		return -1;
	}
	var status = pump.getPumpStatus();
	if(status === undefined){
		return false;
	}
	return status;
};

mdpnp.rules.conditionFunctions.getPumpErrors.getInfo = function(){
	return "Gets the status of the pump. This returns false if the pump status is OK.";
};

mdpnp.rules.conditionFunctions.getPumpErrors.getName = function () {
	return "Get Pump Status Errors";
};

mdpnp.rules.conditionFunctions.getPumpLowBattery = function(){
	var controller;
	var pump;
	try{
		controller = mdpnp.getEnv().getController();
		pump = controller.getActuator("pump0");
		if(pump === undefined){
			return -1;
		}
	} catch (err) {
		mdpnp.log(err.message);
		return -1;
	}
	var status = pump.getLowBattery();
	return status;
};

mdpnp.rules.conditionFunctions.getPumpLowBattery.getInfo = function(){
	return "Gets the status of the pump's battery. This returns false if the pump battery is OK.";
};

mdpnp.rules.conditionFunctions.getPumpLowBattery.getName = function () {
	return "Get Pump Battery Status";
};

mdpnp.rules.conditionFunctions.alwaysTrue = function(){
	return true;
};

mdpnp.rules.conditionFunctions.alwaysTrue.getName = function(){
	return "Always returns the boolean true";
};

mdpnp.rules.conditionFunctions.alwaysTrue.getInfo = function(){
	return "Always returns true. Useful for creating rules that should always be evaluated to true (ie event based only)";
};