import React from "react";
import "./style/board.css";

export class TicTacToeBoard extends React.Component {
    onClick = (id) => {
        // console.log(id);
        this.props.moves.playCard(id);
    };

    render() {
        // field stuff
        // field is a table that is 2 rows long (1 for each hand)
        let tbody_field_other = [];
        let tbody_field_you = [];

        let fields = this.props.G.fields;
        let field_other_len = 0;
        let field_you_len = 0;
        // key is player, value is the corresponding field
        for (let k in fields) {
            let cells_field = [];
            // f = field array
            let f = fields[k];

            for (let idx in f) {
                let card = f[idx];

                cells_field.push(
                    <td key={card.id}>
                        {card.Value} of {card.Suit}
                    </td>
                );
            }

            // add cells to the correct field (your field always on bottom)
            if (k === this.props.playerID) {
                field_you_len = f.length;
                tbody_field_you.push(<tr key={k}>{cells_field}</tr>);
            } else {
                field_other_len = f.length;
                tbody_field_other.push(<tr key={k}>{cells_field}</tr>);
            }

            // the field_key always corresponds to the hand_key, not causing any problems for now
            // console.log("tbody_field key " + this.props.playerID);
        }

        // hand stuff
        // hand is a table that is 1 row long
        let tbody_hand = [];
        let cells_hand = [];

        // ***important*** uses playerID. this matches with G.hands
        // console.log("hello playerid " + this.props.playerID);
        let hand = this.props.G.hands[this.props.playerID];
        for (let i = 0; i < hand.length; i++) {
            let card = hand[i];
            cells_hand.push(
                // key info: https://reactjs.org/docs/lists-and-keys.html#keys-must-only-be-unique-among-siblings
                // https://sentry.io/answers/defining-proper-key-in-props/
                <td
                    key={card.id}
                    className={this.props.isActive ? "active" : ""}
                    onClick={() => this.onClick(i)}
                >
                    {card.Value} of {card.Suit}
                </td>
            );
        }

        // key is tied to playerID
        // console.log("tbody_hand key " + this.props.playerID);
        tbody_hand.push(<tr key={this.props.playerID}>{cells_hand}</tr>);

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
                <table id="field">
                    <thead>
                        <tr>
                            <th colSpan={field_other_len}>Opponent Field</th>
                        </tr>
                    </thead>
                    <tbody>{tbody_field_other}</tbody>
                </table>
                <table id="field">
                    <thead>
                        <tr>
                            <th colSpan={field_you_len}>Your Field</th>
                        </tr>
                    </thead>
                    <tbody>{tbody_field_you}</tbody>
                </table>
                <table id="hand">
                    <thead>
                        <tr>
                            <th colSpan={hand.length}>Your Hand</th>
                        </tr>
                    </thead>
                    <tbody>{tbody_hand}</tbody>
                </table>
                <br></br>
                <br></br>
                <br></br>
                {winner}
            </div>
        );
    }
}
