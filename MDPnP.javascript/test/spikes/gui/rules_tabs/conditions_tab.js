//store each condition function here because for in loops 
//might not give the functions back in the same order each time
mdpnp.gui.conditionFunctions = [];
mdpnp.gui.conditions = [];
mdpnp.gui.editingExistingCondition = -1; //-1 if not editing existing condition, the index of the condition otherwise

mdpnp.gui.createOption = function(value, text){
	var option = document.createElement("option");
	option.setAttribute("value", value);
	option.innerHTML = text;
	return option;
};

mdpnp.gui.initializeConditionsFunctionsSelectBox = function(){
	for(var func in mdpnp.rules.conditionFunctions){
		mdpnp.gui.conditionFunctions.push(mdpnp.rules.conditionFunctions[func]);
	}
	
	var select = document.getElementById("condition_functions_select");
	for(var i = 0; i < mdpnp.gui.conditionFunctions.length; i++){
		var func = mdpnp.gui.conditionFunctions[i];
		var option = mdpnp.gui.createOption(i,func.getName());
		select.appendChild(option);
	}
};

mdpnp.gui.initializeBinaryOperatorsSelectBox = function(){
	var select = document.getElementById("binary_operator_select");
	
	
	
	select.appendChild(mdpnp.gui.createOption("<", "less than"));
	select.appendChild(mdpnp.gui.createOption("<=", "less than or equal to"));
	select.appendChild(mdpnp.gui.createOption(">", "greater than"));
	select.appendChild(mdpnp.gui.createOption(">=", "greater than or equal to"));
	select.appendChild(mdpnp.gui.createOption("==", "equal to"));
	select.appendChild(mdpnp.gui.createOption("!=", "not equal to"));
	select.appendChild(mdpnp.gui.createOption("===", "exactly equal to"));
	select.appendChild(mdpnp.gui.createOption("!==", "not exactly equal to"));
};

mdpnp.gui.initializeTestValueTypeSelectBox = function(){
	var select = document.getElementById("test_value_type_select");
	
	select.appendChild(mdpnp.gui.createOption("number","number"));
	select.appendChild(mdpnp.gui.createOption("boolean","boolean"));
	
	//create the input box for entering a number test value
	var number = document.createElement("input");
	number.setAttribute("type","text");
	number.setAttribute("id","condition_test_value_number");
		
	document.getElementById("test_value_div").appendChild(number);
	
	//create the select box for entering a boolean value
	var booleanSelect = document.createElement("select");
	booleanSelect.setAttribute("id", "condition_test_value_boolean");
	booleanSelect.appendChild(mdpnp.gui.createOption("true","true"));
	booleanSelect.appendChild(mdpnp.gui.createOption("false","false"));
	
	var change = function(){
		var choice = select.value;
		var container = document.getElementById("test_value_div");
		while (container.childNodes[0]) {
			container.removeChild(container.childNodes[0]);
		}
		if(choice == "number"){
			container.appendChild(number);
		} else if(choice == "boolean") {
			container.appendChild(booleanSelect);
		}
	};
	
	select.onchange = change;
};

mdpnp.gui.constructCondition = function(){
	//get all of the parameters to go into the condition
	var func = mdpnp.gui.conditionFunctions[parseInt(document.getElementById("condition_functions_select").value)];
	var operator = document.getElementById("binary_operator_select").value;
	var type = document.getElementById("test_value_type_select").value;
	var testValue;
	if(type == "number"){
		testValue = document.getElementById("condition_test_value_number").value;
		if(!testValue.match(/^\d+(\.\d+)?$|^\.\d+$/)){
			alert("test value must be numeric");
			return;
		}
	} else if(type == "boolean") {
		var val = document.getElementById("condition_test_value_boolean").value;
		if(val == "true"){
			testValue = true;
		} else if(val == "false"){
			testValue = false;
		}
		if(!(operator == "==" || operator == "!=")){
			alert("operator must be == or != when using a boolean test value");
			return;
		}
	}
	
	//construct the binary condition
	var binaryCondition;
	//avoiding switch according to crockford's best practices
	if(operator == "<"){
		binaryCondition = new mdpnp.rules.LessThanCondition(testValue);
	} else if(operator == "<=") {
		binaryCondition = new mdpnp.rules.LessThanOrEqualsCondition(testValue);
	} else if(operator == ">") {
		binaryCondition = new mdpnp.rules.GreaterThanCondition(testValue);
	} else if(operator == ">=") {
		binaryCondition = new mdpnp.rules.GreaterThanOrEqualsCondition(testValue);
	} else if(operator == "==") {
		binaryCondition = new mdpnp.rules.EqualsCondition(testValue);
	} else if(operator == "!=") {
		binaryCondition = new mdpnp.rules.NotEqualToCondition(testValue);
	} else if(operator == "===") {
		binaryCondition = new mdpnp.rules.ExactlyEqualToCondition(testValue);
	} else if(operator == "!==") {
		binaryCondition = new mdpnp.rules.NotExactlyEqualToCondition(testValue);
	}
	if(binaryCondition === undefined) {
		throw new Error("mdpnp.gui.constructCondition: error parsing operator");
	}
	
	var wrapper = new mdpnp.rules.BinaryConditionWrapper(func, binaryCondition);
	
	if(mdpnp.gui.editingExistingCondition == -1){
		mdpnp.gui.conditions.push(wrapper);
	} else {
		mdpnp.gui.conditions[mdpnp.gui.editingExistingCondition] = wrapper;
	}
	
	
	if(document.getElementById("condition_test_value_number")){
		document.getElementById("condition_test_value_number").value = "";
	} else {
		document.getElementById("condition_test_value_boolean").value = "true";
	}
	mdpnp.gui.editingExistingCondition = -1;
	document.getElementById("construct_condition_button").setAttribute("value", "construct condition")

	
	mdpnp.gui.refreshConditionsTable();
	mdpnp.gui.initializeComposeRulesTab();
};

