describe('pump test suite 1', function(){
	
	var beforeStatus;
	var pump;
	
	it('should set up reasonable defaults for testing', function(){
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
			pump.setDirection("WDR", returnStatus);
		});
		waits(2250);
		runs(function(){
			expect(status).toBeDefined();
		});
	});
	
	it('should save pump state before run', function(){
		runs(function(){
			var returnStatus = function(s){
				beforeStatus = s;
			};
			
			pump.getStatus(returnStatus);
		});
		waits(2500);
		runs(function(){
			expect(beforeStatus).toBeDefined();
		});
	});
	
	it('should be able to set the pump direction to infuse', function(){
		var status;
		var returnStatus = function(s){
			status = s;
		};
		runs(function(){
			pump.setDirection("INF", returnStatus);
		});
		waits(2250);
		runs(function(){
			expect(status.direction).toEqual("INF");
		});
	});
	
	it('should be able to set the pump direction to withdraw', function(){
		var status;
		var returnStatus = function(s){
			status = s;
		};
		runs(function(){
			pump.setDirection("WDR", returnStatus);
		});
		waits(2250);
		runs(function(){
			expect(status.direction).toEqual("WDR");
		});
	});
	
	it('should not change the direction when invalid parameter supplied', function(){
		var status;
		var returnStatus = function(s){
			status = s;
		};
		runs(function(){
			pump.getStatus(returnStatus);
		});
		waits(2250);
		var originalDirection;
		runs(function(){
			originalDirection = status.direction;
			pump.setDirection("invalid", returnStatus);
		});
		waits(2250);
		runs(function(){
			expect(status.direction).toEqual(originalDirection);
			expect(status.error).toBeDefined();
		});
	});
	
	it('should report correct status when withdrawing', function(){
		var status;
		var returnStatus = function(s){
			status = s;
		};
		runs(function(){
			pump.setDirection("WDR", returnStatus);
		});
		waits(1000);
		runs(function(){
			pump.stop(returnStatus);
		});
		waits(1000);
		runs(function(){
			pump.stop(returnStatus);
		});
		waits(1000);
		runs(function(){
			pump.run(returnStatus);
		});
		waits(1000);
		runs(function(){
			expect(status).toBeDefined();
			expect(status.status).toEqual("withdrawing");
			pump.stop(returnStatus);
		});
		waits(1000);
		runs(function(){
			expect(status.status).toEqual("paused");
			pump.stop(returnStatus);
		});
		waits(1000);
		runs(function(){
			expect(status.status).toEqual("stopped");
		});
	});
	
	it('should report correct status when infusing', function(){
		var status;
		var returnStatus = function(s){
			status = s;
		};
		runs(function(){
			pump.setDirection("INF", returnStatus);
		});
		waits(1000);
		runs(function(){
			pump.stop(returnStatus);
		});
		waits(1000);
		runs(function(){
			pump.stop(returnStatus);
		});
		waits(1000);
		runs(function(){
			pump.run(returnStatus);
		});
		waits(1000);
		runs(function(){
			expect(status).toBeDefined();
			expect(status.status).toEqual("infusing");
			pump.stop(returnStatus);
		});
		waits(1000);
		runs(function(){
			expect(status.status).toEqual("paused");
			pump.stop(returnStatus);
		});
		waits(1000);
		runs(function(){
			expect(status.status).toEqual("stopped");
		});
	});
	
	it('should be able to set volume to pump to UL', function(){
		var status;
		var returnStatus = function(s){
			status = s;
		};
		runs(function(){
			pump.setVolumeToPump("0.750","UL", returnStatus);
		});
		waits(2250);
		runs(function(){
			expect(status).toBeDefined();
			expect(status.volumeToPump.amount).toEqual("0.750");
			expect(status.volumeToPump.units).toEqual("UL");
		});
	});
	
	it('should be able to set volume to pump to ML', function(){
		var status;
		var returnStatus = function(s){
			status = s;
		};
		runs(function(){
			pump.setVolumeToPump("0.500","ML", returnStatus);
		});
		waits(2250);
		runs(function(){
			expect(status).toBeDefined();
			expect(status.volumeToPump.amount).toEqual("0.500");
			expect(status.volumeToPump.units).toEqual("ML");
		});
	});
	
	it('should not change the volume to pump on invalid units', function(){
		var status;
		var returnStatus = function(s){
			status = s;
		};
		runs(function(){
			pump.setVolumeToPump("0.500","invalid", returnStatus);
		});
		waits(2250);
		runs(function(){
			expect(status).toBeDefined();
			expect(status.error).toBeDefined();
			expect(status.volumeToPump.amount).toEqual("0.500");
			expect(status.volumeToPump.units).toEqual("ML");
		});
	});
	
	it('should not change the volume to pump on invalid volume', function(){
		var status;
		var returnStatus = function(s){
			status = s;
		};
		runs(function(){
			pump.setVolumeToPump("invalid","ML", returnStatus);
		});
		waits(2250);
		runs(function(){
			expect(status).toBeDefined();
			expect(status.error).toBeDefined();
			expect(status.volumeToPump.amount).toEqual("0.500");
			expect(status.volumeToPump.units).toEqual("ML");
		});
	});
	
	it('should be able to set the pumping rate in UM', function(){
		var status;
		var returnStatus = function(s){
			status = s;
		};
		runs(function(){
			pump.setRate('10.12',"UM",returnStatus);
		});
		waits(2250);
		runs(function(){
			expect(status).toBeDefined();
			expect(status.rate.amount).toEqual("10.12");
			expect(status.rate.units).toEqual("UM");
		});
	});
	
	it('should be able to set the pumping rate in MM', function(){
		var status;
		var returnStatus = function(s){
			status = s;
		};
		runs(function(){
			pump.setRate('1.000',"MM",returnStatus);
		});
		waits(2250);
		runs(function(){
			expect(status).toBeDefined();
			expect(status.rate.amount).toEqual("1.000");
			expect(status.rate.units).toEqual("MM");
		});
	});
	
	it('should be able to set the pumping rate in UH', function(){
		var status;
		var returnStatus = function(s){
			status = s;
		};
		runs(function(){
			pump.setRate('12.34',"UH",returnStatus);
		});
		waits(2250);
		runs(function(){
			expect(status).toBeDefined();
			expect(status.rate.amount).toEqual("12.34");
			expect(status.rate.units).toEqual("UH");
		});
	});
	
	it('should be able to set the pumping rate in MH', function(){
		var status;
		var returnStatus = function(s){
			status = s;
		};
		runs(function(){
			pump.setRate('10.12',"MH",returnStatus);
		});
		waits(2250);
		runs(function(){
			expect(status).toBeDefined();
			expect(status.rate.amount).toEqual("10.12");
			expect(status.rate.units).toEqual("MH");
		});
	});
	
	it('should cause error and not change volume when volume out of range is supplied', function(){
		var status;
		var returnStatus = function(s){
			status = s;
		};
		runs(function(){
			pump.setRate('50',"MM",returnStatus);
		});
		waits(2250);
		runs(function(){
			expect(status).toBeDefined();
			expect(status.error).toBeDefined();
			expect(status.rate.amount).toEqual("10.12");
			expect(status.rate.units).toEqual("MH");
		});
	});
	
	it('should set the rate back to a reasonable value for further tests', function(){
		var status;
		var returnStatus = function(s){
			status = s;
		};
		runs(function(){
			pump.setRate('100',"MH",returnStatus);
		});
		waits(2250);
		runs(function(){
			expect(status).toBeDefined();
			expect(status.rate.amount).toEqual("100.0");
			expect(status.rate.units).toEqual("MH");
		});
	});
	
	it('should pump a specified amount when run (infusing) (ML)', function(){
		var status;
		var returnStatus = function(s){
			status = s;
		};
		runs(function(){
			pump.setDirection("INF", returnStatus);
		});
		waits(2250);
		runs(function(){
			expect(status).toBeDefined();
			expect(status.direction).toEqual("INF");
			pump.setVolumeToPump("0.100","ML", returnStatus);
		});
		waits(2250);
		runs(function(){
			expect(status.volumeToPump.amount).toEqual("0.100");
			expect(status.volumeToPump.units).toEqual("ML");
			pump.clearVolumeDispensedCounters(returnStatus);
		});
		waits(2250);
		runs(function(){
			expect(status.volumeDispensed.inf.amount).toEqual("0.000");
			expect(status.volumeDispensed.inf.units).toEqual("ML");
			expect(status.volumeDispensed.wdr.amount).toEqual("0.000");
			expect(status.volumeDispensed.wdr.units).toEqual("ML");
			pump.run(returnStatus);
		});
		waits(7500); //.1 ml at 100MH house only take 3.6 seconds, but 7.5 to be safe
		runs(function(){
			pump.getStatus(returnStatus);
		})
		waits(2250);
		runs(function(){
			expect(status.volumeDispensed.inf.amount).toEqual("0.100");
			expect(status.volumeDispensed.inf.units).toEqual("ML");
		});
	});
	
	it('should pump a specified amount when run (withdrawing) (ML)', function(){
		var status;
		var returnStatus = function(s){
			status = s;
		};
		runs(function(){
			pump.setDirection("WDR", returnStatus);
		});
		waits(2250);
		runs(function(){
			expect(status).toBeDefined();
			expect(status.direction).toEqual("WDR");
			pump.setVolumeToPump("0.100","ML", returnStatus);
		});
		waits(2250);
		runs(function(){
			expect(status.volumeToPump.amount).toEqual("0.100");
			expect(status.volumeToPump.units).toEqual("ML");
			pump.clearVolumeDispensedCounters(returnStatus);
		});
		waits(2250);
		runs(function(){
			expect(status.volumeDispensed.inf.amount).toEqual("0.000");
			expect(status.volumeDispensed.inf.units).toEqual("ML");
			expect(status.volumeDispensed.wdr.amount).toEqual("0.000");
			expect(status.volumeDispensed.wdr.units).toEqual("ML");
			pump.run(returnStatus);
		});
		waits(7500); //.1 ml at 100MH house only take 3.6 seconds, but 7.5 to be safe
		runs(function(){
			pump.getStatus(returnStatus);
		})
		waits(2250);
		runs(function(){
			expect(status.volumeDispensed.inf.amount).toEqual("0.100");
			expect(status.volumeDispensed.inf.units).toEqual("ML");
		});
	});
	
	it('should pump a specified amount when run (infusing) (UL)', function(){
		var status;
		var returnStatus = function(s){
			status = s;
		};
		runs(function(){
			pump.setDirection("INF", returnStatus);
		});
		waits(2250);
		runs(function(){
			expect(status).toBeDefined();
			expect(status.direction).toEqual("INF");
			pump.setVolumeToPump("10","UL", returnStatus);
		});
		waits(2250);
		runs(function(){
			expect(status.volumeToPump.amount).toEqual("10.00");
			expect(status.volumeToPump.units).toEqual("UL");
			pump.clearVolumeDispensedCounters(returnStatus);
		});
		waits(2250);
		runs(function(){
			expect(status.volumeDispensed.inf.amount).toEqual("0.000");
			expect(status.volumeDispensed.inf.units).toEqual("UL");
			expect(status.volumeDispensed.wdr.amount).toEqual("0.000");
			expect(status.volumeDispensed.wdr.units).toEqual("UL");
			pump.run(returnStatus);
		});
		waits(7500); //.1 ml at 100MH house only take 3.6 seconds, but 7.5 to be safe
		runs(function(){
			pump.getStatus(returnStatus);
		})
		waits(2250);
		runs(function(){
			expect(status.volumeDispensed.inf.amount).toEqual("10.00");
			expect(status.volumeDispensed.inf.units).toEqual("UL");
		});
	});
	
	it('should restore the pump after tests', function(){
		var status;
		var returnStatus = function(s){
			status = s;
		};
		runs(function(){
			pump.setDirection(beforeStatus.direction, returnStatus);
		});
		waits(2250);
		runs(function(){
			pump.setDiameter(beforeStatus.diameter.amount, returnStatus);
		});
		waits(2250);
		runs(function(){
			pump.setRate(beforeStatus.rate.amount, beforeStatus.rate.units, returnStatus);
		});
		waits(2250);
		runs(function(){
			pump.setVolumeToPump(beforeStatus.volumeToPump.amount, beforeStatus.volumeToPump.units, returnStatus);
		});
		waits(2250);
		runs(function(){
			expect(status).toBeDefined();
			expect(status.direction).toEqual(beforeStatus.direction);
			expect(status.diameter).toEqual(beforeStatus.diameter);
			expect(status.rate.amount).toEqual(beforeStatus.rate.amount);
			expect(status.rate.units).toEqual(beforeStatus.rate.units);
			expect(status.volumeToPump.amount).toEqual(beforeStatus.volumeToPump.amount);
			expect(status.volumeToPump.units).toEqual(beforeStatus.volumeToPump.units);
		});
	});
});