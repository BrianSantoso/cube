'use strict';

window.onload = init;

let canvas;
let ctx;
let sizeSelector;

let mouse;
let renderer;
let rubiksCube;

let now = timestamp();
let last = 0;
let dt = 0;
let accumulation = 0;
let fps = 0;

const step = 1/60;
let scale = 1.7; // 1.7, 0.7

function init() {
	
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    
    sizeSelector = document.getElementById('sizeSelector');
    
    mouse = new Mouse();
    let raster = new Raster(canvas.width / scale | 0, canvas.height / scale | 0)
    renderer = new Renderer(new Camera(), raster);
    rubiksCube = new RubiksCube(3, RubiksCube.DEFAULT_SIZE);
    
    requestAnimationFrame(frame);
    
    draw(dt);
}

function frame() {
	
    now = timestamp();
    dt = now - last;
    accumulation += Math.min(1, dt / 1000);
    fps = 1000 / dt;
    
    keyInputs();
    
    while (accumulation >= step) {
        
        update(step);
        //draw();
        accumulation -= step;
        
    }
    draw(dt);
    last = now;
    
    requestAnimationFrame(frame);
}

function keyInputs() {
    rubiksCube.keyInputs();
    mouse.prevX = mouse.x;
    mouse.prevY = mouse.y;
}

function update(step) {
    rubiksCube.update(step);
}

function draw(dt) {
  const mouseInBounds = mouse.y <= canvas.height && mouse.y >= 0 && 
        mouse.x >= 0 && mouse.x <= canvas.width;
    if (mouseInBounds || rubiksCube.animationQueue.length > 0) {
        renderer.raster.clear();
        renderer.render();
    }
}

function timestamp() {
    return window.performance.now();
}

function makeArray(rows, cols, val) {
    let resultArr = new Array(rows);
    
    for (let i = 0; i < resultArr.length; i++) {
        let subArray = new Array(cols);
        for (let j = 0; j < subArray.length; j++) {
         	subArray[j] = val;
        }
        resultArr[i] = subArray;
    }
    
    return resultArr;
}