'use strict';

function Vector(x, y, z){
    
    this.x = x;
    this.y = y;
    this.z = z;
    
}

Vector.prototype = {
    
    plus: function(a){

        return new Vector(this.x + a.x, this.y + a.y, this.z + a.z);

    },
    
    minus: function(a){
        
        return new Vector(this.x - a.x, this.y - a.y, this.z - a.z);
        
    },
    
    scale: function(scalar){
        
        return new Vector(this.x * scalar, this.y * scalar, this.z * scalar);
        
    },
    
    dot: function(a){
        
        return this.x * a.x + this.y * a.y + this.z * a.z;
        
    },
    
    cross: function(a){
      
        return new Vector(
        
            this.y * a.z - a.y * this.z,
            this.z * a.x - a.z * this.x,
            this.x * a.y - a.x * this.y
        
        );
        
    },
    
    
    // 2D cross product
    cross2: function(a){
        
        return this.x * a.y - a.x * this.y;
        
    },
    
    project: function(a){
        
        return a.scale(this.dot(a) / a.getMagnitudeSquared());
        
    },
    
    getMagnitudeSquared: function(){
        
        return this.dot(this);
        
    },
    
    getMagnitude: function(){
        
        return Math.sqrt(this.getMagnitudeSquared());
        
    },
    
    normalize: function(){
        
        return this.scale(1 / this.getMagnitude());
        
    },
    
    getDistanceSquared: function(a){
      
        return (this.x - a.x) * (this.x - a.x) + (this.y - a.y) * (this.y - a.y) + (this.z - a.z) * (this.z - a.z);
        
    },
    
    // axis must be normalized
    rotateAround: function(axis, radians){
        
        // rodrigues rotation
        
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        
        return this.scale(cos).plus(axis.cross(this).scale(sin)).plus(axis.scale(axis.dot(this) * (1 - cos)));
        
    },
    
    toMatrix: function(){
      
        return new Matrix([
            
            [this.x],
            [this.y],
            [this.z],
            [1],
            
        ]);
        
    },
    
    equals: function(a){
        
        return  Math.abs(this.x - a.x) <= Vector.EPSILON &&
                Math.abs(this.y - a.y) <= Vector.EPSILON;
        
    }
    
};


Vector.ZERO = new Vector(0, 0, 0);
Vector.RIGHT = new Vector(1, 0, 0);
Vector.BACK = new Vector(0, 0, -1);
Vector.LEFT = new Vector(-1, 0, 0);
Vector.FORWARD = new Vector(0, 0, 1);
Vector.UP = new Vector(0, 1, 0);
Vector.DOWN = new Vector(0, -1, 0);

Vector.EPSILON = 1e-6;