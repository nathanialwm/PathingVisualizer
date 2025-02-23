import React from 'react';

// Add this near the top of the file
const algorithmExplanations: { [key: string]: string } = {
  'A*': "A* is like a smart GPS - it uses a 'heuristic' (an educated guess) to find the shortest path. It considers terrain costs and estimates distance to the end.",
  'Dijkstra': "Dijkstra's algorithm finds the shortest path by considering terrain costs. It spreads out from the start, always choosing the lowest-cost path first.",
  'BFS': "Breadth-First Search explores in all directions one step at a time. It ignores terrain costs but guarantees the path with fewest steps.",
  'DFS': "Depth-First Search picks one direction and goes as far as it can before backtracking. Fast but ignores both terrain costs and path length."
};

// Props for settings controls
interface SettingsPanelProps {
  algorithm: string;
  setAlgorithm: React.Dispatch<React.SetStateAction<string>>;
  gridSize: number;
  setGridSize: React.Dispatch<React.SetStateAction<number>>;
  heuristic: number;
  setHeuristic: (heuristic: number) => void;
  className?: string;  // Optional styling class
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  algorithm,
  setAlgorithm,
  gridSize,
  setGridSize,
  heuristic,
  setHeuristic,
  className,
}) => {
  return (
    <div className={`settings-panel mb-8 ${className || ''}`}>
      <h2 className="text-lg font-bold">Settings</h2>

      {/* Algorithm selector dropdown */}
      <div className="algorithm-selection">
        <h3>Select Algorithm:</h3>
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
        >
          <option value="A*">A* (A-star)</option>
          <option value="Dijkstra">Dijkstra's Algorithm</option>
          <option value="BFS">Breadth-First Search (BFS)</option>
          <option value="DFS">Depth-First Search (DFS)</option>
        </select>

        {/* Algorithm explanation text field */}
        <div className="algorithm-explanation mt-2">
          <p className="text-sm text-gray-600 bg-gray-100 p-3 rounded">
            {algorithmExplanations[algorithm]}
          </p>
        </div>
      </div>

      {/* Grid size input - clamped between 5 and 20 */}
      <div className="grid-size-adjustment">
        <h3>Grid Size:</h3>
        <input
          type="number"
          value={gridSize}
          onChange={(e) => {
            let size = Number(e.target.value);
            // Keep size within reasonable bounds
            size = Math.min(Math.max(size, 5), 20);
            setGridSize(size);
          }}
          min="5"
          max="20"
        />
      </div>

      {/* Heuristic weight for A* */}
      <div className="heuristic-adjustment">
        <h3>Heuristic:</h3>
        <input
          type="number"
          value={heuristic}
          onChange={(e) => setHeuristic(Number(e.target.value))}
          min="1"
          max="50"  // Higher values make A* more greedy
        />
      </div>
    </div>
  );
};

export default SettingsPanel;