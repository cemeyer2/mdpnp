var VitalSign = function(_heartRate, _oxigenSaturationPercentage, timeInMillis)
{
	var heartRate, oxigenSaturationPercentage, time;
	
	var setHeartRate = function(_hr)
	{
		heartRate = _hr;
	};
	
	var setOxigenSaturationPercentage = function(_o)
	{
		oxigenSaturationPercentage = _o;
	};
	
	var setTime = function(_millis)
	{
		time = new Date();
		time.setTime(_millis);
	};
	
	this.getHeartRate = function()
	{
		return heartRate;
	};
	
	this.getOxigenSaturationPercentage = function()
	{
		return oxigenSaturationPercentage;
	};
	
	//gets the time that this vital sign was constructed
	//as a javascript Date object
	this.getTime = function()
	{
		return time;
	};
	
	//constructor
	setHeartRate(_heartRate);
	setOxigenSaturationPercentage(_oxigenSaturationPercentage);
	setTime(timeInMillis);
};