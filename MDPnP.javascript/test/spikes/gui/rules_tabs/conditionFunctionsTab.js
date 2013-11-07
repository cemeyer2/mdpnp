mdpnp.gui.initializeConditionFunctionsTab = function(){
	for(var func in mdpnp.rules.conditionFunctions){
		var text = mdpnp.rules.conditionFunctions[func].getName();
		var info = mdpnp.rules.conditionFunctions[func].getInfo();
		
		var clickClosure = function(t,i){
			return function(){
				var panel = new YAHOO.widget.Panel("panel", { width:"320px", visible:false, draggable:true, close:true } );
				panel.setHeader(t);
				panel.setBody(i);
				panel.setFooter("MDPnP Condition Function");
				panel.render("conditionFunctions");
				panel.show();
			};
		};
		
		var button = mdpnp.gui.createButton(text, func+"_info_button",clickClosure(text,info));
		
		document.getElementById("conditionFunctions").appendChild(button);
		document.getElementById("conditionFunctions").appendChild(document.createElement("br"));
	}
};

mdpnp.gui.createButton = function(text, id, onclick){
	var button = document.createElement("input");
	button.setAttribute("type", "button");
	button.setAttribute("value", text);
	button.onclick = onclick;
	return button;
};