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

// local testing
import { Client } from "boardgame.io/react";
import { Local } from "boardgame.io/multiplayer";
import { Scuttle } from "../src/code/game/Game";
import { Board } from "../src/code/board/Board";
// const GameClient = Client({
//     game: Scuttle,
//     board: Board,
//     multiplayer: Local(),
// });
// // to test locally, uncomment the multiplayer app and use this one
// const App = () => (
//     <div>
//         <GameClient playerID="0" />
//         <GameClient playerID="1" />
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
