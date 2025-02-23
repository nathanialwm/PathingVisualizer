import React, { useEffect, useState } from 'react';
import { GridNode } from '../algorithms/GridNode';

// Propertiess needed for the grid component
interface GridProps {
  gridSize: number;
  start: { row: number; col: number } | null;
  setStart: React.Dispatch<React.SetStateAction<{ row: number; col: number } | null>>;
  end: { row: number; col: number } | null;
  setEnd: React.Dispatch<React.SetStateAction<{ row: number; col: number } | null>>;
  reset: boolean;
  grid: GridNode[][];
  setGrid: React.Dispatch<React.SetStateAction<GridNode[][]>>;
}

const Grid: React.FC<GridProps> = ({
  gridSize,
  start,
  setStart,
  end,
  setEnd,
  reset,
  grid,
  setGrid
}) => {
  // Track if mouse is being held down for wall drawing
  let [isMouseDown, setIsMouseDown] = useState(false);

  // Add state for current terrain type
  const [currentTerrain, setCurrentTerrain] = useState<'wall' | 'water' | 'mountain'>('wall');

  // Reset grid when reset button is clicked
  useEffect(() => {
    if (reset) {
      setGrid(createGrid());
      setStart(null);
      setEnd(null);
    }
  }, [reset]);

  // Update createGrid to use gridWidth
  const createGrid = () => {
    let grid = [];
    for (let row = 0; row < gridSize; row++) {
      let currentRow = [];
      for (let col = 0; col < Math.floor(gridSize * 1.8); col++) {  // Use gridSize instead of gridWidth
        currentRow.push({
          row,
          col,
          isStart: false,
          isEnd: false,
          isWall: false,
          isVisited: false,
          isPath: false,
          distance: Infinity,  // Default to max distance
          heuristic: 0,
          totalDistance: Infinity,
          previousNode: null,
          terrain: 'normal' as const,  // Type assertion to narrow the type
          weight: 1
        });
      }
      grid.push(currentRow);
    }
    return grid;
  };

  // Handle mouse events for wall drawing
  const handleMouseDown = (row: number, col: number) => {
    setIsMouseDown(true);
    handleTileClick(row, col);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isMouseDown) {
      handleTileClick(row, col);
    }
  };

  // Add a mouse leave event to ensure drawing stops when leaving the grid
  const handleMouseLeave = () => {
    setIsMouseDown(false);
  };

  // Add terrain selector
  const handleTerrainChange = (terrain: 'wall' | 'water' | 'mountain') => {
    setCurrentTerrain(terrain);
  };

  // Main function for handling tile clicks
  const handleTileClick = (row: number, col: number) => {
    let newGrid = grid.slice();  // Create a copy of the current grid
    let tile = newGrid[row][col]; // Get the specific tile being clicked

    if (tile.isStart) {
      tile.isStart = false;  // If it's already the start, remove it
      setStart(null);
    } else if (tile.isEnd) {
      tile.isEnd = false;    // If it's already the end, remove it
      setEnd(null);
    } else if (!start) {
      tile.isStart = true;   // Set this tile as the start if none is set
      setStart({ row, col });
    } else if (!end) {
      tile.isEnd = true;     // Set this tile as the end if none is set
      setEnd({ row, col });
    } else {
      // Handle terrain placement
      if (currentTerrain === 'wall') {
        tile.isWall = !tile.isWall;  // Toggle wall state
        tile.terrain = tile.isWall ? 'wall' : 'normal';
        tile.weight = tile.isWall ? Infinity : 1;  // Set weight based on wall state
      } else {
        tile.isWall = false;  // Remove wall if changing terrain
        tile.terrain = tile.terrain === currentTerrain ? 'normal' : currentTerrain;
        tile.weight =
          tile.terrain === 'water' ? 3 :
            tile.terrain === 'mountain' ? 5 : 1;  // Set weight based on terrain type
      }
      tile.isVisited = false;  // Reset visited and path states
      tile.isPath = false;
    }

    setGrid(newGrid);  // Update the grid state
  };

  return (
    <div>
      <div className="terrain-selector">
        <button
          className={`terrain-btn ${currentTerrain === 'wall' ? 'active' : ''}`}
          onClick={() => handleTerrainChange('wall')}
        >
          Wall
        </button>
        <button
          className={`terrain-btn ${currentTerrain === 'water' ? 'active' : ''}`}
          onClick={() => handleTerrainChange('water')}
        >
          Water
        </button>
        <button
          className={`terrain-btn ${currentTerrain === 'mountain' ? 'active' : ''}`}
          onClick={() => handleTerrainChange('mountain')}
        >
          Mountain
        </button>
      </div>
      <div className="grid" onMouseLeave={handleMouseLeave}>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            {row.map((tile, colIndex) => (
              <div
                key={colIndex}
                className={`grid-tile 
                  ${tile.isStart ? 'start' : ''} 
                  ${tile.isEnd ? 'end' : ''} 
                  ${tile.terrain === 'wall' ? 'wall' : ''} 
                  ${tile.terrain === 'water' ? 'water' : ''} 
                  ${tile.terrain === 'mountain' ? 'mountain' : ''} 
                  ${tile.isVisited ? 'visited' : ''} 
                  ${tile.isPath ? 'path' : ''}`
                }
                onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                onMouseUp={handleMouseUp}
                onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Grid;