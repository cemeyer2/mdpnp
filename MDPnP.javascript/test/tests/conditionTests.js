describe("less than condition test suite", function(){
	
	var condition;	
	
	beforeEach(function(){
		condition = new mdpnp.rules.LessThanCondition(50);
	});
	
	it('should be able to construct the condition properly', function(){		
		expect(condition.getMessage()).toEqual("condition not evaluated yet");
		expect(condition.getOperatorString()).toEqual("<");
		expect(condition.getConditionValue()).toEqual(50);
	});
	
	it('should be able to evaluate the condition successfully', function(){	
		var test1 = condition.evaluate(20);
		expect(test1).toBeTruthy();
		expect(condition.getMessage()).toEqual("condition passed");
		
		var test2 = condition.evaluate(70);
		expect(test2).toBeFalsy();
		expect(condition.getMessage()).toEqual("condition failed: 70 < 50");
	});
	
	it('should be able to wrap the condition in a condition wrapper', function(){
		
		var conditionFunction = function(){return 50;};
		var wrapper = new mdpnp.rules.BinaryConditionWrapper(conditionFunction, condition);

		expect(wrapper.getMessage()).toEqual("condition not evaluated yet");
		expect(wrapper.getOperatorString()).toEqual("<");
		expect(wrapper.getConditionValue()).toEqual(50);
	});
	
	it('should be able to evaluate a wrapped condition successfully', function(){	
		var conditionFunction1 = function(){return 20;};
		var wrapper1 = new mdpnp.rules.BinaryConditionWrapper(conditionFunction1, condition);
		var conditionFunction2 = function(){return 70;};
		var wrapper2 = new mdpnp.rules.BinaryConditionWrapper(conditionFunction2, condition);
		
		var test1 = wrapper1.evaluate(20);
		expect(test1).toBeTruthy();
		expect(wrapper1.getMessage()).toEqual("condition passed");
		
		var test2 = wrapper2.evaluate(70);
		expect(test2).toBeFalsy();
		expect(wrapper2.getMessage()).toEqual("condition failed: 70 < 50");
	});
});



describe("less than or equals condition test suite", function(){
	
	var condition;	
	
	beforeEach(function(){
		condition = new mdpnp.rules.LessThanOrEqualsCondition(50);
	});
	
	it('should be able to construct the condition properly', function(){		
		expect(condition.getMessage()).toEqual("condition not evaluated yet");
		expect(condition.getOperatorString()).toEqual("<=");
		expect(condition.getConditionValue()).toEqual(50);
	});
	
	it('should be able to evaluate the condition successfully', function(){	
		var test1 = condition.evaluate(20);
		expect(test1).toBeTruthy();
		expect(condition.getMessage()).toEqual("condition passed");
		
		var test2 = condition.evaluate(70);
		expect(test2).toBeFalsy();
		expect(condition.getMessage()).toEqual("condition failed: 70 <= 50");
		
		var test3 = condition.evaluate(50);
		expect(test3).toBeTruthy();
		expect(condition.getMessage()).toEqual("condition passed");
	});
	
	it('should be able to wrap the condition in a condition wrapper', function(){
		
		var conditionFunction = function(){return 50;};
		var wrapper = new mdpnp.rules.BinaryConditionWrapper(conditionFunction, condition);

		expect(wrapper.getMessage()).toEqual("condition not evaluated yet");
		expect(wrapper.getOperatorString()).toEqual("<=");
		expect(wrapper.getConditionValue()).toEqual(50);
	});
	
	it('should be able to evaluate a wrapped condition successfully', function(){	
		var conditionFunction1 = function(){return 20;};
		var wrapper1 = new mdpnp.rules.BinaryConditionWrapper(conditionFunction1, condition);
		var conditionFunction2 = function(){return 70;};
		var wrapper2 = new mdpnp.rules.BinaryConditionWrapper(conditionFunction2, condition);
		var conditionFunction3 = function(){return 50;};
		var wrapper3 = new mdpnp.rules.BinaryConditionWrapper(conditionFunction3, condition);
		
		var test1 = wrapper1.evaluate(20);
		expect(test1).toBeTruthy();
		expect(wrapper1.getMessage()).toEqual("condition passed");
		
		var test2 = wrapper2.evaluate(70);
		expect(test2).toBeFalsy();
		expect(wrapper2.getMessage()).toEqual("condition failed: 70 <= 50");
		
		var test3 = wrapper3.evaluate(50);
		expect(test3).toBeTruthy();
		expect(wrapper3.getMessage()).toEqual("condition passed");
	});
});



