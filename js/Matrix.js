'use strict';

function Matrix(m) {
    this.m = m;
}

Matrix.prototype = {
    
    x: function() { return this.m[0][0]; },
    y: function() { return this.m[1][0]; },
    z: function() { return this.m[2][0]; },
    w: function() { return this.m[3][0]; },
    
    getCols: function() { return this.m[0].length; },
    getRows: function() { return this.m.length; },
    
    multiply: function(mat) {
        
		let resultArr;
		if (mat.getCols() == 1) {
			resultArr = [[0], [0], [0], [0]];
		} else {
			resultArr = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
		}
		
        for (let ar = 0; ar < this.getRows(); ar++) {
            for (let bc = 0; bc < mat.getCols(); bc++) {
                for (let i = 0; i < this.getCols(); i++)
                    resultArr[ar][bc] += this.m[ar][i] * mat.m[i][bc];
            }
        }
        
        return new Matrix(resultArr);
    },
    
    determinant: function() {},
    
    toVector: function() {
        return new Vector(this.x(), this.y(), this.z());
    },
    
    toString: function() {
        let str = '';
        for (let r = 0; r < this.getRows(); r++) {
            for (let c = 0; c < this.getCols(); c++) {
                str += this.m[r][c] + '   ';
            }
            str += '\n';
        }
        
        return str;
    }
    
};

Matrix.translationMatrix = function(tx, ty, tz) {
    
    return new Matrix([
        
        [1, 0, 0, tx],
        [0, 1, 0, ty],
        [0, 0, 1, tz],
        [0, 0, 0, 1]
        
    ]);
    
};

Matrix.scalingMatrix = function(s) {
    
    return new Matrix([
        
        [s, 0, 0, 0],
        [0, s, 0, 0],
        [0, 0, s, 0],
        [0, 0, 0, 1]
        
    ]);
    
};

Matrix.xAxisRotationMatrix = function(radians) {
    
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    
    return new Matrix([
        
        [1,    0,    0,    0],
        [0,    cos,  -sin, 0],
        [0,    sin,  cos,  0],
        [0,    0,    0,    1]
        
    ]);
    
};

Matrix.yAxisRotationMatrix = function(radians) {
    
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    
    return new Matrix([
        
        [cos,  0,  sin,    0],
        [0,    1,    0,    0],
        [-sin, 0,  cos,    0],
        [0,    0,    0,    1]
        
    ]);
    
};

Matrix.zAxisRotationMatrix = function(radians) {
    
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    
    return new Matrix([
        
        [cos, -sin,    0,    0],
        [sin,  cos,    0,    0],
        [0,      0,    1,    0],
        [0,      0,    0,    1]
        
    ]);
    
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