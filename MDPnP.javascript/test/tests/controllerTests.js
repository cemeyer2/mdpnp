var ct;

describe('controller test suite 1', function(){ 
 
 		var patient;
        var controller; 
        var now; 
		var pump0;
		var rule;
		var ruleResult;
 
        beforeEach(function(){ 
            now = new Date();
            patient = new mdpnp.Patient('Steve Jobs', 'M', now);
            controller = new mdpnp.Controller(patient); 
			
			var ruleSuccess = function(){
				ruleResult = 'rule passed';
			};

			var ruleFail = function(){
				ruleResult = 'rule failed';
			};

			var getMostRecentHeartRate = function(){return 75;};
  
  			//fails here
  			var binaryCondition1 = new mdpnp.rules.LessThanOrEqualsCondition(90);
  			var binaryConditionWrapper1 = new mdpnp.rules.BinaryConditionWrapper(getMostRecentHeartRate, binaryCondition1);
  
  			var binaryCondition2 = new mdpnp.rules.GreaterThanOrEqualsCondition(60);
  			var binaryConditionWrapper2 = new mdpnp.rules.BinaryConditionWrapper(getMostRecentHeartRate, binaryCondition2);
  
  			rule = new mdpnp.rules.CompositeRule(ruleSuccess, ruleFail);
  			rule.addCondition(binaryConditionWrapper1);
  			rule.addCondition(binaryConditionWrapper2);
  
  			//clear out the event handler list
  			mdpnp.Event._eventHandlers = [];
  			controller.addRule("test:dummyEvent",rule);
  			mdpnp.Event._fire("test:dummyEvent");
			
        }); 
         
        it('should return the matching patient', function() { 
            expect(controller.getPatient()).toEqual(patient); 
        }); 
 
        it('should the number of rules which is one', function() {
            expect(controller.getRuleCount()).toEqual(1); 
        });
		
		it('should return the rule at index 0', function() {
            expect(controller.getRule(0).rule).toEqual(rule); 
        });
		
		it('should return that the rule passed', function() {
			waits(250);
			runs(function(){
				expect(ruleResult).toEqual('rule passed'); 
			});
            
        });
		
    }); 
 