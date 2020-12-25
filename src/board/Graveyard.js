import React from "react";
import "../style/board.css";

export class Graveyard extends React.Component {
    render() {
        let tbody_graveyard = [];
        let cells_graveyard = [];
        let graveyard = this.props.graveyard;

        for (let i = 0; i < graveyard.length; i++) {
            let card = graveyard[i];
            cells_graveyard.push(
                <td
                    key={card.id}
                    className={this.props.targetable ? "targetable" : ""}
                    onClick={
                        this.props.targetable
                            ? () => this.props.playCardEffect(card.id)
                            : () => void 0
                    }
                >
                    {card.Value} of {card.Suit}
                </td>
            );
        }
        tbody_graveyard.push(
            <tr key={this.props.playerID}>{cells_graveyard}</tr>
        );

        return (
            <div>
                <table>
                    <tbody>{tbody_graveyard}</tbody>
                </table>
            </div>
        );
    }
}
