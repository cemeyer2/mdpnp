describe("UC1 rules test suite", function(){
	
	var now;	
	var data;
	var pulseOximeter;
	var controller;
	var beforeStatus;
	var pump;
	mdpnp.rules.UC1.initRulesForUC1();

	
	beforeEach(function(){

		now = new Date();
		var patient = new mdpnp.Patient('Steve Jobs', 'M', now);
		mdpnp.getEnv().setPatient(patient);
        controller = new mdpnp.Controller(patient); 
		pulseOximeter = new mdpnp.MockPulseOximeter('myPluseOxi', controller);
		mdpnp.MockController.get().addMockSPO2();
		
	});
	
	it('test pumpReady rule failure', function(){
		var status;
		var returnStatus = function(s){
			status = s;
		};
		pump = new mdpnp.Pump("pump0");
		runs(function(){
			pump.setRate("100","MH", returnStatus);
		});
		waits(2250);
		runs(function(){
			pump.setVolumeToPump("0.100","ML", returnStatus);
		});
		waits(2250);
		runs(function(){
			pump.stop(returnStatus);
		});
		waits(2250);
		runs(function(){
			pump.stop(returnStatus);
		});
		waits(2250);
		runs(function(){
			pump.clearVolumeDispensedCounters(returnStatus);
		});
		waits(2250);
		runs(function(){
			pump.setDirection("INF", returnStatus);
		});
		
		pulseOximeter.setIsError(true);
		waits(2250);
		expect(pump.isEnabled()).toEqual(false);	
	});
	
	it('test pumpReady rule success', function(){
		var status;
		var returnStatus = function(s){
			status = s;
		};
		
		pulseOximeter.setIsError(false);
		waits(2250);
		expect(pump.isEnabled()).toEqual(true);	
	});
	
	it('test startPump rule failure', function(){
		var status;
		var returnStatus = function(s){
			status = s;
		};
		
		pulseOximeter.setIsError(true);
		waits(2250);
		expect(pump.isEnabled()).toEqual(false);
		expect(pump.isRequestingToRun()).toEqual(false);	
	});
	
	it('test startPump rule success', function(){
		var status;
		var returnStatus = function(s){
			status = s;
		};
		
		pulseOximeter.setIsError(false);
		waits(2250);
		expect(pump.isRequestingToRun()).toEqual(true);	
		
	});
	
	it('test normalPumpingOperation rule failure', function(){
		var status;
		var returnStatus = function(s){
			status = s;
		};
		
		pulseOximeter.setIsOutOfBounds(true);
		waits(2250);
		expect(pump.isEnabled()).toEqual(false);	
		
	});
	
	it('test normalPumpingOperation rule success', function(){
		var status;
		var returnStatus = function(s){
			status = s;
		};
		
		pulseOximeter.setIsOutOfBounds(false);
		waits(2250);
		expect(pump.isEnabled()).toEqual(true);	
		
	});
	
	it('test vitalSignsOutOfRange rule failure', function(){
		var status;
		var returnStatus = function(s){
			status = s;
		};
		
		pulseOximeter.setIsOutOfBounds(false);
		waits(2250);
		expect(pump.isEnabled()).toEqual(true);	
		
	});
	
	it('test vitalSignsOutOfRange rule success', function(){
		var status;
		var returnStatus = function(s){
			status = s;
		};
		
		pulseOximeter.setIsOutOfBounds(true);
		waits(2250);
		expect(pump.isEnabled()).toEqual(false);	
		
	});

	
	
	
});