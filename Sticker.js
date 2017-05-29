'use strict';

function Sticker(vertices, stickerCoordinates, face, location){
    
    Face.call(this, vertices);
    this.stickerCoordinates = stickerCoordinates;
    this.originalFace = face;
    this.face = face;   // currrent face of the rubiks cube which the sticker is on
    this.location = location;
    
}

Sticker.prototype = Object.create(Face.prototype);

Sticker.prototype.intersectsFace = function(ray){
    
    let one = ray.intersectsTriangle(
    
        renderer.vertices[this.vertexIndexArray[0]].pos.toVector(),
        renderer.vertices[this.vertexIndexArray[1]].pos.toVector(),
        renderer.vertices[this.vertexIndexArray[2]].pos.toVector()
        
    );
    
    let two = ray.intersectsTriangle(
    
        renderer.vertices[this.vertexIndexArray[3]].pos.toVector(),
        renderer.vertices[this.vertexIndexArray[4]].pos.toVector(),
        renderer.vertices[this.vertexIndexArray[5]].pos.toVector()
        
    );
    
    return one || two;
    
};

Sticker.prototype.setColor = function(colorScheme){
    
    for(let i = 0; i < this.vertexIndexArray.length; i++){
        
        renderer.vertices[this.vertexIndexArray[i]].rgb = colorScheme[this.originalFace];
        
    }
    
};