'use strict';

function Camera(pos) {
    this.pos = pos || Vector.ZERO;
}

Camera.simplePerspectiveProjectionMatrix = new Matrix([
    [1,  0,  0,  0],
    [0,  1,  0,  0],
    [0,  0,  1,  0],
    [0,  0, -1,  0],
]);

Camera.prototype = {
    
    transformationMatrix: function() {
        return Matrix.translationMatrix(-this.pos.x(), -this.pos.y(), -this.pos.z());
    },
    
    getProjectionMatrix: function() {
        return Camera.simplePerspectiveProjectionMatrix;
    }
};