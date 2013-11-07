//assume conditions are stored in mdpnp.gui.conditions array
//create arrays of drag drop objects and targets
mdpnp.gui.ddtargets = [];
mdpnp.gui.ddobjects = [];
//store success and failure functions here since for...in loops are
//not guaranteed to return in the same order each time
mdpnp.gui.successFailureFunctions = [];

//store created rules here
mdpnp.gui.rules = [];

//adopted from example on yui page
mdpnp.gui.DDList = function(id, sGroup, config) {
    mdpnp.gui.DDList.superclass.constructor.call(this, id, sGroup, config);
    this.logger = this.logger || YAHOO;
    var el = this.getDragEl();
    YAHOO.util.Dom.setStyle(el, "opacity", 0.67); // The proxy is slightly transparent
    this.goingUp = false;
    this.lastY = 0;
};

YAHOO.extend(mdpnp.gui.DDList, YAHOO.util.DDProxy, {

    startDrag: function(x, y) {
        this.logger.log(this.id + " startDrag");

        // make the proxy look like the source element
        var dragEl = this.getDragEl();
        var clickEl = this.getEl();
        YAHOO.util.Dom.setStyle(clickEl, "visibility", "hidden");

        dragEl.innerHTML = clickEl.innerHTML;

        YAHOO.util.Dom.setStyle(dragEl, "color", YAHOO.util.Dom.getStyle(clickEl, "color"));
        YAHOO.util.Dom.setStyle(dragEl, "backgroundColor", YAHOO.util.Dom.getStyle(clickEl, "backgroundColor"));
        YAHOO.util.Dom.setStyle(dragEl, "border", "2px solid gray");
    },

    endDrag: function(e) {

        var srcEl = this.getEl();
        var proxy = this.getDragEl();

        // Show the proxy element and animate it to the src element's location
        YAHOO.util.Dom.setStyle(proxy, "visibility", "");
        var a = new YAHOO.util.Motion( 
            proxy, { 
                points: { 
                    to: YAHOO.util.Dom.getXY(srcEl)
                }
            }, 
            0.2, 
            YAHOO.util.Easing.easeOut 
        )
        var proxyid = proxy.id;
        var thisid = this.id;

        // Hide the proxy and show the source element when finished with the animation
        a.onComplete.subscribe(function() {
        	YAHOO.util.Dom.setStyle(proxyid, "visibility", "hidden");
        	YAHOO.util.Dom.setStyle(thisid, "visibility", "");
            });
        a.animate();
    },

    onDragDrop: function(e, id) {

        // If there is one drop interaction, the li was dropped either on the list,
        // or it was dropped on the current location of the source element.
        if (YAHOO.util.DragDropMgr.interactionInfo.drop.length === 1) {

            // The position of the cursor at the time of the drop (YAHOO.util.Point)
            var pt = YAHOO.util.DragDropMgr.interactionInfo.point; 

            // The region occupied by the source element at the time of the drop
            var region = YAHOO.util.DragDropMgr.interactionInfo.sourceRegion; 

            // Check to see if we are over the source element's location.  We will
            // append to the bottom of the list once we are sure it was a drop in
            // the negative space (the area of the list without any list items)
            if (!region.intersect(pt)) {
                var destEl = YAHOO.util.Dom.get(id);
                var destDD = YAHOO.util.DragDropMgr.getDDById(id);
                destEl.appendChild(this.getEl());
                destDD.isEmpty = false;
                YAHOO.util.DragDropMgr.refreshCache();
            }

        }
    },

    onDrag: function(e) {

        // Keep track of the direction of the drag for use during onDragOver
        var y = YAHOO.util.Event.getPageY(e);

        if (y < this.lastY) {
            this.goingUp = true;
        } else if (y > this.lastY) {
            this.goingUp = false;
        }

        this.lastY = y;
    },

    onDragOver: function(e, id) {
    
        var srcEl = this.getEl();
        var destEl = YAHOO.util.Dom.get(id);

        // We are only concerned with list items, we ignore the dragover
        // notifications for the list.
        if (destEl.nodeName.toLowerCase() == "li") {
            var orig_p = srcEl.parentNode;
            var p = destEl.parentNode;

            if (this.goingUp) {
                p.insertBefore(srcEl, destEl); // insert above
            } else {
                p.insertBefore(srcEl, destEl.nextSibling); // insert below
            }

            YAHOO.util.DragDropMgr.refreshCache();
        }
    }
});


mdpnp.gui.loadConditionsIntoComposeRules = function(){
	var container = document.getElementById("conditionsNotInRule");
	var container2= document.getElementById("conditionsInRule");
	
	//empty container
	while(container.childNodes[0]){
		container.removeChild(container.childNodes[0]);
	}
	while(container2.childNodes[0]){
		container2.removeChild(container2.childNodes[0]);
	}
	
	
	for(var i = 0; i < mdpnp.gui.conditions.length; i++){
			var condition = mdpnp.gui.conditions[i];
			var text = condition.getConditionFunction().getName() + " "+condition.getOperatorString()+" "+condition.getConditionValue();
			
			var node = document.createElement("li");
			node.innerHTML = text;
			node.setAttribute("class", "list1");
			node.setAttribute("id", "condition_"+i);
			
			container.appendChild(node);
	}
};

