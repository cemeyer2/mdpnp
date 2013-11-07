mdpnp.rules.UC1 = {};

mdpnp.rules.UC1.pumpReady = function(){
	var ruleSuccess = mdpnp.rules.successFailureFunctions.readyPumps;
	
	var ruleFail = mdpnp.rules.successFailureFunctions.disablePumps;
	
	var binaryCondition1 = new mdpnp.rules.EqualsCondition(mdpnp.rules.conditionFunctions.isMostRecentSPO2VitalSignValid);
	var binaryConditionWrapper1 = new mdpnp.rules.BinaryConditionWrapper(true, binaryCondition1);

	
	var rule = new mdpnp.rules.CompositeRule(ruleSuccess, ruleFail);
	rule.addCondition(binaryConditionWrapper1);

	var controller;
	try{
		controller = mdpnp.getEnv().getController();
	} catch(err){
		mdpnp.log(err.message);
		return;
	}
	
	controller.addRule("controller:deviceAdded", rule);
};

mdpnp.rules.UC1.startPump = function(){
	var ruleSuccess = mdpnp.rules.successFailureFunctions.runPumpsRequestingToRun;
	
	var ruleFail = mdpnp.rules.successFailureFunctions.disablePumps;
	
	var binaryCondition1 = new mdpnp.rules.EqualsCondition(mdpnp.rules.conditionFunctions.isMostRecentSPO2VitalSignValid);
	var binaryConditionWrapper1 = new mdpnp.rules.BinaryConditionWrapper(true, binaryCondition1);
	
	var binaryCondition2 = new mdpnp.rules.EqualsCondition(false);
	var binaryConditionWrapper2 = new mdpnp.rules.BinaryConditionWrapper(mdpnp.rules.conditionFunctions.getPumpErrors, binaryCondition2);
	
	var rule = new mdpnp.rules.CompositeRule(ruleSuccess, ruleFail);
	rule.addCondition(binaryConditionWrapper1);
	rule.addCondition(binaryConditionWrapper2);

	var controller;
	try{
		controller = mdpnp.getEnv().getController();
	} catch(err){
		mdpnp.log(err.message);
		return;
	}
	
	controller.addRule("pump:requestToRun",rule);
};

mdpnp.rules.UC1.normalPumpingOperation = function(){
	var ruleSuccess = function(){
		//should be enabled for XXX amount of time
		mdpnp.rules.successFailureFunctions.enablePumps();
	};
	
	var ruleFail = function(){
		mdpnp.rules.successFailureFunctions.disablePumps();
	};
	
	var binaryCondition1 = new mdpnp.rules.LessThanOrEqualsCondition(90);
	var binaryConditionWrapper1 = new mdpnp.rules.BinaryConditionWrapper(mdpnp.rules.conditionFunctions.getMostRecentValidHeartRate, binaryCondition1);
	
	var binaryCondition2 = new mdpnp.rules.GreaterThanOrEqualsCondition(60);
	var binaryConditionWrapper2 = new mdpnp.rules.BinaryConditionWrapper(mdpnp.rules.conditionFunctions.getMostRecentValidHeartRate, binaryCondition2);
	
	var binaryCondition3 = new mdpnp.rules.LessThanOrEqualsCondition(100);
	var binaryConditionWrapper3 = new mdpnp.rules.BinaryConditionWrapper(mdpnp.rules.conditionFunctions.getMostRecentValidOxygenSaturationPercentage, binaryCondition3);
	
	var binaryCondition4 = new mdpnp.rules.GreaterThanOrEqualsCondition(90);
	var binaryConditionWrapper4 = new mdpnp.rules.BinaryConditionWrapper(mdpnp.rules.conditionFunctions.getMostRecentValidOxygenSaturationPercentage, binaryCondition4);
	
	var binaryCondition5 = new mdpnp.rules.EqualsCondition(false);
	var binaryConditionWrapper5 = new mdpnp.rules.BinaryConditionWrapper(mdpnp.rules.conditionFunctions.getPumpErrors, binaryCondition5);
	
	var rule = new mdpnp.rules.CompositeRule(ruleSuccess, ruleFail);
	rule.addCondition(binaryConditionWrapper1);
	rule.addCondition(binaryConditionWrapper2);
	rule.addCondition(binaryConditionWrapper3);
	rule.addCondition(binaryConditionWrapper4);
	rule.addCondition(binaryConditionWrapper5);
	
	var controller;
	try{
		controller = mdpnp.getEnv().getController();
	} catch(err){
		mdpnp.log(err.message);
		return;
	}
	
	controller.addRule("PulseOximeter:newVitalSign",rule);

}