describe("greater than condition test suite", function(){
	
	var condition;	
	
	beforeEach(function(){
		condition = new mdpnp.rules.GreaterThanCondition(50);
	});
	
	it('should be able to construct the condition properly', function(){		
		expect(condition.getMessage()).toEqual("condition not evaluated yet");
		expect(condition.getOperatorString()).toEqual(">");
		expect(condition.getConditionValue()).toEqual(50);
	});
	
	it('should be able to evaluate the condition successfully', function(){	
		var test1 = condition.evaluate(70);
		expect(test1).toBeTruthy();
		expect(condition.getMessage()).toEqual("condition passed");
		
		var test2 = condition.evaluate(20);
		expect(test2).toBeFalsy();
		expect(condition.getMessage()).toEqual("condition failed: 20 > 50");
	});
	
	it('should be able to wrap the condition in a condition wrapper', function(){
		
		var conditionFunction = function(){return 50;};
		var wrapper = new mdpnp.rules.BinaryConditionWrapper(conditionFunction, condition);

		expect(wrapper.getMessage()).toEqual("condition not evaluated yet");
		expect(wrapper.getOperatorString()).toEqual(">");
		expect(wrapper.getConditionValue()).toEqual(50);
	});
	
	it('should be able to evaluate a wrapped condition successfully', function(){	
		var conditionFunction1 = function(){return 70;};
		var wrapper1 = new mdpnp.rules.BinaryConditionWrapper(conditionFunction1, condition);
		var conditionFunction2 = function(){return 20;};
		var wrapper2 = new mdpnp.rules.BinaryConditionWrapper(conditionFunction2, condition);
		
		var test1 = wrapper1.evaluate(70);
		expect(test1).toBeTruthy();
		expect(wrapper1.getMessage()).toEqual("condition passed");
		
		var test2 = wrapper2.evaluate(20);
		expect(test2).toBeFalsy();
		expect(wrapper2.getMessage()).toEqual("condition failed: 20 > 50");
	});
});


describe("greater than or equals condition test suite", function(){
	
	var condition;	
	
	beforeEach(function(){
		condition = new mdpnp.rules.GreaterThanOrEqualsCondition(50);
	});
	
	it('should be able to construct the condition properly', function(){		
		expect(condition.getMessage()).toEqual("condition not evaluated yet");
		expect(condition.getOperatorString()).toEqual(">=");
		expect(condition.getConditionValue()).toEqual(50);
	});
	
	it('should be able to evaluate the condition successfully', function(){	
		var test1 = condition.evaluate(70);
		expect(test1).toBeTruthy();
		expect(condition.getMessage()).toEqual("condition passed");
		
		var test2 = condition.evaluate(20);
		expect(test2).toBeFalsy();
		expect(condition.getMessage()).toEqual("condition failed: 20 >= 50");
		
		var test3 = condition.evaluate(50);
		expect(test3).toBeTruthy();
		expect(condition.getMessage()).toEqual("condition passed");
	});
	
	it('should be able to wrap the condition in a condition wrapper', function(){
		
		var conditionFunction = function(){return 50;};
		var wrapper = new mdpnp.rules.BinaryConditionWrapper(conditionFunction, condition);

		expect(wrapper.getMessage()).toEqual("condition not evaluated yet");
		expect(wrapper.getOperatorString()).toEqual(">=");
		expect(wrapper.getConditionValue()).toEqual(50);
	});
	
	it('should be able to evaluate a wrapped condition successfully', function(){	
		var conditionFunction1 = function(){return 70;};
		var wrapper1 = new mdpnp.rules.BinaryConditionWrapper(conditionFunction1, condition);
		var conditionFunction2 = function(){return 20;};
		var wrapper2 = new mdpnp.rules.BinaryConditionWrapper(conditionFunction2, condition);
		var conditionFunction3 = function(){return 50;};
		var wrapper3 = new mdpnp.rules.BinaryConditionWrapper(conditionFunction3, condition);
		
		var test1 = wrapper1.evaluate(70);
		expect(test1).toBeTruthy();
		expect(wrapper1.getMessage()).toEqual("condition passed");
		
		var test2 = wrapper2.evaluate(20);
		expect(test2).toBeFalsy();
		expect(wrapper2.getMessage()).toEqual("condition failed: 20 >= 50");
		
		var test3 = wrapper3.evaluate(50);
		expect(test3).toBeTruthy();
		expect(wrapper3.getMessage()).toEqual("condition passed");
	});
});

