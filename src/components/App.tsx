import React, { useState, useEffect } from 'react';
import Grid from './Grid';
import SettingsPanel from './SettingsPanel';
import aStar from '../algorithms/aStar';
import dijkstra from '../algorithms/dijkstra';
import dfs from '../algorithms/dfs';
import bfs from '../algorithms/bfs';

// Basic node structure that all algorithms need
interface Node {
    row: number;
    col: number;

    isStart: boolean;
    isEnd: boolean;
    isWall: boolean;

    // Pathfinding properties
    distance: number;     // How far from start (actual distance traveled)
    heuristic: number;   // Estimated distance to end (for A* algorithm)
    totalDistance: number; // distance + heuristic
    previousNode: Node | null;  // Which node did we come from? (for backtracking)

    // Terrain properties
    terrain: 'normal' | 'water' | 'mountain' | 'wall';  // What type of terrain?
    weight: number;      // How "costly" to move through this cell
    // normal = 1, water = 3, mountain = 5, wall = Infinity
}

// This is our main component that orchestrates everything
const App: React.FC = () => {
    // Setup states for everything we need to track
    const [gridSize, setGridSize] = useState(12);
    const [algorithm, setAlgorithm] = useState('A*');
    const [heuristic, setHeuristic] = useState(1);
    const [start, setStart] = useState<{ row: number; col: number } | null>(null);
    const [end, setEnd] = useState<{ row: number; col: number } | null>(null);
    const [reset, setReset] = useState(false);
    let [timer, setTimer] = useState<number>(0);  // let because we update this a lot
    const [timerInterval, setTimerInterval] = useState<number | null>(null);
    const [algorithmTime, setAlgorithmTime] = useState<number>(0);
    const [pathCost, setPathCost] = useState<number>(0);

    // Reset grid when size changes
    useEffect(() => {
        setGrid(createGrid(gridSize));
        setStart(null);
        setEnd(null);
    }, [gridSize]);

    // Creates a fresh grid with default values
    const createGrid = (size: number): Node[][] => {
        const grid = [];
        for (let row = 0; row < size; row++) {
            const currentRow = [];
            for (let col = 0; col < Math.floor(size * 1.8); col++) {
                currentRow.push({
                    // Each cell has properties like whether it's a wall, its weight, etc.
                    row, col,
                    isStart: false,
                    isEnd: false,
                    isWall: false,
                    distance: Infinity,  // Start everything at max distance
                    heuristic: 0,
                    totalDistance: Infinity,
                    previousNode: null,
                    isVisited: false,
                    isPath: false,
                    terrain: 'normal' as 'normal' | 'water' | 'mountain' | 'wall',
                    weight: 1
                });
            }
            grid.push(currentRow);
        }
        return grid;
    };

    const [grid, setGrid] = useState<Node[][]>(createGrid(gridSize));
    const [isAnimating, setIsAnimating] = useState(false);

    // Timer functions to measure algorithm speed
    const startTimer = () => {
        setTimer(0);
        const interval = setInterval(() => {
            setTimer(prev => prev + 10);
        }, 10);
        setTimerInterval(interval);
    };

    const stopTimer = () => {
        if (timerInterval) {
            clearInterval(timerInterval);
            setTimerInterval(null);
        }
    };

    // Main function that starts the pathfinding
    const handleStart = () => {
        if (!start || !end) return;
        setIsAnimating(true);
        startTimer();

        // Make a new grid but keep the walls and terrain
        const newGrid = createGrid(gridSize);
        grid.forEach((row, rowIndex) => {
            row.forEach((node, colIndex) => {
                // Copy terrain and weights from old grid
                newGrid[rowIndex][colIndex].terrain = node.terrain;
                newGrid[rowIndex][colIndex].weight = node.weight;
                newGrid[rowIndex][colIndex].isWall = node.isWall;
            });
        });

        // Setup start and end points
        newGrid[start.row][start.col] = {
            ...newGrid[start.row][start.col],
            isStart: true,
            distance: 0,
            totalDistance: heuristic,
        };

        newGrid[end.row][end.col] = {
            ...newGrid[end.row][end.col],
            isEnd: true
        };

        setGrid(newGrid);

        // Run the selected algorithm
        switch (algorithm) {
            case 'Dijkstra':
                dijkstra(newGrid, newGrid[start.row][start.col], newGrid[end.row][end.col], setGrid, setIsAnimating, heuristic, setAlgorithmTime, setPathCost);
                break;
            case 'DFS':
                dfs(newGrid, newGrid[start.row][start.col], newGrid[end.row][end.col], setGrid, setIsAnimating, heuristic, setAlgorithmTime, setPathCost);
                break;
            case 'BFS':
                bfs(newGrid, newGrid[start.row][start.col], newGrid[end.row][end.col], setGrid, setIsAnimating, heuristic, setAlgorithmTime, setPathCost);
                break;
            default:
                aStar(newGrid, newGrid[start.row][start.col], newGrid[end.row][end.col], setGrid, setIsAnimating, heuristic, setAlgorithmTime, setPathCost);
        }
    };

    // Reset everything back to initial state
    const handleReset = () => {
        setReset(true);
        setTimeout(() => setReset(false), 0);  // Fixes a React state update issue
        setGrid(createGrid(gridSize));
        setStart(null);
        setEnd(null);
    };

    // Stop the timer when animation finishes
    useEffect(() => {
        if (!isAnimating && timerInterval) {
            stopTimer();
        }
    }, [isAnimating, timerInterval]);

    return (
        <div className="app">
            <SettingsPanel
                gridSize={gridSize}
                setGridSize={setGridSize}
                algorithm={algorithm}
                setAlgorithm={setAlgorithm}
                heuristic={heuristic}
                setHeuristic={setHeuristic}
                className="mb-8"
            />
            <div className="grid-container">
                <Grid
                    gridSize={gridSize}
                    start={start}
                    setStart={setStart}
                    end={end}
                    setEnd={setEnd}
                    reset={reset}
                    grid={grid}
                    setGrid={setGrid}
                />
            </div>
            <div className="mt-4 mb-2 text-center">
                <span className="font-mono text-xl">
                    Path Cost: {pathCost.toFixed(1)}
                </span>
            </div>
            <div className="mt-4 mb-2 text-center">
                <span className="font-mono text-xl">
                    Algorithm Time: {algorithmTime.toFixed(3)}ms
                </span>
            </div>
            <div className="mt-2 mb-4 text-center">
                <span className="font-mono text-xl">
                    Animation Time: {(timer / 1000).toFixed(3)}s
                </span>
            </div>
            <div className="controls">
                <button onClick={handleStart} disabled={isAnimating}>Start</button>
                <button onClick={handleReset} disabled={isAnimating}>Reset</button>
            </div>
        </div>
    );
};

export default App;