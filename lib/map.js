/* jshint*/
'use strict';

function Map() {
	this.values = {};
	this.keys = {};

	var set = this;
	this.__defineGetter__('length', function(){
		return Object.keys(set.values).length;
	});
}

Map.prototype.set = function (key, value) {
	var hash = key;
	if (key.__getKey) {
		hash = key.__getKey();
	}
	this.values[hash] = value;
	this.keys[hash] = key;
};

Map.prototype.get = function (key, value) {
	var hash = key;
	if (key.__getKey) {
		hash = key.__getKey();
	}
	return this.values[hash];
};

Map.prototype.remove = function (key) {
	var hash = key;
	if (key.__getKey) {
		hash = key.__getKey();
	}
	delete this.values[hash];
	delete this.keys[hash];
};

Map.prototype.contains = function (key) {
	var hash = key;
	if (key.__getKey) {
		hash = key.__getKey();
	}
	return !!this.values[hash];
};

module.exports = Map;
