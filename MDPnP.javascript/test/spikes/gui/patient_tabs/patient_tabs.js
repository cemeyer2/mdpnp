mdpnp.gui.createPatient = function(){
	var name = document.patient_create.patient_name.value;
	var day = document.patient_create.patient_day.value;
	var month = document.patient_create.patient_month.value;
	var year = document.patient_create.patient_year.value;
	var sex = document.patient_create.patient_sex.value;

	var date = new Date();
	date.setDate(day);
	date.setFullYear(year);
	date.setMonth(month);

	var patient = new mdpnp.Patient(name, sex, date);

	mdpnp.gui.includePage("patient_tabs/patientInfoTab.html", "patient_tab_1");

	document.getElementById("patient_name").innerHTML = patient.getName();
	document.getElementById("patient_dob").innerHTML = patient.getDateOfBirth().toString();
	document.getElementById("patient_age").innerHTML = patient.getAge();
	document.getElementById("patient_sex").innerHTML = (patient.getSex() == "M") ? "Male" : "Female";

	mdpnp.getEnv().setPatient(patient);
};

mdpnp.gui.createPatientDobSelectBoxes = function(){
	var retval = "";
	retval += "month:";
	var s1 = "<select name='patient_month'>";
	for(var i = 0; i < 12; i++) {
		s1 += "<option value='"+(i)+"'>"+(i+1)+"</option>";
	}
	s1 += "</select>";
	retval+=s1;
	retval+="day:";
	var s2 = "<select name='patient_day'>";
	for(var i = 1; i <= 31; i++) {
		s2 += "<option value='"+i+"'>"+i+"</option>";
	}
	s2 += "</select>";
	retval += s2;
	retval += "year:";
	var s3 = "<select name='patient_year'>";
	for(var i = 1900; i < 2010; i++){
		s3 += "<option value='"+i+"'>"+i+"</option>";
	}
	s3 += "</select>";
	retval += s3;
	return retval;
};

mdpnp.gui.initializeDataTables = function() {
	var initPatientHeartRateTable = function() {
		var columnDefs = [
		                  {key:"timestamp", label:"timestamp", resizeable:true,sortable:true},
		                  {key:"heartRate", label: "heart rate", resizeable:true, sortable:true},
		                  {key:"disconnected", label:"disconnected", resizeable:true},
		                  {key:"outOfTrack", label:"out of track", resizeable:true},
		                  {key:"artifact",label:"artifact",resizable:true},
		                  {key:"marginalPerfusion",label:"marginal perfusion",resizable:true},
		                  {key:"lowPerfusion",label:"low perfusion",resizable:true}
		                  ];
		mdpnp.gui.patientHeartRateDataSource = new YAHOO.util.DataSource([]);
		mdpnp.gui.patientHeartRateDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
		mdpnp.gui.patientHeartRateDataSource.responseSchema = {fields: ["timestamp","heartRate","disconnected", "outOfTrack", "artifact","marginalPerfusion","lowPerfusion"]};

		mdpnp.gui.patientHeartRateDataTable = new YAHOO.widget.ScrollingDataTable("heartRateDataTable", columnDefs, mdpnp.gui.patientHeartRateDataSource, {height:"25em"});

	};

	var initPatientOxygenSaturationDataTable = function() {
		var columnDefs = [
		                  {key:"timestamp", label:"timestamp", resizeable:true,sortable:true},
		                  {key:"oxygenSaturationPercentage", label: "oxygen saturation %", resizeable:true, sortable:true},
		                  {key:"disconnected", label:"disconnected", resizeable:true},
		                  {key:"outOfTrack", label:"out of track", resizeable:true},
		                  {key:"artifact",label:"artifact",resizable:true},
		                  {key:"marginalPerfusion",label:"marginal perfusion",resizable:true},
		                  {key:"lowPerfusion",label:"low perfusion",resizable:true}
		                  ];
		mdpnp.gui.patientOxygenSaturationDataSource = new YAHOO.util.DataSource([]);
		mdpnp.gui.patientOxygenSaturationDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
		mdpnp.gui.patientOxygenSaturationDataSource.responseSchema = {fields: ["timestamp","oxygenSaturationPercentage","disconnected", "outOfTrack", "artifact","marginalPerfusion","lowPerfusion"]};

		mdpnp.gui.patientOxygenSaturationDataTable = new YAHOO.widget.ScrollingDataTable("oxygenSaturationDataTable", columnDefs, mdpnp.gui.patientOxygenSaturationDataSource, {height:"25em"});

	};

	initPatientHeartRateTable();
	initPatientOxygenSaturationDataTable();
};

