# PathingVisualizer Deployment Instructions

Welcome to the PathingVisualizer project! Follow the steps below to clone and run the application on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 14 or higher)

## Cloning the Repository

1. Open your terminal or command prompt.
2. Navigate to the directory where you want to clone the repository.
3. Run the following command to clone the repository, specifically the `master` branch:

   ```bash
   git clone --single-branch --branch master https://github.com/nathanialwm/PathingVisualizer.git
   ```

## Installing Dependencies

1. Change into the project directory:

   ```bash
   cd PathingVisualizer
   ```

2. Install the required dependencies using npm:

   ```bash
   npm install
   ```

## Running the Application

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Once the server is running, you will see a message in the terminal indicating the localhost address (usually `http://localhost:3000` or similar).

3. Copy the localhost address and paste it into your web browser to view the application.

## Accessing the Application

You should now see the PathingVisualizer application running in your browser. You can interact with the application to visualize various pathfinding algorithms.

## Troubleshooting

If you encounter any issues, ensure that:

- Node.js is installed correctly.
- You are in the correct project directory.
- All dependencies are installed without errors.

For further assistance, feel free to check the [GitHub repository](https://github.com/nathanialwm/PathingVisualizer.git) for updates or open an issue.

Happy coding!