mdpnp.rules.UC1.vitalSignsOutOfRange = function(){
	var ruleSuccess = function(){
		mdpnp.rules.successFailureFunctions.disablePumps();
		mdpnp.rules.successFailureFunctions.sendMessageToStaff();
	};
	
	var ruleFail = function(){
		mdpnp.rules.successFailureFunctions.enablePumps();
	};
	
	var binaryCondition1 = new mdpnp.rules.LessThanOrEqualsCondition(60);
	var binaryConditionWrapper1 = new mdpnp.rules.BinaryConditionWrapper(mdpnp.rules.conditionFunctions.getMostRecentValidHeartRate, binaryCondition1);
	
	var binaryCondition2 = new mdpnp.rules.GreaterThanOrEqualsCondition(90);
	var binaryConditionWrapper2 = new mdpnp.rules.BinaryConditionWrapper(mdpnp.rules.conditionFunctions.getMostRecentValidHeartRate, binaryCondition2);
	
	var binaryCondition3 = new mdpnp.rules.LessThanOrEqualsCondition(90);
	var binaryConditionWrapper3 = new mdpnp.rules.BinaryConditionWrapper(mdpnp.rules.conditionFunctions.getMostRecentValidOxygenSaturationPercentage, binaryCondition3);
	
	var binaryCondition4 = new mdpnp.rules.GreaterThanOrEqualsCondition(100);
	var binaryConditionWrapper4 = new mdpnp.rules.BinaryConditionWrapper(mdpnp.rules.conditionFunctions.getMostRecentValidOxygenSaturationPercentage, binaryCondition4);
	
	var rule = new mdpnp.rules.CompositeRule(ruleSuccess, ruleFail);
	rule.addCondition(binaryConditionWrapper1);
	rule.addCondition(binaryConditionWrapper2);
	rule.addCondition(binaryConditionWrapper3);
	rule.addCondition(binaryConditionWrapper4);
	
	var controller;
	try{
		controller = mdpnp.getEnv().getController();
	} catch(err){
		mdpnp.log(err.message);
		return;
	}
	
	controller.addRule("PulseOximeter:newVitalSign",rule);
};

mdpnp.rules.UC1.pumpFailure = function(){
	var ruleSuccess = function(){
		mdpnp.rules.successFailureFunctions.disablePumps();
		mdpnp.rules.successFailureFunctions.sendMessageToStaff();
	};
	
	var ruleFail = function(){
		mdpnp.rules.successFailureFunctions.enablePumps();
	};
	
	
	var binaryCondition1 = new mdpnp.rules.EqualsCondition(true);
	var binaryConditionWrapper1 = new mdpnp.rules.BinaryConditionWrapper(mdpnp.rules.conditionFunctions.getPumpErrors, binaryCondition1);
	
	var rule = new mdpnp.rules.CompositeRule(ruleSuccess, ruleFail);
	rule.addCondition(binaryConditionWrapper1);

	var controller;
	try{
		controller = mdpnp.getEnv().getController();
	} catch(err){
		mdpnp.log(err.message);
		return;
	}
	
	controller.addRule("pump:commFailure",rule);
};

mdpnp.rules.UC1.pumpLowBatteryWarning = function(){
	var ruleSuccess = function(){
		mdpnp.rules.successFailureFunctions.disablePumps();
		mdpnp.rules.successFailureFunctions.sendMessageToStaff();
	};
	
	var ruleFail = function(){
		mdpnp.rules.successFailureFunctions.enablePumps();
	};
	
	
	var binaryCondition1 = new mdpnp.rules.EqualsCondition(true);
	var binaryConditionWrapper1 = new mdpnp.rules.BinaryConditionWrapper(mdpnp.rules.conditionFunctions.getPumpLowBattery, binaryCondition1);
	
	var rule = new mdpnp.rules.CompositeRule(ruleSuccess, ruleFail);
	rule.addCondition(binaryConditionWrapper1);

	var controller;
	try{
		controller = mdpnp.getEnv().getController();
	} catch(err){
		mdpnp.log(err.message);
		return;
	}
	
	controller.addRule("pump:commFailure",rule);
};

mdpnp.rules.UC1.pumpOutOfContact = function(){
	var ruleSuccess = function(){
		mdpnp.rules.successFailureFunctions.disablePumps();
		mdpnp.rules.successFailureFunctions.sendMessageToStaff();
	};
	
	var ruleFail = function(){
		mdpnp.rules.successFailureFunctions.enablePumps();
	};
	
	//not sure if this is right
	mdpnp.Event.on("pump:commFailure", this, mdpnp.gui.ruleSuccess);
	
	var binaryCondition1 = new mdpnp.rules.EqualsCondition(true);
	var binaryConditionWrapper1 = new mdpnp.rules.BinaryConditionWrapper(mdpnp.rules.conditionFunctions.alwaysTrue, binaryCondition1);
	
	var rule = new mdpnp.rules.CompositeRule(ruleSuccess, ruleFail);
	rule.addCondition(binaryConditionWrapper1);

	var controller;
	try{
		controller = mdpnp.getEnv().getController();
	} catch(err){
		mdpnp.log(err.message);
		return;
	}
	
	controller.addRule("pump:commFailure",rule);
};


mdpnp.rules.UC1.initRulesForUC1 = function(){
	mdpnp.rules.UC1.pumpReady();
	mdpnp.rules.UC1.startPump();
	mdpnp.rules.UC1.normalPumpingOperation();
	mdpnp.rules.UC1.vitalSignsOutOfRange();
	mdpnp.rules.UC1.pumpFailure();
	mdpnp.rules.UC1.pumpLowBatteryWarning();
	//mdpnp.rules.UC1.pumpNearEmptyWarning();
	//mdpnp.rules.UC1.pumpEmptyAlarm();
	//mdpnp.rules.UC1.patientPushesDeliveryButton();
	//mdpnp.rules.UC1.patinetPushesDeliveryButtonTooManyTimes();
	mdpnp.rules.UC1.pumpOutOfContact();
	
	

};
