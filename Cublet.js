'use strict';

function Cublet(location, faces){
    
    this.location = location;
    this.faces = faces;
    
}

Cublet.prototype = {
    
    applyTransformation: function(transformation){
        
        this.faces.forEach(f => f.applyTransformation(transformation));
        
    },
    
    setColor: function(colorScheme){
        
        this.faces.forEach(f => f.setColor(colorScheme));
        
    },
    
    rotateData: function(transformation){
        
        this.location = transformation.multiply(this.location);
        
    },
    
    rotate: function(pivot, axis, radians){
        
        this.faces.forEach(f => f.rotate(pivot, axis, radians));
        
    },
    
    isOnSector: function(sector){
        
        return Math.floor(this.location.m[sector[0]][0]) == sector[1];
        
    }
    
};