import { animateVisitedNodes } from '../utils/animation.ts';
import { GridNode } from './GridNode';

const aStar = (
    grid: GridNode[][],
    startNode: GridNode,
    endNode: GridNode,
    setGrid: React.Dispatch<React.SetStateAction<GridNode[][]>>,
    setAnimation: React.Dispatch<React.SetStateAction<boolean>>,
    heuristicWeight: number,
    setAlgorithmTime: React.Dispatch<React.SetStateAction<number>>,
    setPathCost: React.Dispatch<React.SetStateAction<number>>
) => {
    let startTime = performance.now();
    console.log('A* algorithm started');
    console.log('Start Node:', startNode);
    console.log('End Node:', endNode);

    var openSet: GridNode[] = [];
    let closedSet: GridNode[] = [];
    let visitedNodesInOrder: GridNode[] = [];
    openSet.push(startNode);

    const animate = (nodes: GridNode[], callback: () => void) => {
        if (nodes.length === 0) {
            callback();
            return;
        }
        const [currentNode, ...rest] = nodes;
        setTimeout(() => {
            currentNode.isVisited = true;
            setGrid((prevGrid) => {
                const newGrid = prevGrid.map(row => row.map(tile => ({ ...tile })));
                newGrid[currentNode.row][currentNode.col] = currentNode;
                return newGrid;
            });
            animate(rest, callback);
        }, 100);
    };

    function heuristic(node: GridNode, endNode: GridNode) {
        const manhattanDistance = Math.abs(node.row - endNode.row) + Math.abs(node.col - endNode.col);
        return manhattanDistance * heuristicWeight;
    }

    const getNeighbors = (node: GridNode, grid: GridNode[][]) => {
        const neighbors = [];
        const { row, col } = node;
        if (row > 0) neighbors.push(grid[row - 1][col]);
        if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
        if (col > 0) neighbors.push(grid[row][col - 1]);
        if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
        return neighbors.filter(neighbor => !neighbor.isWall);
    };

    const getNodesInShortestPathOrder = (finishNode: GridNode): GridNode[] => {
        const nodesInShortestPathOrder = [];
        let currentNode: GridNode | null = finishNode;
        while (currentNode !== null) {
            nodesInShortestPathOrder.unshift(currentNode);
            currentNode = currentNode.previousNode;
        }
        return nodesInShortestPathOrder;
    };

    const findPath = () => {
        while (openSet.length > 0) {
            openSet.sort((a, b) => a.totalDistance - b.totalDistance);
            const currentNode = openSet.shift()!;
            visitedNodesInOrder.push(currentNode);
            closedSet.push(currentNode);

            if (currentNode === endNode) {
                const endTime = performance.now();
                const time = endTime - startTime;
                console.log(`Algorithm time: ${time.toFixed(3)}ms`);
                setAlgorithmTime(time);

                const path = getNodesInShortestPathOrder(endNode);
                const totalCost = path.reduce((sum: number, node: GridNode) => sum + node.weight, 0);
                setPathCost(totalCost);

                animateVisitedNodes(visitedNodesInOrder, path, setGrid, setAnimation);
                return;
            }

            const neighbors = getNeighbors(currentNode, grid);
            for (let i = 0; i < neighbors.length; i++) {
                const neighbor = neighbors[i];
                if (closedSet.includes(neighbor)) continue;

                let tentativeDistance = currentNode.distance + neighbor.weight;

                if (tentativeDistance < neighbor.distance) {
                    neighbor.previousNode = currentNode;
                    neighbor.distance = tentativeDistance;
                    neighbor.heuristic = heuristic(neighbor, endNode);
                    neighbor.totalDistance = neighbor.distance + neighbor.heuristic;

                    if (!openSet.includes(neighbor)) {
                        openSet.push(neighbor);
                    }
                }
            }
        }
        console.log('No path found');
        setAnimation(false);
    };

    startNode.distance = 0;
    startNode.totalDistance = heuristic(startNode, endNode);
    findPath();
};

export default aStar;