describe("equals condition test suite", function(){
	
	var condition;	
	
	beforeEach(function(){
		condition = new mdpnp.rules.EqualsCondition(50);
	});
	
	it('should be able to construct the condition properly', function(){		
		expect(condition.getMessage()).toEqual("condition not evaluated yet");
		expect(condition.getOperatorString()).toEqual("==");
		expect(condition.getConditionValue()).toEqual(50);
	});
	
	it('should be able to evaluate the condition successfully', function(){	
		var test1 = condition.evaluate(70);
		expect(test1).toBeFalsy();
		expect(condition.getMessage()).toEqual("condition failed: 70 == 50");
		
		var test2 = condition.evaluate(20);
		expect(test2).toBeFalsy();
		expect(condition.getMessage()).toEqual("condition failed: 20 == 50");
		
		var test3 = condition.evaluate(50);
		expect(test3).toBeTruthy();
		expect(condition.getMessage()).toEqual("condition passed");
	});
	
	it('should be able to wrap the condition in a condition wrapper', function(){
		
		var conditionFunction = function(){return 50;};
		var wrapper = new mdpnp.rules.BinaryConditionWrapper(conditionFunction, condition);

		expect(wrapper.getMessage()).toEqual("condition not evaluated yet");
		expect(wrapper.getOperatorString()).toEqual("==");
		expect(wrapper.getConditionValue()).toEqual(50);
	});
	
	it('should be able to evaluate a wrapped condition successfully', function(){	
		var conditionFunction1 = function(){return 70;};
		var wrapper1 = new mdpnp.rules.BinaryConditionWrapper(conditionFunction1, condition);
		var conditionFunction2 = function(){return 20;};
		var wrapper2 = new mdpnp.rules.BinaryConditionWrapper(conditionFunction2, condition);
		var conditionFunction3 = function(){return 50;};
		var wrapper3 = new mdpnp.rules.BinaryConditionWrapper(conditionFunction3, condition);
		
		var test1 = wrapper1.evaluate(70);
		expect(test1).toBeFalsy();
		expect(wrapper1.getMessage()).toEqual("condition failed: 70 == 50");
		
		var test2 = wrapper2.evaluate(20);
		expect(test2).toBeFalsy();
		expect(wrapper2.getMessage()).toEqual("condition failed: 20 == 50");
		
		var test3 = wrapper3.evaluate(50);
		expect(test3).toBeTruthy();
		expect(wrapper3.getMessage()).toEqual("condition passed");
	});
});

describe("not equal to condition test suite", function(){
	
	var condition;	
	
	beforeEach(function(){
		condition = new mdpnp.rules.NotEqualToCondition(50);
	});
	
	it('should be able to construct the condition properly', function(){		
		expect(condition.getMessage()).toEqual("condition not evaluated yet");
		expect(condition.getOperatorString()).toEqual("!=");
		expect(condition.getConditionValue()).toEqual(50);
	});
	
	it('should be able to evaluate the condition successfully', function(){	
		var test1 = condition.evaluate(70);
		expect(test1).toBeTruthy();
		expect(condition.getMessage()).toEqual("condition passed");
		
		var test2 = condition.evaluate(20);
		expect(test2).toBeTruthy();
		expect(condition.getMessage()).toEqual("condition passed");
		
		var test3 = condition.evaluate(50);
		expect(test3).toBeFalsy();
		expect(condition.getMessage()).toEqual("condition failed: 50 != 50");
	});
	
	it('should be able to wrap the condition in a condition wrapper', function(){
		
		var conditionFunction = function(){return 50;};
		var wrapper = new mdpnp.rules.BinaryConditionWrapper(conditionFunction, condition);

		expect(wrapper.getMessage()).toEqual("condition not evaluated yet");
		expect(wrapper.getOperatorString()).toEqual("!=");
		expect(wrapper.getConditionValue()).toEqual(50);
	});
	
	it('should be able to evaluate a wrapped condition successfully', function(){	
		var conditionFunction1 = function(){return 70;};
		var wrapper1 = new mdpnp.rules.BinaryConditionWrapper(conditionFunction1, condition);
		var conditionFunction2 = function(){return 20;};
		var wrapper2 = new mdpnp.rules.BinaryConditionWrapper(conditionFunction2, condition);
		var conditionFunction3 = function(){return 50;};
		var wrapper3 = new mdpnp.rules.BinaryConditionWrapper(conditionFunction3, condition);
		
		var test1 = wrapper1.evaluate(70);
		expect(test1).toBeTruthy();
		expect(wrapper1.getMessage()).toEqual("condition passed");
		
		var test2 = wrapper2.evaluate(20);
		expect(test2).toBeTruthy();
		expect(wrapper2.getMessage()).toEqual("condition passed");
		
		var test3 = wrapper3.evaluate(50);
		expect(test3).toBeFalsy();
		expect(wrapper3.getMessage()).toEqual("condition failed: 50 != 50");
	});
});


