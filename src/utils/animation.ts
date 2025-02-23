import { GridNode } from '../algorithms/GridNode';

export const animateVisitedNodes = (
    visitedNodesInOrder: GridNode[],
    shortestPath: GridNode[],
    setGrid: React.Dispatch<React.SetStateAction<GridNode[][]>>,
    setAnimation: React.Dispatch<React.SetStateAction<boolean>>
) => {
    // Scale animation speed based on number of nodes visited
    const baseDelay = 240;
    const scaleFactor = Math.max(1, Math.sqrt(visitedNodesInOrder.length) / 2);
    const delay = baseDelay / scaleFactor;

    // Log values to help debug
    console.log(`Nodes visited: ${visitedNodesInOrder.length}`);
    console.log(`Scale factor: ${scaleFactor}`);
    console.log(`Actual delay: ${delay}ms`);

    // First animate visited nodes
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
        if (i === visitedNodesInOrder.length) {
            setTimeout(() => {
                animatePath(shortestPath, setGrid, setAnimation);
            }, delay * i);
            return;
        }

        setTimeout(() => {
            const node = visitedNodesInOrder[i];
            setGrid(prevGrid => {
                const newGrid = prevGrid.map(row => row.map(cell => ({ ...cell })));
                newGrid[node.row][node.col] = {
                    ...newGrid[node.row][node.col],
                    isVisited: true,
                    isPath: false  // Ensure we're not marking visited nodes as path
                };
                return newGrid;
            });
        }, delay * i);
    }
};

export const animatePath = (
    shortestPath: GridNode[],
    setGrid: React.Dispatch<React.SetStateAction<GridNode[][]>>,
    setAnimation: React.Dispatch<React.SetStateAction<boolean>>
) => {
    const delay = 40;  // Keep path animation speed the same

    for (let i = 0; i < shortestPath.length; i++) {
        setTimeout(() => {
            const node = shortestPath[i];
            setGrid(prevGrid => {
                const newGrid = prevGrid.map(row => row.map(cell => ({ ...cell })));
                newGrid[node.row][node.col] = {
                    ...newGrid[node.row][node.col],
                    isPath: true  // Only mark actual path nodes
                };
                return newGrid;
            });
            if (i === shortestPath.length - 1) {
                setAnimation(false);
            }
        }, delay * i);
    }
}; 