mdpnp.gui.initializeDragDropConditions = function(){
	for(var i = 0; i < mdpnp.gui.ddtargets.length; i++){
		delete mdpnp.gui.ddtargets[i];
	}
	for(var i = 0; i < mdpnp.gui.ddobjects.length; i++){
		delete mdpnp.gui.ddobjects[i];
	}
	mdpnp.gui.ddtargets = [];
	mdpnp.gui.ddobjects = [];
	
	mdpnp.gui.ddtargets.push(new YAHOO.util.DDTarget("conditionsInRule"));
	mdpnp.gui.ddtargets.push(new YAHOO.util.DDTarget("conditionsNotInRule"));
		        
	for(var i = 0; i < mdpnp.gui.conditions.length; i++){
		mdpnp.gui.ddobjects.push(new mdpnp.gui.DDList("condition_" + i));
	}
};

mdpnp.gui.initializeSuccessFailureSelectBoxes = function(){
	mdpnp.gui.successFailureFunctions = [];
	for(var key in mdpnp.rules.successFailureFunctions){
		mdpnp.gui.successFailureFunctions.push(mdpnp.rules.successFailureFunctions[key]);
	}
	var box1 = document.getElementById("ruleSuccessFunction");
	var box2 = document.getElementById("ruleFailureFunction");
	while(box1.childNodes[0]){
		box1.removeChild(box1.childNodes[0]);
	}
	while(box2.childNodes[0]){
		box2.removeChild(box2.childNodes[0]);
	}
	
	for(var i = 0; i < mdpnp.gui.successFailureFunctions.length; i++){
		var func = mdpnp.gui.successFailureFunctions[i];
		var node1 = document.createElement("option");
		node1.setAttribute("value", i);
		node1.innerHTML = func.getName();
		var node2 = document.createElement("option");
		node2.setAttribute("value", i);
		node2.innerHTML = func.getName();
		box1.appendChild(node1);
		box2.appendChild(node2);
	}
};

mdpnp.gui.initializeComposeButton = function(){
	var button = document.getElementById("composeRuleButton");
	var clickHandler = (function(){
		return function(){
			var successFunction = mdpnp.gui.successFailureFunctions[parseInt(document.getElementById("ruleSuccessFunction").value)];
			var failureFunction = mdpnp.gui.successFailureFunctions[parseInt(document.getElementById("ruleFailureFunction").value)];
			var rule = new mdpnp.rules.CompositeRule(successFunction, failureFunction);
			rule.setDescription(document.getElementById("ruleDescription").value);
			var conditionsContainer = document.getElementById("conditionsInRule");
			var listItems = conditionsContainer.getElementsByTagName("li");
			for(var i = 0; i < listItems.length; i++){
				var id = listItems[i].getAttribute("id");
				//format of id is 'condition_i'
				var condition = mdpnp.gui.conditions[parseInt(id.substring(10))];
				rule.addCondition(condition);
			}
			mdpnp.gui.rules.push(rule);
			mdpnp.gui.initializeComposeRulesTab();
			mdpnp.gui.initializeRulesSelectBox();
		};
	})();
	button.onclick = clickHandler;
};

mdpnp.gui.initializeComposedRulesTable = function(){
	var table = document.getElementById("composedRules");
	//clear the table
	while(table.childNodes[0]){
		table.removeChild(table.childNodes[0]);
	}
	//add the header
	var headerRow = document.createElement("tr");
	var hcol1 = document.createElement("th");
	var hcol2 = document.createElement("th");
	hcol1.innerHTML = "Rule";
	headerRow.appendChild(hcol1);
	headerRow.appendChild(hcol2);
	table.appendChild(headerRow);
	
	var deleteHandlerCreator = function(index){
		return function(){
			mdpnp.gui.rules.remove(index);
			mdpnp.gui.initializeComposedRulesTable();
			mdpnp.gui.initializeRulesSelectBox();
		};
	};
	for(var i = 0; i < mdpnp.gui.rules.length; i++){
		var rule = mdpnp.gui.rules[i];
		var row = document.createElement("tr");
		var col1 = document.createElement("td");
		col1.innerHTML = rule.getDescription();
		var col2 = document.createElement("td");
		var button = document.createElement("input");
		button.setAttribute("type","button");
		button.setAttribute("value","delete");
		button.onclick = deleteHandlerCreator(i);
		col2.appendChild(button);
		
		row.appendChild(col1);
		row.appendChild(col2);
		table.appendChild(row);
	}
};

mdpnp.gui.initializeComposeRulesTab = function(){
	mdpnp.gui.loadConditionsIntoComposeRules();
	mdpnp.gui.initializeDragDropConditions();
	mdpnp.gui.initializeSuccessFailureSelectBoxes();
	mdpnp.gui.initializeComposeButton();
	mdpnp.gui.initializeComposedRulesTable();
	document.getElementById("ruleDescription").value = "";
};