mdpnp.gui.initializeSuccessFailureFunctionsTab = function(){
	for(var func in mdpnp.rules.successFailureFunctions){
		var text = mdpnp.rules.successFailureFunctions[func].getName();
		var info = mdpnp.rules.successFailureFunctions[func].getInfo();
		
		var clickClosure = function(t,i){
			return function(){
				var panel = new YAHOO.widget.Panel("panel", { width:"320px", visible:false, draggable:true, close:true } );
				panel.setHeader(t);
				panel.setBody(i);
				panel.setFooter("MDPnP Success/Failure Function");
				panel.render("successFailureFunctionsTab");
				panel.show();
			};
		};
		
		var button = mdpnp.gui.createButton(text, func+"_info_button",clickClosure(text,info));
		
		document.getElementById("successFailureFunctionsTab").appendChild(button);
		document.getElementById("successFailureFunctionsTab").appendChild(document.createElement("br"));
	}
};