jasmine.TrivialReporter = function() {
	this.specNumber = 1;
};

jasmine.TrivialReporter.prototype.createDom = function(type, attrs, childrenVarArgs) {
	var el = document.createElement(type);

	for (var i = 2; i < arguments.length; i++) {
		var child = arguments[i];

		if (typeof child === 'string') {
			el.appendChild(document.createTextNode(child));
		} else {
			el.appendChild(child);
		}
	}

	for (var attr in attrs) {
		if (attr == 'className') {
			el.setAttribute('class', attrs[attr]);
		} else {
			if (attr.indexOf('x-') == 0) {
				el.setAttribute(attr, attrs[attr]);
			} else {
				el[attr] = attrs[attr];
			}
		}
	}

	return el;
};

jasmine.TrivialReporter.prototype.reportRunnerResults = function(runner) {
	console.log(runner);
};

jasmine.TrivialReporter.prototype.reportSuiteResults = function(suite) {
	console.log(suite);
	var div = this.createDom('div', {});
	div.innerHTML = "<br><hr><br>";
	document.body.appendChild(div);
};

jasmine.TrivialReporter.prototype.reportSpecResults = function(spec) {
	var specDiv = this.createDom('div', {
		className: spec.getResults().passed() ? 'spec passed' : 'spec failed'
	}, "spec "+this.specNumber+": "+spec.getFullName());

	this.specNumber = this.specNumber + 1;

	var resultItems = spec.getResults().getItems();
	for (var i = 0; i < resultItems.length; i++) {
		var result = resultItems[i];
		if (!result.passed) {
			var resultMessageDiv = this.createDom('div', {className: 'resultMessage'});
			resultMessageDiv.innerHTML = result.message; // todo: lame; mend
			specDiv.appendChild(resultMessageDiv);
			if(result.trace.stack){
				specDiv.appendChild(this.createDom('div', {className: 'stackTrace'}, result.trace.stack));
			};
		}
		document.body.appendChild(specDiv);
	};
};

	jasmine.TrivialReporter.prototype.log = function() {
		console.log.apply(console, arguments);
	};
