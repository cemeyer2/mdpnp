describe("mockPulseOximeter test suite", function(){
	
	var now;	
	var data;
	var pulseOximeter;
	var controller;

	
	beforeEach(function(){
		now = new Date();
		condition = new mdpnp.rules.LessThanCondition(50);
		data = {
			'measurementTime': now,
			
			'type': 'MockPulseOximeter',
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
		mdpnp.getEnv().setPatient(patient);
        controller = new mdpnp.Controller(patient); 
		pulseOximeter = new mdpnp.MockPulseOximeter('myPluseOxi', controller);
		mdpnp.MockController.get().addMockSPO2();
		
	});
	
	it('should be able to get information from a sensor', function(){	
		expect(pulseOximeter.getName()).toEqual('MockPulseOximeter');
		expect(pulseOximeter.getType()).toEqual('sensor');
		expect(pulseOximeter.isActuator()).toEqual(false);
		expect(pulseOximeter.isSensor()).toEqual(true);
		waits(2250);
		//expect(controller.getDevice[0].sensor_id).toEqual("mockSPO2_0");
		
		
	});
	
	
});