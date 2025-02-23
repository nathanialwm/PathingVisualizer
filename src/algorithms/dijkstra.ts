// filepath: /pathing-visualizer/pathing-visualizer/src/algorithms/dijkstra.ts
import { GridNode } from './GridNode';
import { animateVisitedNodes } from '../utils/animation.ts';

//Djikstra's Algorithm spreads out from the start, always choosing the lowest-cost path first.
const dijkstra = (
    grid: GridNode[][],
    startNode: GridNode,
    endNode: GridNode,
    setGrid: React.Dispatch<React.SetStateAction<GridNode[][]>>,
    setAnimation: React.Dispatch<React.SetStateAction<boolean>>,
    _heuristicWeight: number,  // Not used in Dijkstra
    setAlgorithmTime: React.Dispatch<React.SetStateAction<number>>,
    setPathCost: React.Dispatch<React.SetStateAction<number>>  // Add parameter
) => {
    const startTime = performance.now();
    const visitedNodesInOrder: GridNode[] = [];  // Keep track of the order for animation
    var unvisitedNodes = getAllNodes(grid);  // Get every node in the grid

    // Initialize distances
    startNode.distance = 0;
    startNode.totalDistance = 0;

    while (unvisitedNodes.length) {
        sortNodesByDistance(unvisitedNodes);  // Sort by distance (closest first)
        const closestNode = unvisitedNodes.shift()!;

        if (!closestNode || closestNode.distance === Infinity) {
            setAnimation(false);
            return;
        }
        if (closestNode.isWall) continue;

        // Add to visited nodes but don't mark as visited yet
        visitedNodesInOrder.push(closestNode);

        if (closestNode === endNode) {
            let endTime = performance.now();
            let time = endTime - startTime;
            setAlgorithmTime(time);

            const path = getNodesInShortestPathOrder(endNode);
            const totalCost = path.reduce((sum: number, node: GridNode) => sum + node.weight, 0);
            setPathCost(totalCost);
            animateVisitedNodes(visitedNodesInOrder, path, setGrid, setAnimation);
            return;
        }

        const neighbors = getUnvisitedNeighbors(closestNode, grid);
        for (const neighbor of neighbors) {
            // Add the weight of the terrain to the distance
            const tentativeDistance = closestNode.distance + neighbor.weight;
            if (tentativeDistance < neighbor.distance) {
                neighbor.distance = tentativeDistance;
                neighbor.previousNode = closestNode;
            }
        }
    }

    setAnimation(false);
};

// Sort nodes by distance (closest first)
function sortNodesByDistance(unvisitedNodes: GridNode[]) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

// Get valid neighbors
const getUnvisitedNeighbors = (node: GridNode, grid: GridNode[][]) => {
    const neighbors = [];
    const { row, col } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);  // up
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);  // down
    if (col > 0) neighbors.push(grid[row][col - 1]);  // left
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);  // right
    return neighbors.filter(neighbor => !neighbor.isWall && !neighbor.isVisited);
};

// Turn the grid into a list 
const getAllNodes = (grid: GridNode[][]) => {
    let nodes = [];
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
};

// Backtrack from the end to get the path
const getNodesInShortestPathOrder = (finishNode: GridNode) => {
    const nodesInShortestPathOrder = [];
    let currentNode: GridNode | null = finishNode;
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);  // Add to front
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
};

export default dijkstra;
