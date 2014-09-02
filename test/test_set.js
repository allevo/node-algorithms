/* jshint mocha:true */
'use strict';

var assert = require('assert');

var Set_ = require('../lib/set');

function MyObject(value) {
	this.value = value;
}
MyObject.prototype.__getKey = function() {
	return 'MyObject(' + this.value + ')';
};

describe('set', function() {
	it('add', function() {
		var set = new Set_();

		set.add('aa');
		set.add('bb');
		set.add(new MyObject('aaaa'));

		assert.ok(set.keys.aa);
		assert.ok(set.keys.bb);
		assert.ok(set.keys['MyObject(aaaa)']);
		assert.ifError(set.keys.cc);
	});

	it('remove', function() {
		var set = new Set_();

		set.add('aa');
		set.add('bb');

		set.remove('bb');

		assert.ok(set.keys.aa);
		assert.ifError(set.keys.bb);
		assert.ifError(set.keys.cc);
	});
	it('remove unknown element', function() {
		var set = new Set_();

		set.add('aa');
		set.add('bb');

		set.remove('cc');

		assert.ok(set.keys.aa);
		assert.ok(set.keys.bb);
		assert.ifError(set.keys.cc);
	});
	it('contains', function() {
		var set = new Set_();

		set.add('aa');
		set.add('bb');
		set.add(new MyObject('aaaa'));

		assert.ok(set.contains('aa'));
		assert.ok(set.contains('bb'));
		assert.ok(set.contains(new MyObject('aaaa')));
		assert.ifError(set.contains('cc'));
	});

	it('getIterable', function() {
		var set = new Set_();

		set.add('aa');
		set.add('bb');
		set.add(new MyObject('aaaa'));

		var iterable = set.getIterable();

		var expeted = {
			'aa': 'aa',
			'bb': 'bb',
			'MyObject(aaaa)': { value: 'aaaa'}
		};
		assert.deepEqual(expeted, iterable);
	});
});
