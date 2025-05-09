let canvas = document.querySelector('canvas');
// canvas.width = window.innerWidth - 25;
// canvas.height = window.innerHeight - 25;

let c = canvas.getContext('2d');

let tool = "line";
let line = document.getElementById('line');
let rect = document.getElementById('rect');
let circ = document.getElementById('circ');
let clear = document.getElementById('clear');
const fillButton = document.getElementById('fill');
    


let stroke = 1;
let fill = "rgb(191, 255, 0)";
const elements = [];


clear.addEventListener('click', () => {c.clearRect(0, 0, canvas.width, canvas.height); elements.length = 0});
line.addEventListener('click', () => {tool = 'line'});
rect.addEventListener('click', () => {tool = 'rect'});
circ.addEventListener('click', () => {tool = 'circ'});

let start = false;
let startX, startY;

class Rectangle{
    constructor(x, y, width, height, _stroke, _fill){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.stroke = _stroke;
        this.fill = _fill;
    }
}


class Circle{
    constructor(x, y, width, height, _stroke, _fill){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.stroke = _stroke;
        this.fill = _fill;
    }
}


document.addEventListener('mousedown', (e) =>{
    startX = e.clientX;
    startY = e.clientY;
    start = true;
})

document.addEventListener('mousemove', (e) => {
    if (tool == 'line'){
        drawLines(e);
    }
})

document.addEventListener('mouseup', (e) => {
    start = false;
     c.beginPath();
    switch (tool){
        case 'rect':
            if (startX == e.clientX && startY == e.clientY) return;
            drawRect(e.clientX, e.clientY);
            break;
        case 'circ':
            if (startX == e.clientX && startY == e.clientY) return;
            drawCirc(e);
            break;
}
})

function drawLines(e){
    if (!start) return;
    c.lineTo(e.clientX, e.clientY);
    c.stroke();
    c.moveTo(e.clientX, e.clientY)
}

function drawRect(x, y){
    // c.strokeRect(startX, startY, x - startX, y - startY);
    elements.push(new Rectangle(startX, startY,  x - startX, y - startY, stroke, fill));
    draw();
}

function drawCirc(e) {
    const x = Math.abs(e.clientX - startX);
    const y = Math.abs(e.clientY - startY);
    const centerX = (e.clientX + startX) / 2;
    const centerY = (e.clientY + startY) / 2;
    // c.ellipse(centerX, centerY, x / 2, y / 2, 0, 0, 2 * Math.PI);
    // c.stroke();
    elements.push(new Circle(centerX, centerY, x / 2, y / 2,  stroke, fill));
    draw();
}

const strokePlus = document.getElementById('strokePlus');
const strokeMinus = document.getElementById('strokeMinus');
strokePlus.addEventListener('click', () => {
    stroke += 1;
    c.lineWidth = stroke;
})
strokeMinus.addEventListener('click', () => {
    stroke -= 1;
    c.lineWidth = stroke;
})

function draw(){
 c.clearRect(0, 0, canvas.width, canvas.height);
 elements.forEach(element => {
    if (element instanceof Circle){
        c.beginPath();
        c.lineWidth = element.stroke;
        c.fillStyle = element.fill;
        c.ellipse(element.x, element.y, element.width, element.height, 0, 0, 2 * Math.PI);
        c.fill();
        c.stroke();
    }
    else if (element instanceof Rectangle){
        c.lineWidth = element.stroke;
        c.fillStyle = element.fill;
        c.fillRect(element.x, element.y, element.width, element.height);
        c.strokeRect(element.x, element.y, element.width, element.height);
    }
 });
}