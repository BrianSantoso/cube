'use strict';

function Ray(pos, direction){
    
    // direction must be normalized
    
    this.pos = pos;
    this.direction = direction;
    
}

Ray.prototype = {
    
    intersectsTriangle: function(a, b, c){
        
        let ab = b.minus(a);
        let bc = c.minus(b);
        
//        let ac = c.minus(a);
        
        let normal = ab.cross(bc).normalize();
//        let normal = ab.cross(bc).normalize();
        let plane = new Plane(a, normal);
        
        let intersection = this.xPlane(plane);
        
        if(!intersection.valid) return false;
        
        let point = intersection.pos;
        
        let ca = a.minus(c)
        
        if(point.minus(a).cross2(ab) > 0) return false;
        if(point.minus(b).cross2(bc) > 0) return false;
        if(point.minus(c).cross2(ca) > 0) return false;
        
        return true;
        
    },
    
    xPlane: function(plane){
        
        let denom = this.direction.dot(plane.normal);
        
        if(denom == 0) return {valid: false};
        
        let t = plane.pos.minus(this.pos).dot(plane.normal) / denom;
        
        if(t < 0) return {valid: false};
        
        let pos = this.pos.plus(this.direction.scale(t));
        
        return {
            valid: true,
            pos: pos,
            squaredDistance: this.pos.getDistanceSquared(pos)
        };
        
    }
    
};