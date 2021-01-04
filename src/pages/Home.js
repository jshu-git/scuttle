import React, { useState, useEffect } from "react";
import Lobby from "../pages/Lobby";
import { api } from "../LobbyAPI";

import { Button, Row, Col } from "react-bootstrap";


const Home = (props) => {
    const { history } = props;
    const maxNameLength = 12;
    const roomIDLength = 9;

    const [room, setRoom] = useState("");
    const [jName, setJName] = useState("");
    // const jNameCount = maxNameLength - jName.length;
    const numPlayers = 2;
    // const [num, setNum] = useState(2);
    const [cName, setCName] = useState("");
    // const cNameCount = maxNameLength - cName.length;
    const [errMsg, setErrMsg] = useState("");

    // handle URL to a room that doesn't exist
    useEffect(() => {
        let timer;
        if (history.location.state && history.location.state.invalidRoom) {
            setErrMsg("Room does not exist");
            // reset error message
            timer = setTimeout(() => {
                setErrMsg("");
                history.replace();
            }, 4000);
        }
        return () => {
            clearTimeout(timer);
        };
    }, [history]);

    // restrict inputs, specifically spaces (inspired by https://secret-hitler.online/)
    const handleKeyDown = (e, text) => {
        if (e.key === " ") {
            if (text) {
                if (
                    text.length === 0 ||
                    text.substring(text.length - 1, text.length) === " "
                ) {
                    e.preventDefault();
                }
            } else {
                e.preventDefault();
            }
        }
    };

    // store user information to localStorage to use later when we arrive at the room
    const saveInfo = (name, id, credentials) => {
        localStorage.setItem("name", name);
        localStorage.setItem("id", id);
        localStorage.setItem("credentials", credentials);
    };

    const joinRoom = async (roomID, name) => {
        try {
            const players = await api.getPlayers(roomID);
            const uniqueName =
                players
                    .filter((player) => player.name)
                    .map((player) => player.name)
                    .indexOf(name) === -1;
            if (uniqueName) {
                // find first empty seat
                const id = players.find((player) => !player.name).id;
                api.joinRoom(roomID, id, name).then((credentials) => {
                    saveInfo(name, id, credentials);
                    history.push("/rooms/" + roomID);
                });
            } else {
                // handle name conflict error
                setErrMsg("name already taken!");
                setJName("");
                document.getElementById("joinName").value = "";
            }
        } catch (err) {
            /*
             * --- TO-DO: setErrMsg("room is full") here if that's the case. currently it's "room does not exist" in both cases ---
             */
            setErrMsg("Room does not exist");
            setRoom("");
            document.getElementById("roomIdentification").value = "";
        }
    };

    const createRoom = () => {
        api.createRoom(numPlayers).then((roomID) => {
            joinRoom(roomID, cName);
        });
    };

    return (
        <Lobby>
            <Row>
                <Col className="border">
                    <h6>Create Game</h6>
                    <label>Name:</label>
                    <div>
                        <input
                            type="text"
                            maxLength={`${maxNameLength}`}
                            spellCheck="false"
                            autoComplete="off"
                            onKeyDown={(e) => handleKeyDown(e, cName)}
                            onChange={(e) => setCName(e.target.value)}
                            onPaste={(e) => e.preventDefault()}
                        />
                    </div>
                    <Button
                        size="sm"
                        variant="success"
                        disabled={cName.length === 0}
                        onClick={createRoom}
                    >
                        Create
                    </Button>
                </Col>

                <Col className="border">
                    <h6>Join Game</h6>
                    <label>Room ID:</label>
                    <div>
                        <input
                            id="roomIdentification"
                            type="text"
                            maxLength={`${roomIDLength}`}
                            spellCheck="false"
                            autoComplete="off"
                            onKeyDown={(e) => handleKeyDown(e)}
                            onChange={(e) => setRoom(e.target.value)}
                        />
                    </div>
                    <label>Name:</label>
                    <div>
                        <input
                            id="joinName"
                            type="text"
                            maxLength={`${maxNameLength}`}
                            spellCheck="false"
                            autoComplete="off"
                            onKeyDown={(e) => handleKeyDown(e, jName)}
                            onChange={(e) => setJName(e.target.value)}
                            onPaste={(e) => e.preventDefault()}
                        />
                    </div>
                    <Button
                        size="sm"
                        variant="success"
                        className="lobby-btn"
                        disabled={
                            room.length !== roomIDLength || jName.length === 0
                        }
                        onClick={() => joinRoom(room, jName)}
                    >
                        Join
                    </Button>
                </Col>
            </Row>
            <div>{errMsg}</div>
        </Lobby>
    );
};

export default Home;
