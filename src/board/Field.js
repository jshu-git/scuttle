import React from "react";
import "../style/board.css";

export class Field extends React.Component {
    determineOnClick = (target_card_id) => {
        if (this.props.choosingScuttle) {
            return () => this.props.playCardScuttle(target_card_id);
        } else if (this.props.choosingEffect) {
            return () => this.props.playCardEffect(target_card_id);
        }
        return () => void 0;
    };

    render() {
        let tbody_field = [];
        let cells_field = [];
        let field = this.props.field;
        for (let i = 0; i < field.length; i++) {
            let card = field[i];
            cells_field.push(
                <td
                    key={card.id}
                    className={this.props.targetable ? "targetable" : ""}
                    onClick={this.determineOnClick(card.id)}
                >
                    {card.Value} of {card.Suit}
                </td>
            );
        }
        tbody_field.push(<tr key={this.props.playerID}>{cells_field}</tr>);

        return (
            <div>
                <table id="field">
                    <tbody>{tbody_field}</tbody>
                </table>
            </div>
        );
    }
}
