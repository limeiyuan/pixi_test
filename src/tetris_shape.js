class Shape {
    constructor() {
    }

    shapes;
    shapeIndex;
    color;
    x = 0;
    y = -4;

    rotate() {
        let destIndex = (this.shapeIndex + 1) % this.shapes.length;
        let xIndex = (this.x) / pixelSize;
        let yIndex = Math.floor((this.y) / pixelSize);
        //检查是否可以旋转
        if (this.canRotate(xIndex, yIndex, destIndex)) {
            this.shapeIndex = destIndex;
            return;
        }
        //计算目标图形最大宽
        let area = this.shapes[destIndex];
        let maxWidth = 0;
        area.forEach((row, rowIndex) => {
            let rowWidth = 0;
            row.forEach((pixel, colIndex) => {
                if (pixel !== 0) {
                    rowWidth += 1;
                }
            });
            if (rowWidth > maxWidth) {
                maxWidth = rowWidth;
            }
        })
        //尝试左右移动图形，看是否可以变形
        for (let offset = 1; offset < (maxWidth + 1); offset++) {
            if (this.canRotate(xIndex + offset, yIndex, destIndex)) {
                this.x += offset * pixelSize;
                this.shapeIndex = destIndex;
                return;
            }
            if (this.canRotate(xIndex - offset, yIndex, destIndex)) {
                this.x -= offset * pixelSize;
                this.shapeIndex = destIndex;
                return;
            }
        }
    }

    canRotate(x, y, index) {
        let area = this.shapes[index];
        let result = true;
        area.forEach((row, rowIndex) => {
            row.forEach((pixel, colIndex) => {
                if (pixel !== 0) {
                    let _x = x + colIndex;
                    let _y = y + rowIndex;
                    if (_y >= rowSize) {
                        result = false;
                        return;
                    }
                    if (_y < 0) {
                        result = false;
                        return;
                    }
                    if (_x < 0) {
                        result = false;
                        return;
                    }
                    if (_x >= colSize) {
                        result = false;
                        return;
                    }

                    if (map[_y][_x].value === 1) {
                        result = false;
                        return;
                    }
                }
            });
        })
        return result;
    }

    render(g) {
        g.beginFill(this.color);
        let area = this.shapes[this.shapeIndex];
        area.forEach((row, rowIndex) => {
            row.forEach((pixel, colIndex) => {
                if (pixel !== 0) {
                    let x = this.x + colIndex * pixelSize;
                    let y = this.y + rowIndex * pixelSize;
                    if (y > 20 * pixelSize) {
                        return;
                    }
                    if (x < -pixelSize || x >= colSize * pixelSize) {
                        return;
                    }
                    if (y < -pixelSize || y > rowSize * pixelSize) {
                        return;
                    }
                    // x = Math.min(x, (10 - 1) * pixelSize);
                    // x = Math.max(x, 0);
                    // y = Math.min(y, (20 - 1) * pixelSize);
                    // y = Math.max(y, 0);
                    g.drawRect(x + mask_x_offset, y + mask_y_offset, pixelSize, pixelSize);
                }
            });
        })
    };

    canDown(y) {
        //计算当前所在序号
        let xIndex = Math.floor((this.x) / pixelSize);
        let yIndex = Math.floor((y === undefined ? this.y : y) / pixelSize);
        let area = this.shapes[this.shapeIndex];
        let result = true;
        area.forEach((row, rowIndex) => {
            row.forEach((pixel, colIndex) => {
                if (pixel !== 0) {
                    let x = xIndex + colIndex;
                    let y = yIndex + rowIndex;
                    if (y > 18) {
                        result = false;
                        return;
                    }
                    if (y < -1) {
                        return;
                    }
                    if (map[y + 1][x].value !== 0) {
                        result = false;
                        return;
                    }
                }
            });
        })
        return result;
    }

    canRight() {
        //计算当前所在序号
        let xIndex = (this.x) / pixelSize;
        let yIndex = Math.floor((this.y) / pixelSize);
        let area = this.shapes[this.shapeIndex];
        let result = true;
        area.forEach((row, rowIndex) => {
            row.forEach((pixel, colIndex) => {
                if (pixel !== 0) {
                    let x = xIndex + colIndex;
                    let y = yIndex + rowIndex;
                    if (x > 8) {
                        result = false;
                        return;
                    }
                    if (y < 0) {
                        return;
                    }
                    if (map[y][x + 1].value !== 0) {
                        result = false;
                        return;
                    }
                }
            });
        })
        return result;
    }

    canLeft() {
        //计算当前所在序号
        let xIndex = (this.x) / pixelSize;
        let yIndex = Math.floor((this.y) / pixelSize);
        let area = this.shapes[this.shapeIndex];
        let result = true;
        area.forEach((row, rowIndex) => {
            row.forEach((pixel, colIndex) => {
                if (pixel !== 0) {
                    let x = xIndex + colIndex;
                    let y = yIndex + rowIndex;
                    if (x < 1) {
                        result = false;
                        return;
                    }
                    if (y < 0) {
                        return;
                    }
                    if (map[y][x - 1].value !== 0) {
                        result = false;
                        return;
                    }
                }
            });
        })
        return result;
    }

    destroy() {
        let xIndex = (this.x) / pixelSize;
        let yIndex = Math.floor((this.y) / pixelSize);
        let area = this.shapes[this.shapeIndex];
        area.forEach((row, rowIndex) => {
            row.forEach((pixel, colIndex) => {
                if (pixel !== 0) {
                    let x = xIndex + colIndex;
                    let y = yIndex + rowIndex;
                    if (y < 0) {
                        fail = true;
                        return;
                    }
                    if (map[y][x].value === 1) {
                        fail = true;
                    }
                    let p = new Pixel();
                    p.x = x;
                    p.y = y;
                    p.value = 1;
                    p.color = this.color;
                    map[y][x] = p;
                }
            });
        })
    }
}

