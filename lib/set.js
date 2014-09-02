/* jshint*/
'use strict';

function Set() {
	this.values = {};
	this.keys = {};

	var set = this;
	this.__defineGetter__('length', function(){
		return Object.keys(set.values).length;
	});
}

Set.prototype.add = function (item) {
	var hash = item;
	if (item.__getKey) hash = item.__getKey();
	this.values[hash] = item;
	this.keys[hash] = item;
};

Set.prototype.remove = function (item) {
	var hash = item;
	if (item.__getKey) hash = item.__getKey();
	delete this.values[hash];
	delete this.keys[hash];
};

Set.prototype.contains = function (item) {
	var hash = item;
	if (item.__getKey) hash = item.__getKey();
	return !!this.values[hash];
};

Set.prototype.getIterable = function () {
	return this.values;
};

module.exports = Set;
