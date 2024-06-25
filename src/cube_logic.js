/*
Color scheme:
   B
W  R  Y  O
   G

Numbering system:
          44 43 42 
          41 40 39
          38 37 36
15 12 9   0  1  2  29 32 35  53 52 51 
16 13 10  3  4  5  28 31 34  50 49 48
17 14 11  6  7  8  27 30 33  47 46 45
          18 19 20 
          21 22 23
          24 25 26

Lettering system (might use this in the future): 
        S s T 
        r 4 t
        R q Q        
H h E   A a B  N n O  W w X 
g 1 e   d 0 b  m 3 o  v 5 x
G f F   C c B  M p P  V u U
        I i J 
        l 2 j
        L k K

Map between systems:
["A","a","B","d","0","b","C","c","B","E","e","F","h","1","f","H","g","G","I","i","J","l","2","j","L","k","K","M","m","N","p","3","n","P","o","O", "Q", "q", "R","t", "4", "r", "T", "s","S", "U", "u", "V", "x", "5","v", "X", "w", "W"];

*/

export default class Cube {
    constructor() {
        for (let i = 0; i < 54; i++) {
            this.tiles[i] = i;
        }
    }

    displayPattern = [" ".repeat(3),44,43,42,"l"," ".repeat(3),41,40,39,'l'," ".repeat(3),38,37,36,"l",15, 12, 9,   0,  1,  2,  29, 32, 35,  53, 52, 51, "l", 16, 13, 10, 3,  4,  5,  28, 31, 34,  50, 49, 48, "l", 17, 14, 11,  6,  7,  8,  27, 30, 33,  47, 46, 45, "l"," ".repeat(3), 18, 19, 20, "l"," ".repeat(3), 21, 22, 23, "l"," ".repeat(3) ,24, 25, 26, "l"];

    logCube() {
        var displayString = "";
        var displayIndex;
        
        for (let i = 0; i < this.displayPattern.length; i++) {
            
            displayIndex = this.displayPattern[i];

            switch (displayIndex) {
                case "l": { displayString += '\n'; break; }
                case " ".repeat(3): { displayString += " ".repeat(3); break; }
                default: { displayString += this.colorAtPosition(displayIndex); break; }
            }
        }
        
        console.log(displayString);
    }

    applyPermutation(permutation) {
        var cycle;
        var savedValue;
        var nextPosValue;

        for (let c = 0; c < permutation.length; c++) {
            cycle = permutation[c];
            savedValue = this.tiles[cycle[0]];
            for (let i = 0; i < cycle.length - 1; i++) {
                nextPosValue = this.tiles[cycle[i+1]];
                this.tiles[cycle[i+1]] = savedValue;
                savedValue = nextPosValue;
            }
            this.tiles[cycle[0]] = savedValue;
        }
    }

    permutationF = [[18,20,26,24],[19,23,25,21],[6,27,47,17],[11,8,33,45],[7,30,46,14]];
    permutationB = [[36,38,44,42],[37,41,43,39],[2,9,51,35],[29,0,15,53],[1,12,52,32]];
    permutationL = [[9,11,17,15],[10,14,16,12],[0,18,45,44],[38,6,24,51],[41,3,21,48]];
    permutationR = [[27,29,35,33],[28,32,34,30],[8,36,53,26],[20,2,42,47],[5,39,50,23]];
    permutationU = [[0,2,8,6],[1,5,7,3],[38,29,20,11],[9,36,27,18],[10,37,28,19]];
    permutationD = [[53,51,45,47],[52,48,46,50],[35,44,17,26],[42,15,24,33],[34,43,16,25]];
    applyMove(move) {
        switch (move) {
            case "F": { this.applyPermutation(this.permutationF); break;}
            case "B": { this.applyPermutation(this.permutationB); break;}
            case "L": { this.applyPermutation(this.permutationL); break;}
            case "R": { this.applyPermutation(this.permutationR); break;}
            case "U": { this.applyPermutation(this.permutationU); break;}
            case "D": { this.applyPermutation(this.permutationD); break;}

            case "F-": { for (let i = 0; i < 3; i++){ this.applyMove("F"); }  break;}
            case "B-": { for (let i = 0; i < 3; i++){ this.applyMove("B"); }  break;}
            case "L-": { for (let i = 0; i < 3; i++){ this.applyMove("L"); }  break;}
            case "R-": { for (let i = 0; i < 3; i++){ this.applyMove("R"); }  break;}
            case "U-": { for (let i = 0; i < 3; i++){ this.applyMove("U"); }  break;}
            case "D-": { for (let i = 0; i < 3; i++){ this.applyMove("D"); }  break;}
            
            default: { break; }
        }
    }

    applyMoves(moves) {
        for (let i = 0; i < moves.length; i++) {
            this.applyMove(moves[i]);
        }
    }

    tiles = [];    

    colorAtPosition(tileNumber) {
        var i = this.tiles[tileNumber];
        switch (Math.floor(i/9)) {
            case 0: { return "Y"; }
            case 1: { return "R"; }
            case 2: { return "G"; }
            case 3: { return "O"; }
            case 4: { return "B"; }
            case 5: { return "W"; }
        }
    }
}

// should return array of moves which solves inputted cube
function solveCube(cube) {

}