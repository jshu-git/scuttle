import { Lobby } from "boardgame.io/react";
import { Scuttle } from "../game/Game";
import { ScuttleBoard } from "../board/Board_copy";

<Lobby
    gameServer={`https://${window.location.hostname}:8000`}
    lobbyServer={`https://${window.location.hostname}:8000`}
    gameComponents={[{ game: Scuttle, board: ScuttleBoard }]}
/>;
