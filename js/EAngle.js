/*

    Brian Santoso
    APCSP p.3B
    May 2017

*/

'use strict';

function EAngle(pitch, yaw, roll){
    
    this.pitch = pitch;
    this.yaw = yaw;
    this.roll = roll;
    
}

EAngle.prototype = {
    
    rotationMatrix: function(){
        
        let xAxisRotationMatrix = Matrix.xAxisRotationMatrix(this.pitch);
        let yAxisRotationMatrix = Matrix.yAxisRotationMatrix(this.yaw);
        let zAxisRotationMatrix = Matrix.zAxisRotationMatrix(this.roll);
        
        return xAxisRotationMatrix.multiply(yAxisRotationMatrix).multiply(zAxisRotationMatrix);
        
    }
    
};

EAngle.UP = new EAngle(0, 0, 0);
EAngle.RIGHT = new EAngle(0, 0, 3 * Math.PI / 2);
EAngle.BACK = new EAngle(Math.PI / 2, 0, 0);
EAngle.FORWARD = new EAngle(3 * Math.PI / 2, 0, 0);
EAngle.DOWN = new EAngle(Math.PI, 0, 0);
EAngle.LEFT = new EAngle(0, 0, Math.PI / 2);

EAngle.AXIS_ANGLES = [
    
    EAngle.RIGHT,   // 0
    EAngle.UP,      // 1
    EAngle.BACK,    // 2
    EAngle.LEFT,    // 3
    EAngle.DOWN,    // 4
    EAngle.FORWARD  // 5
    
];