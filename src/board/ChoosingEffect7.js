import React from "react";
import "../style/board.css";

export class ChoosingEffect7 extends React.Component {
    render() {
        let tbody = [];
        let cells = [];
        let deck = this.props.deck;

        for (let i = 0; i < 2; i++) {
            let idx = deck.length - 1 - i;
            let card = deck[idx];

            cells.push(
                <td
                    key={card.id}
                    // className={this.props.targetable ? "targetable" : ""}
                    // className={"targetable"}
                    onClick={this.props.chooseEffectTarget(card)}
                >
                    {card.Value} of {card.Suit}
                </td>
            );
        }
        tbody.push(<tr key={this.props.playerID}>{cells}</tr>);

        return (
            <div>
                <p>Choose a card to take:</p>
                <table>
                    <tbody>{tbody}</tbody>
                </table>
            </div>
        );
    }
}
