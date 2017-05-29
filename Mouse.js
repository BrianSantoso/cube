'use strict';

function Mouse(){
    
    this.x = 0;
    this.y = 0;
    this.down = false;
    this.left = false;
    this.right = false;
    
    this.dragStartX = 0;
    this.dragStartY = 0;
    
    this.dragEndX = 0;
    this.dragEndY = 0;
    
    this.prevX = 0;
    this.prevY = 0;
    
    this.pivotX = canvas.getBoundingClientRect().left | 0 + 1;
    this.pivotY = canvas.getBoundingClientRect().bottom | 0;
        
    
    this.calcX = e =>  e.clientX - this.pivotX;
    this.calcY = e =>  this.pivotY - event.clientY;
    
    this.onMove = function(e){
        
        this.prevX = this.x;
        this.prevY = this.y;
        
        this.x = this.calcX(e);
        this.y = this.calcY(e);
        
        this.dragEndX = this.x;
        this.dragEndY = this.y;
        
        //renderer.render();
    };
    
    this.onDown = function(e){
        
        this.updateState(e.button, true);
        
        this.dragStartX = this.calcX(e);
        this.dragStartY = this.calcY(e);
        
        
    };
    
    this.onUp = function(e){
      
        this.updateState(e.button, false);
        
        this.dragStartX = 0;
        this.dragSTartY = 0;
        this.dragEndX = 0;
        this.dragEndY = 0;
        e.preventDefault();
    };
        
    this.updateState = function(button, bool){
        
        this.down = bool;
        if(button == 0) this.left = bool;
        if(button == 2) this.right = bool;
        
    };
    
    this.dragDirection = function(){
        
        return this.dragEndToVector().minus(this.dragStartToVector());
        
    };
    
    this.direction = function(){
        
        return this.toVector().minus(this.prevToVector());
        
    };
    
    this.dragEndToVector = function(){
      
        return new Vector(this.dragEndX, this.dragEndY, 0);
        
    };
    
    this.dragStartToVector = function(){
        
        return new Vector(this.dragStartX, this.dragStartY, 0);
        
    };
    
    this.toVector = function(){
        
        return new Vector(this.x, this.y, 0);
        
    };
    
    this.ray = function(){
        
        let screenPoint = this.toVector();
        let point = new Vector(screenPoint.x / canvas.width - 0.5, screenPoint.y / canvas.height -0.5, -1);
        
        let origin = renderer.camera.pos;
        let direction = point.minus(origin).normalize();
        
        return new Ray(origin, direction);
        
    }
    
    this.prevToVector = function(){
        
        return new Vector(this.prevX, this.prevY, 0);
        
    };
    
    document.addEventListener('mousemove', function(e){
        
        this.onMove(e);
        
    }.bind(this), false);
    
    document.addEventListener('mousedown', function(e){
        
        this.onDown(e);
        
    }.bind(this), false);
    
    document.addEventListener('mouseup', function(e){
        
        this.onUp(e);
        
    }.bind(this), false);
    
    window.addEventListener('resize', function(e){
        
        this.pivotX = canvas.getBoundingClientRect().left | 0 + 1;
        this.pivotY = canvas.getBoundingClientRect().bottom | 0;
        
    }, false);
}