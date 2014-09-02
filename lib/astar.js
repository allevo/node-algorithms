'use strict';

var async = require('async');

var Set_ = require('./set');
var Map_ = require('./map');

function Searcher(getNeighborFunction, estimateFunction) {
	this.getNeighborFunction = getNeighborFunction;
	this.estimateFunction = estimateFunction;
	
	this.closedset = new Set_();
	this.openset = new Set_();

	this.cameFrom = new Map_();
	this.gScore = new Map_();
	this.fScore = new Map_();
}

Searcher.prototype.search = function(start, goal, callback) {
	this.openset.add(start);
	this.gScore.set(start, 0);
	this.fScore.set(start, this.estimateFunction(start));

	this.goal = goal;
	this.startAStar(callback);
};

Searcher.prototype.foundMin = function() {
	var minKey = null;
	var minValue = 1000000000;

	var iterable = this.openset.getIterable();
	for (var i in iterable) {
		var node = iterable[i];
		if (this.fScore.get(node) < minValue) {
			minKey = node;
			minValue = this.fScore.get(node);
		}
	}

	return minKey;
};

Searcher.prototype.startAStar = function(callback) {
	var current = this.foundMin();

	if (current.equal(this.goal)) {
		return callback(null, this.reconstructPath(current));
	}

	this.openset.remove(current);
	this.closedset.add(current);

	this.getNeighborFunction(current, this.searchNeighbor.bind(this, current, callback));
};

Searcher.prototype.searchNeighbor = function(current, callback, err, neighbors) {
	if (err) return callback(err);

	var searcher = this;
	async.map(neighbors, function(item, next) {
		if (searcher.closedset.contains(item)) {
			return next(null, null);
		}
		var tentativeGScore = searcher.gScore.get(current) + 1;

		if (!searcher.openset.contains(item) || (tentativeGScore < searcher.gScore.get(item))) {
			searcher.cameFrom.set(item, current);
			searcher.gScore.set(item, tentativeGScore);
			searcher.fScore.set(item, tentativeGScore, searcher.estimateFunction(item, searcher.goal));

			if (!searcher.openset.contains(item)) {
				searcher.openset.add(item);
			}
		}
		next(null, null);
	}, function(err, results) {
		if (searcher.openset.length === 0) {
			return callback('fails');
		}
		searcher.startAStar(callback);
	});
};

Searcher.prototype.reconstructPath = function(current) {
	if (this.cameFrom.contains(current)) {
		var p = this.reconstructPath(this.cameFrom.get(current));
		p.push(current);
		return p;
	} else {
		return [current, ];
	}
};


function AStar() {
	this.getNeighborFunction = null;
}

AStar.prototype.setNeighborGetter = function(getNeighborFunction) {
	this.getNeighborFunction = getNeighborFunction;
};
AStar.prototype.setEstimateFunction = function(estimateFunction) {
	this.estimateFunction = estimateFunction;
};

AStar.prototype.search = function(start, goal, callback) {
	if (!this.getNeighborFunction) {
		return callback('getNeighborFunction not set');
	}
	if(!this.estimateFunction) {
		return callback('estimateFunction not set');
	}
	var searcher = new Searcher(this.getNeighborFunction, this.estimateFunction);
	searcher.search(start, goal, callback);
};


module.exports = AStar;
