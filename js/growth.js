class GrowthManager {
    constructor(grid) {
        this.grid = grid;
        this.rng = null;
        this.probabilities = {
            1: [0.4, 0.3, 0.2, 0.1, 0.0], // Type 1 -> [1,2,3,4,5]
            2: [0.2, 0.4, 0.2, 0.1, 0.1], // Type 2 -> [1,2,3,4,5]
            3: [0.0, 0.0, 0.0, 0.5, 0.5], // Type 3 -> [1,2,3,4,5]
            4: [0.0, 0.0, 0.0, 0.0, 1.0]  // Type 4 -> [1,2,3,4,5]
            // Type 5 doesn't grow
        };
        this.setSeed(Date.now());
    }

    setSeed(seed) {
        this.seed = seed;
        this.rng = this.createRNG(seed);
    }

    // Simple seeded random number generator
    createRNG(seed) {
        return {
            next: function() {
                seed = (seed * 16807) % 2147483647;
                return (seed - 1) / 2147483646;
            }
        };
    }

    // Get N random empty neighbors
    getGrowthCells(x, y, count) {
        const emptyNeighbors = this.grid.getEmptyNeighbors(x, y);
        const selected = [];
        
        // Shuffle array using Fisher-Yates
        for (let i = emptyNeighbors.length - 1; i > 0; i--) {
            const j = Math.floor(this.rng.next() * (i + 1));
            [emptyNeighbors[i], emptyNeighbors[j]] = [emptyNeighbors[j], emptyNeighbors[i]];
        }
        
        return emptyNeighbors.slice(0, count);
    }

    // Determine new cell type based on parent type and probability matrix
    determineChildType(parentType) {
        if (parentType === 5) return null; // Type 5 doesn't grow
        
        const probs = this.probabilities[parentType];
        const rand = this.rng.next();
        let sum = 0;
        
        for (let type = 1; type <= 5; type++) {
            sum += probs[type - 1];
            if (rand < sum) return type;
        }
        
        return 1; // Fallback to type 1
    }

    // Process one generation
    tick() {
        const newCells = new Set(); // Track cells to add
        
        // Process each cell in the current grid
        for (let y = 0; y < this.grid.height; y++) {
            for (let x = 0; x < this.grid.width; x++) {
                const cellType = this.grid.getCell(x, y);
                if (cellType >= 1 && cellType <= 4) { // Types 1-4 can grow
                    const growthCells = this.getGrowthCells(x, y, cellType);
                    for (const cell of growthCells) {
                        const newType = this.determineChildType(cellType);
                        if (newType) {
                            newCells.add({ x: cell.x, y: cell.y, type: newType });
                        }
                    }
                }
            }
        }
        
        // Apply all new cells at once
        for (const cell of newCells) {
            this.grid.setCell(cell.x, cell.y, cell.type);
        }
        
        return newCells.size > 0; // Return true if any changes were made
    }

    // Update probability matrix
    setProbability(parentType, childType, probability) {
        if (parentType >= 1 && parentType <= 4 && childType >= 1 && childType <= 5) {
            this.probabilities[parentType][childType - 1] = probability;
        }
    }
}
