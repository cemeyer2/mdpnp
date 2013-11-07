/*global mdpnp, rules, extend */
/**
 * a condition based on one value compared to another value based on a binary operator
 * @param {Function} a function that takes 2 parameters, the test value and the condition value
 * and compares them and returns a boolean
 * @param conditionValue the condition value
 * @param {String} operatorString the binary operator used in this condition, used for error reporting
 * @constructor
 * @author Charlie Meyer
 */
mdpnp.rules.BinaryCondition = function(testFunction, conditionValue, operatorString){
	
	/**
	 * evaluates this binary condition
	 * @param testValue the value that we are testing against
	 * @return {Boolean} true if the condition evaluates successfully, false otherwise
	 */
	this.evaluate = function(testValue){
		this.recentTestValue = testValue;
		this.recentEvaluation = testFunction(testValue, conditionValue);
		return this.recentEvaluation;
	};
	
	/**
	 * gets a message about the status of the condition
	 * @return {String} a status message regarding the most recent evaluation of this condition
	 */
	this.getMessage = function(){
		if(this.recentEvaluation  === undefined){
			return "condition not evaluated yet";
		} else if(this.recentEvaluation === true) {
			return "condition passed";
		} else {
			return "condition failed: "+this.recentTestValue+" "+operatorString+" "+conditionValue;
		}
	};
	
	/**
	 * gets the operator used as the binary operator in this condition
	 * @return {String} the operator used in this condition
	 */
	this.getOperatorString = function(){
		return operatorString;
	};
	
	/**
	 * gets the condition value
	 * @return the condition value
	 */
	this.getConditionValue = function(){
		return conditionValue;
	};
	
	/**
	 * gets the most recently used value used when evaluating this condition
	 * @return the most recently used value used when evaluating this condition
	 */
	this.getRecentTestValue = function(){
		return this.recentTestValue;
	};
};

/**
 * A condition for having a test value being less than a condition value
 * @param conditionValue the condition value
 * @constructor
 * @augments mdpnp.rules.BinaryCondition
 * @author Charlie Meyer
 */
mdpnp.rules.LessThanCondition = function(conditionValue){
	var conditionFunction = function(testValue, conditionValue){
		return (testValue < conditionValue);
	};
	mdpnp.rules.LessThanCondition.superclass.constructor.call(this,conditionFunction,conditionValue, "<");
};
extend(mdpnp.rules.LessThanCondition,mdpnp.rules.BinaryCondition);

/**
 * A condition for having a test value being less than or equal to a condition value
 * @param conditionValue the condition value
 * @constructor
 * @augments mdpnp.rules.BinaryCondition
 * @author Charlie Meyer
 */
mdpnp.rules.LessThanOrEqualsCondition = function(conditionValue){
	var conditionFunction = function(testValue, conditionValue){
		return (testValue <= conditionValue);
	};
	mdpnp.rules.LessThanOrEqualsCondition.superclass.constructor.call(this,conditionFunction,conditionValue, "<=");
};
extend(mdpnp.rules.LessThanOrEqualsCondition,mdpnp.rules.BinaryCondition);

/**
 * A condition for having a test value being greater than a condition value
 * @param conditionValue the condition value
 * @constructor
 * @augments mdpnp.rules.BinaryCondition
 * @author Charlie Meyer
 */
mdpnp.rules.GreaterThanCondition = function(conditionValue){
	var conditionFunction = function(testValue, conditionValue){
		return (testValue > conditionValue);
	};
	mdpnp.rules.GreaterThanCondition.superclass.constructor.call(this,conditionFunction,conditionValue, ">");
};
extend(mdpnp.rules.GreaterThanCondition,mdpnp.rules.BinaryCondition);

/**
 * A condition for having a test value being greater than or equal to a condition value
 * @param conditionValue the condition value
 * @constructor
 * @augments mdpnp.rules.BinaryCondition
 * @author Charlie Meyer
 */
mdpnp.rules.GreaterThanOrEqualsCondition = function(conditionValue){
	var conditionFunction = function(testValue, conditionValue){
		return (testValue >= conditionValue);
	};
	mdpnp.rules.GreaterThanOrEqualsCondition.superclass.constructor.call(this,conditionFunction,conditionValue, ">=");
};
extend(mdpnp.rules.GreaterThanOrEqualsCondition,mdpnp.rules.BinaryCondition);

