/* jshint mocha:true */
'use strict';

var assert = require('assert');

var AStar = require('../index').astar;


function Point(x, y) {
	this.x = x;
	this.y = y;
}
Point.prototype.__getKey = Point.prototype.toString = function() {
	return this.x + ',' + this.y;
};
Point.prototype.equal = function(other) {
	return this.x == other.x && this.y == other.y;
};

var goodGraph = {
	'0,0' : [new Point(0, 1), new Point(1, 0), ],
	'0,1' : [new Point(1, 1), new Point(0, 0), ],
	'1,0' : [new Point(0, 0), ],
	'1,1' : [new Point(1, 2), new Point(0, 1), ],
	'1,2' : [new Point(1, 1), new Point(1, 3), ],
	'1,3' : [new Point(1, 2), new Point(2, 3), ],
	'2,3' : [new Point(1, 3), new Point(3, 3), new Point(2, 4), ],
	'2,4' : [new Point(2, 3), ],
	'3,3' : [new Point(2, 3), new Point(3, 2), ],
	'3,2' : [new Point(3, 3), new Point(3, 1), ],
	'3,1' : [new Point(3, 2), new Point(3, 0), ],
};
var badGraph = {
	'0,0' : [new Point(0, 1), new Point(1, 0), ],
	'0,1' : [new Point(1, 1), new Point(0, 0), ],
	'1,0' : [new Point(0, 0), ],
	'1,1' : [new Point(1, 2), new Point(0, 1), ],
	'1,2' : [new Point(1, 1), new Point(1, 3), ],
	'1,3' : [new Point(1, 2), new Point(2, 3), ],
	'2,3' : [new Point(1, 3), new Point(2, 4), ], // not linked to 3,3
	'2,4' : [new Point(2, 3), ],
	'3,3' : [new Point(2, 3), new Point(3, 2), ],
	'3,2' : [new Point(3, 3), new Point(3, 1), ],
	'3,1' : [new Point(3, 2), new Point(3, 0), ],
};

describe('astar', function() {
	describe('should give error if', function() {
		it('getNeighborFunction not set', function(done) {
			var astar = new AStar();

			astar.search(0, 1, function(err) {
				assert.equal('getNeighborFunction not set', err);
				done();
			});
		});
		it('estimateFunction not set', function(done) {
			var astar = new AStar();
			astar.setNeighborGetter(function(node, callback) {
				callback(null, []);
			});

			astar.search(0, 1, function(err) {
				assert.equal('estimateFunction not set', err);
				done();
			});
		});
	});

	it('should give the path', function(done) {
		var astar = new AStar();
		var start = new Point(0, 0);
		var goal = new Point(3, 0);

		astar.setNeighborGetter(function(node, callback) {
			callback(null, goodGraph[node]);
		});
		astar.setEstimateFunction(function(node) {
			return Math.abs(node.x - goal.x) + Math.abs(node.y - goal.y);
		});

		astar.search(start, goal, function(err, path) {
			assert.ifError(err);

			var expectedPath = [
				{ x: 0, y: 0 },
				{ x: 0, y: 1 },
				{ x: 1, y: 1 },
				{ x: 1, y: 2 },
				{ x: 1, y: 3 },
				{ x: 2, y: 3 },
				{ x: 3, y: 3 },
				{ x: 3, y: 2 },
				{ x: 3, y: 1 },
				{ x: 3, y: 0 }
			];

			assert.deepEqual(expectedPath, path);
			done();
		});
	});

	it('should give error if there\'re not path', function(done) {
		var astar = new AStar();
		var start = new Point(0, 0);
		var goal = new Point(3, 0);

		astar.setNeighborGetter(function(node, callback) {
			callback(null, badGraph[node]);
		});
		astar.setEstimateFunction(function(node) {
			return Math.abs(node.x - goal.x) + Math.abs(node.y - goal.y);
		});

		astar.search(start, goal, function(err, path) {
			assert.equal('fails', err);

			done();
		});
	});
});
