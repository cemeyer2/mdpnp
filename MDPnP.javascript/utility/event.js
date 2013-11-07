/*global mdpnp, console, setTimeout */
/**
 * Event subsystem for mdpnp. Simplier than the one that
 * comes with yui 3.
 * @constructor
 */
mdpnp.Event = function(){};

mdpnp.Event._eventHandlers = [];
mdpnp.Event._registeredEvents = [];

/**
 * binds an event handler to an event
 * @param {String} event the name of the event to bind to
 * @param {Object} context the context that the event will be fired in
 * @param {Function} func the function to be executed when the event fires
 */
mdpnp.Event.on = function(event, context, func){
	if(mdpnp.Event._eventHandlers[event] === undefined){
		mdpnp.Event._eventHandlers[event] = [];
	}
	var obj = {fun:func, ctext:context};
	mdpnp.Event._eventHandlers[event].push(obj);
};

/**
 * removes the first found instance of a hander from an event
 * @param {String} event the event to which you want to remove a handler
 * @param {Function} the function that is being removed
 * @return {Boolean} true if the function was found and removed, false otherwise
 */
mdpnp.Event.remove = function(event, func){
	var handlers= mdpnp.Event._eventHandlers[event];
	if(handlers === undefined){
		return false;
	}
	for(var i = 0; i < handlers.length; i++){
		if(handlers[i].fun === func){
			handlers.remove(i);
			return true;
		}
	}
	return false;
};

mdpnp.Event._fire =	function(event, args){
	var handlers = mdpnp.Event._eventHandlers[event]; //could add || [] but rather avoid the block below if there are no handlers
	if(!(handlers === undefined)){
		for(var i = 0; i < handlers.length; i++){
			var func = handlers[i].fun;
			var context = handlers[i].ctext;
			var a = [];
			for(var j = 1; j < arguments.length; j++){
				a[j-1] = arguments[j];
			}
			var closure = function(fn, ct, argarr){
				var f = function(){ 
					try{
						fn.apply(ct, argarr);
					} catch(err) {
						mdpnp.log("error caught in handler while firing event: "+event+": "+err.message);
						if(err.stack) {
							mdpnp.log(err.stack);
						};
					}
				};
				setTimeout(f,10);
			}(func,context,a);
			
		}
	}
};

/**
 * registers an event with the Events framework
 * @param {String} event the name of the event to register
 * @param {String} desc a description of the event
 * @return void
 */
mdpnp.Event.registerEvent = function(event,desc){
	var objLiteral = {
			name:event,
			description:desc
	};
	mdpnp.Event._registeredEvents.push(objLiteral);
};

mdpnp.Event.getRegisteredEvents = function(){
	return mdpnp.Event._registeredEvents;
};

mdpnp.Event.registerAllEvents = function(namespace, depth){
	if(namespace === undefined){
		namespace = mdpnp;
	}
	if(depth === undefined){
		depth = 0;
	}
	if(depth < 4)
	{
		for(var key in namespace){
			if(key && namespace[key] && (typeof namespace[key] == "function"))
			{
				if(namespace[key].registerEvents){
					namespace[key].registerEvents();
				}
				mdpnp.Event.registerAllEvents(namespace[key],depth+1);
			}
		}
	}
};