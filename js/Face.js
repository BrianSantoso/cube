'use strict';

function Face(vertices) {
    this.vertexIndexArray = new Array(vertices.length);
    
    for (let i = 0; i < vertices.length; i++) {    
        this.vertexIndexArray[i] = renderer.vertices.length;
        renderer.addVertex(vertices[i]);
    }
}

Face.prototype = {
    
    applyTransformation: function(transformation) {
		
        for (let i = 0; i < this.vertexIndexArray.length; i++) {
            let v = renderer.vertices[this.vertexIndexArray[i]];
            let newPos = transformation.multiply(v.pos);
            v.pos = newPos;
        }  
    },
    
    rotate: function(pivot, axis, radians) {
        
        for (let i = 0; i < this.vertexIndexArray.length; i++) {
            
            let v = renderer.vertices[this.vertexIndexArray[i]];
            let p0 = v.pos.toVector();
            
            let translated1 = p0.minus(pivot);
            let rotated = translated1.rotateAround(axis, radians);
            let translated2 = rotated.plus(pivot);
            
            v.pos = translated2.toMatrix();
        }
    },
    
    setColor: function(colorScheme) {
        
        for (let i = 0; i < this.vertexIndexArray.length; i++) {
			renderer.vertices[this.vertexIndexArray[i]].rgb = colorScheme[6];
		} 
    }
};

// Standard 1 x 1 unit face centered at the origin.
Face.FACE = [
    
    new Vector(-0.5, 0.0, 0.5),
    new Vector(0.5, 0.0, 0.5),
    new Vector(0.5, 0.0, -0.5),
    new Vector(-0.5, 0.0, -0.5)
    
];

Face.FACE_INDICES = [
    
    // bottom left triangle
    3, 0, 1,
    // top right triangle
    3, 1, 2
    
];

Face.constructFaceVertices = function(pos, eAngle, radius, size, color) {
    
    let vertices = [];
    
    let scale = Matrix.scalingMatrix(size);
    let rotation = eAngle.rotationMatrix();
    let translation1 = Matrix.translationMatrix(pos.x, pos.y, pos.z);
    let translation2 = Matrix.translationMatrix(0, radius, 0);
    
    let transformation = translation1.multiply(rotation).multiply(translation2).multiply(scale);
    
    vertices.push(new Vertex(Face.FACE[Face.FACE_INDICES[0]], color));
    vertices.push(new Vertex(Face.FACE[Face.FACE_INDICES[1]], color));
    vertices.push(new Vertex(Face.FACE[Face.FACE_INDICES[2]], color));
    vertices.push(new Vertex(Face.FACE[Face.FACE_INDICES[3]], color));
    vertices.push(new Vertex(Face.FACE[Face.FACE_INDICES[4]], color));
    vertices.push(new Vertex(Face.FACE[Face.FACE_INDICES[5]], color));
    
    for (let i = 0; i < vertices.length; i++) {
        vertices[i].pos = transformation.multiply(vertices[i].pos);
    }
    
    return vertices;
};
