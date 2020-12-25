import React from "react";
import "../style/board.css";

export class Hand extends React.Component {
    render() {
        let tbody_hand = [];
        let cells_hand = [];
        let hand = this.props.hand;
        for (let i = 0; i < hand.length; i++) {
            let card = hand[i];
            cells_hand.push(
                <td
                    key={card.id}
                    className={this.props.active ? "active" : ""}
                    onClick={
                        // note: when using ternary in onClick, have to use ()=>
                        this.props.active
                            ? () => this.props.togglePlayCardOptions(card.id)
                            : () => void 0
                    }
                >
                    {card.Value} of {card.Suit}
                </td>
            );
        }
        // // the key here is tied to playerID
        // // console.log("tbody_hand key " + this.props.playerID);
        tbody_hand.push(<tr key={this.props.playerID}>{cells_hand}</tr>);

        return (
            <table id="hand">
                <thead>
                    <tr>
                        <th colSpan={hand.length}>Your Hand</th>
                    </tr>
                </thead>
                <tbody>{tbody_hand}</tbody>
            </table>
        );
    }
}
