# Game Pathing Algorithm Visualizer

## Overview
This application will visualize various game pathing algorithms using **pygame** for rendering and **customtkinter** for the user interface. Users can select different pathfinding algorithms via checkboxes and adjust pathing-related settings to see how they affect the movement from a start point to an endpoint.

## Features
- **Algorithm Selection**: Users can choose from different pathfinding algorithms such as:
  - A* (A-star)
  - Dijkstra's Algorithm
  - Breadth-First Search (BFS)
  - Depth-First Search (DFS)
  - Greedy Best-First Search (GBFS)
  - Minimum Spanning Tree (MST)
- **Pathing Options**:
  - Grid size adjustment
  - Obstacles placement
  - Heuristic adjustments (for algorithms like A*)
- **Visualization**:
  - Animated search process
  - Start and endpoint selection
  - Color-coded paths

## Technologies Used
- **Python**
- **pygame** (for rendering the grid and path visualization)
- **customtkinter** (for user interface and settings panel)

---

## Step-by-Step Implementation

### 1. Set Up the Project
- Install dependencies:
  ```sh
  pip install pygame customtkinter
  ```
- Create a new Python script:
  ```sh
  touch main.py
  ```

### 2. Create the Grid System
- Define a 2D grid with nodes.
- Represent walkable and non-walkable tiles.
- Implement functions to set start and end positions.

### 3. Implement the Pathfinding Algorithms
- **A***: Use a priority queue to find the shortest path.
- **Dijkstra’s Algorithm**: Similar to A* but without a heuristic.
- **BFS & DFS**: Implement simple recursive or queue-based approaches.
- **Greedy Best-First Search (GBFS)**: Use a priority queue to find the shortest path.
- **Minimum Spanning Tree (MST)**: Use a priority queue to find the shortest path.

### 4. Build the UI with customtkinter
- Create a **Tkinter** window with a settings panel.
- Add checkboxes for algorithm selection.
- Include sliders or input fields for grid size and heuristics.
- Create a button to generate a random grid.
- Create buttons for start/reset.

### 5. Integrate pygame and customtkinter
- Run pygame in a loop to update the grid.
- Capture user input for placing start/end points and obstacles.
- Apply selected algorithms and visualize results in real-time.

### 6. Optimize and Enhance
- Improve performance for large grids.
- Allow real-time modifications (e.g., adding obstacles mid-simulation).
- Export results or take snapshots of paths found.

---

## Future Enhancements
- Support for weighted terrains.
- Real-time algorithm comparisons.
- Integration with machine learning for dynamic path optimization.
- More algorithms

---

## Conclusion
This application will serve as a valuable tool for understanding how different pathfinding algorithms work, helping game developers and students visualize and compare their efficiency.

