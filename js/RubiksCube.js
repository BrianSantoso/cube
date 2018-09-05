/*

    Brian Santoso
    APCSP p.3B
    May 2017

*/

function RubiksCube(n, scale){
    
    this.n = n < 1 ? 1 : n;
    this.t = (this.n - 1) / 2;
    this.size = 4.2 / n * scale;
    
    console.log(this.size)
    
    let z = new Vector(1, 1, 1).scale(this.t).getMagnitude();
//    this.pos = new Vector(0, 0, -4 - z);
//    this.pos = new Vector(0, 0, -12.7729 - z);
    this.pos = new Vector(0, 0, -12.7729);
    this.axis = [
        
        Vector.RIGHT,   // 0
        Vector.UP,      // 1
        Vector.BACK,    // 2
        Vector.LEFT,    // 3
        Vector.DOWN,    // 4
        Vector.FORWARD  // 5
        
    ];
    
    this.stickerManager = new StickerManager(this.n);
    
    this.colorSchemes = [
        
        [
            0xffffff,
            0xffffff,
            0xffffff,
            0xffffff,
            0xffffff,
            0xffffff,
            0x000000
        ],
        
        [
            0xff6600,   // 0: Orange. Right Face.
            0xffffff,   // 1: White. Up Face.
            0x1e90ff,   // 2: Blue. Front Face.
            0xfe0000,   // 3: Red. Left Face.
            0xffff00,   // 4: Yellow. Down Face.
            0x00ff00,   // 5: Green. Back Face.
            0x080808    // 6: Black. Cube's background color.
        ],
        
        [
            0xff6600,   // 0: Orange. Right Face.
            0xcbcbcb,   // 1: White. Up Face.
            0x1e90ff,   // 2: Blue. Front Face.
            0xfe0000,   // 3: Red. Left Face.
            0xfafa00,   // 4: Yellow. Down Face.
            0x00ff00,   // 5: Green. Back Face.
            0xfbfbfb    // 6: White. Cube's background color.
            
        ]
        
    ];
    
    this.colorScheme = this.colorSchemes[1];
    
    // Polynomial expressing number of pieces of an N x N x N cube:
    // 6n^2 - 12n + 8, n > 1
    const len = this.n === 1 ? 1 : 6 * this.n * this.n - 12 * this.n + 8;
    this.pieces = new Array(len);
    this.constructPieces();
    
    //this.moves = new LinkedList();
    this.moves = []; // Moves history
    this.movesIndex = -1;
    
    this.animationQueue = [];
    this.animationFrames = 10;
    
    this.selectedSticker = null;
    this.selectedStickerData = null;
    this.minDragDistance = 3;
    this.minRadians = Math.PI / 6;
    this.lockedRotationAxisIndex = -1;
    this.accumulatedRadians = 0;
    
    this.rotationSensitivity = 0.0175;
    this.translationSensitivity = 0.05;
    
    this.rotateCube(new EAngle(Math.PI / 6, Math.PI / 4, 0));
    
}

