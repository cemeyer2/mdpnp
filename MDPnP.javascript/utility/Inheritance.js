/**
 * Causes a given subclass to extend a superclass
 * @param subClass the subclass
 * @param superClass the superclass
 */
var extend = function(subClass, superClass){
	var F = function(){};
	F.prototype = superClass.prototype;
	subClass.prototype = new F();
	subClass.prototype.constructor = subClass;
	
	subClass.superclass = superClass.prototype;
	
	if(superClass.prototype.constructor == Object.prototype.constructor){
		superClass.prototype.constructor = superClass;
	}
};