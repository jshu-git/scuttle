import React from "react";
import "../style/board.css";

export class Field extends React.Component {
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
                    onClick={
                        this.props.targetable
                            ? () => this.props.playCardScuttle(card.id)
                            : () => void 0
                    }
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