mdpnp.gui.refreshConditionsTable = function(){
	var table = document.getElementById("constructed_conditions_table");
	while(table.childNodes[0]){
		table.removeChild(table.childNodes[0]);
	}
	
	//put the table header row back
	var header = document.createElement("tr");
	var hcol1 = document.createElement("th");
	hcol1.innerHTML = "Condition";
	var hcol2 = document.createElement("th");
	var hcol3 = document.createElement("th");
	header.appendChild(hcol1);
	header.appendChild(hcol2);
	header.appendChild(hcol3);
	table.appendChild(header);
	
	var deleteClosureCreator = function(index){
		var closure = function(){
			mdpnp.gui.conditions.remove(index);
			mdpnp.gui.refreshConditionsTable();
			mdpnp.gui.initializeComposeRulesTab();
		};
		return closure;
	};
	
	var editClosureCreator = function(index){
		var closure = function(){
			var condition = mdpnp.gui.conditions[index];
			mdpnp.gui.editingExistingCondition = index;
			
			var condIndex;
			for(var i = 0; i < mdpnp.gui.conditionFunctions.length; i++){
				if(condition.getConditionFunction() === mdpnp.gui.conditionFunctions[i]){
					condIndex = i;
					break;
				}
			}
			var type = "number";
			if(condition.getConditionValue().constructor == Boolean){
				type = "boolean";
			}
			
			document.getElementById("condition_functions_select").value = condIndex;
			document.getElementById("binary_operator_select").value = condition.getOperatorString();
			document.getElementById("test_value_type_select").value = type;
			
			var container = document.getElementById("test_value_div");
			while (container.childNodes[0]) {
				container.removeChild(container.childNodes[0]);
			}
	
			var value = condition.getConditionValue();
			if(type == "number"){
				var number = document.createElement("input");
				number.setAttribute("type","text");
				number.setAttribute("id","condition_test_value_number");
				container.appendChild(number);
				document.getElementById("condition_test_value_number").value = value;
			} else {
				var booleanSelect = document.createElement("select");
				booleanSelect.setAttribute("id", "condition_test_value_boolean");
				booleanSelect.appendChild(mdpnp.gui.createOption("true","true"));
				booleanSelect.appendChild(mdpnp.gui.createOption("false","false"));
				container.appendChild(booleanSelect);
				var val = "true";
				if(value == false){
					val = "false";
				}
				document.getElementById("condition_test_value_boolean").value = val;
			}
			document.getElementById("construct_condition_button").setAttribute("value", "edit condition")
		};
		return closure;
	};
	
	for(var i = 0; i < mdpnp.gui.conditions.length; i++){
		var condition = mdpnp.gui.conditions[i];
		var text = condition.getConditionFunction().getName() + " "+ condition.getOperatorString() + " "+ condition.getConditionValue();
		
		var row = document.createElement("tr");
		var col1 = document.createElement("td");
		col1.innerHTML = text;
		var col2 = document.createElement("td");
		var col3 = document.createElement("td");
		
		var editButton = document.createElement("input");
		editButton.setAttribute("type", "button");
		editButton.setAttribute("value", "edit");
		editButton.setAttribute("id", "edit_condition_"+i);
		editButton.onclick = editClosureCreator(i);
		col2.appendChild(editButton);
		
		var deleteButton = document.createElement("input");
		deleteButton.setAttribute("type", "button");
		deleteButton.setAttribute("value", "delete");
		deleteButton.setAttribute("id", "delete_condition_"+i);
		deleteButton.onclick = deleteClosureCreator(i);
		col3.appendChild(deleteButton);
		
		row.appendChild(col1);
		row.appendChild(col2);
		row.appendChild(col3);
		
		table.appendChild(row);
	}
};

mdpnp.gui.initializeConditionsTab = function(){
	mdpnp.gui.initializeConditionsFunctionsSelectBox();
	mdpnp.gui.initializeBinaryOperatorsSelectBox();
	mdpnp.gui.initializeTestValueTypeSelectBox();
	mdpnp.gui.refreshConditionsTable();
	
	document.getElementById("construct_condition_button").onclick = mdpnp.gui.constructCondition;
};