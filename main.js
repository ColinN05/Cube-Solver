import CubeRenderer from "./src/cube_rendering.js"
import Cube from "./src/cube_logic.js"
import * as CubeLogic from "./src/cube_logic.js"

// apply moves in the rendered cube
var cubeRenderer = new CubeRenderer();
const moves = ["R","F","U-","F-","U-","F","L","D","F","U","F","B","L","R","U","D","F-","B-","L-","R-","U-","D-"];
cubeRenderer.applyMoves(moves);

// apply moves to simulated cube
var cube = new Cube();
cube.applyMoves(moves);

// logged cube should match rendered cube once moves are completed
cube.logCube();

