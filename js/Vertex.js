'use strict';

function Vertex(pos, rgb){
    
    this.pos = pos instanceof Matrix ? pos : pos.toMatrix();
    this.rgb = rgb;
    
}

Vertex.prototype = {
    
    setPos: function(pos){
        
        this.pos = pos;
        
    }
    
};