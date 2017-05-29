'use strict';

function Matrix(m){
    
    this.m = m;
    
}

Matrix.translationMatrix = function(tx, ty, tz){
    
    return new Matrix([
        
        [1, 0, 0, tx],
        [0, 1, 0, ty],
        [0, 0, 1, tz],
        [0, 0, 0, 1]
        
    ]);
    
};

Matrix.scalingMatrix = function(s){
    
    return new Matrix([
        
        [s, 0, 0, 0],
        [0, s, 0, 0],
        [0, 0, s, 0],
        [0, 0, 0, 1]
        
    ]);
    
};

Matrix.xAxisRotationMatrix = function(radians){
    
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    
    return new Matrix([
        
        [1,    0,    0,    0],
        [0,    cos,  -sin, 0],
        [0,    sin,  cos,  0],
        [0,    0,    0,    1]
        
    ]);
    
};

Matrix.yAxisRotationMatrix = function(radians){
    
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    
    return new Matrix([
        
        [cos,  0,  sin,    0],
        [0,    1,    0,    0],
        [-sin, 0,  cos,    0],
        [0,    0,    0,    1]
        
    ]);
    
};

Matrix.zAxisRotationMatrix = function(radians){
    
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    
    return new Matrix([
        
        [cos, -sin,    0,    0],
        [sin,  cos,    0,    0],
        [0,      0,    1,    0],
        [0,      0,    0,    1]
        
    ]);
    
};

Matrix.prototype = {
    
    x: function(){ return this.m[0][0]; },
    y: function(){ return this.m[1][0]; },
    z: function(){ return this.m[2][0]; },
    w: function(){ return this.m[3][0]; },
    
    getCols: function(){ return this.m[0].length; },
    getRows: function(){ return this.m.length; },
    
    multiply: function(mat){
    
//        if(this.getCols() != mat.getRows())
//            console.error("Incompatible dimensions for Matrix multiplication");
    
        //let resultArr = makeArray(this.getRows(), mat.getCols(), 0);
        
        let resultArr = mat.getCols() === 1 ? [[0], [0], [0], [0]] : [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
        
        //console.log(resultArr);
        
        for(let ar = 0; ar < this.getRows(); ar++){
            for(let bc = 0; bc < mat.getCols(); bc++){
                
                for(let i = 0; i < this.getCols(); i++)
                    resultArr[ar][bc] += this.m[ar][i] * mat.m[i][bc];
            }
        }
        
        return new Matrix(resultArr);

        
//        if(mat.getCols == 0){
//            
//            let a = this.m;
//            let b = mat.m;
//            
//            return new Martix([
//                
//                [a[0][0] * b[0][0] + a[0][1] * b[1][0] + a[0][2] * b[2][0] + a[0][3] * b[3][0]],
//                [a[1][0] * b[0][0] + a[1][1] * b[1][0] + a[1][2] * b[2][0] + a[1][3] * b[3][0]],
//                [a[2][0] * b[0][0] + a[2][1] * b[1][0] + a[2][2] * b[2][0] + a[2][3] * b[3][0]],
//                [a[3][0] * b[0][0] + a[3][1] * b[1][0] + a[3][2] * b[2][0] + a[3][3] * b[3][0]]
//                
//            ]);
//            
//        }
//        
////        if(this.getCols() != mat.getRows())
////            console.error("Incompatible dimensions for Matrix multiplication");
//    
//        //let resultArr = makeArray(this.getRows(), mat.getCols(), 0);
//        
//        let resultArr = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
//        
//        //console.log(resultArr);
//        
//        for(let ar = 0; ar < this.getRows(); ar++){
//            for(let bc = 0; bc < mat.getCols(); bc++){
//                
//                for(let i = 0; i < this.getCols(); i++)
//                    resultArr[ar][bc] += this.m[ar][i] * mat.m[i][bc];
//            }
//        }
//        
//        return new Matrix(resultArr);
////        
        
        
    },
    
    determinant: function(){

        
        
    },
    
    toVector: function(){
        
        return new Vector(this.x(), this.y(), this.z());
        
    },
    
    toString: function(){
        
        let str = '';
        for(let r = 0; r < this.getRows(); r++){
            
            for(let c = 0; c < this.getCols(); c++){
             
                str += this.m[r][c] + '   ';
                
            }
                
            str += '\n';
            
        }
        
        return str;
        
    }
    
};

Matrix.IDENTITY = Matrix.scalingMatrix(1);

Matrix.xAxisRotation90CC = new Matrix([
    
    [1,  0,  0,  0],
    [0,  0, -1,  0],
    [0,  1,  0,  0],
    [0,  0,  0,  1]
    
]);

Matrix.yAxisRotation90CC = new Matrix([
    
    [0,  0,  1,  0],
    [0,  1,  0,  0],
    [-1, 0,  0,  0],
    [0,  0,  0,  1]
    
]);

Matrix.zAxisRotation90CC = new Matrix([
    
    [0, -1,  0,  0],
    [1,  0,  0,  0],
    [0,  0,  1,  0],
    [0,  0,  0,  1]
    
]);

Matrix.xAxisRotation90C = new Matrix([
    
    [1,  0,  0,  0],
    [0,  0,  1,  0],
    [0, -1,  0,  0],
    [0,  0,  0,  1]
    
]);

Matrix.yAxisRotation90C = new Matrix([
    
    [0,  0, -1,  0],
    [0,  1,  0,  0],
    [1,  0,  0,  0],
    [0,  0,  0,  1]
    
]);

Matrix.zAxisRotation90C = new Matrix([
    
    [0,  1,  0,  0],
    [-1, 0,  0,  0],
    [0,  0,  1,  0],
    [0,  0,  0,  1]
    
]);