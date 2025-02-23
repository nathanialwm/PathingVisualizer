export interface GridNode {
    row: number;
    col: number;
    isStart: boolean;
    isEnd: boolean;
    isWall: boolean;
    distance: number;     // How far from start (actual distance traveled)
    heuristic: number;    // Estimated distance to end (for A* algorithm)
    totalDistance: number; // distance + heuristic
    previousNode: GridNode | null;  // Which node did we come from? (for backtracking)
    isVisited: boolean;   // Has this node been visited?
    isPath: boolean;      // Is this node part of the final path?
    terrain: 'normal' | 'water' | 'mountain' | 'wall';  // What type of terrain?
    weight: number;       // How "costly" to move through this cell
} 