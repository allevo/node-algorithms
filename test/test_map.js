/* jshint mocha:true */
'use strict';


var assert = require('assert');

var Map_ = require('../lib/map');

function MyObject(value) {
	this.value = value;
}
MyObject.prototype.__getKey = function() {
	return 'MyObject(' + this.value + ')';
};


describe('map', function() {
	it('add', function() {
		var map = new Map_();

		map.set('aa', 1);
		map.set('bb', new MyObject('pippo'));
		map.set(new MyObject('aaaa'), new MyObject('pluto'));

		assert.ok(map.keys.aa);
		assert.ok(map.keys.bb);
		assert.ok(map.keys['MyObject(aaaa)']);
		assert.ifError(map.keys.cc);
	});
	it('get', function() {
		var map = new Map_();

		map.set('aa', 1);
		map.set('bb', new MyObject('pippo'));
		map.set(new MyObject('aaaa'), new MyObject('pluto'));

		assert.equal(1, map.get('aa'));
		assert.equal('pippo', map.get('bb').value);
		assert.equal('pluto', map.get(new MyObject('aaaa')).value);
	});
	it('contains', function() {
		var map = new Map_();

		map.set('aa', 1);
		map.set('bb', new MyObject('pippo'));
		map.set(new MyObject('aaaa'), new MyObject('pluto'));

		assert.equal(true, map.contains('aa'));
		assert.equal(true, map.contains('bb'));
		assert.equal(true, map.contains(new MyObject('aaaa')));
		assert.equal(false, map.contains(new MyObject('foo')));
	});
});