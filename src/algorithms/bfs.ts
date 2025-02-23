import { GridNode } from './GridNode';
import { animateVisitedNodes } from '../utils/animation.ts';

const bfs = (
    grid: GridNode[][],
    startNode: GridNode,
    endNode: GridNode,
    setGrid: React.Dispatch<React.SetStateAction<GridNode[][]>>,
    setAnimation: React.Dispatch<React.SetStateAction<boolean>>,
    _heuristicWeight: number,
    setAlgorithmTime: React.Dispatch<React.SetStateAction<number>>,
    setPathCost: React.Dispatch<React.SetStateAction<number>>
) => {
    var startTime = performance.now();
    let visitedNodesInOrder: Array<GridNode> = [];
    var queue: GridNode[] = [startNode];
    let visited = new Set<GridNode>();

    startNode.distance = 0;
    visited.add(startNode);
    visitedNodesInOrder.push(startNode);

    while (queue.length > 0) {
        let currentNode = queue.shift()!;

        if (currentNode === endNode) {
            let endTime = performance.now();
            let timeTaken = endTime - startTime;
            console.log('BFS found the end!');
            console.log(`Time taken: ${timeTaken.toFixed(3)}ms`);
            setAlgorithmTime(timeTaken);

            const path = backtrackPath(endNode);
            const totalCost = path.reduce((sum: number, node: GridNode) => sum + node.weight, 0);
            setPathCost(totalCost);
            animateVisitedNodes(visitedNodesInOrder, path, setGrid, setAnimation);
            return;
        }

        let neighbors = getUnvisitedNeighbors(currentNode, grid, visited);
        for (let i = 0; i < neighbors.length; i++) {
            var neighbor = neighbors[i];
            if (!neighbor.isWall) {
                visited.add(neighbor);
                visitedNodesInOrder.push(neighbor);
                neighbor.previousNode = currentNode;
                queue.push(neighbor);
            }
        }
    }

    console.log('No path found :(');
    setAnimation(false);
};

const getUnvisitedNeighbors = (node: GridNode, grid: GridNode[][], visited: Set<GridNode>) => {
    const neighbors = [];
    const { row, col } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(n => !visited.has(n) && !n.isWall);
};

const backtrackPath = (finishNode: GridNode) => {
    let path = [];
    let current = finishNode;

    while (current != null) {
        path.unshift(current);
        current = current.previousNode as GridNode;
    }

    return path;
};

export default bfs;