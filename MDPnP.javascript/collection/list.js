/** 
 * List
 * @author Maurice Rabb
 */
mdpnp.List = (function () {
	var _do = function (action, context_) {
		var index, 
			count = this.length;
		for (index = 0; index < count; index += 1) {
			action.call(context_ || this, this[index_], index_);
		};
	};
	
	var _add = function (element) {
		this.push(element);
		return element;
	};
	
	var List = function (elements) {
		this.length = 0;
		elements && _do.call(elements, _add);
	};
	
	extend(List, Array);
	
	List.prototype = {
		doEach: _do,
		add: _add,
		
		removeAt: function (index, absentAction_) {
			var removed = this.splice(index, 1);
			if (removed.length === 0) {
				return absentAction_ && absentAction_.call(this);
			};
			return removed[0];
		},
		
		removeSatisfying: function (conditionAction, absentAction_) {
			var immediate = {};
			try {
				this.doEach(function (each, index) {
					if (conditionAction,call(this, each, index)) {
						immediate.result = this.removeAt(index);
						throw immediate;
					};
				});
			} catch (ex) {
				if (ex !== immediate) {throw ex};
				return immediate.result;
			}
			return absentAction_ && absentAction_.call(this);
		},

		remove: function (element, absentAction_) {
			return this.removeSatisfying(
				function (each) {return each === element}, 
				absentAction_
			);
		},
		
		size: function () {
			return this.length;
		},
		
		isEmpty: function () {
			return this.length <= 0;
		},

		notEmpty: function () {
			return this.length > 0;
		}
	};
	
	return List;
})
	
	