import { GridNode } from './GridNode';
import { animateVisitedNodes } from '../utils/animation.ts';

// DFS - checks all of one direction before backtracking and checking another direction
const dfs = (
    grid: GridNode[][],
    startNode: GridNode,
    endNode: GridNode,
    setGrid: React.Dispatch<React.SetStateAction<GridNode[][]>>,
    setAnimation: React.Dispatch<React.SetStateAction<boolean>>,
    _heuristicWeight: number,  // not used
    setAlgorithmTime: React.Dispatch<React.SetStateAction<number>>,
    setPathCost: React.Dispatch<React.SetStateAction<number>>
) => {
    const startTime = performance.now();
    const visitedNodesInOrder: GridNode[] = [];
    const stack: GridNode[] = [startNode];
    const visited = new Set<GridNode>();
    let pathFound = false;

    while (stack.length > 0 && !pathFound) {
        const currentNode = stack.pop()!;

        if (!visited.has(currentNode)) {
            visited.add(currentNode);
            visitedNodesInOrder.push(currentNode);

            if (currentNode === endNode) {
                pathFound = true;
                const endTime = performance.now();
                const timeTaken = endTime - startTime;
                setAlgorithmTime(timeTaken);

                // Get the actual path by backtracking from end to start
                const path = getNodesInShortestPathOrder(endNode);
                const totalCost = path.reduce((sum: number, node: GridNode) => sum + node.weight, 0);
                setPathCost(totalCost);
                animateVisitedNodes(visitedNodesInOrder, path, setGrid, setAnimation);
                return;
            }

            // Get unvisited neighbors
            const neighbors = getUnvisitedNeighbors(currentNode, grid, visited);
            for (const neighbor of neighbors) {
                if (!neighbor.isWall) {
                    neighbor.previousNode = currentNode;
                    stack.push(neighbor);
                }
            }
        }
    }

    setAnimation(false);
};

const getUnvisitedNeighbors = (node: GridNode, grid: GridNode[][], visited: Set<GridNode>) => {
    const neighbors = [];
    const { row, col } = node;
    // DFS order: right, down, left, up (this affects which direction it explores first)
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (row > 0) neighbors.push(grid[row - 1][col]);
    return neighbors.filter(n => !visited.has(n));
};

const getNodesInShortestPathOrder = (finishNode: GridNode) => {
    const nodesInShortestPathOrder = [];
    let currentNode: GridNode | null = finishNode;
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
};

export default dfs;  // Export for use in App.tsx
