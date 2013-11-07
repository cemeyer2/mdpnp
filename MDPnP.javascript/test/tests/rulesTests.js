//here we are assuming that all the conditions have been
//properly tested, so the tests here will not be comprehensive
//over all the different types of conditions
describe("rules test suite", function(){
	
	var success;
	var successFunction;
	var failureFunction;
	
	beforeEach(function(){
		success = undefined;
		successFunction = function(){success = true;};
		failureFunction = function(){success = false;};
	});
	
	it('should be able to construct a rule with one condition', function(){
		var condition = new mdpnp.rules.LessThanCondition(50);
		var conditionFunction = function(){return 20;};
		var wrapper = new mdpnp.rules.BinaryConditionWrapper(conditionFunction, condition);
		
		var rule = new mdpnp.rules.CompositeRule(successFunction, failureFunction);
		rule.addCondition(wrapper);
		rule.setDescription("simple rule");
		
		expect(rule.getDescription()).toEqual("simple rule");
		expect(rule.getConditionCount()).toEqual(1);
		expect(rule.getCondition(0)).toEqual(wrapper);
		expect(rule.isEvaluating()).toBeFalsy();
	});
	
	it('should be able to construct a rule with many conditions', function(){
		var conditions = [];
		var count = 100;
		
		var rule = new mdpnp.rules.CompositeRule(successFunction, failureFunction);
		
		for(var i = 0; i < count; i++){
			var cond = new mdpnp.rules.LessThanCondition(i);
			var conditionFunction = function(){return i-1;};
			var wrapper = new mdpnp.rules.BinaryConditionWrapper(conditionFunction, cond);
			conditions.push(wrapper);
			rule.addCondition(wrapper);
		}
		
		expect(rule.getConditionCount()).toEqual(count);
		for(var i = 0; i < rule.getConditionCount(); i++){
			expect(rule.getCondition(i)).toEqual(conditions[i]);
		};
	});
	
	it('should be able to evaluate rules with a single condition', function(){
		//create a rule that should pass
		var condition = new mdpnp.rules.LessThanCondition(50);
		var conditionFunction1 = function(){return 20;};
		var wrapper1 = new mdpnp.rules.BinaryConditionWrapper(conditionFunction1, condition);
		
		var rule1 = new mdpnp.rules.CompositeRule(successFunction, failureFunction);
		rule1.addCondition(wrapper1);
		
		var test1 = rule1.evaluate();
		
		expect(test1).toBeTruthy();
		expect(rule1.getFailingConditions().length).toEqual(0);
		expect(success).toBeTruthy();
		
		//create a rule that should fail
		success = undefined;
		var conditionFunction2 = function(){return 70;};
		var wrapper2 = new mdpnp.rules.BinaryConditionWrapper(conditionFunction2, condition);
		
		var rule2 = new mdpnp.rules.CompositeRule(successFunction, failureFunction);
		rule2.addCondition(wrapper2);
		
		var test2 = rule2.evaluate();
		
		expect(test2).toBeFalsy();
		expect(rule2.getFailingConditions().length).toEqual(1);
		expect(rule2.getFailingConditions()[0]).toEqual(wrapper2);
		expect(success).toBeFalsy();
	});
	
	it('should be able to evaluate rules with many conditions', function(){
		var count = 100;
		
		//create a rule that should pass (all passing conditions)
		var rule1 = new mdpnp.rules.CompositeRule(successFunction, failureFunction);
		for(var i = 0; i < count; i++){
			var cond = new mdpnp.rules.LessThanCondition(100);
			var conditionFunction = function(){return 1;};
			var wrapper = new mdpnp.rules.BinaryConditionWrapper(conditionFunction, cond);
			rule1.addCondition(wrapper);
		}
		var test1 = rule1.evaluate();
		expect(test1).toBeTruthy();
		expect(rule1.getFailingConditions().length).toEqual(0);
		expect(success).toBeTruthy();
		
		//create a rule that should fail (all failing conditions)
		success = undefined;
		var conditions = [];
		var rule2 = new mdpnp.rules.CompositeRule(successFunction, failureFunction);
		for(var i = 0; i < count; i++){
			var cond = new mdpnp.rules.LessThanCondition(0);
			var conditionFunction = function(){return 100;};
			var wrapper = new mdpnp.rules.BinaryConditionWrapper(conditionFunction, cond);
			rule2.addCondition(wrapper);
			conditions.push(wrapper);
		}
		var test2 = rule2.evaluate();
		expect(test2).toBeFalsy();
		expect(rule2.getFailingConditions().length).toEqual(100);
		expect(success).toBeFalsy();
		for(var i = 0; i < rule1.getFailingConditions().length; i++){
			expect(rule2.getFailingConditions()[i]).toEqual(conditions[i]);
		}
		
		//create a rule that should fail (1 failing condition)
		success = undefined;
		var rule3 = new mdpnp.rules.CompositeRule(successFunction, failureFunction);
		for(var i = 0; i < count; i++){
			var cond = new mdpnp.rules.LessThanCondition(100);
			var conditionFunction = function(){return 1;};
			var wrapper = new mdpnp.rules.BinaryConditionWrapper(conditionFunction, cond);
			rule3.addCondition(wrapper);
		}
		var failCond = new mdpnp.rules.LessThanCondition(1);
		var condFunc = function(){return 10;};
		var failWrapper = new mdpnp.rules.BinaryConditionWrapper(condFunc, failCond);
		rule3.addCondition(failWrapper);
		
		var test3 = rule3.evaluate();
		expect(test2).toBeFalsy();
		expect(rule3.getFailingConditions().length).toEqual(1);
		expect(success).toBeFalsy();
		expect(rule3.getFailingConditions()[0]).toEqual(failWrapper);
	});
});