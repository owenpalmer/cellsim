class Grid {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.cells = new Array(width * height).fill(0);
    }

    getCell(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return null;
        }
        return this.cells[y * this.width + x];
    }

    setCell(x, y, value) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return;
        }
        this.cells[y * this.width + x] = value;
    }

    clear() {
        this.cells.fill(0);
    }

    // Convert screen coordinates to grid coordinates
    screenToGrid(screenX, screenY, cellSize) {
        const x = Math.floor(screenX / cellSize);
        const y = Math.floor(screenY / cellSize);
        return { x, y };
    }

    // Get all neighboring cells (including diagonals)
    getNeighbors(x, y) {
        const neighbors = [];
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue;
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
                    neighbors.push({ x: nx, y: ny, value: this.getCell(nx, ny) });
                }
            }
        }
        return neighbors;
    }

    // Get empty neighboring cells
    getEmptyNeighbors(x, y) {
        return this.getNeighbors(x, y).filter(n => n.value === 0);
    }
}