//==
// ==
// 0 0 0 0
// 0 0 0 0
// 1 1 0 0
// 0 1 1 0
class Shape0 extends Shape {
    constructor() {
        super();
        this.color = 0x9a3cc2;
        this.shapes = [
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [1, 1, 0, 0],
                [0, 1, 1, 0],
            ],
            [
                [0, 0, 0, 0],
                [0, 1, 0, 0],
                [1, 1, 0, 0],
                [1, 0, 0, 0],
            ]
        ]
        this.shapeIndex = 0
    }
}

// ==
//==
// 0 0 0 0
// 0 0 0 0
// 0 1 1 0
// 1 1 0 0
class Shape1 extends Shape {
    constructor() {
        super();
        this.color = 0xf01da3;
        this.shapes = [
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [1, 1, 0, 0],
            ],
            [
                [0, 0, 0, 0],
                [1, 0, 0, 0],
                [1, 1, 0, 0],
                [0, 1, 0, 0],
            ]
        ]
        this.shapeIndex = 0
    }
}

// ==
//==
// 0 0 0 0
// 0 0 0 0
// 1 1 0 0
// 1 1 0 0
class Shape2 extends Shape {
    constructor() {
        super();
        this.color = 0x4c64ed;
        this.shapes = [
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [1, 1, 0, 0],
                [1, 1, 0, 0],
            ]
        ]
        this.shapeIndex = 0
    }
}

// ==
//==
// 0 0 0 0
// 1 0 0 0
// 1 0 0 0
// 1 1 0 0
class Shape3 extends Shape {
    constructor() {
        super();
        this.color = 0x20f01d;
        this.shapes = [
            [
                [0, 0, 0, 0],
                [1, 0, 0, 0],
                [1, 0, 0, 0],
                [1, 1, 0, 0],
            ],
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [1, 1, 1, 0],
                [1, 0, 0, 0],
            ],
            [
                [0, 0, 0, 0],
                [1, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
            ],
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 1, 0],
                [1, 1, 1, 0],
            ]
        ]
        this.shapeIndex = 0
    }
}

// ==
//==
// 0 0 0 0
// 0 1 0 0
// 0 1 0 0
// 1 1 0 0
class Shape4 extends Shape {
    constructor() {
        super();
        this.color = 0xf52c2c;
        this.shapes = [
            [
                [0, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [1, 1, 0, 0],
            ],
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [1, 0, 0, 0],
                [1, 1, 1, 0],
            ],
            [
                [0, 0, 0, 0],
                [1, 1, 0, 0],
                [1, 0, 0, 0],
                [1, 0, 0, 0],
            ],
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [1, 1, 1, 0],
                [0, 0, 1, 0],
            ]
        ]
        this.shapeIndex = 0
    }
}

// ==
//==
// 0 0 0 0
// 0 0 0 0
// 0 1 0 0
// 1 1 1 0
class Shape5 extends Shape {
    constructor() {
        super();
        this.color = 0xe5ed4c;
        this.shapes = [
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 1, 0, 0],
                [1, 1, 1, 0],
            ],
            [
                [0, 0, 0, 0],
                [1, 0, 0, 0],
                [1, 1, 0, 0],
                [1, 0, 0, 0],
            ],
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [1, 1, 1, 0],
                [0, 1, 0, 0],
            ],
            [
                [0, 0, 0, 0],
                [0, 1, 0, 0],
                [1, 1, 0, 0],
                [0, 1, 0, 0],
            ]
        ]
        this.shapeIndex = 0
    }
}

// ==
//==
// 1 0 0 0
// 1 0 0 0
// 1 0 0 0
// 1 0 0 0
class Shape6 extends Shape {
    constructor() {
        super();
        this.color = 0x4cede2;
        this.shapes = [
            [
                [1, 0, 0, 0],
                [1, 0, 0, 0],
                [1, 0, 0, 0],
                [1, 0, 0, 0],
            ],
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [1, 1, 1, 1],
            ]
        ]
        this.shapeIndex = 0
    }
}