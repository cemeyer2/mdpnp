/**
 * mock blood glucose monitor
 * @param {String} id the identifier of this 
 */
mdpnp.MockBloodGlucoseMonitor = function(id, controller){
	
	
	var po = this;
	var timer;
	//var isError = false;
	var isOutOfBounds = false;
	
	var name = "MockBloodGlucoseMonitor";

	mdpnp.MockBloodGlucoseMonitor.superclass.constructor.call(this,name,controller);
	
	var createBG = function(){
		if(isOutOfBounds) {
			var bg = Math.round(Math.random() * 30) + 170;
			return bg;
		} else {
			var bg = Math.round(Math.random() * 30) + 105;
			return bg;
		}
	};
	
	var createMeasurement = function(){
	 
		 var bg = createBG();
		 
		 var measurement = {};
		 measurement.type = "measurement";
		 measurement.measurementType = "BloodGlucose";
		 measurement.bloodGlucose = bg;
		 measurement.outOfTrack = isError;
		 measurement.artifact = isError;
		 measurement.marginalPerfusion = isError;
		 measurement.lowPerfusion = isError;
		 measurement.fromValidSensor = true;
		 
		 var vital = new mdpnp.BGVitalSign(measurement, po);
		 
		 mdpnp.Event._fire("BloodGlucoseMonitor:newVitalSign", po, measurement);
		 controller.addVitalSign(vital);
	};
	
	this.startPolling = function(){
		timer = setInterval(createMeasurement,1000);
	};
	
	this.stopPolling = function(){
		clearInterval(timer);
	};
	

};
extend(mdpnp.MockBloodGlucoseMonitor, mdpnp.Sensor);