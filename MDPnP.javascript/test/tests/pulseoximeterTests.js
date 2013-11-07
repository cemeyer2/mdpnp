describe("pulseOximeter test suite", function(){
	
	var now;	
	var data;
	var pulseOximeter;

	
	beforeEach(function(){
		now = new Date();
		condition = new mdpnp.rules.LessThanCondition(50);
		data = {
			'measurementTime': now,
			
			'type': 'PulseOximeter',
			'measurementType': 'heartrate',
			'heartRate': 78,
			'oxygenSaturationPercentage': 98,
			'disconnected': false,
			'outOfTrack': false,
			'artifact': false,
			'marginalPerfusion': false,
			'lowPerfusion': false,
			'fromValidSensor': false
		};
		now = new Date();
		var patient = new mdpnp.Patient('Steve Jobs', 'M', now);
        var controller = new mdpnp.Controller(patient); 
		pulseOximeter = new mdpnp.PulseOximeter('myPluseOxi', controller);
		
	});
	
	it('should be able to get information from a sensor', function(){	
		expect(pulseOximeter.getName()).toEqual('PulseOximeter');
		expect(pulseOximeter.getType()).toEqual('sensor');
		expect(pulseOximeter.isActuator()).toEqual(false);
		expect(pulseOximeter.isSensor()).toEqual(true);
		
		
	});
	
	
});