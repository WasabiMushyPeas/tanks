var canvas
var context
var amplitude;
var frequency;
var frequency2;
var phase;
var phase2;
var canvasHeight;
var canvasWidth;
var tankHeight = 10;
var tankWidth = 20;
var tankX = 50;

function start(){
    // Get the canvas element
    canvas = document.getElementById('canvas');
    // Get the canvas context
    context = canvas.getContext('2d');
    // make canvas background black
    canvas.style.backgroundColor = 'black';

    // Get the canvas width and height
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

    amplitude = randomFloat(10, canvasHeight / 2.5);
    frequency = randomFloat(0, 0.01);
    frequency2 = randomFloat(0, 0.01);
    phase = randomFloat(0, 2 * Math.PI);
    phase2 = randomFloat(0, 2 * Math.PI);


    drawTerrain();
    drawTank(tankX);
    //drawTank(canvasWidth-tankInitialX);
    //console.log(terrainFunction(50));

}


function drawTerrain(){

    for (let i = 0; i < canvasWidth; i++){
        // i\sin\left(hx+k\right)\cos\left(lx\right)
        var y = terrainFunction(i);
        // draw white a rectangle at the current position
        context.fillStyle = 'white';
        context.fillRect(i, y, 1, canvasHeight);
    }

    console.log(amplitude + "*sin(" + frequency + " * " + "x" + " + " + phase + ") *cos(" + frequency2 + " * " + "x" + " + " + phase2 + ")");
}

function terrainFunction(x){
    let tempY = amplitude * Math.sin(frequency * x + phase) * Math.cos(frequency2 * x + phase2);
    return (canvasHeight/2)-tempY;    
}

function drawTank(x ){
    context.fillStyle = 'green';
    tankIntersectX = x;
    tankIntersectY = terrainFunction(x);

    // rotate the tank around the point (x, terrainFunction(x))
    context.translate(x, terrainFunction(x));
    context.rotate(-slopeToAngle(slopeFunction(x)));
    context.translate(-x, -terrainFunction(x));
    context.fillRect(x-(tankWidth/2), terrainFunction(x)-tankHeight, tankWidth, tankHeight);
    context.setTransform(1, 0, 0, 1, 0, 0);
    
}

function slopeFunction(x){
    return amplitude * ((frequency * Math.cos(frequency * x + phase) * Math.cos(frequency2 * x + phase2)) - (frequency2 * Math.sin(frequency * x + phase) * Math.sin(frequency2 * x + phase2)));
}

function tangentFunction(x){
    return slopeFunction(x) * x + terrainFunction(x);
}

function slopeToAngle(slope){
    return Math.atan(slope);
}

function randomFloat(min, max){
    return Math.random() * (max - min) + min;
}

function getTankY(x){
    return terrainFunction(x);
}


// Key press event listener
document.addEventListener('keydown', function(event){
    if (event.key == "ArrowRight"){
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawTerrain();
        tankX++;
        drawTank(tankX);
    }
    else if (event.key == "ArrowLeft"){
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawTerrain();
        tankX--;
        drawTank(tankX);
    }
});



// Physics of the projectile
var gravity = -9.8;
var initialVelocity = -100;
var angle = 0;
var time = 0;
var x = 0;
var y = 0;
var velocity = 0;

function spawnProjectile(){
    x = tankX;
    y = terrainFunction(tankX)+tankHeight;
    angle = 145 * Math.PI / 180;
    velocity = initialVelocity;
    time = 0;
    console.log("Projectile Spawned");
}

function updateProjectile(){
    x = tankX + velocity * Math.cos(angle) * time;
    y = terrainFunction(x) + velocity * Math.sin(angle) * time - 0.5 * gravity * time * time;
    time += 0.1;
    drawProjectile();
    console.log("Projectile Updated");
}

function drawProjectile(){
    context.fillStyle = 'red';
    context.beginPath();
    context.arc(x, y, 5, 0, 2 * Math.PI);
    context.fill();
    console.log("Projectile Drawn");
}


// When space is pressed, spawn a projectile and start the update loop
document.addEventListener('keydown', function(event){
    if (event.key == " "){
        spawnProjectile();
        setInterval(updateProjectile, 100);
    }
});