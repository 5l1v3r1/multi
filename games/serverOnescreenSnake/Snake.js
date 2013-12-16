/* global module */


function Segment(startX, startY) {
	this.startX = startX;
	this.startY = startY;
	this.x = startX;
	this.y = startY;
}
Segment.prototype.getWidth = function () {
	return Math.abs(this.x - this.startX);
};
Segment.prototype.getHeight = function () {
	return Math.abs(this.y - this.startY);
};
Segment.prototype.getTop = function () {
	return this.y - this.startY < 0 ? this.y : this.startY;
};
Segment.prototype.getLeft = function () {
	return this.x - this.startX < 0 ? this.x : this.startX;
};


function Snake (owner, arranger) {
	this.owner = owner;
	this.arranger = arranger;

	// start at center of display (global coords)
	var display = owner;
	var localX = Math.round(display.width / 2);
	var localY = Math.round(display.height / 2);

	this.speed = 5;
	this.dir = -1;
	this.lastDir = -1;

	var initialPos = display.screen.localToGlobal(localX, localY);
	this.curSegment = new Segment(initialPos.x, initialPos.y);
	this.segments = [this.curSegment];
}

Snake.prototype.update = function () {
	this.move();
	this.updateDisplay();
};

Snake.prototype.move = function () {
	this.lastDir = this.dir;
	this.dir = this.owner.attributes.direction || 0;

	if (this.dir !== this.lastDir) {
		// direction changed - start a new segment
		this.curSegment = new Segment(this.curSegment.x, this.curSegment.y);
		this.segments.push(this.curSegment);
	}

	switch (this.dir) {
	case 0:
		this.curSegment.y -= this.speed;
		break;
	case 1:
		this.curSegment.x += this.speed;
		break;
	case 2:
		this.curSegment.y += this.speed;
		break;
	case 3:
		this.curSegment.x -= this.speed;
		break;
	}
};

Snake.prototype.isAlive = function () {
	return this.arranger.getPlayerAtCoords(this.curSegment.x, this.curSegment.y) !== null;
};

Snake.prototype.updateDisplay = function () {
	var width = this.curSegment.getWidth();
	var height = this.curSegment.getHeight();
	var left = this.curSegment.getLeft();
	var top = this.curSegment.getTop();
	var locals = this.arranger.globalRectToLocals(left, top, width, height);
	for (var i in locals) {
		var local = locals[i];
		this.owner.message('draw',
			{
				x: local.x,
				y: local.y,
				width: width,
				height: height
			},
			local.player);
	}
};

module.exports = Snake;