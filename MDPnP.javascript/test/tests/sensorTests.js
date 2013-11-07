describe("sensor test suite", function(){
	
	var now;	
	var data;
	var sensor;

	
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
		sensor = new mdpnp.Sensor('sensorName', controller);
		
	});
	
	it('should be able to get information from a sensor', function(){	
		expect(sensor.getName()).toEqual('sensorName');
		expect(sensor.getType()).toEqual('sensor');
		expect(sensor.isActuator()).toEqual(false);
		expect(sensor.isSensor()).toEqual(true);
		
		
	});
	
	
});