import React from "react";
import ReactDOM from "react-dom";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
    useHistory,
} from "react-router-dom";
import { Home, Room } from "./pages";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.scss";

<<<<<<< HEAD
// // TO TEST LOCALLY:, uncomment the multiplayer app and use this one
// // local testing
=======
// TO TEST LOCALLY:, uncomment the multiplayer app and use this one
// local testing
>>>>>>> 7ebcc71ba5ee7a8f7b8b0f071975b7404da429f7
// import { Client } from "boardgame.io/react";
// import { Local } from "boardgame.io/multiplayer";
// import { Scuttle } from "../src/code/game/Game";
// import { Board } from "../src/code/board/Board";
// const GameClient = Client({
//     game: Scuttle,
//     board: Board,
//     multiplayer: Local(),
// });
// const App = () => (
//     <div>
<<<<<<< HEAD
//         <GameClient playerID="0" playerName="jshu" />
//         <GameClient playerID="1" playerName="vindara"/>
=======
//         <GameClient playerID="0" />
//         <GameClient playerID="1" />
>>>>>>> 7ebcc71ba5ee7a8f7b8b0f071975b7404da429f7
//     </div>
// );

const App = () => {
    const history = useHistory(); // remember the history of user navigation

    // defining the routing: (so far) homepage, lobby/room page. else redirect to home page for simplicity
    return (
        <Switch>
            <Route exact path="/">
                <Home history={history} />
            </Route>
            <Route exact path="/rooms/:id">
                <Room history={history} />
            </Route>
            <Redirect to="/" />
        </Switch>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <App />
        </Router>
    </React.StrictMode>,
    document.getElementById("root")
);
