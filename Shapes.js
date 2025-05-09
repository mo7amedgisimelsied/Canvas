class Rectangle{
    constructor(x, y, width, height, _stroke, _fill, _stroke_color){
        this.id = `rect${elements.length}`;
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
        this.id = `circ${elements.length}`;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.stroke = _stroke;
        this.fill = _fill;
        this.stroke_color = _stroke_color;
    }
}