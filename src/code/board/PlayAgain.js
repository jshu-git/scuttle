import React from "react";
import { LobbyAPI } from "../../LobbyAPI";
import uniqid from "uniqid";

const api = new LobbyAPI();

export class PlayAgain extends React.Component {
    componentDidUpdate() {
        let gameOver = this.props.gameOver;

        if (gameOver.newRoomID !== "") {
            let myID = localStorage.getItem("id");
            let myCredentials = localStorage.getItem("credentials");
            let myName = localStorage.getItem("name");
            api.leaveRoom(this.props.gameID, myID, myCredentials).then(() => {
                api.joinRoom(gameOver.newRoomID, myID, myName).then(
                    (credentials) => {
                        localStorage.setItem("credentials", credentials);
                        window.location.href = "/rooms/" + gameOver.newRoomID;
                    }
                );
            });
        }

        // 2 players
        if (gameOver.playAgain.length === 2) {
            if (
                gameOver.newRoomID === "" &&
                // only the [0] player creates the room
                this.props.playerID === gameOver.playAgain[0]
            ) {
                api.createRoom(2).then((roomID) => {
                    this.props.setNewRoom(roomID);
                });
            }
        }
    }

    render() {
        let temp = [];
        let winner = this.props.winner;
        let gameOver = this.props.gameOver;
        let playerID = this.props.playerID;
        console.log(this.props.gameID);

        if (winner !== "") {
            temp.push(
                <button
                    key={uniqid()}
                    onClick={this.props.playAgain}
                    disabled={gameOver.playAgain.includes(playerID)}
                >
                    play again
                </button>
            );
        }
        return <div>HELLO WORLD!{temp}</div>;
    }
}
