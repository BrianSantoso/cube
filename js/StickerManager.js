'use strict';

function StickerManager(n) {
    
    this.n = n;
    this.t = (n - 1) / 2;
    
    this.staticNet = new Array(6);
    for (let i = 0; i < this.staticNet.length; i++) {
        
        this.staticNet[i] = makeArray(this.n, this.n);
        
    }
    
    this.dynamicNet = [];
    
    for (let face = 0; face < 6; face++) {
        
        for (let x = 0; x < this.n; x++) {
            for (let y = 0; y < this.n; y++) {
             
                let stickerCoordinates = [x, y];
                
                let location = this.getLocation(face, stickerCoordinates);
                let sectors = [
                    
                    [0, Math.floor(location.x())],
                    [1, Math.floor(location.y())],
                    [2, Math.floor(location.z())],
                    
                ];
                
                this.staticNet[face][x][y] = new StickerData(face, stickerCoordinates, sectors);
                
            }
        }
        
    }
    
    this.turnCCMatrices = [
        
        Matrix.translationMatrix(0, this.t, this.t).multiply(Matrix.xAxisRotation90CC).multiply(Matrix.translationMatrix(0, -this.t, -this.t)),
        Matrix.translationMatrix(this.t, 0, this.t).multiply(Matrix.yAxisRotation90CC).multiply(Matrix.translationMatrix(-this.t, 0, -this.t)),
        Matrix.translationMatrix(this.t, this.t, 0).multiply(Matrix.zAxisRotation90CC).multiply(Matrix.translationMatrix(-this.t, -this.t, 0)),
        
        Matrix.translationMatrix(0, this.t, this.t).multiply(Matrix.xAxisRotation90C).multiply(Matrix.translationMatrix(0, -this.t, -this.t)),
        Matrix.translationMatrix(this.t, 0, this.t).multiply(Matrix.yAxisRotation90C).multiply(Matrix.translationMatrix(-this.t, 0, -this.t)),
        Matrix.translationMatrix(this.t, this.t, 0).multiply(Matrix.zAxisRotation90C).multiply(Matrix.translationMatrix(-this.t, -this.t, 0))
        
    ];
    
    this.faceMatrices = [
        
        new Vector(this.n - 1, this.t, this.t).toMatrix(),
        new Vector(this.t, this.n - 1, this.t).toMatrix(),
        new Vector(this.t, this.t, 0).toMatrix(),
        new Vector(0, this.t, this.t).toMatrix(),
        new Vector(this.t, 0, this.t).toMatrix(),
        new Vector(this.t, this.t, this.n - 1).toMatrix()
        
    ];
    
    
}

StickerManager.prototype = {
    
    getStickerCoordinates: function(face, x, y, z) {
        
        let n = this.n;
        
        if (face == 0) return [y, n - z - 1];
        if (face == 1) return [x, n - z - 1];
        if (face == 2) return [x, y];
        if (face == 3) return [n - y - 1, n - z - 1];
        if (face == 4) return [x, n - z - 1];
        return [x, n - y - 1];
        
    },
    
    getLocation: function(face, stickerCoordinates) {
        
        let x = stickerCoordinates[0];
        let y = stickerCoordinates[1];
        
        let n = this.n;
        
        if (face == 0) return new Vector(n - 1, x, n - y - 1).toMatrix();
        if (face == 1) return new Vector(x, n - 1, n - y - 1).toMatrix();
        if (face == 2) return new Vector(x, y, 0).toMatrix();
        if (face == 3) return new Vector(0, n - x - 1, n - y - 1).toMatrix();
        if (face == 4) return new Vector(x, 0, n - y - 1).toMatrix();
        return new Vector(x, n - y - 1, n -1).toMatrix();
        
    },
    
    getStickerData: function(sticker) {
        
        let stickerCoordinates = sticker.stickerCoordinates;
        return this.staticNet[sticker.face][stickerCoordinates[0]][stickerCoordinates[1]];
        
    },
    
    addSticker: function(sticker) {
        
        this.dynamicNet.push(sticker);
        
    },
    
    getFaceFromMatrix: function(faceMatrix) {
        
        for (let rep = 0; rep < 6; rep++) {
            
            if (faceMatrix.toVector().equals(this.faceMatrices[rep].toVector()))
                return rep;
            
        }
        
    },
    
    rotateStickerData: function(sector, cc) {
      
        let sectorSelection = [];
        
        this.dynamicNet.forEach(sticker => {
            
            if (sticker.location.m[sector[0]][0] == sector[1])
                sectorSelection.push(sticker);
            
        });
        
        let transformation = this.turnCCMatrices[sector[0] + (cc ? 0 : 3)];
        
        sectorSelection.forEach(sticker => {
            
            let location = sticker.location;
            let faceMatrix = this.faceMatrices[sticker.face];
            
            let newLocation = transformation.multiply(location);
            let newFace = this.getFaceFromMatrix(transformation.multiply(faceMatrix));
            
            sticker.face = newFace;
            sticker.location = newLocation;
            sticker.stickerCoordinates = this.getStickerCoordinates(newFace, Math.floor(newLocation.x()), Math.floor(newLocation.y()), Math.floor(newLocation.z()));
            
        });
        
    },
    
};