/**
 * A condition for having a test value being equal to a condition value
 * @param conditionValue the condition value
 * @constructor
 * @augments mdpnp.rules.BinaryCondition
 * @author Charlie Meyer
 */
mdpnp.rules.EqualsCondition = function(conditionValue){
	var conditionFunction = function(testValue, conditionValue){
		return (testValue == conditionValue);
	};
	mdpnp.rules.EqualsCondition.superclass.constructor.call(this,conditionFunction,conditionValue, "==");
};
extend(mdpnp.rules.EqualsCondition,mdpnp.rules.BinaryCondition);

/**
 * A rule for having a test value being not equal to a condition value
 * @param conditionValue the condition value
 * @constructor
 * @augments mdpnp.rules.BinaryCondition
 * @author Charlie Meyer
 */
mdpnp.rules.NotEqualToCondition = function(conditionValue){
	var conditionFunction = function(testValue, conditionValue){
		return (testValue != conditionValue);
	};
	mdpnp.rules.NotEqualToCondition.superclass.constructor.call(this,conditionFunction,conditionValue, "!=");
};
extend(mdpnp.rules.NotEqualToCondition,mdpnp.rules.BinaryCondition);

/**
 * A rule for having a test value being exactly equal (===) to a condition value
 * @param conditionValue the condition value
 * @constructor
 * @augments mdpnp.rules.BinaryCondition
 * @author Charlie Meyer
 */
mdpnp.rules.ExactlyEqualToCondition = function(conditionValue){
	var conditionFunction = function(testValue, conditionValue){
		return (testValue === conditionValue);
	};
	mdpnp.rules.ExactlyEqualToCondition.superclass.constructor.call(this,conditionFunction,conditionValue, "===");
};
extend(mdpnp.rules.ExactlyEqualToCondition,mdpnp.rules.BinaryCondition);

/**
 * A rule for having a test value being not exactly equal (!==) to a condition value
 * @param conditionValue the condition value
 * @constructor
 * @augments mdpnp.rules.BinaryCondition
 * @author Charlie Meyer
 */
mdpnp.rules.NotExactlyEqualToCondition = function(conditionValue){
	var conditionFunction = function(testValue, conditionValue){
		return (testValue !== conditionValue);
	};
	mdpnp.rules.NotExactlyEqualToCondition.superclass.constructor.call(this,conditionFunction,conditionValue, "!==");
};
extend(mdpnp.rules.NotExactlyEqualToCondition,mdpnp.rules.BinaryCondition);

/**
 * A wrapper around a BinaryCondition that allows for a function
 * to be provided for the value rather than a set value.
 * @param {Function} testFunction the function that will be called each time that
 * this rule is evaluated. It must return a single Number or Boolean value. The function
 * can only return a boolean value when the other parameter is either an EqualsCondition or
 * a NotEqualToCondition.
 * @param {mdpnp.rules.BinaryCondition} binaryCondition the condition that will be evaluated
 * @constructor
 * @author Charlie Meyer
 */
mdpnp.rules.BinaryConditionWrapper = function(testFunction, binaryCondition){
	
	/**
	 * evaluates this condition
	 * @return {Boolean} true if this condition evaluates successfully, false otherwise
	 */
	this.evaluate = function(){
		return binaryCondition.evaluate(testFunction());
	};
	
	/**
	 * gets the message for this binary condition
	 * @return {String} the status message regarding the most recent evaluation of this condition
	 */
	this.getMessage = function(){
		return binaryCondition.getMessage();
	};
	
	/**
	 * gets the operator used in this condition
	 * @return {String} a string representation of the operator used in this condition
	 */
	this.getOperatorString = function(){
		return binaryCondition.getOperatorString();
	};
	
	/**
	 * gets the condition value used in this condition
	 * @return the condition value used in this condition
	 */
	this.getConditionValue = function(){
		return binaryCondition.getConditionValue();
	};
	
	/**
	 * gets the function used to generate values when evaluating the condition
	 * @return {Function} gets the function used to generate values when evaluating the condition
	 */
	this.getConditionFunction = function(){
		return testFunction;
	};
	
	/**
	 * gets the most recently used value used when evaluating this condition
	 * @return the most recently used value used when evaluating this condition
	 */
	this.getRecentTestValue = function(){
		return binaryCondition.getRecentTestValue();
	};
};