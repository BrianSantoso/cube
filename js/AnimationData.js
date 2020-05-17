'use strict';
function AnimationData(sector, axisIndex, radiansPerAnimation, move) {
	
    this.sector = sector;
    this.axisIndex = axisIndex;
    this.radians = radiansPerAnimation;
    this.move = move || null;
	
}

AnimationData.prototype = {
	
    hasMove: function() {
        return this.move != null;
    }
	
};