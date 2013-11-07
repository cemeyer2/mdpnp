mdpnp.gui.createPumpTab = function(controller, pump){
	
	if(pump.constructor == mdpnp.Pump){
		var labelText = pump.getPumpId();
		
		mdpnp.gui.deviceTabs.addTab(new YAHOO.widget.Tab({
			label: labelText,
			content: mdpnp.gui.createPumpTab(pump.getPumpId())
			}));
		mdpnp.gui.createPumpTabContent(pump.getPumpId());
	}
};

mdpnp.Event.on("controller:deviceAdded", this, mdpnp.gui.createPumpTab);

mdpnp.gui.createPumpTab = function(pumpId){
	return "<div id='"+pumpId+"_tab'></div>";
};

mdpnp.gui.createPumpTabContent = function(pumpId){
	
	var container = document.createElement("div");
	
	var statusArea = document.createElement("table");
	var headerRow = document.createElement("tr");
	var hcol1 = document.createElement("th");
	var hcol2 = document.createElement("th");
	hcol1.innerHTML = "Property";
	hcol2.innerHTML = "Value";
	headerRow.appendChild(hcol1);
	headerRow.appendChild(hcol2);
	statusArea.appendChild(headerRow);
	
	var statusRow = document.createElement("tr");
	var statusCol1 = document.createElement("td");
	var statusCol2 = document.createElement("td");
	statusCol1.innerHTML = "Status";
	statusRow.appendChild(statusCol1);
	statusRow.appendChild(statusCol2);
	statusArea.appendChild(statusRow);
	
	var diameterRow = document.createElement("tr");
	var diameterCol1 = document.createElement("td");
	var diameterCol2 = document.createElement("td");
	diameterCol1.innerHTML = "Diameter";
	diameterRow.appendChild(diameterCol1);
	diameterRow.appendChild(diameterCol2);
	statusArea.appendChild(diameterRow);
	
	var buzzingRow = document.createElement("tr");
	var buzzingCol1 = document.createElement("td");
	var buzzingCol2 = document.createElement("td");
	buzzingCol1.innerHTML = "Buzzing";
	buzzingRow.appendChild(buzzingCol1);
	buzzingRow.appendChild(buzzingCol2);
	statusArea.appendChild(buzzingRow);
	
	var rateRow = document.createElement("tr");
	var rateCol1 = document.createElement("td");
	var rateCol2 = document.createElement("td");
	rateCol1.innerHTML = "Pumping Rate";
	rateRow.appendChild(rateCol1);
	rateRow.appendChild(rateCol2);
	statusArea.appendChild(rateRow);
	
	var volInfRow = document.createElement("tr");
	var volInfCol1 = document.createElement("td");
	var volInfCol2 = document.createElement("td");
	volInfCol1.innerHTML = "Volume Infused";
	volInfRow.appendChild(volInfCol1);
	volInfRow.appendChild(volInfCol2);
	statusArea.appendChild(volInfRow);
	
	var volWdrRow = document.createElement("tr");
	var volWdrCol1 = document.createElement("td");
	var volWdrCol2 = document.createElement("td");
	volWdrCol1.innerHTML = "Volume Withdrawn";
	volWdrRow.appendChild(volWdrCol1);
	volWdrRow.appendChild(volWdrCol2);
	statusArea.appendChild(volWdrRow);
	
	var volRow = document.createElement("tr");
	var volCol1 = document.createElement("td");
	var volCol2 = document.createElement("td");
	volCol1.innerHTML = "Volume To Pump";
	volRow.appendChild(volCol1);
	volRow.appendChild(volCol2);
	statusArea.appendChild(volRow);
	
	var dirRow = document.createElement("tr");
	var dirCol1 = document.createElement("td");
	var dirCol2 = document.createElement("td");
	dirCol1.innerHTML = "Direction";
	dirRow.appendChild(dirCol1);
	dirRow.appendChild(dirCol2);
	statusArea.appendChild(dirRow);
	
	var enabledRow = document.createElement("tr");
	var enabledCol1 = document.createElement("td");
	var enabledCol2 = document.createElement("td");
	enabledCol1.innerHTML = "Is Pump Enabled";
	enabledRow.appendChild(enabledCol1);
	enabledRow.appendChild(enabledCol2);
	statusArea.appendChild(enabledRow);
	
	var runRow = document.createElement("tr");
	var runCol1 = document.createElement("td");
	var runCol2 = document.createElement("td");
	runCol1.innerHTML = "Most Recent Run Time";
	runRow.appendChild(runCol1);
	runRow.appendChild(runCol2);
	statusArea.appendChild(runRow);
	
	var errorRow = document.createElement("tr");
	var errorCol1 = document.createElement("td");
	var errorCol2 = document.createElement("td");
	errorCol1.innerHTML = "Error";
	errorRow.appendChild(errorCol1);
	errorRow.appendChild(errorCol2);
	statusArea.appendChild(errorRow);
	
	var buttonRow = document.createElement("tr");
	var buttonCol1 = document.createElement("td");
	var buttonCol2 = document.createElement("td");
	var updateStatusButton = document.createElement("input");
	updateStatusButton.setAttribute("type", "button");
	updateStatusButton.setAttribute("value", "Update Pump Status");
	buttonCol1.appendChild(updateStatusButton);
	buttonRow.appendChild(buttonCol1);
	buttonRow.appendChild(buttonCol2);
	statusArea.appendChild(buttonRow);
	
	var genericCallback = function(json){
		statusCol2.innerHTML = json.status;
		diameterCol2.innerHTML = json.diameter.amount+" "+json.diameter.units;
		buzzingCol2.innerHTML = json.buzzing;
		rateCol2.innerHTML = json.rate.amount+" "+json.rate.units;
		volInfCol2.innerHTML = json.volumeDispensed.inf.amount+" "+json.volumeDispensed.inf.units;
		volWdrCol2.innerHTML = json.volumeDispensed.wdr.amount+" "+json.volumeDispensed.wdr.units;
		volCol2.innerHTML = json.volumeToPump.amount+" "+json.volumeToPump.units;
		dirCol2.innerHTML = json.direction;
		enabledCol2.innerHTML = json.enabled;
		runCol2.innerHTML = json.mostRecentRunTime;
		errorCol2.innerHTML = json.error;
	};
	
	var statusClickHandler = function(){
		var controller = mdpnp.getEnv().getController();
		var pump = controller.getActuator(pumpId);
		pump.getStatus(genericCallback);
	};
	updateStatusButton.onclick = statusClickHandler;
	container.appendChild(statusArea);
	
	var br = document.createElement("br");
	container.appendChild(br);
	container.appendChild(br.cloneNode(false));
	
	var runButton = document.createElement("input");
	runButton.setAttribute("type", "button");
	runButton.setAttribute("value", "Request Pump To Run");
	var runButtonClickHandler = function(){
		var controller = mdpnp.getEnv().getController();
		var pump = controller.getActuator(pumpId);
		pump.requestToRun(genericCallback);
	};
	runButton.onclick = runButtonClickHandler;
	container.appendChild(runButton);
	
	container.appendChild(br.cloneNode(false));
	container.appendChild(br.cloneNode(false));
	
	var stopButton = document.createElement("input");
	stopButton.setAttribute("type","button");
	stopButton.setAttribute("value","Pause/Stop Pump");
	var stopButtonClickHandler = function(){
		var controller = mdpnp.getEnv().getController();
		var pump = controller.getActuator(pumpId);
		pump.stop(genericCallback);
	};
	stopButton.onclick = stopButtonClickHandler;
	container.appendChild(stopButton);
	
	container.appendChild(br.cloneNode(false));
	container.appendChild(br.cloneNode(false));
	
	var rateDiv = document.createElement("div");
	var rateLabel = document.createElement("label");
	rateLabel.innerHTML = "Rate Amount";
	rateDiv.appendChild(rateLabel);
	var rateAmount = document.createElement("input");
	rateAmount.setAttribute("type", "text");
	rateDiv.appendChild(rateAmount);
	rateDiv.appendChild(br.cloneNode(false));
	var rateUnitsLabel = document.createElement("label");
	rateUnitsLabel.innerHTML = "Rate Units";
	rateDiv.appendChild(rateUnitsLabel);
	var rateUnitsSelect = document.createElement("select");
	var rateMM = document.createElement("option");
	var rateMH = document.createElement("option");
	var rateUM = document.createElement("option");
	var rateUH = document.createElement("option");
	rateMM.setAttribute("value", "MM");
	rateMH.setAttribute("value", "MH");
	rateUM.setAttribute("value", "UM");
	rateUH.setAttribute("value", "UH");
	rateMM.innerHTML = "MM";
	rateMH.innerHTML = "MH";
	rateUM.innerHTML = "UM";
	rateUH.innerHTML = "UH";
	rateUnitsSelect.appendChild(rateMM);
	rateUnitsSelect.appendChild(rateMH);
	rateUnitsSelect.appendChild(rateUM);
	rateUnitsSelect.appendChild(rateUH);
	rateDiv.appendChild(rateUnitsSelect);
	rateDiv.appendChild(br.cloneNode(false));
	var rateButton = document.createElement("input");
	rateButton.setAttribute("type", "button");
	rateButton.setAttribute("value", "Set Pumping Rate");
	rateDiv.appendChild(rateButton);
	var rateClickHandler = function(){
		var controller = mdpnp.getEnv().getController();
		var pump = controller.getActuator(pumpId);
		var rate = rateAmount.value;
		var units = rateUnitsSelect.value;
		pump.setRate(rate,units,genericCallback);
		rateAmount.value = "";
	};
	rateButton.onclick = rateClickHandler;
	container.appendChild(rateDiv);
	
	container.appendChild(br.cloneNode(false));
	container.appendChild(br.cloneNode(false));
	
	var volDiv = document.createElement("div");
	var volLabel = document.createElement("label");
	volLabel.innerHTML = "Volume to Pump Amount";
	volDiv.appendChild(volLabel);
	var volAmount = document.createElement("input");
	volAmount.setAttribute("type", "text");
	volDiv.appendChild(volAmount);
	volDiv.appendChild(br.cloneNode(false));
	var volUnitsLabel = document.createElement("label");
	volUnitsLabel.innerHTML = "Volume To Pump Units";
	volDiv.appendChild(volUnitsLabel);
	var volUnitsSelect = document.createElement("select");
	var volML = document.createElement("option");
	var volUL = document.createElement("option");
	volML.setAttribute("value", "ML");
	volUL.setAttribute("value", "UL");
	volML.innerHTML = "ML";
	volUL.innerHTML = "UL";
	volUnitsSelect.appendChild(volML);
	volUnitsSelect.appendChild(volUL);
	volDiv.appendChild(volUnitsSelect);
	volDiv.appendChild(br.cloneNode(false));
	var volButton = document.createElement("input");
	volButton.setAttribute("type", "button");
	volButton.setAttribute("value", "Set Volume To Pump");
	volDiv.appendChild(volButton);
	var volClickHandler = function(){
		var controller = mdpnp.getEnv().getController();
		var pump = controller.getActuator(pumpId);
		var vol = volAmount.value;
		var units = volUnitsSelect.value;
		pump.setVolumeToPump(vol,units,genericCallback);
		volAmount.value = "";
	};
	volButton.onclick = volClickHandler;
	container.appendChild(volDiv);
	
	container.appendChild(br.cloneNode(false));
	container.appendChild(br.cloneNode(false));
	
	var buzzOn = document.createElement("input");
	buzzOn.setAttribute("type", "button");
	buzzOn.setAttribute("value","Turn on Pump Buzzer");
	var buzzOnClickHandler = function(){
		var controller = mdpnp.getEnv().getController();
		var pump = controller.getActuator(pumpId);
		pump.buzzOn(genericCallback);
	};
	buzzOn.onclick = buzzOnClickHandler;
	container.appendChild(buzzOn);
	
	container.appendChild(br.cloneNode(false));
	
	var buzzOff = document.createElement("input");
	buzzOff.setAttribute("type", "button");
	buzzOff.setAttribute("value","Turn off Pump Buzzer");
	var buzzOffClickHandler = function(){
		var controller = mdpnp.getEnv().getController();
		var pump = controller.getActuator(pumpId);
		pump.buzzOff(genericCallback);
	};
	buzzOff.onclick = buzzOffClickHandler;
	container.appendChild(buzzOff);
	
	container.appendChild(br.cloneNode(false));
	container.appendChild(br.cloneNode(false));
	
	var diameterDiv = document.createElement("div");
	var diameterLabel = document.createElement("label");
	diameterLabel.innerHTML = "Diameter Amount (MM)";
	diameterDiv.appendChild(diameterLabel);
	var diameterAmount = document.createElement("input");
	diameterAmount.setAttribute("type","text");
	diameterDiv.appendChild(diameterAmount);
	diameterDiv.appendChild(br.cloneNode(false));
	var diameterButton = document.createElement("input");
	diameterButton.setAttribute("type", "button");
	diameterButton.setAttribute("value", "Set Diameter");
	diameterDiv.appendChild(diameterButton);
	var diameterClickHandler = function(){
		var controller = mdpnp.getEnv().getController();
		var pump = controller.getActuator(pumpId);
		pump.setDiameter(diameterAmount.value,genericCallback);
		diameterAmount.value = "";
	};
	diameterButton.onclick = diameterClickHandler;
	container.appendChild(diameterDiv);
	
	container.appendChild(br.cloneNode(false));
	container.appendChild(br.cloneNode(false));
	
	var dirDiv = document.createElement("div");
	var dirLabel = document.createElement("label");
	dirLabel.innerHTML = "Pump Direction";
	dirDiv.appendChild(dirLabel);
	var dirSelect = document.createElement("select");
	var dirInf = document.createElement("option");
	var dirWdr = document.createElement("option");
	dirInf.setAttribute("value", "INF");
	dirWdr.setAttribute("value", "WDR");
	dirInf.innerHTML = "Infuse";
	dirWdr.innerHTML = "Withdraw";
	dirSelect.appendChild(dirInf);
	dirSelect.appendChild(dirWdr);
	dirDiv.appendChild(dirSelect);
	dirDiv.appendChild(br.cloneNode(false));
	var dirButton = document.createElement("input");
	dirButton.setAttribute("type", "button");
	dirButton.setAttribute("value", "Set Direction");
	dirDiv.appendChild(dirButton);
	var dirClickHandler = function(){
		var controller = mdpnp.getEnv().getController();
		var pump = controller.getActuator(pumpId);
		pump.setDirection(dirSelect.value,genericCallback);
	};
	dirButton.onclick = dirClickHandler;
	container.appendChild(dirDiv);
	
	container.appendChild(br.cloneNode(false));
	container.appendChild(br.cloneNode(false));
	
	var clearButton = document.createElement("input");
	clearButton.setAttribute("type","button");
	clearButton.setAttribute("value","Clear Volume Dispensed Counters");
	container.appendChild(clearButton);
	var clearClickHandler = function(){
		var controller = mdpnp.getEnv().getController();
		var pump = controller.getActuator(pumpId);
		pump.clearVolumeDispensedCounters(genericCallback);
	};
	clearButton.onclick = clearClickHandler;
	
	document.getElementById(pumpId+"_tab").appendChild(container);
	
	statusClickHandler();
};