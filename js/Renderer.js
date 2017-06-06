/*

    Brian Santoso
    APCSP p.3B
    May 2017

*/

'use strict';

function Renderer(camera, raster){
    
    this.wireFrame = false;
    this.zBuffering = true;
    
    this.camera = camera;
    this.raster = raster;
    
    this.vertices = [];
    
    // Performance Test (goal = 142)
    
//    for(let i = 0; i < 42; i++){
//        
//        this.addVertex(new Vertex(new Vector(0, 0.5, -5), 0xff0000));
//        this.addVertex(new Vertex(new Vector(0, 0, -5), 0xff0000));
//        this.addVertex(new Vertex(new Vector(0.5, 0, -5), 0xff0000));
//        
//    }
    
//    this.addVertex(new Vertex(new Vector(0, 1, -15), 0xff0000));
//    this.addVertex(new Vertex(new Vector(0, 0, -15), 0xff0000));
//    this.addVertex(new Vertex(new Vector(1, 0, -15), 0xff0000));
//    
//    this.addVertices(Face.constructFaceVertices(new Vector(0, 0, -12), EAngle.BACK, 0, 1, 0x00ff00));
    
}

Renderer.prototype = {
    
    render: function(){
        
        //let projectedPoints = this.getProjectedPoints();
        let projectedPoints = this.vertices.map(v => v.pos.toVector().scale(1 / -v.pos.z()));
        
        for(let i = 0; i < projectedPoints.length; i += 3){
            
            // Vertices
            let v0 = this.vertices[i + 0];
            let v1 = this.vertices[i + 1];
            let v2 = this.vertices[i + 2];
            
            // Projected Points (Vectors)
            let a = projectedPoints[i + 0];
            let b = projectedPoints[i + 1];
            let c = projectedPoints[i + 2];
            
            if(a.x < -1 || a.x > 1 || a.y < -1 || a.y > 1 || v0.pos.z > -1) continue;
            if(b.x < -1 || b.x > 1 || b.y < -1 || b.y > 1 || v1.pos.z > -1) continue;
            if(c.x < -1 || c.x > 1 || c.y < -1 || c.y > 1 || v2.pos.z > -1) continue;
            
            this.rasterize(v0, v1, v2, a, b, c);
            
        }
        
    },
    
    rasterize: function(v0, v1, v2, a, b, c){
        
//        let sa = this.raster.getScreenCoordinates(a);
//        let sb = this.raster.getScreenCoordinates(b);
//        let sc = this.raster.getScreenCoordinates(c);
//        
//        let x0 = Math.min(sa[0], Math.min(sb[0], sc[0])) | 0;
//        let y0 = Math.min(sa[1], Math.min(sb[1], sc[1])) | 0;
//
//        let x1 = Math.max(sa[0], Math.max(sb[0], sc[0])) | 0;
//        let y1 = Math.max(sa[1], Math.max(sb[1], sc[1])) | 0;
//        
//        let totalArea = Raster.areaOfTriangle2(a, b, c);
//        let areaOfTriangleA, areaOfTriangleB, areaOfTriangleC, rgb, red, green, blue, interpolate, depth;
//        // Mutate this vector
//        let point = new Vector(0, 0, -1);
//        // Mutate this array
//        let weights = [0, 0, 0];
//        
//        for(let x = x0; x < x1; x++){
//            for(let y = y0; y < y1; y++){
//                
//                point.x = x;
//                point.y = y;
//                
//                areaOfTriangleA = Raster.areaOfTriangle2(point, b, c);
//                areaOfTriangleB = Raster.areaOfTriangle2(point, c, a);
//                areaOfTriangleC = totalArea - areaOfTriangleA - areaOfTriangleB;
//                
//                weights[0] = areaOfTriangleA / totalArea;
//                weights[1] = areaOfTriangleB / totalArea;
//                weights[2] = areaOfTriangleC / totalArea;
//                
//                console.log(totalArea, areaOfTriangleA, areaOfTriangleB, areaOfTriangleC);
//                
//                if(0 <= weights[0] && weights[0] <= 1 && 0 <= weights[1] && weights[1] <= 1 && 0 <= weights[2] && weights[2] <= 1){
//                    
//                    
//                    
//                    interpolate = 1 / v0.pos.z() * weights[0] +
//                                    1 / v1.pos.z() * weights[1] +
//                                    1 / v2.pos.z() * weights[2];
//                    depth = -1 / interpolate;
//                    
//                    
//                    rgb = v0.rgb;
//                    red = (rgb & 0xff0000) >> 16;
//                    green = (rgb & 0xff00) >> 8;
//                    blue = (rgb & 0xff);
//                    
//                    this.raster.tryToSetPixel(x, y, depth, red, green, blue);
//                }
//                
//            }
//        }
        
        
        let trianglePixels = Raster.getTrianglePixels(
            
            this.raster.getScreenCoordinates(a),
            this.raster.getScreenCoordinates(b),
            this.raster.getScreenCoordinates(c),
            this.wireFrame

        );

        trianglePixels.forEach(p => {

            let depth = 0;

            if(this.zBuffering){

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

            // bit shifts have precendence over &, hence the parenthesis...

            let red = (rgb & 0xff0000) >> 16;
            let green = (rgb & 0xff00) >> 8;
            let blue = (rgb & 0xff);

            this.raster.tryToSetPixel(p[0], p[1], depth, red, green, blue);

//            
//            this.raster.tryToSetPixel(p[0], p[1], depth, 255, 0, 0);
        });
        
    },
    
    addVertices: function(arr){
        
        this.vertices.push.apply(this.vertices, arr);
        
    },
    
    addVertex: function(vertex){
        
        this.vertices.push(vertex);
        
    },
    
    getProjectedPoints: function(){
    
        let projectedPoints = [];
    
        this.vertices.forEach(vertex => {
    
            let homogonized = this.camera.getProjectionMatrix().multiply(vertex.pos);
            
            let p = 1 / homogonized.w();
    
//            let projected = new Matrix([
//    
//                [p, 0, 0, 0],
//                [0, p, 0, 0],
//                [0, 0, p, 0],
//                [0, 0, 0, 1],
//    
//            ]).multiply(homogonized);
            
            let projected = Matrix.scalingMatrix(p).multiply(homogonized);
    
            projectedPoints.push(projected.toVector());
    
        });   
        
        return projectedPoints;
    
    }
    
};