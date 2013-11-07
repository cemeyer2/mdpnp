/*global mdpnp, extend */
/**
 * @namespace
 * @example
 * //creates a rule that is heart rate is less than or equals to 90 and greater than or equal to 60
 * //on success, the pump is enabled to run, on failure, the pump is stopped and disabled
 * var ruleSuccess = function(){
 * 		controller.getActuator("0").enable();
 * };
 * 
 * var ruleFail = function(){
 * 		controller.getActuator("0").disable();
 * };
 * 
 * var getMostRecentHeartRate = function(){
 * 		var arr = controller.getVitalSigns(mdpnp.PulseOximeter.getType());
 * 		var i = 1;
 * 		var vital = arr[arr.length-i];
 * 		
 *      //in an actual implementation, this wouldnt go here, it would be somewhere
 *      //better like in PulseOximeterMeasurement or a utility file
 * 		var isValidPulseOximeterMeasurement = function(vitalSign){
 * 			var payload = vitalSign.getData();
 * 			var isValid = true;
 * 			isValid = isValid && !payload.disconnected;
 * 			isValid = isValid && !payload.outOfTrack;
 * 			isValid = isValid && !payload.artifact;
 * 			isValid = isValid && payload.fromValidSensor;
 * 			return isValid;
 * 		};
 * 		
 * 		//loop until we get the most recent valid measurement
 * 		while(!isValidPulseOximeterMeasurement(vital)){
 * 			i = i+1;
 * 			vital = arr[arr.length-i];
 * 		}
 * 
 * 		var hr = vital.getData().heartRate;
 * 		return hr;
 * };
 * 
 * var binaryCondition1 = new mdpnp.rules.LessThanOrEqualsCondition(90);
 * var binaryConditionWrapper1 = new mdpnp.rules.BinaryRuleCondition(getMostRecentHeartRate, binaryCondition1);
 * 
 * var binaryCondition2 = new mdpnp.rules.GreaterThanOrEqualsCondition(60);
 * var binaryConditionWrapper2 = new mdpnp.rules.BinaryRuleWrapper(getMostRecentHeartRate, binaryCondition2);
 * 
 * var rule = new mdpnp.rules.CompositeRule(ruleSuccess, ruleFail);
 * rule.addRule(binaryConditionWrapper1);
 * rule.addRule(binaryConditionWrapper2);
 * 
 * controller.addRule(rule);
 */
mdpnp.rules = function(){};

/**
 * an abstract class for a rule
 * @constructor
 * @author Charlie Meyer
 */
mdpnp.rules.Rule = function(){
	
	this._failingConditions = [];
	this._evaluating = false;
	var rule = this;
	
	/**
	 * fires when a rule has completed evaluation
	 * @name mdpnp.rules.Rule#rule:evaluated
	 * @event
	 * @param {Rule} rule the Rule that fired the event
	 * @param {Boolean} evaluationResult the result of the rule evaluation
	 */
	
	/**
	 * evaluates the rule. for the basic rule class, it always returns true
	 * @fires Rule#event:rule:evaluated
	 * @return {boolean} true
	 */
	this.evaluate = function(){
		mdpnp.Event._fire("rule:evaluated",rule, true);
		return true;
	};
	
	/**
	 * sets a textual description of the rule
	 * @param desc the description to set
	 * @return void
	 */
	this.setDescription = function(desc){
		this.description = desc;
	};
	
	/**
	 * gets the description of this rule
	 * @return the description of this rule
	 */
	this.getDescription = function(){
		return this.description;
	};
	
	/**
	 * gets an array of conditions that failed the last time
	 * this rule was evaluated. This array is cleared
	 * each time the evaluation of this rule is begun.
	 * @return {Array} an array of conditions that failed
	 */
	this.getFailingConditions = function(){
		return this._failingConditions;
	};
	
	/**
	 * gets the status of the evaluation of this rule
	 * @return {boolean} true if this rule is currently
	 * being evaluated, false otherwise
	 */
	this.isEvaluating = function(){
		return this._evaluating;
	};
};

mdpnp.rules.Rule.registerEvents = function(){
	mdpnp.Event.registerEvent("rule:ruleEvaluated","fired when a rule evaluation is completed");
};

/**
 * This is the class that should be created and added as a rule the
 * controller. When this rule is evaluated, it iterates over each
 * of the conditions that it contains and if they all evaluate to true,
 * then the success function is evaluated, otherwise the fail function
 * is evaluated.
 * @param {Function} successFunction the function to execute if the rule passes
 * @param {Function} failFunction the function to execute if the rule fails
 * @constructor
 * @author Charlie Meyer
 */
mdpnp.rules.CompositeRule = function(successFunction, failFunction){
	
	/**
	 * fires when a rule has completed evaluation
	 * @name mdpnp.rules.CompositeRule#rule:evaluated
	 * @event
	 * @param {Rule} rule the Rule that fired the event
	 * @param {Boolean} evaluationResult the result of the rule evaluation
	 */
	
	mdpnp.rules.CompositeRule.superclass.constructor.call(this);
	
	var _conditions = [];
	var rule = this;
	
	/**
	 * adds a condition to this composite.
	 * @param condition the condition to add. This object should not be a specific
	 * condition, but should be a wrapper condition (one that allows for a function
	 * to be placed as the condition value).
	 * @return void
	 */
	this.addCondition = function(condition){
		_conditions.push(condition);
	};
	
	/**
	 * evaluates this rule. it iterates over each of the condition
	 * added to this rule and calls the sucessFunction if all
	 * the rules pass, the failFunction otherwise
	 * @return {boolean} true if all the rules contained in this
	 * rule pass, false otherwise
	 */
	this.evaluate = function(){
		var conditionsEvaluated = 0;
		var allPass = true;
		this._failingConditions.length = 0;
		this._evaluating = true;
		for(var i = 0; i < _conditions.length; i++){
			var passed = _conditions[i].evaluate();
			if(passed === false){
				this._failingConditions.push(_conditions[i]);
			}
			allPass = allPass && passed;
			conditionsEvaluated = conditionsEvaluated +1;
		}
		this._evaluating = false;
		if(allPass && conditionsEvaluated == _conditions.length){
			successFunction(rule);
		}
		else{
			failFunction(rule);
		}
		mdpnp.Event._fire("rule:evaluated",rule,allPass);
		return allPass;
	};
	
	/**
	 * gets the number of conditions in this composite
	 * @return the number of conditions in this composite
	 */
	this.getConditionCount = function(){
		return _conditions.length;
	};
	
	/**
	 * @param {Number} index the location to fetch from
	 * @return the condition at the specified index
	 */
	this.getCondition = function(index){
		return _conditions[index];
	};
	
	/**
	 * removes a condition
	 * @param index the index of the condition to remove
	 * @return void
	 */
	this.removeCondition = function(index){
		return _conditions.remove(index);
	};
};
extend(mdpnp.rules.CompositeRule, mdpnp.rules.Rule);