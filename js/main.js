// Initialize grid and renderer
const grid = new Grid(100, 100);
const canvas = document.getElementById('grid');
const renderer = new Renderer(canvas, grid);
const growth = new GrowthManager(grid);

// UI elements
const seedInput = document.getElementById('seed');
const clearButton = document.getElementById('clear');
const cellTypeSelect = document.getElementById('selected-type');

// Add simulation controls to HTML
const controlsDiv = document.getElementById('controls');
controlsDiv.insertAdjacentHTML('beforeend', `
    <button id="play-pause">Play</button>
    <button id="step">Step</button>
    <span id="generation">Generation: 0</span>
`);

const playPauseButton = document.getElementById('play-pause');
const stepButton = document.getElementById('step');
const generationSpan = document.getElementById('generation');

// Simulation state
let isRunning = false;
let needsRedraw = true;
let generation = 0;
let lastStepTime = 0;
const stepInterval = 100; // ms between generations

// Track if mouse is down for drawing
let isMouseDown = false;
let lastX = -1, lastY = -1;

// Handle mouse input
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
    
    if (gridPos.x >= 0 && gridPos.x < grid.width && 
        gridPos.y >= 0 && gridPos.y < grid.height &&
        (gridPos.x !== lastX || gridPos.y !== lastY)) {
        
        grid.setCell(gridPos.x, gridPos.y, parseInt(cellTypeSelect.value));
        lastX = gridPos.x;
        lastY = gridPos.y;
        needsRedraw = true;
    }
}

// Handle simulation controls
playPauseButton.addEventListener('click', () => {
    isRunning = !isRunning;
    playPauseButton.textContent = isRunning ? 'Pause' : 'Play';
});

stepButton.addEventListener('click', () => {
    if (!isRunning) {
        performStep();
    }
});

// Handle clear button
clearButton.addEventListener('click', () => {
    grid.clear();
    generation = 0;
    generationSpan.textContent = `Generation: ${generation}`;
    needsRedraw = true;
});

// Handle seed input
seedInput.addEventListener('change', () => {
    const newSeed = parseInt(seedInput.value) || Date.now();
    growth.setSeed(newSeed);
    seedInput.value = newSeed;
});

function performStep() {
    if (growth.tick()) {
        generation++;
        generationSpan.textContent = `Generation: ${generation}`;
        needsRedraw = true;
    } else {
        // No changes were made, pause simulation
        isRunning = false;
        playPauseButton.textContent = 'Play';
    }
}

// Animation loop
function animate(currentTime) {
    // Handle simulation steps
    if (isRunning && currentTime - lastStepTime >= stepInterval) {
        performStep();
        lastStepTime = currentTime;
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
