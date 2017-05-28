'use strict';

function StickerData(face, stickerCoordinates, sectors){
    
    // The 2 axis parallel to the sticker.
    
    this.axis = [
        
        ((face + 1) % 3) + (face > 2 ? 3 : 0),
        ((face + 2) % 3) + (face > 2 ? 3 : 0)
        
    ];
    
    this.sectors = sectors;
    this.stickerCoordinates = stickerCoordinates;
    this.face = face;
    
}