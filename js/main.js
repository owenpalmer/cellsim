// Initialize grid and renderer
const grid = new Grid(100, 100);
const canvas = document.getElementById('grid');
const renderer = new Renderer(canvas, grid);
const growth = new GrowthManager(grid);

// UI elements
const seedInput = document.getElementById('seed');
const clearButton = document.getElementById('clear');
const cellTypeSelect = document.getElementById('selected-type');
const playPauseButton = document.getElementById('play-pause');
const stepButton = document.getElementById('step');
const generationSpan = document.getElementById('generation');

// Simulation state
let isRunning = false;
let needsRedraw = true;
let generation = 0;
let lastStepTime = 0;
const stepInterval = 100; // ms between generations

// Draggable panels
const panels = document.querySelectorAll('.panel');
let activePanel = null;
let initialX = 0;
let initialY = 0;
let currentX = 0;
let currentY = 0;

// Initialize panel positions from localStorage or defaults
panels.forEach(panel => {
    const savedPos = localStorage.getItem(`${panel.id}-position`);
    if (savedPos) {
        const [left, top] = savedPos.split(',');
        panel.style.left = left;
        panel.style.top = top;
        panel.style.right = 'auto'; // Clear any right positioning
    }
    
    const header = panel.querySelector('.panel-header');
    header.addEventListener('mousedown', e => {
        activePanel = panel;
        initialX = e.clientX - panel.offsetLeft;
        initialY = e.clientY - panel.offsetTop;
        panel.classList.add('dragging');
    });
});

document.addEventListener('mousemove', e => {
    if (activePanel) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        
        // Keep panel within window bounds
        currentX = Math.max(0, Math.min(window.innerWidth - activePanel.offsetWidth, currentX));
        currentY = Math.max(0, Math.min(window.innerHeight - activePanel.offsetHeight, currentY));
        
        activePanel.style.left = currentX + 'px';
        activePanel.style.top = currentY + 'px';
        activePanel.style.right = 'auto';
    }
});

document.addEventListener('mouseup', () => {
    if (activePanel) {
        activePanel.classList.remove('dragging');
        // Save position
        localStorage.setItem(`${activePanel.id}-position`, 
            `${activePanel.style.left},${activePanel.style.top}`);
        activePanel = null;
    }
});

// Handle probability matrix inputs
const probabilityInputs = document.querySelectorAll('input[data-parent]');
probabilityInputs.forEach(input => {
    input.addEventListener('change', () => {
        const parent = parseInt(input.dataset.parent);
        const child = parseInt(input.dataset.child);
        const value = parseFloat(input.value);
        growth.setProbability(parent, child, value);
    });
});

// Track if mouse is down for drawing
let isMouseDown = false;
let lastX = -1, lastY = -1;

// Handle mouse input for cell placement
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
