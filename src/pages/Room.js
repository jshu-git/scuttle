import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Client } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
// import classNames from "classnames";
import { DEFAULT_PORT, APP_PRODUCTION } from "../config";
import { Scuttle, Board } from "../code";
import Lobby from "../pages/Lobby";
import { LobbyAPI } from "../LobbyAPI";

// import "./Room.scss";
import { Button, Row, Col } from "react-bootstrap";

const api = new LobbyAPI();

const { origin, protocol, hostname } = window.location;
const SERVER_URL = APP_PRODUCTION
    ? origin
    : `${protocol}//${hostname}:${DEFAULT_PORT}`;

const GameClient = Client({
    game: Scuttle,
    board: Board,
    debug: true,
    multiplayer: SocketIO({ server: SERVER_URL }),
});

const Room = (props) => {
    const { history } = props;
    const { id } = useParams();
    // const [copied, setCopied] = useState(false);
    const [players, setPlayers] = useState([]);
    const [show, setShow] = useState(false);

    // check for newly joined players by comparing against the two players array (front-end and the api, and api is always slightly ahead)
    useEffect(() => {
        const interval = setInterval(() => {
            api.getPlayers(id).then(
                (players) => {
                    setPlayers(players);
                    const currPlayers = players.filter((player) => player.name); // only current players have a name field
                    if (currPlayers.length === players.length) {
                        setShow(true); // everyone has joined, show them the board
                    }
                },
                () => {
                    history.push("", { invalidRoom: true }); // failed to join because room doesn't exist -> return user to homepage
                }
            );
        }, 500);
        if (show) {
            clearInterval(interval);
        }
        return () => {
            clearInterval(interval);
        };
    }, [show, players.length, id, history]);

    // after user copies to clipboard
    // useEffect(() => {
    //     let timeout;
    //     if (copied) {
    //         timeout = setTimeout(() => {
    //             if (document.getSelection().toString() === id) {
    //                 document.getSelection().removeAllRanges();
    //             }
    //             setCopied(false);
    //         }, 0);
    //     }

    //     return () => clearTimeout(timeout);
    // }, [copied, id]);

    const copyToClipboard = (e) => {
        const textArea = document.getElementById("roomID");
        textArea.select();
        document.execCommand("copy");
        e.target.focus();
        // setCopied(true);
    };

    const leaveRoom = () => {
        api.leaveRoom(
            id,
            localStorage.getItem("id"),
            localStorage.getItem("credentials")
        ).then(() => {
            history.push("/");
        });
    };

    if (show) {
        // don't include lobby because game doesn't show game title, game credits... it's fullscreen.
        return (
            <GameClient
                gameID={id}
                // numPlayers={players.length}
                playerID={localStorage.getItem("id")}
                credentials={localStorage.getItem("credentials")}
            />
        );
    } else {
        return (
            <Lobby>
                <Row>
                    <Col className="border">
                        <h6>Room ID:</h6>
                        <span>
                            <input id="roomID" value={id} readOnly />{" "}
                            <Button
                                size="sm"
                                variant="outline-secondary"
                                onClick={copyToClipboard}
                            >
                                Copy
                            </Button>
                        </span>
                    </Col>
                    <Col className="border">
                        <h6>Players</h6>
                        <div>
                            {players.map((player) => {
                                if (player.name) {
                                    return player.name;
                                } else {
                                    return "\n";
                                }
                            })}
                        </div>
                    </Col>
                </Row>

                <h6>Game will begin once all players have joined.</h6>
                <Button size="sm" variant="danger" onClick={leaveRoom}>
                    Leave Room
                </Button>
            </Lobby>
        );
    }
};

export default Room;
