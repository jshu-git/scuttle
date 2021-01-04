import React, { useState, useEffect } from "react";
import { LobbyAPI } from "../../LobbyAPI";
import uniqid from "uniqid";

import { Button } from "react-bootstrap";

const api = new LobbyAPI();

export const PlayAgain = ({ G, ctx, playerID, moves, gameID }) => {
    const [choices, setChoices] = useState([]);

    useEffect(() => {
        if (G.gameOver.newRoomID !== "") {
            const myID = localStorage.getItem("id");
            const myCredentials = localStorage.getItem("credentials");
            const myName = localStorage.getItem("name");
            api.leaveRoom(gameID, myID, myCredentials).then(() => {
                api.joinRoom(G.gameOver.newRoomID, myID, myName).then(
                    (credentials) => {
                        localStorage.setItem("credentials", credentials);
                        window.location.href = "/rooms/" + G.gameOver.newRoomID;
                    }
                );
            });
        }
    }, [G.gameOver.newRoomID, gameID]);

    useEffect(() => {
        if (G.gameOver.playAgain.length === 2) {
            if (
                G.gameOver.newRoomID === "" &&
                playerID === G.gameOver.playAgain[0]
            ) {
                api.createRoom(ctx.numPlayers).then((roomID) => {
                    moves.setNewRoom(roomID);
                });
            }
        }

        const playAgain = () => {
            moves.playAgain(playerID);
        };

        let temp = [];
        let disabled = G.gameOver.playAgain.includes(playerID);
        if (G.winner !== "") {
            temp.push(
                <Button
                    size="sm"
                    variant="primary"
                    key={uniqid()}
                    onClick={playAgain}
                    disabled={disabled}
                >
                    {disabled ? "Waiting for other player..." : "Play Again"}
                </Button>
            );
        }
        setChoices(temp);
    }, [
        G.gameOver.playAgain,
        G.winner,
        G.gameOver.newRoomID,
        ctx.numPlayers,
        moves,
        playerID,
    ]);

    return <React.Fragment>{choices}</React.Fragment>;
};
