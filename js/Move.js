function Move(sector, cc, animated, addToMoves){
    
    this.sector = sector;
    this.cc = cc;
    this.animated = animated;
    this.addToMoves = addToMoves || false;
    
}

Move.prototype = {
    
    inverse: function(){
        
        return new Move(this.sector, !this.cc, this.animated, false);
        
    }
    
};