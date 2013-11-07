mdpnp.gui.initializeEventsTable = function(){
	var table = document.getElementById("eventsTable");
	mdpnp.gui.empty(table);
	var header = document.createElement("tr");
	var hcol1 = document.createElement("th");
	hcol1.innerHTML = "Event Name";
	var hcol2 = document.createElement("th");
	hcol2.innerHTML = "Event Description";
	header.appendChild(hcol1);
	header.appendChild(hcol2);
	table.appendChild(header);
	
	var events = mdpnp.Event.getRegisteredEvents();
	for(var i = 0; i < events.length; i = i+1){
		var row = document.createElement("tr");
		var col1 = document.createElement("td");
		col1.innerHTML = events[i].name;
		var col2 = document.createElement("td");
		col2.innerHTML = events[i].description;
		row.appendChild(col1);
		row.appendChild(col2);
		table.appendChild(row);
	}
};

mdpnp.gui.initializeRulesSelectBox = function(){
	var box = document.getElementById("ruleSelectBox");
	mdpnp.gui.empty(box);
	for(var i = 0; i < mdpnp.gui.rules.length; i=i+1){
		var rule = mdpnp.gui.rules[i];
		var option = document.createElement("option");
		option.setAttribute("value", i);
		option.innerHTML = rule.getDescription();
		box.appendChild(option);
	}	
};

mdpnp.gui.initializeEventsSelectBox = function(){
	var box = document.getElementById("eventSelectBox");
	mdpnp.gui.empty(box);
	var events = mdpnp.Event.getRegisteredEvents();
	for(var i = 0; i < events.length; i=i+1){
		var option = document.createElement("option");
		option.setAttribute("value", i);
		option.innerHTML = events[i].name;
		box.appendChild(option);
	}	
};

mdpnp.gui.initializeAttachRuleButton = function(){
	var button = document.getElementById("attachRuleButton");
	var clickHandler = function(){
		if(document.getElementById("ruleSelectBox").childNodes.length == 0){
			alert("cannot attach rule:\n\nmust have a rule constructed before it can be attached");
			return;
		}
		var event = mdpnp.Event.getRegisteredEvents()[parseInt(document.getElementById("eventSelectBox").value)].name;
		var rule = mdpnp.gui.rules[parseInt(document.getElementById("ruleSelectBox").value)];
		var controller;
		try{
			controller = mdpnp.getEnv().getController();
		} catch(err){
			alert("cannot attach rule:\n\n"+err.message);
			return;
		}
		controller.addRule(event,rule);
		mdpnp.gui.initializeAttachedRulesTable();
	};
	button.onclick = clickHandler;
};

mdpnp.gui.initializeAttachedRulesTable = function(){
	var table = document.getElementById("attachedRulesTable");
	mdpnp.gui.empty(table);
	var header = document.createElement("tr");
	var hcol1 = document.createElement("th");
	hcol1.innerHTML = "Attached Rule";
	var hcol2 = document.createElement("th");
	hcol2.innerHTML = "Event";
	var hcol3 = document.createElement("th");
	header.appendChild(hcol1);
	header.appendChild(hcol2);
	header.appendChild(hcol3);
	table.appendChild(header);
	var controller;
	try{
		controller = mdpnp.getEnv().getController();
	} catch (err){
		return;
	}
	var removeClosureCreator = function(index){
		return function(){
			var controller = mdpnp.getEnv().getController();
			var ruleClosure = controller.getRule(index);
			var removed = controller.removeRule(ruleClosure);
			if(removed == false){
				alert("error removing rule!");
			}
			mdpnp.gui.initializeAttachedRulesTable();
		};
	};
	for(var i = 0; i < controller.getRuleCount(); i=i+1) {
		var ruleClosure = controller.getRule(i);
		var row = document.createElement("tr");
		var col1 = document.createElement("td");
		col1.innerHTML = ruleClosure.rule.getDescription();
		var col2 = document.createElement("td");
		col2.innerHTML = ruleClosure.event;
		var col3 = document.createElement("td");
		var del = document.createElement("input");
		del.setAttribute("type", "button");
		del.setAttribute("value", "Detach Rule");
		del.onclick = removeClosureCreator(i);
		col3.appendChild(del);
		
		row.appendChild(col1);
		row.appendChild(col2);
		row.appendChild(col3);
		table.appendChild(row);
	}
};

mdpnp.gui.initializeAttachRulesTab = function(){
	mdpnp.gui.initializeEventsTable();
	mdpnp.gui.initializeRulesSelectBox();
	mdpnp.gui.initializeEventsSelectBox();
	mdpnp.gui.initializeAttachRuleButton();
	mdpnp.gui.initializeAttachedRulesTable();
};
