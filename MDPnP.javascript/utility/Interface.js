// adopted from Pro Javascript Design Patterns by Harmes and Diaz

/**
 * Constructs a new Interface object
 * @param name the name of the interface
 * @param methods an array of strings with one string per method name that the interface should implement
 * @constructor
 */
var Interface = function(name, methods) { 
    if(arguments.length != 2) { 
        throw new Error("Interface constructor called with " + arguments.length + "arguments, but expected exactly 2."); 
    } 
     
    this.name = name; 
    this.methods = [];
    for(var i = 0, len = methods.length; i < len; i++) { 
        if(typeof methods[i] !== 'string') { 
            throw new Error("Interface constructor expects method names to be passed in as a string."); 
        } 
        this.methods.push(methods[i]);         
    }     
};     
 
/**
 * Ensures that a given object implements a particular interface(s)
 * @param object an array of objects, with the first element being the object to check and the remaining elements the Interfaces that the first object should implement
 */ 
Interface.prototype.ensureImplements = function(object) { 
    if(arguments.length < 2) { 
        throw new Error("Function Interface.ensureImplements called with " + arguments.length  + "arguments, but expected at least 2."); 
    } 
 
    for(var i = 1, len = arguments.length; i < len; i++) { 
        var iface = arguments[i]; 
        if(iface.constructor !== Interface) { 
            throw new Error("Function Interface.ensureImplements expects arguments two and above to be instances of Interface."); 
        } 
         
        for(var j = 0, methodsLen = iface.methods.length; j < methodsLen; j++) { 
            var method = iface.methods[j]; 
            if(!object[method] || typeof object[method] !== 'function') { 
                throw new Error("Function Interface.ensureImplements: object does not implement the " + iface.name + " interface. Method " + method + " was not found."); 
            } 
        } 
    }  
};