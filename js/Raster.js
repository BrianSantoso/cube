'use strict';


function Raster(width, height){
    
    this.width = width;
    this.height = height;
    this.halfWidth = this.width / 2 | 0;
    this.halfHeight = this.height / 2 | 0;
    this.pixels = new ImageData(this.width, this.height);
    this.depthBuffer = new Float32Array(this.width * this.height).map(c => Number.POSITIVE_INFINITY);
    
    this.clear();
}

Raster.getRed = (rgb) => (rgb & 0xff0000) >> 16;
Raster.getGreen = (rgb) => (rgb & 0xff00) >> 8;
Raster.getBlue = (rgb) => (rgb & 0xff);

Raster.rgb = (r, g, b) => r << 24 | g << 16 | b << 8;

// screen coordinates a, b, c
Raster.getTrianglePixels = function(sa, sb, sc, wireFrame){

    return wireFrame ? Raster.getPointsOnTriangle(sa, sb, sc) : Raster.getPointsInTriangle(sa, sb, sc);

};

// screen coordinates a, b, c
Raster.getPointsInTriangle = function(sa0, sb0, sc0){
    
    let pointsInTriangle = [];

    let a = new Vector(sa0[0], sa0[1], 0);
    let b = new Vector(sb0[0], sb0[1], 0);
    let c = new Vector(sc0[0], sc0[1], 0);
    
    let side1 = b.minus(a);
    let side2 = c.minus(b);
    let side3 = a.minus(c);

    let x0 = Math.min(a.x, Math.min(b.x, c.x)) | 0;
    let y0 = Math.min(a.y, Math.min(b.y, c.y)) | 0;

    let x1 = Math.max(a.x, Math.max(b.x, c.x)) | 0;
    let y1 = Math.max(a.y, Math.max(b.y, c.y)) | 0;

    // not using isInTriangle method in order to avoid recalculating side vectors

    for(let x = x0; x < x1; x++){
        for(let y = y0; y < y1; y++){

            let point = new Vector(x, y, 0);

            let AP = point.minus(a);
            if(AP.cross2(side1) > 0)
                continue;

            let BP = point.minus(b);
            if(BP.cross2(side2) > 0)
                continue;

            let CP = point.minus(c);
            if(CP.cross2(side3) > 0)
                continue;

            pointsInTriangle.push([x, y]);

        }
    }

    return pointsInTriangle;

};

Raster.getPointsOnTriangle = function(a, b, c){
    
    let tri = [];
    
    tri.push.apply(tri, Raster.bresenham(a, b));
    tri.push.apply(tri, Raster.bresenham(b, c));
    tri.push.apply(tri, Raster.bresenham(c, a));
    
    return tri;

};

Raster.bresenham = function(a, b){
    
    let line = [];
    
    let x0 = Math.min(a[0], b[0]);
    let y0 = Math.min(a[1], b[1]);
    let x1 = Math.max(a[0], b[0]);
    let y1 = Math.max(a[1], b[1]);
    
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;
    
    while(true){
        
        line.push([x0, y0]);
        
        if(x0 == x1 && y0 == y1) break;
        let e2 = err << 1;
        
        if(e2 > -dy){
            
            err -= dy;
            x0 += sx;
            
        }
        
        if(e2 < dx){
            
            err += dx;
            y0 += sy;
            
        }
        
    }
    
    return line;
    
}

Raster.barycentricInterpolation2 = function(a, aValue, b, bValue, c, cValue, point){
    
    let weights = Raster.barycentricWeights2(a, b, c, point);
    
    return aValue * weights[0] + bValue * weights[1] + cValue * weights[2];
    
};

Raster.barycentricWeights2 = function(a, b, c, point){
    
    let totalArea = Raster.areaOfTriangle2(a, b, c);
    let areaOfTriangleA = Raster.areaOfTriangle2(point, b, c);
    let areaOfTriangleB = Raster.areaOfTriangle2(point, c, a);
    let areaOfTriangleC = totalArea - areaOfTriangleA - areaOfTriangleB;
    
    return [
        
        areaOfTriangleA / totalArea,
        areaOfTriangleB / totalArea,
        areaOfTriangleC / totalArea
        
    ];
    
};

Raster.areaOfTriangle2 = function(a, b, c){
    
    let AB = b.minus(a);
    let AC = c.minus(a);
    
    // try taking out absolute value
    return Math.abs(AB.cross2(AC) * 0.5);
    
};

Raster.prototype = {
    
    getPixelIndex: function(x, y){
        
        return y * this.width * 4 + x * 4;
        
    },
    
    getDepthIndex: function(x, y){
        
        return y * this.width + x;
        
    },
    
    tryToSetPixel: function(x, y, depth, r, g, b){
        
        let newX = x + this.halfWidth;
        let newY = this.halfHeight - y - 1;
        
        if(newX < 0 || newX >= this.width || newY < 0 || newY >= this.height) return;
        
        let pixelIndex = this.getPixelIndex(newX, newY);
        let depthIndex = this.getDepthIndex(newX, newY);
        
        //console.log(newX, newY);
        //console.log(pixelIndex, depthIndex);
        
        if(depth < this.depthBuffer[depthIndex]){
            
            this.depthBuffer[depthIndex] = depth;
            
            ctx.fillStyle = 
                    'rgb(' + r + ',' +
                            g + ',' +
                            b + ')';
            ctx.fillRect(newX * scale, newY * scale, scale, scale);
//            this.pixels.data[pixelIndex + 0] = r;
//            this.pixels.data[pixelIndex + 1] = g;
//            this.pixels.data[pixelIndex + 2] = b;
//            this.pixels.data[pixelIndex + 3] = 255; // Alpha Channel. Set to opaque.
            
            
        }
        
    },
    
    clear: function(rgb = 0xfafafa){
      
        // Mutate existing arrays to minimize garbage collection
        
//        for(let i = 0; i < this.pixels.data.length; i++){
//            
//            this.pixels.data[i + 0] = Raster.getRed(rgb);
//            this.pixels.data[i + 1] = Raster.getGreen(rgb);
//            this.pixels.data[i + 2] = Raster.getBlue(rgb);
//            this.pixels.data[i + 3] = 255;  // Alpha Channel. Set to opaque.
//            
//        }
        ctx.fillStyle = '#fafafa'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        for(let i = 0; i < this.depthBuffer.length; i++){
            
            this.depthBuffer[i] = Number.POSITIVE_INFINITY;
            
        }
        
    },
    
    getScreenCoordinates: function(projectedPoint){
        
        return [
            projectedPoint.x * this.width | 0,
            projectedPoint.y * this.height | 0
        ];
        
    },
    
    draw: function(){
        
//        for(let x = 0; x < this.width; x++){
//            
//            for(let y = 0; y < this.height; y++){
//                
//                let index = this.getPixelIndex(x, y);
//                ctx.fillStyle = 
//                    'rgb(' + this.pixels.data[index + 0] + ',' +
//                            this.pixels.data[index + 1] + ',' +
//                            this.pixels.data[index + 2] + ')';
//                ctx.fillRect(x * 4, y * 4, 4, 4);
//                
//            }
//            
//        }
        //ctx.putImageData(this.pixels, 0, 0);
        
    }
    
};