RubiksCube.prototype = {
    
    undo: function(){
        
//        if(this.movesIndex > 0){
//            this.movesIndex--;
//            let prevMove = this.moves.get(this.movesIndex);
//            this.makeMove(prevMove.inverse(), false);
//        }
        
        
        if(!this.isAnimating() && this.movesIndex >= 0){
            
            
            this.makeMove(this.moves[this.movesIndex].inverse());
            this.movesIndex--;
        }
        
    },
    
    redo: function(){
//        
//        if(this.movesIndex < this.moves.length){
//            
//            this.makeMove(this.moves.get(++this.movesIndex));
//        }
        
        if(!this.isAnimating() && this.movesIndex < this.moves.length - 1){
            
            this.movesIndex++;
            this.makeMove(this.moves[this.movesIndex]);
            
        }
        
    },
    
    scramble: function(){
        
        if(this.isAnimating())
            return;
        
        for(let i =0; i < 7 * this.n; i++){
            
            this.makeMove(this.getRandomMove())
            
        }
        
    },
    
    getRandomMove: function(animated = true){
        
        let sector = [Math.random() * 3 | 0, Math.random() * this.n | 0];
        let cc = Math.random() < 0.5;
        
        return new Move(sector, cc, animated, true);
        
    },
    
    constructPieces: function(){
        
        let index = 0;
        
        let pivot = this.pos.plus(new Vector(-this.t, -this.t, this.t).scale(this.size));
        
        for(let x = 0; x < this.n; x++){
            for(let y = 0; y < this.n; y++){
                for(let z = 0; z < this.n; z++){
                    
                    if(this.isOnOutside(x, y, z)){
                        
                        let pos = pivot.plus(new Vector(x, y, -z).scale(this.size));
                        let location = new Vector(x, y, z).toMatrix();
                        let facesToAdd = [];
                        
                        for(let face = 0; face < 6; face++){
                            
                            let f = new Face(Face.constructFaceVertices(pos, EAngle.AXIS_ANGLES[face], this.size / 2, this.size, this.colorScheme[6]));
                            facesToAdd.push(f);
                            
                            if(this.isOnFace(face, x, y, z)){
                                
                                let stickerCoordinates = this.stickerManager.getStickerCoordinates(face, x, y, z);
                                let s = new Sticker(Face.constructFaceVertices(pos, EAngle.AXIS_ANGLES[face], this.size / 2 + 0.12, this.size * 0.8, this.colorScheme[face]), stickerCoordinates, face, location);
                                this.stickerManager.addSticker(s);
                                facesToAdd.push(s);
                                
                            }
                            
                        }
                        
                        this.pieces[index++] = new Cublet(location, facesToAdd);
                    }
                    
                }
            }
        }
        
    },
    
    isOnOutside: function(x, y, z){
        
        return  x == 0 || x == this.n- 1 ||
                y == 0 || y == this.n - 1 ||
                z == 0 || z == this.n - 1;
        
    },
    
    isOnFace(face, x , y, z){
        
        let n = this.n;
        
        if(face == 0) return x == n - 1;
        else if(face == 1) return y == n - 1;
        else if(face == 2) return z == 0;
        else if(face == 3) return x == 0;
        else if(face == 4) return y == 0;
        return z == n - 1;
        
    },
    
    rotateCube: function(eAngle){
        
        let translation1 = Matrix.translationMatrix(-this.pos.x, -this.pos.y, -this.pos.z);
        let rotation = eAngle.rotationMatrix();
        let translation2 = Matrix.translationMatrix(this.pos.x, this.pos.y, this.pos.z);
        
        let transformation = translation2.multiply(rotation).multiply(translation1);
        
        for(let i = 0; i < this.axis.length; i++)
            this.axis[i] = rotation.multiply(this.axis[i].toMatrix()).toVector();
        
        this.applyTransformation(transformation);
        
    },
    
    rotateSectorData: function(sector, cc){
        
        let transformation = this.stickerManager.turnCCMatrices[sector[0] + (cc ? 0 : 3)];
        
        this.pieces.forEach(c => {
           
            if(c.isOnSector(sector)){
                
                c.rotateData(transformation);
                
            }
                
        });
        
    },
    
    applyTransformation: function(transformation){
        
        this.pos = transformation.multiply(this.pos.toMatrix()).toVector();
        
        this.pieces.forEach(c => c.applyTransformation(transformation));
        
    },
    
    rotateFace: function(sector, axisIndex, radians){
        
        this.pieces.forEach(c => {
           
            if(c.isOnSector(sector))
                c.rotate(this.pos, this.axis[axisIndex], radians);
            
        });
        
    },
    
    // Note that the setColor method of the RubiksCube takes an index,
    // while the setColor method of the Cublet, Face, and Sticker take an array.
    setColor: function(colorSchemeIndex){
        
        this.colorScheme = this.colorSchemes[colorSchemeIndex];
        this.pieces.forEach(c => c.setColor(this.colorScheme));
        
    },
    
    moveCube: function(tx, ty, tz){
        
        this.applyTransformation(Matrix.translationMatrix(tx, ty, tz));
        
    },
    
    interpolateFace: function(sector, axisIndex, radians, move){
      
        let radiansPerAnimation = radians / this.animationFrames;
        
        for(let rep = 0; rep < this.animationFrames; rep++){
            
            if(rep === this.animationFrames - 1 && move){
                
                this.animationQueue.unshift(new AnimationData(sector, axisIndex, radiansPerAnimation, move));
                
            } else {
                
                this.animationQueue.unshift(new AnimationData(sector, axisIndex, radiansPerAnimation));
                
            }
            
        }
        
    },
    
    makeMove: function(move){
        
        this.lockedRotationAxisIndex = move.sector[0];
        let cc2 = this.lockedRotationAxisIndex > 2 ^ move.cc ? -1 : 1;
        
        if(move.animated){
            
            this.interpolateFace(move.sector, this.lockedRotationAxisIndex, cc2 * (Math.PI / 2 - Math.abs(this.accumulatedRadians)), move);
            
        } else {
            
            this.rotateSectorData(move.sector, move.cc);
            this.stickerManager.rotateStickerData(move.sector, move.cc);
            
            // add move to moves linked list here
            if(move.addToMoves){
                
                
                
//                if(this.movesIndex != this.moves.length - 1) this.moves.breakAt(this.movesIndex);
//                this.moves.add(new Move(move.sector, move.cc, true));
//                this.movesIndex++;
                //this.movesIndex = this.moves.length;
                if(this.movesIndex < this.moves.length - 1) this.moves.splice(this.movesIndex + 1);
                this.movesIndex = this.moves.length;
                this.moves.push(new Move(move.sector, move.cc, true, false));
                
                
            }
            
        }
        
    },
    
    resetSelectionData: function(){
        
        this.selectedSticker = null;
        this.selectedStickerData = null;
        this.lockedRotationAxisIndex = -1;
        this.accumulatedRadians = 0;
        
    },
    
    lockRotationAxisIndex: function(index){
        
        this.lockedRotationAxisIndex = index;  
        
    },
    
    isAnimating: function(){
      
        return this.animationQueue.length > 0;
        
    },
    
    stickerSelected: function(){
      
        return this.selectedSticker != null;
        
    },
    
    rotationAxisLocked: function(){
        
        return this.lockedRotationAxisIndex > -1;  
        
    },
    
    whichSticker: function(ray){
    
        let dn = this.stickerManager.dynamicNet;
        for(let i = 0; i < dn.length; i++){
            
            let s = dn[i];
            if(dn[i].intersectsFace(ray))
                return s;
            
        }
        
        return null;
    
    },
    
    selectSticker: function(selectedSticker){
        
        this.selectedSticker = selectedSticker;
        this.selectedStickerData = this.stickerManager.getStickerData(selectedSticker);
        
    },
    
    keyInputs: function(){

        let direction = mouse.direction();
        let normalizedDirection = direction.normalize();

        let dragDirection = mouse.dragDirection();
        let normalizedDragDirection = dragDirection.normalize();

        if(mouse.left && !mouse.shift)
            this.rotateCube(new EAngle(-direction.y * this.rotationSensitivity, direction.x * this.rotationSensitivity, 0));
        
        if(!this.isAnimating()){
            
            if(mouse.right || (mouse.shift && mouse.down)){
                
                if(this.stickerSelected()){
                    
                    if(this.rotationAxisLocked()){
                        
                        let sector = this.selectedStickerData.sectors[this.lockedRotationAxisIndex % 3];
                        
                        let rotationAxis = this.axis[this.lockedRotationAxisIndex];
                        let cross = direction.cross2(rotationAxis);
                        let cc = cross > 0 ? 1 : -1;
                        
                        let radians = direction.getMagnitude() * this.rotationSensitivity * cc;
                        this.accumulatedRadians += radians;
                        
                        
                        // here?
                        this.rotateFace(sector, this.lockedRotationAxisIndex, radians);
                        
                        if(Math.abs(this.accumulatedRadians) > this.minRadians){
                            
                            this.makeMove(new Move(sector, (this.lockedRotationAxisIndex > 2) ^ (cc < 0), true, true));
                            this.resetSelectionData();
                            
                        }
                        
                    } else {
                        
                        if(dragDirection.getMagnitudeSquared() >= this.minDragDistance * this.minDragDistance){
                            
                            let axisIndices = this.selectedStickerData.axis;
                            
                            let dot1 = this.axis[axisIndices[0]].dot(normalizedDragDirection);
                            let dot2 = this.axis[axisIndices[1]].dot(normalizedDirection);
                            
                            let whichAxisIndexToLock = Math.abs(dot1) < Math.abs(dot2) ? axisIndices[0] : axisIndices[1];
                            
                            this.lockRotationAxisIndex(whichAxisIndexToLock);
                            
                        }
                        
                    }
                    
                } else {
                    
                    let ray = mouse.ray();
                    let requestedStickerSelection = this.whichSticker(ray);
                    
                    if(requestedStickerSelection)
                        this.selectSticker(requestedStickerSelection);
                    
                }
                
            } else {
                
                if(Math.abs(this.accumulatedRadians) > 0 && this.selectedStickerData){
                    
                    let sector = this.selectedStickerData.sectors[this.lockedRotationAxisIndex % 3];
                    this.interpolateFace(sector, this.lockedRotationAxisIndex, -this.accumulatedRadians);
                }
                
                this.resetSelectionData();
                
            }
            
        }
        
            


    },
    
    update: function(step){
        
        if(this.isAnimating()){
            
            let a = this.animationQueue[0];
            
            this.rotateFace(a.sector, a.axisIndex, a.radians);
            
            if(a.hasMove()){
                
                this.makeMove(new Move(a.move.sector, a.move.cc, false, a.move.addToMoves));
                
            }
            
            
            // Remove bottom item from stack
            this.animationQueue.splice(0, 1);
            
        }
        
    }
    
};

RubiksCube.DEFAULT_SIZE = 0.85;