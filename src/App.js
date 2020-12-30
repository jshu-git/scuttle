import React from "react";
import { Client } from "boardgame.io/react";
import { Local } from "boardgame.io/multiplayer";
// import { SocketIO } from "boardgame.io/multiplayer";
import { Scuttle } from "./game/Game";
import { ScuttleBoard } from "./board/Board_copy";

const ScuttleClient = Client({
    game: Scuttle,
    board: ScuttleBoard,
    numPlayers: 2,

    // local master
    multiplayer: Local({
        persist: false,
        // storageKey: "bgio",
    }),
    // debug: false,
});

const App = () => (
    <div>
        <ScuttleClient playerID="0" playerIDOpponent="1" playerName="jshu" />
        <ScuttleClient playerID="1" playerIDOpponent="0" playerName="vindara" />

        {/* spectator */}
        {/* <ScuttleClient playerID="2" /> */}
    </div>
);

export default App;
