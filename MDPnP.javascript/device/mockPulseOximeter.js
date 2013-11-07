/**
 * mock pulse oximeter
 * @param {String} id the identifier of this 
 * @author Charlie Meyer
 */
mdpnp.MockPulseOximeter = function(id, controller){
	
	
	var po = this;
	var timer;
	var isError = false;
	var isOutOfBounds = false;
	
	var name = "MockPulseOximeter";

	mdpnp.MockPulseOximeter.superclass.constructor.call(this,name,id,controller);
	
	var createO2 = function(){
		if(isError == true){
			var o2 = Math.round(Math.random() * 10) + 100;
			return o2;
		} else if(isOutOfBounds) {
			var o2 = Math.round(Math.random() * 10) + 60;
			return o2;
		} else {
			var o2 = Math.round(Math.random() * 3) + 96;
			return o2;
		}
	};
	
	var createHR = function(){
		if(isError == true){
			return 512;
		} else if(isOutOfBounds) {
			var hr = Math.round(Math.random() * 10) + 25;
			return hr;
		} else {
			var hr = Math.round(Math.random()*10)+80;
			return hr;
		}
	};
	
	var createMeasurement = function(){
	 
		 var o2 = createO2();
		 var hr = createHR();
		 
		 var measurement = {};
		 measurement.type = "measurement";
		 measurement.measurementType = "SPO2";
		 measurement.heartRate = hr;
		 measurement.oxygenSaturationPercentage = o2;
		 measurement.outOfTrack = isError;
		 measurement.artifact = isError;
		 measurement.marginalPerfusion = isError;
		 measurement.lowPerfusion = isError;
		 measurement.fromValidSensor = true;
		 
		 var vital = new mdpnp.SPO2VitalSign(measurement, po);
		 
		 mdpnp.Event._fire("PulseOximeter:newVitalSign", po, measurement);
		 controller.addVitalSign(vital);
	};
	
	this.startPolling = function(){
		timer = setInterval(createMeasurement,1000);
	};
	
	this.stopPolling = function(){
		clearInterval(timer);
	};
	
	this.setIsOutOfBounds = function(outOfBounds){
		isOutOfBounds = outOfBounds;
	};
	
	this.setIsError = function(error){
		isError = error;
	};
	

};
extend(mdpnp.MockPulseOximeter, mdpnp.Sensor);