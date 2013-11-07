describe('event tests suite 1',function(){
	
	var dummyHandler;
	var event;
	var event2;
	var event3;
	var spy1;
	var spy2;
	var spy3;
	var that;
	
	beforeEach(function(){
		dummyHandler = function(){};
		event = "test:dummyEvent";
		event2 = "test:dummyEvent2";
		event3 = "test:dummyEvent3";
		spy1 = jasmine.createSpy('spy1');
		spy2 = jasmine.createSpy('spy2');
		spy3 = jasmine.createSpy('spy3');
		mdpnp.Event._eventHandlers[event] = [];
		mdpnp.Event._eventHandlers[event2] = [];
		mdpnp.Event._eventHandlers[event3] = [];
		that = this;
	});
	
	it('should be able to register a handler', function(){
		
		mdpnp.Event.on(event,this,dummyHandler);
		expect(mdpnp.Event._eventHandlers[event].length).toEqual(1);
	});
	
	it('should be able to remove a registered handler', function(){
		mdpnp.Event.on(event,this,dummyHandler);
		var removed = mdpnp.Event.remove(event,dummyHandler);
		expect(removed).toBeTruthy();
	});
	
	it('should do nothing if caller tries to remove a handler that is not registered', function(){
		var removed = mdpnp.Event.remove(event, spy1);
		expect(removed).toBeFalsy();
	});
	
	it('should call a handler when an event is fired', function(){
		mdpnp.Event.on(event,this,spy1);
		mdpnp.Event._fire(event);
		waits(100);
		runs(function(){
			expect(spy1).wasCalled();
		});
	});
	
	it('should call a handler when an event is fired and pass back arguments from source', function(){
		mdpnp.Event.on(event, this, spy1);
		var foo = 1;
		var bar = "a";
		mdpnp.Event._fire(event, foo, bar);
		waits(100);
		runs(function(){
			expect(spy1).wasCalledWith(foo,bar);
		});
	});
	
	it('should be able to fire the same event multiple times', function(){
		mdpnp.Event.on(event, this, spy1);
		var times = 100;
		for(var i = 0; i < times; i++){
			mdpnp.Event._fire(event);
		};
		waits(100);
		runs(function(){
			expect(spy1.callCount).toEqual(times);
		});
	});
	
	it('should be able to pass different arguments each time an event is fired', function(){
		mdpnp.Event.on(event, this, spy1);
		var times = 100;
		var args = [];
		for(var i = 0; i < times; i++){
			args[i] = [];
			var argCount = parseInt(10*Math.random());
			args[i][0] = event;
			for(var j = 1; j < argCount; j++){
				args[i][j] = Math.random();
			};
			mdpnp.Event._fire.apply(this,args[i]);
		};
		waits(100);
		runs(function(){
			for(var i = 0; i < times; i++){
				expect(spy1.argsForCall[i]).toEqual(args[i].slice(1));
			};
		});
	});
	
	it('should be able to attach one handler to multiple events', function(){
		mdpnp.Event.on(event, this, spy1);
		mdpnp.Event.on(event2, this, spy1);
		mdpnp.Event.on(event3, this, spy1);
		
		expect(mdpnp.Event._eventHandlers[event].length).toEqual(1);
		expect(mdpnp.Event._eventHandlers[event2].length).toEqual(1);
		expect(mdpnp.Event._eventHandlers[event3].length).toEqual(1);
	});
	
	it('should be able to fire multiple different events using the same handler', function(){
		mdpnp.Event.on(event, this, spy1);
		mdpnp.Event.on(event2, this, spy1);
		mdpnp.Event.on(event3, this, spy1);
		mdpnp.Event._fire(event);
		mdpnp.Event._fire(event2);
		mdpnp.Event._fire(event3);
		waits(100);
		runs(function(){
			expect(spy1).wasCalled();
			expect(spy1.callCount).toEqual(3);
		});
	});
	
	it('should be able to fire multiple different events using different handlers', function(){
		mdpnp.Event.on(event, this, spy1);
		mdpnp.Event.on(event2, this, spy2);
		mdpnp.Event.on(event3, this, spy3);
		mdpnp.Event._fire(event);
		mdpnp.Event._fire(event2);
		mdpnp.Event._fire(event3);
		waits(100);
		runs(function(){
			expect(spy1).wasCalled();
			expect(spy1.callCount).toEqual(1);
			expect(spy2).wasCalled();
			expect(spy2.callCount).toEqual(1);
			expect(spy3).wasCalled();
			expect(spy3.callCount).toEqual(1);
		});
	});
	
	it('should be able to add the same handler to the same event multiple times', function(){
		mdpnp.Event.on(event, this, spy1);
		mdpnp.Event.on(event, this, spy1);
		expect(mdpnp.Event._eventHandlers[event].length).toEqual(2);
	});
	
	it('should be able to add the same handler to the same event multiple times with different contexts', function(){
		mdpnp.Event.on(event, this, spy1);
		mdpnp.Event.on(event, that, spy2);
		expect(mdpnp.Event._eventHandlers[event].length).toEqual(2);
	});
	
	it('should only delete the first instance found if the same function is registered multiple times', function(){
		mdpnp.Event.on(event, this, spy1);
		mdpnp.Event.on(event, this, spy1);
		mdpnp.Event.on(event, this, spy1);
		var removed = false;
		expect(mdpnp.Event._eventHandlers[event].length).toEqual(3);
		removed = mdpnp.Event.remove(event, spy1);
		expect(removed).toBeTruthy();
		removed = false;
		expect(mdpnp.Event._eventHandlers[event].length).toEqual(2);
		removed = mdpnp.Event.remove(event, spy1);
		expect(removed).toBeTruthy();
		removed = false;
		expect(mdpnp.Event._eventHandlers[event].length).toEqual(1);
		removed = mdpnp.Event.remove(event, spy1);
		expect(removed).toBeTruthy();
		removed = false;
		expect(mdpnp.Event._eventHandlers[event].length).toEqual(0);
	});
	
	it('should be able to run different handlers for the same event', function(){
		var errorSpy = jasmine.createSpy('error spy').andThrow("Error");
		mdpnp.Event.on(event, this, spy1);
		mdpnp.Event.on(event, this, spy2);
		mdpnp.Event.on(event, this, spy3);
		mdpnp.Event._fire(event);
		waits(100);
		runs(function(){
			expect(spy1).wasCalled();
			expect(spy2).wasCalled();
			expect(spy3).wasCalled();
		});
	});
	
	it('should not stop other events from being fired if one handler throws an Error', function(){
		var errorSpy = jasmine.createSpy('error spy').andThrow("Error");
		mdpnp.Event.on(event, this, spy1);
		mdpnp.Event.on(event, this, errorSpy);
		mdpnp.Event.on(event, this, spy2);
		mdpnp.Event._fire(event);
		waits(100);
		runs(function(){
			expect(spy1).wasCalled();
			expect(errorSpy).wasCalled();
			expect(spy2).wasCalled();
		});
	});
	
	
	
});