import React from "react";
import { Client } from "boardgame.io/react";
import { Local } from "boardgame.io/multiplayer";
// import { SocketIO } from "boardgame.io/multiplayer";
import { TicTacToe } from "./Game";
// import { TicTacToeBoard } from "./board/Board";
import { TicTacToeBoard } from "./board/Board_copy";

const TicTacToeClient = Client({
    game: TicTacToe,
    board: TicTacToeBoard,
    numPlayers: 2,
    
    // local master
    multiplayer: Local({
        persist: false,
        // storageKey: "bgio",
    }),
});

const App = () => (
    <div>
        <TicTacToeClient playerID="0" />
        <TicTacToeClient playerID="1" />

        {/* spectator */}
        {/* <TicTacToeClient playerID="2" /> */}
    </div>
);

export default App;
