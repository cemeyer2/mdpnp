YAHOO.widget.Chart.SWFURL = "http://yui.yahooapis.com/2.7.0/build/charts/assets/charts.swf"; 

mdpnp.gui = {};

mdpnp.gui.initializeTabs = function (){
	mdpnp.gui.mainTabs = new YAHOO.widget.TabView("tabs"); 
	mdpnp.gui.rulesTabs = new YAHOO.widget.TabView("rules_tabs");
	mdpnp.gui.deviceTabs = new YAHOO.widget.TabView("devices_tabs");
	mdpnp.gui.patientTabs = new YAHOO.widget.TabView("patient_tabs");
};

mdpnp.gui.empty = function(node){
	while(node.childNodes[0]){
		node.removeChild(node.childNodes[0]);
	}
};

mdpnp.gui.XmlHttpRequest = XMLHttpRequest;

//Provide the XMLHttpRequest class for IE 5.x-6.x:
//yeah, i stole this from jasmine
if (typeof XMLHttpRequest == "undefined") mdpnp.gui.XmlHttpRequest = function() {
	try {
		return new ActiveXObject("Msxml2.XMLHTTP.6.0");
	} catch(e) {
	}
	try {
		return new ActiveXObject("Msxml2.XMLHTTP.3.0");
	} catch(e) {
	}
	try {
		return new ActiveXObject("Msxml2.XMLHTTP");
	} catch(e) {
	}
	try {
		return new ActiveXObject("Microsoft.XMLHTTP");
	} catch(e) {
	}
	throw new Error("This browser does not support XMLHttpRequest.");
};

mdpnp.gui.includePage = function(url, toContainerId) {

	var xhr;
	try {
		xhr = new mdpnp.gui.XmlHttpRequest();
		xhr.open("GET", url, false);
		xhr.send(null);
	} catch(e) {
		throw new Error("couldn't fetch " + url + ": " + e);
	}
	//for some reason, onreadystatechange callback not working on my ff with firebug
	if (xhr.readyState==4)
	{// 4 = "loaded"
		if (xhr.status==200)
		{// 200 = "OK"
			var node = document.getElementById(toContainerId);
			if(node === undefined){
				throw new Error("cannot load data into a container that does not exist");
			}
			node.innerHTML = xhr.responseText;
		}
	}
	mdpnp.Event._fire("gui:includeComplete",url,toContainerId);
};

YAHOO.util.Event.addListener(window, "load", function() { 
	mdpnp.Event.registerAllEvents();

	mdpnp.gui.initializeTabs();
	mdpnp.gui.includePage("controller_tabs/controllerTab.html","main_tab_1");
	mdpnp.gui.includePage("patient_tabs/createPatientTab.html","patient_tab_1");
	mdpnp.gui.includePage("patient_tabs/patientHeartRateTab.html","patient_tab_2");
	mdpnp.gui.includePage("patient_tabs/patientOxygenSaturationTab.html","patient_tab_3");
	mdpnp.gui.includePage("rules_tabs/conditionFunctionsTab.html","rules_tab_1");
	mdpnp.gui.includePage("rules_tabs/conditionsTab.html","rules_tab_2");
	mdpnp.gui.includePage("rules_tabs/successFailureFunctionsTab.html","rules_tab_3");
	mdpnp.gui.includePage("rules_tabs/composeRulesTab.html", "rules_tab_4");
	mdpnp.gui.includePage("rules_tabs/attachRulesTab.html","rules_tab_5");
	

	mdpnp.gui.initializeDataTables();
	mdpnp.gui.initializeCharts();
	mdpnp.gui.initializeConditionFunctionsTab();
	mdpnp.gui.initializeConditionsTab();
	mdpnp.gui.initializeSuccessFailureFunctionsTab();
	mdpnp.gui.initializeComposeRulesTab();
	document.getElementById("patient_dob").innerHTML = mdpnp.gui.createPatientDobSelectBoxes();
	mdpnp.gui.initializeAttachRulesTab();
});
