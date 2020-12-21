import React from "react";
import "./style/board.css";

export class TicTacToeBoard extends React.Component {
    onClick = (id) => {
        console.log(id);
        this.props.moves.playCard(id);
    };

    render() {
        // hand stuff
        // hand is a table that is 1 row long
        let tbody_hand = [];
        let cells_hand = [];
        // ***important*** uses playerID. this matches with G.hands
        // console.log("hello playerid " + this.props.playerID);
        let hand = this.props.G.hands[this.props.playerID];
        for (let i = 0; i < hand.length; i++) {
            cells_hand.push(
                // key info: https://reactjs.org/docs/lists-and-keys.html#keys-must-only-be-unique-among-siblings
                <td
                    key={i}
                    className={this.props.isActive ? "active" : ""}
                    onClick={() => this.onClick(i)}
                >
                    {hand[i].Value} of {hand[i].Suit}
                </td>
            );
        }
        tbody_hand.push(<tr key={0}>{cells_hand}</tr>);

        // winner stuff
        let winner = null;
        if (this.props.ctx.gameover) {
            winner =
                this.props.ctx.gameover.winner !== undefined ? (
                    <div id="winner">
                        Winner: {this.props.ctx.gameover.winner}
                    </div>
                ) : (
                    <div id="winner">Draw!</div>
                );
        }

        return (
            <div>
                <p>Current Turn: Player {this.props.ctx.currentPlayer}</p>
                <hr></hr>
                <p>Your Hand</p>
                <table>
                    <tbody>{tbody_hand}</tbody>
                </table>
                {winner}
            </div>
        );
    }
}
