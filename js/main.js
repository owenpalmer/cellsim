// Initialize grid and renderer
const grid = new Grid(100, 100);
const canvas = document.getElementById('grid');
const renderer = new Renderer(canvas, grid);

// UI elements
const seedInput = document.getElementById('seed');
const clearButton = document.getElementById('clear');
const cellTypeSelect = document.getElementById('selected-type');

// Track if grid needs redraw
let needsRedraw = true;

// Handle mouse input
let isMouseDown = false;
let lastX = -1, lastY = -1;  // Track last cell modified to prevent redundant updates

canvas.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    handleMouseInput(e);
});

canvas.addEventListener('mousemove', (e) => {
    if (isMouseDown) {
        handleMouseInput(e);
    }
});

canvas.addEventListener('mouseup', () => {
    isMouseDown = false;
    lastX = lastY = -1;
});

canvas.addEventListener('mouseleave', () => {
    isMouseDown = false;
    lastX = lastY = -1;
});

function handleMouseInput(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const gridPos = renderer.screenToGrid(mouseX, mouseY);
    
    // Only update if we're in bounds and haven't modified this cell yet
    if (gridPos.x >= 0 && gridPos.x < grid.width && 
        gridPos.y >= 0 && gridPos.y < grid.height &&
        (gridPos.x !== lastX || gridPos.y !== lastY)) {
        
        grid.setCell(gridPos.x, gridPos.y, parseInt(cellTypeSelect.value));
        lastX = gridPos.x;
        lastY = gridPos.y;
        needsRedraw = true;
    }
}

// Handle clear button
clearButton.addEventListener('click', () => {
    grid.clear();
    needsRedraw = true;
});

// Handle seed input
seedInput.addEventListener('change', () => {
    // We'll use this later for the growth algorithm
    console.log('Seed changed:', seedInput.value);
});

// Performance monitoring
let frameCount = 0;
let lastTime = performance.now();
let fps = 0;

// Animation loop
function animate(currentTime) {
    // Update FPS counter
    frameCount++;
    if (currentTime - lastTime >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastTime = currentTime;
        console.log('FPS:', fps);
    }

    // Only render if needed
    if (needsRedraw) {
        renderer.render();
        needsRedraw = false;
    }
    
    requestAnimationFrame(animate);
}

// Start animation
requestAnimationFrame(animate);
