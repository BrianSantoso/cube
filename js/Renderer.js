'use strict';

function Renderer(camera, raster) {
    
    this.wireFrame = false;
    this.zBuffering = true;
    
    this.camera = camera;
    this.raster = raster;
    
    this.vertices = [];  
}

Renderer.prototype = {
    
    render: function() {
		
        let projectedPoints = this.vertices.map(v => v.pos.toVector().scale(1 / -v.pos.z()));
        
        for (let i = 0; i < projectedPoints.length; i += 3) {
            
            // Vertices
            let v0 = this.vertices[i + 0];
            let v1 = this.vertices[i + 1];
            let v2 = this.vertices[i + 2];
            
            // Projected Points (Vectors)
            let a = projectedPoints[i + 0];
            let b = projectedPoints[i + 1];
            let c = projectedPoints[i + 2];
            
            if (a.x < -1 || a.x > 1 || a.y < -1 || a.y > 1 || v0.pos.z > -1) continue;
            if (b.x < -1 || b.x > 1 || b.y < -1 || b.y > 1 || v1.pos.z > -1) continue;
            if (c.x < -1 || c.x > 1 || c.y < -1 || c.y > 1 || v2.pos.z > -1) continue;
            
            this.rasterize(v0, v1, v2, a, b, c);
            
        }
        
    },
    
    rasterize: function(v0, v1, v2, a, b, c) {
		
        let trianglePixels = Raster.getTrianglePixels(
            this.raster.getScreenCoordinates(a),
            this.raster.getScreenCoordinates(b),
            this.raster.getScreenCoordinates(c),
            this.wireFrame
        );

        trianglePixels.forEach(p => {

            let depth = 0;
			
            if (this.zBuffering) {
				
                let point = new Vector(
                    p[0] / this.raster.width,
                    p[1] / this.raster.height,
                    -1
                );
				
                depth = -1 / Raster.barycentricInterpolation2(
                    a, 1 / v0.pos.z(),
                    b, 1 / v1.pos.z(),
                    c, 1 / v2.pos.z(),
                    point
                );
				
            }

            let rgb = v0.rgb;

            // bit shifts have precendence over &, hence the parenthesis

            let red = (rgb & 0xff0000) >> 16;
            let green = (rgb & 0xff00) >> 8;
            let blue = (rgb & 0xff);

            this.raster.tryToSetPixel(p[0], p[1], depth, red, green, blue);
			
        });
        
    },
    
    addVertices: function(arr) {
        this.vertices.push.apply(this.vertices, arr);
    },
    
    addVertex: function(vertex) {
        this.vertices.push(vertex);
    },
    
    getProjectedPoints: function() {
    
        let projectedPoints = [];
    
        this.vertices.forEach(vertex => {
    
            let homogonized = this.camera.getProjectionMatrix().multiply(vertex.pos);
            
            let p = 1 / homogonized.w();
            
            let projected = Matrix.scalingMatrix(p).multiply(homogonized);
    
            projectedPoints.push(projected.toVector());
    
        });   
        
        return projectedPoints;
		
    }
    
};