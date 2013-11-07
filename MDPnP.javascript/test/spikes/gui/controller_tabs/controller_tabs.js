mdpnp.gui.initController= function(){
	try {
		mdpnp.getEnv().getController();
		var message = "controller initialized";
		document.getElementById("initControllerContainer").innerHTML = message;
	} catch (err) {
		alert(err.message);
	}
};