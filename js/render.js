class Renderer {
    constructor(canvas, grid) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.grid = grid;
        this.cellColors = {
            0: '#111', // Empty cell
            1: '#4a9', // Type 1 - Teal
            2: '#2b7', // Type 2 - Green
            3: '#a47', // Type 3 - Purple
            4: '#b52', // Type 4 - Orange
            5: '#d33'  // Type 5 - Red
        };
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Calculate cell size to fit grid in screen while maintaining aspect ratio
        const gridAspect = this.grid.width / this.grid.height;
        const screenAspect = this.canvas.width / this.canvas.height;
        
        if (gridAspect > screenAspect) {
            this.cellSize = this.canvas.width / this.grid.width;
        } else {
            this.cellSize = this.canvas.height / this.grid.height;
        }
        
        // Center the grid
        this.offsetX = (this.canvas.width - (this.grid.width * this.cellSize)) / 2;
        this.offsetY = (this.canvas.height - (this.grid.height * this.cellSize)) / 2;
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw cells by type to minimize state changes
        for (let type = 1; type <= 5; type++) {
            this.ctx.fillStyle = this.cellColors[type];
            this.ctx.beginPath();
            
            // Find all cells of this type
            for (let y = 0; y < this.grid.height; y++) {
                for (let x = 0; x < this.grid.width; x++) {
                    if (this.grid.getCell(x, y) === type) {
                        const screenX = this.offsetX + (x * this.cellSize);
                        const screenY = this.offsetY + (y * this.cellSize);
                        this.ctx.rect(screenX, screenY, this.cellSize, this.cellSize);
                    }
                }
            }
            
            this.ctx.fill();
        }

        // Draw grid lines only if cells are large enough
        if (this.cellSize >= 6) {
            this.ctx.strokeStyle = '#222';
            this.ctx.beginPath();
            
            // Vertical lines
            for (let x = 0; x <= this.grid.width; x++) {
                const screenX = this.offsetX + (x * this.cellSize);
                this.ctx.moveTo(screenX, this.offsetY);
                this.ctx.lineTo(screenX, this.offsetY + (this.grid.height * this.cellSize));
            }
            
            // Horizontal lines
            for (let y = 0; y <= this.grid.height; y++) {
                const screenY = this.offsetY + (y * this.cellSize);
                this.ctx.moveTo(this.offsetX, screenY);
                this.ctx.lineTo(this.offsetX + (this.grid.width * this.cellSize), screenY);
            }
            
            this.ctx.stroke();
        }
    }

    // Convert screen coordinates to grid coordinates
    screenToGrid(screenX, screenY) {
        const gridX = Math.floor((screenX - this.offsetX) / this.cellSize);
        const gridY = Math.floor((screenY - this.offsetY) / this.cellSize);
        return { x: gridX, y: gridY };
    }
}