describe("exactly equal to test suite", function(){
	it('should be able to construct the condition properly', function(){
		var condition = new mdpnp.rules.ExactlyEqualToCondition(50);
		expect(condition.getMessage()).toEqual("condition not evaluated yet");
		expect(condition.getOperatorString()).toEqual("===");
		expect(condition.getConditionValue()).toEqual(50);
	});
	
	it('should be able to evaluate the condition successfully', function(){
		var condition1 = new mdpnp.rules.ExactlyEqualToCondition(50);
		var test1 = condition1.evaluate(50);
		expect(test1).toBeTruthy();
		expect(condition1.getMessage()).toEqual("condition passed");
		
		var test2 = condition1.evaluate(70);
		expect(test2).toBeFalsy();
		expect(condition1.getMessage()).toEqual("condition failed: 70 === 50");
		
		//now test with objects
		var obj = ["a","b","c",1,2,3];
		var obj2 = [1,2,3,"a","b","c"];
		var condition2 = new mdpnp.rules.ExactlyEqualToCondition(obj);
		
		var test3 = condition2.evaluate(obj);
		expect(test3).toBeTruthy();
		expect(condition2.getMessage()).toEqual("condition passed");
		
		var test4 = condition2.evaluate(obj2);
		expect(test4).toBeFalsy();
		expect(condition2.getMessage()).toEqual("condition failed: 1,2,3,a,b,c === a,b,c,1,2,3");
		
		//now test with strings
		var str = 'Hello Test!';
		var str2 = 'Goodbye Test!';
		var condition3 = new mdpnp.rules.ExactlyEqualToCondition(str);
		
		var test5 = condition3.evaluate(str);
		expect(test5).toBeTruthy();
		expect(condition3.getMessage()).toEqual("condition passed");
		
		var test6 = condition3.evaluate(str2);
		expect(test6).toBeFalsy();
		expect(condition3.getMessage()).toEqual("condition failed: Goodbye Test! === Hello Test!");
		
		//now test with booleans
		var bool  = true;
		var bool2 = false;
		var condition4 = new mdpnp.rules.ExactlyEqualToCondition(bool);
		
		var test7 = condition4.evaluate(bool);
		expect(test7).toBeTruthy();
		expect(condition4.getMessage()).toEqual("condition passed");
		
		var test8 = condition4.evaluate(bool2);
		expect(test8).toBeFalsy();
		expect(condition4.getMessage()).toEqual("condition failed: false === true");
		
		
	});
	
	it('should be able to wrap the condition in a condition wrapper', function(){
		var condition = new mdpnp.rules.ExactlyEqualToCondition(50);
		var conditionFunction = function(){return 50;};
		var wrapper = new mdpnp.rules.BinaryConditionWrapper(conditionFunction, condition);

		expect(wrapper.getMessage()).toEqual("condition not evaluated yet");
		expect(wrapper.getOperatorString()).toEqual("===");
		expect(wrapper.getConditionValue()).toEqual(50);
	});
	
	it('should be able to evaluate a wrapped condition successfully', function(){
		var condition1 = new mdpnp.rules.ExactlyEqualToCondition(50);
		var conditionFunction1 = function(){return 50;};
		var wrapper1 = new mdpnp.rules.BinaryConditionWrapper(conditionFunction1, condition1);
		var test1 = wrapper1.evaluate();
		expect(test1).toBeTruthy();
		expect(wrapper1.getMessage()).toEqual("condition passed");
		
		var conditionFunction2 = function(){return 70;};
		var wrapper2 = new mdpnp.rules.BinaryConditionWrapper(conditionFunction2, condition1);
		var test2 = wrapper2.evaluate();
		expect(test2).toBeFalsy();
		expect(wrapper2.getMessage()).toEqual("condition failed: 70 === 50");
		
		//now test with objects
		var obj = ["a","b","c",1,2,3];
		var obj2 = [1,2,3,"a","b","c"];
		var condition3 = new mdpnp.rules.ExactlyEqualToCondition(obj);
		var conditionFunction3 = function(){return obj;};
		var wrapper3 = new mdpnp.rules.BinaryConditionWrapper(conditionFunction3, condition3);
		
		var test3 = wrapper3.evaluate();
		expect(test3).toBeTruthy();
		expect(wrapper3.getMessage()).toEqual("condition passed");
		
		var conditionFunction4 = function(){return obj2;};
		var wrapper4 = new mdpnp.rules.BinaryConditionWrapper(conditionFunction4, condition3);
		
		var test4 = wrapper4.evaluate();
		expect(test4).toBeFalsy();
		expect(wrapper4.getMessage()).toEqual("condition failed: 1,2,3,a,b,c === a,b,c,1,2,3");
		
		//now test with strings
		var str = 'Hello Test!';
		var str2 = 'Goodbye Test!';
		var condition5 = new mdpnp.rules.ExactlyEqualToCondition(str);
		var conditionFunction5 = function(){return str;};
		var wrapper5 = new mdpnp.rules.BinaryConditionWrapper(conditionFunction5, condition5);
		
		var test5 = wrapper5.evaluate();
		expect(test5).toBeTruthy();
		expect(wrapper5.getMessage()).toEqual("condition passed");
		
		var conditionFunction6 = function(){return str2;};
		var wrapper6 = new mdpnp.rules.BinaryConditionWrapper(conditionFunction6, condition5);
		
		var test6 = wrapper6.evaluate();
		expect(test6).toBeFalsy();
		expect(wrapper6.getMessage()).toEqual("condition failed: Goodbye Test! === Hello Test!");
		
		//now test with booleans
		var bool = true;
		var bool2 = false;
		var condition7 = new mdpnp.rules.ExactlyEqualToCondition(bool);
		var conditionFunction7 = function(){return bool;};
		var wrapper7 = new mdpnp.rules.BinaryConditionWrapper(conditionFunction7, condition7);
		
		var test7 = wrapper7.evaluate();
		expect(test7).toBeTruthy();
		expect(wrapper7.getMessage()).toEqual("condition passed");
		
		var conditionFunction8 = function(){return bool2;};
		var wrapper8 = new mdpnp.rules.BinaryConditionWrapper(conditionFunction8, condition7);
		
		var test8 = wrapper8.evaluate();
		expect(test8).toBeFalsy();
		expect(wrapper8.getMessage()).toEqual("condition failed: false === true");
	});
});

