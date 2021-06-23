function getTilesDOM()  {
    return Array.from(document.querySelectorAll("td"));

}

let maxTurns = 9;
let turns = 0;

const DOM = {

    tiles: getTilesDOM(),

    x:"url('Images/Player X.jpg')",
    
    o:"url('Images/Player O.jpg')",
    
    alert: document.querySelector(".alert"),
    
    boardSizeInput: document.querySelector("#board-size-input"),
    
    toWinInput: document.querySelector("#to-win-input"),
    
    submitButton: document.querySelector("#submit-button"),
    
    board: document.querySelector("tbody"),

};

let state = {
    currentPlayer: "x",

    player: {
        x:[],
        o:[],
    },

    playerName:{
        x: "blue",
        o: "Green",
    },

    boardSize: 3,
    toWin: 3,
};

function main()  {
    DOM.tiles.forEach((tile) =>{
        tile.addEventListener("click", insertToken);
    });
}
main();

function insertToken(event) {
    clearWarning();
    const tile = event.target;
    
    if (tileEmpty(tile)) {
    

    tile.style.backgroundColor = DOM[state.currentPlayer];
    tile.style.backgroundImage = DOM[state.currentPlayer];

    const tileObj = tileJSPosition(tile.id);
    console.log(tile.id);
    console.log(tileObj);

    addTokenToState(tileObj);

    addPointsToToken(
        state.player[state.currentPlayer][
            state.player[state.currentPlayer].length - 1
        ]
    );
    
    turns ++;
    if(turns >= maxTurns){
        declareDraw();
    }
    console.log(turns);
    switchPlayer(state.currentPlayer);

    } else {
        tileNotEmptyWarning();
    }




}
function tileEmpty(tile) {
    if (tile.style.backgroundColor =="") {
        return true; 
    } else {
            return false;
        }
    }
 
     function tileNotEmptyWarning() {
         DOM.alert.innerText = "Nope";
     }

     function clearWarning() {
         DOM.alert.innerText = "";
     }

     function tileJSPosition(tile) {
         const splitTile = tile.split(" ");

         return {
            x: parseInt(
            splitTile[0].split("").slice(1, splitTile[0].split("").length).join("")
            ),
            y: parseInt(
            splitTile[1].split("").slice(1, splitTile[1].split("").length).join("")
            ),
            };
            }

    function addTokenToState (tileObj) {
        state.player[state.currentPlayer].push({
            position: tileObj,
            point: {
                x:1,
                y:1,
                topLeft:1,
                topRight:1,
            
            }
        });
    }
    
    function switchPlayer (prevPlayer) {
        state.currentPlayer = prevPlayer === "x" ? "o" : "x";
    }

    function addPointsToToken(tileObj) {
        winThroughXorY(tileObj, "x");
        winThroughXorY(tileObj, "y");
        winThroughDiagonalTopLeft(tileObj);
        winThroughDiagonalTopRight(tileObj);
    }


    function winThroughXorY(tileObj, coordinate) {
        state.player[state.currentPlayer].forEach((aTile) => {
        if (
        aTile.position[reverseCoordinate(coordinate)] ===
        tileObj.position[reverseCoordinate(coordinate)] &&
        (aTile.position[coordinate] === tileObj.position[coordinate] + 1 ||
        aTile.position[coordinate] === tileObj.position[coordinate] - 1)
        ) {
        mutatePoints(aTile, tileObj, coordinate);
        if (checkWinner(tileObj.point[coordinate])) declareWinner();
        }
        });
        }
        function reverseCoordinate(token) {
            if (token === "x") {
                return "y"
            } else {
                return "x";
            }
        }

        function mutatePoints(aTile, tileObj, position) {
            aTile.point[position] += tileObj.point[position];
            tileObj.point[position] = aTile.point[position];

        }

        function checkWinner (point) {
            if (point >= state.toWin) {
                return true;
            }else{ 
                console.log(point);
                return false;}
            }

            //declare draw after enough turns if no winner
            function declareDraw(){
                DOM.alert.innerHTML = `no winner you both suck`;
                gamePlayOff();
            }
            function declareWinner() {
                DOM.alert.innerHTML = `<p>Player ${
                    state.playerName[state.currentPlayer]
                } has won </p>`;
                gamePlayOff();
                } 
            
            function gamePlayOff () {
                DOM.tiles.forEach ((tile) => {
                    tile.removeEventListener("click", insertToken);
                
                });
            }

            function winThroughDiagonalTopLeft (tileObj) {
                state.player[state.currentPlayer].forEach ((aTile) => {
                    if (
                        (tileObj.position["x"] === aTile.position["x"] + 1 && 
                        tileObj.position["y"] === aTile.position ["y"] + 1)  ||

                        (tileObj.position["x"] === aTile.position["x"] -1 && 
                        tileObj.position["y"] === aTile.position["y"] - 1)
                    ) {
                        mutatePoints(aTile, tileObj, "topLeft");
                        if(checkWinner(tileObj.point["topLeft"])) declareWinner();
                    
                    }
                });
            }

            function winThroughDiagonalTopRight (tileObj) {
                state.player[state.currentPlayer].forEach ((aTile) => {
                    if (
                        (tileObj.position["x"] === aTile.position["x"] + 1 && 
                        tileObj.position["y"] === aTile.position ["y"] - 1)  ||

                        (tileObj.position["x"] === aTile.position["x"] -1 && 
                        tileObj.position["y"] === aTile.position["y"] + 1)
                    ) {
                        mutatePoints(aTile, tileObj, "topRight");
                        if(checkWinner(tileObj.point["topRight"])) declareWinner();
                    
                    }
                });
            }



