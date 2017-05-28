function Move(sector, cc, animated){
    
    this.sector = sector;
    this.cc = cc;
    this.animated = animated;
    
}

Move.prototype = {
    
    inverse: function(){
        
        return new Move(this.sector, !this.cc, this.animated);
        
    }
    
};