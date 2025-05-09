let canvas = document.querySelector('canvas');
canvas.width =  1080;
canvas.height = 540;
let c = canvas.getContext('2d');


/* ______________________________________________ Variables __________________________________________ */

// toolbar buttons
let tool = "line";
let line = document.getElementById('line');
let rect = document.getElementById('rect');
let circ = document.getElementById('circ');
let clear = document.getElementById('clear');

// undo and redo
const undo = document.getElementById('undo');
const redo = document.getElementById('redo');

// stroke and fill
let stroke = 1;
let fill = "white";
let stroke_color = 'black';

// stroke plus and minus
const strokePlus = document.getElementById('strokePlus');
const strokeMinus = document.getElementById('strokeMinus');

// color selection
const selec_fill = document.getElementById('fill');
const selec_stroke = document.getElementById('stroke');


// layers
const elements = [];
const removed_items = [];
const layers = document.getElementById('layers');

// colors
let selec_color = true;
const fillButton = document.getElementById('fill');

// drawing
let start = false;
let startX, startY;


/* ______________________________________________ Event listeners __________________________________________ */

window.addEventListener('load', () => {
    elements.push(new Rectangle(0, 0, canvas.width, canvas.height, stroke, fill, stroke_color));
    draw();
})

// toolbar Listeners
line.addEventListener('click', () => {tool = 'line'});
rect.addEventListener('click', () => {tool = 'rect'});
circ.addEventListener('click', () => {tool = 'circ'});
clear.addEventListener('click', () => {
    elements.length = 0;
    elements.push(new Rectangle(0, 0, canvas.width, canvas.height, stroke, fill, stroke_color));
    draw();
});

// color selection
selec_fill.addEventListener('click', () => {
    if (!selec_color) {selec_fill.style.border = '3px solid #F25A29'; selec_stroke.style.border = 'none';}
    selec_color = true;
})

selec_stroke.addEventListener('click', () => {
    if (selec_color) {selec_stroke.style.border = '3px solid #F25A29'; selec_fill.style.border = 'none';}
    selec_color = false;
})


// undo and redo
undo.addEventListener('click', () => {
    removed_items.push(elements.pop());
    draw();
})

redo.addEventListener('click', () => {
    elements.push(removed_items.pop());
    draw();
})


// drawing
canvas.addEventListener('mousedown', (e) =>{
    startX = e.clientX - canvas.offsetLeft;
    startY = e.clientY - canvas.offsetTop;
    start = true;
})

canvas.addEventListener('mousemove', (e) => {
    if (tool == 'line'){
        c.strokeStyle = stroke_color;
        drawLines({clientX: e.clientX - canvas.offsetLeft, clientY: e.clientY - canvas.offsetTop});
    }
})

canvas.addEventListener('mouseup', (e) => {
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

// stroke
strokePlus.addEventListener('click', () => {
    stroke += 1;
    c.lineWidth = stroke;
})
strokeMinus.addEventListener('click', () => {
    stroke -= 1;
    c.lineWidth = stroke;
})


/* ______________________________________________ Functions __________________________________________ */

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

function draw(){
 c.clearRect(0, 0, canvas.width, canvas.height);
 layers.innerHTML = '';
 elements.forEach(element => {
    layers.innerHTML += `<div class="layer">
    <svg viewBox="0 0 16 16">
        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
    </svg> 

    <svg viewBox="0 0 16 16">
        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
    </svg>
    ${element.id}
    </div>`
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