describe("not exactly equal to test suite", function(){
	it('should be able to construct the condition properly', function(){
		var condition = new mdpnp.rules.NotExactlyEqualToCondition(50);
		expect(condition.getMessage()).toEqual("condition not evaluated yet");
		expect(condition.getOperatorString()).toEqual("!==");
		expect(condition.getConditionValue()).toEqual(50);
	});
	
	it('should be able to evaluate the condition successfully', function(){
		var condition1 = new mdpnp.rules.NotExactlyEqualToCondition(50);
		var test1 = condition1.evaluate(60);
		expect(test1).toBeTruthy();
		expect(condition1.getMessage()).toEqual("condition passed");
		
		var test2 = condition1.evaluate(50);
		expect(test2).toBeFalsy();
		expect(condition1.getMessage()).toEqual("condition failed: 50 !== 50");
		
		//now test with objects
		var obj = ["a","b","c",1,2,3];
		var obj2 = [1,2,3,"a","b","c"];
		var condition2 = new mdpnp.rules.NotExactlyEqualToCondition(obj);
		
		var test3 = condition2.evaluate(obj2);
		expect(test3).toBeTruthy();
		expect(condition2.getMessage()).toEqual("condition passed");
		
		var test4 = condition2.evaluate(obj);
		expect(test4).toBeFalsy();
		expect(condition2.getMessage()).toEqual("condition failed: a,b,c,1,2,3 !== a,b,c,1,2,3");
		
		//now test with strings
		var str = 'Hello Test!';
		var str2 = 'Goodbye Test!';
		var condition3 = new mdpnp.rules.NotExactlyEqualToCondition(str);
		
		var test5 = condition3.evaluate(str2);
		expect(test5).toBeTruthy();
		expect(condition3.getMessage()).toEqual("condition passed");
		
		var test6 = condition3.evaluate(str);
		expect(test6).toBeFalsy();
		expect(condition3.getMessage()).toEqual("condition failed: Hello Test! !== Hello Test!");
		
		//now test with booleans
		var bool  = true;
		var bool2 = false;
		var condition4 = new mdpnp.rules.NotExactlyEqualToCondition(bool);
		
		var test7 = condition4.evaluate(bool2);
		expect(test7).toBeTruthy();
		expect(condition4.getMessage()).toEqual("condition passed");
		
		var test8 = condition4.evaluate(bool);
		expect(test8).toBeFalsy();
		expect(condition4.getMessage()).toEqual("condition failed: true !== true");
		
	});
	
	it('should be able to wrap the condition in a condition wrapper', function(){
		var condition = new mdpnp.rules.NotExactlyEqualToCondition(50);
		var conditionFunction = function(){return 50;};
		var wrapper = new mdpnp.rules.BinaryConditionWrapper(conditionFunction, condition);

		expect(wrapper.getMessage()).toEqual("condition not evaluated yet");
		expect(wrapper.getOperatorString()).toEqual("!==");
		expect(wrapper.getConditionValue()).toEqual(50);
	});
	
	it('should be able to evaluate a wrapped condition successfully', function(){
		var condition1 = new mdpnp.rules.NotExactlyEqualToCondition(50);
		var conditionFunction1 = function(){return 70;};
		var wrapper1 = new mdpnp.rules.BinaryConditionWrapper(conditionFunction1, condition1);
		var test1 = wrapper1.evaluate();
		expect(test1).toBeTruthy();
		expect(wrapper1.getMessage()).toEqual("condition passed");
		
		var conditionFunction2 = function(){return 50;};
		var wrapper2 = new mdpnp.rules.BinaryConditionWrapper(conditionFunction2, condition1);
		var test2 = wrapper2.evaluate();
		expect(test2).toBeFalsy();
		expect(wrapper2.getMessage()).toEqual("condition failed: 50 !== 50");
		
		//now test with objects
		var obj = ["a","b","c",1,2,3];
		var obj2 = [1,2,3,"a","b","c"];
		var condition3 = new mdpnp.rules.NotExactlyEqualToCondition(obj);
		var conditionFunction3 = function(){return obj2;};
		var wrapper3 = new mdpnp.rules.BinaryConditionWrapper(conditionFunction3, condition3);
		
		var test3 = wrapper3.evaluate();
		expect(test3).toBeTruthy();
		expect(wrapper3.getMessage()).toEqual("condition passed");
		
		var conditionFunction4 = function(){return obj;};
		var wrapper4 = new mdpnp.rules.BinaryConditionWrapper(conditionFunction4, condition3);
		
		var test4 = wrapper4.evaluate();
		expect(test4).toBeFalsy();
		expect(wrapper4.getMessage()).toEqual("condition failed: a,b,c,1,2,3 !== a,b,c,1,2,3");
		
		//now test with strings
		var str = 'Hello Test!';
		var str2 = 'Goodbye Test!';
		var condition5 = new mdpnp.rules.NotExactlyEqualToCondition(str);
		var conditionFunction5 = function(){return str2;};
		var wrapper5 = new mdpnp.rules.BinaryConditionWrapper(conditionFunction5, condition5);
		
		var test5 = wrapper5.evaluate();
		expect(test5).toBeTruthy();
		expect(wrapper5.getMessage()).toEqual("condition passed");
		
		var conditionFunction6 = function(){return str;};
		var wrapper6 = new mdpnp.rules.BinaryConditionWrapper(conditionFunction6, condition5);
		
		var test6 = wrapper6.evaluate();
		expect(test6).toBeFalsy();
		expect(wrapper6.getMessage()).toEqual("condition failed: Hello Test! !== Hello Test!");
		
		//now test with boolean
		var bool = true;
		var bool2 = false;
		var condition7 = new mdpnp.rules.NotExactlyEqualToCondition(bool);
		var conditionFunction7 = function(){return bool2;};
		var wrapper7 = new mdpnp.rules.BinaryConditionWrapper(conditionFunction7, condition7);
		
		var test7 = wrapper7.evaluate();
		expect(test7).toBeTruthy();
		expect(wrapper7.getMessage()).toEqual("condition passed");
		
		var conditionFunction8 = function(){return bool;};
		var wrapper8 = new mdpnp.rules.BinaryConditionWrapper(conditionFunction8, condition7);
		
		var test8 = wrapper8.evaluate();
		expect(test8).toBeFalsy();
		expect(wrapper8.getMessage()).toEqual("condition failed: true !== true");
	});
});
