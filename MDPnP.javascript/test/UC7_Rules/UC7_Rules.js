mdpnp.rules.UC7 = {};

mdpnp.rules.UC7.pumpReady = function(){
	var ruleSuccess = mdpnp.rules.successFailureFunctions.readyPumps;
	
	var ruleFail = mdpnp.rules.successFailureFunctions.disablePumps;
	
	var binaryCondition1 = new mdpnp.rules.EqualsCondition(mdpnp.rules.conditionFunctions.isMostRecentBGVitalSignValid);
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

mdpnp.rules.UC7.startPump = function(){
	var ruleSuccess = mdpnp.rules.successFailureFunctions.enablePumps;
	
	var ruleFail = mdpnp.rules.successFailureFunctions.disablePumps;
	
	var binaryCondition1 = new mdpnp.rules.EqualsCondition(mdpnp.rules.conditionFunctions.isMostRecentBGVitalSignValid);
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

mdpnp.rules.UC7.normalPumpingOperation = function(){
	var ruleSuccess = function(){
		//should be enabled for XXX amount of time
		mdpnp.rules.successFailureFunctions.readyPumps();
	};
	
	var ruleFail = function(){
		mdpnp.rules.successFailureFunctions.sendMessageToStaff();
	};
	
	var binaryCondition1 = new mdpnp.rules.LessThanOrEqualsCondition(70);
	var binaryConditionWrapper1 = new mdpnp.rules.BinaryConditionWrapper(mdpnp.rules.conditionFunctions.getMostRecentValidBloodGlucose, binaryCondition1);
	
	var binaryCondition2 = new mdpnp.rules.GreaterThanOrEqualsCondition(140);
	var binaryConditionWrapper2 = new mdpnp.rules.BinaryConditionWrapper(mdpnp.rules.conditionFunctions.getMostRecentValidBloodGlucose, binaryCondition2);
	
	var binaryCondition3 = new mdpnp.rules.EqualsCondition(false);
	var binaryConditionWrapper3 = new mdpnp.rules.BinaryConditionWrapper(mdpnp.rules.conditionFunctions.getPumpErrors, binaryCondition3);
	
	var rule = new mdpnp.rules.CompositeRule(ruleSuccess, ruleFail);
	rule.addCondition(binaryConditionWrapper1);
	rule.addCondition(binaryConditionWrapper2);
	rule.addCondition(binaryConditionWrapper3);
	
	var controller;
	try{
		controller = mdpnp.getEnv().getController();
	} catch(err){
		mdpnp.log(err.message);
		return;
	}
	
	controller.addRule("PulseOximeter:newVitalSign",rule);

}

mdpnp.rules.UC7.glucoseLevelIsLow = function(){
	var ruleSuccess = function(){
		mdpnp.rules.successFailureFunctions.runGlucosePump();
	};
	
	var ruleFail = function(){
		//mdpnp.rules.successFailureFunctions.enablePumps();
	};
	
	var binaryCondition1 = new mdpnp.rules.LessThanOrEqualsCondition(70);
	var binaryConditionWrapper1 = new mdpnp.rules.BinaryConditionWrapper(mdpnp.rules.conditionFunctions.getMostRecentValidBloodGlucose, binaryCondition1);
	
	var rule = new mdpnp.rules.CompositeRule(ruleSuccess, ruleFail);
	rule.addCondition(binaryConditionWrapper1);
	
	var controller;
	try{
		controller = mdpnp.getEnv().getController();
	} catch(err){
		mdpnp.log(err.message);
		return;
	}
	
	controller.addRule("PulseOximeter:newVitalSign",rule);
};

mdpnp.rules.UC7.glucoseLevelIsHigh = function(){
	var ruleSuccess = function(){
		mdpnp.rules.successFailureFunctions.runInsulinPump();
	};
	
	var ruleFail = function(){
		//mdpnp.rules.successFailureFunctions.enablePumps();
	};
	
	var binaryCondition1 = new mdpnp.rules.GreaterThanOrEqualsCondition(140);
	var binaryConditionWrapper1 = new mdpnp.rules.BinaryConditionWrapper(mdpnp.rules.conditionFunctions.getMostRecentValidBloodGlucose, binaryCondition1);
	
	var rule = new mdpnp.rules.CompositeRule(ruleSuccess, ruleFail);
	rule.addCondition(binaryConditionWrapper1);
	
	var controller;
	try{
		controller = mdpnp.getEnv().getController();
	} catch(err){
		mdpnp.log(err.message);
		return;
	}
	
	controller.addRule("PulseOximeter:newVitalSign",rule);
};

mdpnp.rules.UC7.pumpFailure = function(){
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

mdpnp.rules.UC7.pumpLowBatteryWarning = function(){
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

mdpnp.rules.UC7.pumpOutOfContact = function(){
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


mdpnp.rules.UC7.initRulesForUC7 = function(){
	mdpnp.rules.UC7.pumpReady();
	mdpnp.rules.UC7.startPump();
	mdpnp.rules.UC7.normalPumpingOperation();
	mdpnp.rules.UC7.glucoseLevelIsLow();
	mdpnp.rules.UC7.glucoseLevelIsHigh();
	mdpnp.rules.UC7.pumpFailure();
	mdpnp.rules.UC7.pumpLowBatteryWarning();
	//mdpnp.rules.UC7.pumpNearEmptyWarning();
	//mdpnp.rules.UC7.pumpEmptyAlarm();
	mdpnp.rules.UC7.pumpOutOfContact();
	
	

};
