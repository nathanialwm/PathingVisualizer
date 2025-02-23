// filepath: /pathing-visualizer/pathing-visualizer/src/types/index.ts
export interface Tile {
  row: number;
  col: number;
  isWalkable: boolean;
  isStart: boolean;
  isEnd: boolean;
  isObstacle: boolean;
}

export interface Grid {
  tiles: Tile[][];
  start: Tile | null;
  end: Tile | null;
}

export interface AlgorithmSettings {
  algorithm: string;
  gridSize: number;
  heuristic: string;
}