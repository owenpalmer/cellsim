I want to make an artificial life simulator, but we're gonna just start with some simple grid-based growth algorithms on a js canvas.

Make the grid 100x100 and take up the full screen.

This is the basic idea. There are blank tiles, and tiles with a cell on it. Cells are of different types, and the type is specified by a number, ranging 2-5.

type 2 "grows" 2 adjacent tiles
type 3 "grows" 3 adjacent tiles
etc.

the "genes" of the organism is a set of probabilities of what type of tile each tile could grow.

For 2-type tiles, there are a set of probabilities for each of the tiles it could generate (2,3,4,5).
For 3-type tiles, there are a set of probabilities for each of the tiles it could generate (2,3,4,5).
etc.

I'll outline a table here:

2: 0 0 0 0 
3: 0 0 0 0
4: 0 0 0 0
5: 0 0 0 0