mdpnp.gui.initializeCharts = function () {
	var initPatientHeartRateChart = function(){
		var seriesDef = 
			[
				{ displayName: "Heart Rate", yField: "heartRate" },
			];
		var yaxis = new YAHOO.widget.NumericAxis();
		yaxis.minimum = 0;
		yaxis.maximum = 200;
		
		var getDataTipText = function( item, index, series ){
			var toolTipText = series.displayName + " for " + item.timestamp;
			toolTipText += "\n" + item[series.yField];
			return toolTipText;
		};
		mdpnp.gui.patientHeartRateChart = new YAHOO.widget.LineChart( "heartRateChart", mdpnp.gui.patientHeartRateDataSource,
				{
					xField: "timestamp",
					series: seriesDef,
					yAxis: yaxis,
					dataTipFunction: getDataTipText,
					polling: 5000
				});
	};
	
	var initPatientOxygenSaturationChart = function(){
		var seriesDef = 
			[
				{ displayName: "Oxygen Saturation %", yField: "oxygenSaturationPercentage" },
			];
		var yaxis = new YAHOO.widget.NumericAxis();
		yaxis.minimum = 0;
		yaxis.maximum = 100;
		
		var getDataTipText = function( item, index, series ){
			var toolTipText = series.displayName + " for " + item.timestamp;
			toolTipText += "\n" + item[series.yField];
			return toolTipText;
		};
		mdpnp.gui.patientOxygenSaturationChart = new YAHOO.widget.LineChart( "oxygenSaturationChart", mdpnp.gui.patientOxygenSaturationDataSource,
				{
					xField: "timestamp",
					series: seriesDef,
					yAxis: yaxis,
					dataTipFunction: getDataTipText,
					polling: 5000
				});
	};
	
	initPatientHeartRateChart();
	initPatientOxygenSaturationChart();
};


//move these somewhere better later
var newSPO2VitalSign = function(pulseOximeter, vitalSign){
	if(vitalSign.getTimestamp().getSeconds() % 5 == 0) {
		var data1 = {	timestamp:vitalSign.getTimestamp(),
				heartRate:vitalSign.getHeartRate(),
				disconnected:vitalSign.isDisconnected(),
				outOfTrack:vitalSign.isOutOfTrack(),
				artifact:vitalSign.isArtifact(),
				lowPerfusion:vitalSign.isLowPerfusion(),
				marginalPerfusion:vitalSign.isMarginalPerfusion()};
		
		var data2 = {	timestamp:vitalSign.getTimestamp(),
				oxygenSaturationPercentage:vitalSign.getOxygenSaturationPercentage(),
				disconnected:vitalSign.isDisconnected(),
				outOfTrack:vitalSign.isOutOfTrack(),
				artifact:vitalSign.isArtifact(),
				lowPerfusion:vitalSign.isLowPerfusion(),
				marginalPerfusion:vitalSign.isMarginalPerfusion()};
	
		mdpnp.gui.patientHeartRateDataTable.addRow(data1,0);
		
		//mdpnp.gui.patientHeartRateChart.refreshData();
		mdpnp.gui.patientOxygenSaturationDataTable.addRow(data2,0);
		
		var arr = [];
		var rs = mdpnp.gui.patientHeartRateDataTable.getRecordSet();
		
		for(var i = 0; i < rs.getLength(); i++){
			arr.push(rs.getRecord(i).getData());
		};
		var ds = mdpnp.gui.patientHeartRateChart.get("dataSource");
		ds.liveData = arr;
		mdpnp.gui.patientHeartRateChart.set("dataSource", ds);
		
		arr = [];
		rs = mdpnp.gui.patientOxygenSaturationDataTable.getRecordSet();
		
		for(var i = 0; i < rs.getLength(); i++){
			arr.push(rs.getRecord(i).getData());
		};
		var ds = mdpnp.gui.patientOxygenSaturationChart.get("dataSource");
		ds.liveData = arr;
		mdpnp.gui.patientOxygenSaturationChart.set("dataSource", ds);
		
	}
	
	var records = mdpnp.gui.patientHeartRateDataTable.getRecordSet();
	var records_count = records.getLength();
		
	if(records_count > 60){
		mdpnp.gui.patientHeartRateDataTable.deleteRow(records_count-1);
	}
	
	records = mdpnp.gui.patientOxygenSaturationDataTable.getRecordSet();
	records_count = records.getLength();
	
	if(records_count > 60){
		mdpnp.gui.patientOxygenSaturationDataTable.deleteRow(records_count-1);
	}

};

mdpnp.Event.on("PulseOximeter:newVitalSign", this, newSPO2VitalSign);