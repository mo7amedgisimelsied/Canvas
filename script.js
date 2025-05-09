let canvas = document.querySelector('canvas');
canvas.width =  1080;
canvas.height = 1080;

let c = canvas.getContext('2d');

let tool = "line";
let line = document.getElementById('line');
let rect = document.getElementById('rect');
let circ = document.getElementById('circ');
let clear = document.getElementById('clear');
let stroke_color = 'black';
const selec_fill = document.getElementById('fill');
const selec_stroke = document.getElementById('stroke');
let selec_color = true;
const fillButton = document.getElementById('fill');
    

selec_fill.addEventListener('click', () => {
    selec_color = true;
})


selec_stroke.addEventListener('click', () => {
    selec_color = false;
})


function setColor(color){
if (selec_color){
    fill = color;
    selec_fill.style = `background-color: ${fill}`
}
else {
    stroke_color = color
    selec_stroke.style = `background-color: ${stroke_color}`
};
}

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
    constructor(x, y, width, height, _stroke, _fill, _stroke_color){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.stroke = _stroke;
        this.fill = _fill;
        this.stroke_color = _stroke_color;
    }
}


class Circle{
    constructor(x, y, width, height, _stroke, _fill, _stroke_color){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.stroke = _stroke;
        this.fill = _fill;
        this.stroke_color = _stroke_color;
    }
}


document.addEventListener('mousedown', (e) =>{
    startX = e.clientX - canvas.offsetLeft;
    startY = e.clientY - canvas.offsetTop;
    start = true;
})

document.addEventListener('mousemove', (e) => {
    if (tool == 'line'){
        c.strokeStyle = stroke_color;
        drawLines({clientX: e.clientX - canvas.offsetLeft, clientY: e.clientY - canvas.offsetTop});
    }
})

document.addEventListener('mouseup', (e) => {
    start = false;
    c.beginPath();
    switch (tool){
        case 'rect':
            if (startX == e.clientX - canvas.offsetLeft && startY == e.clientY - canvas.offsetTop) return;
            drawRect(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
            break;
        case 'circ':
            if (startX == e.clientX - canvas.offsetLeft && startY == e.clientY - canvas.offsetTop) return;
            drawCirc({clientX: e.clientX - canvas.offsetLeft, clientY: e.clientY - canvas.offsetTop});
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
    elements.push(new Rectangle(startX, startY,  x - startX, y - startY, stroke, fill, stroke_color));
    draw();
}

function drawCirc(e) {
    const x = Math.abs(e.clientX - startX);
    const y = Math.abs(e.clientY - startY);
    const centerX = (e.clientX + startX) / 2;
    const centerY = (e.clientY + startY) / 2;
    elements.push(new Circle(centerX, centerY, x / 2, y / 2,  stroke, fill, stroke_color));
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
        c.strokeStyle = element.stroke_color;
        c.fillStyle = element.fill;
        c.ellipse(element.x, element.y, element.width, element.height, 0, 0, 2 * Math.PI);
        c.fill();
        c.stroke();
    }
    else if (element instanceof Rectangle){
        c.lineWidth = element.stroke;
        c.strokeStyle = element.stroke_color;
        c.fillStyle = element.fill;
        c.fillRect(element.x, element.y, element.width, element.height);
        c.strokeRect(element.x, element.y, element.width, element.height);
    }
 });
}