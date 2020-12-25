import React from "react";
import "../style/board.css";

export class Fields extends React.Component {
    render() {
        let tbody_field_other = [];
        let tbody_field_you = [];
        let fields = this.props.fields;
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
                tbody_field_you.push(<tr key={k}>{cells_field}</tr>);
            } else {
                tbody_field_other.push(<tr key={k}>{cells_field}</tr>);
            }

            // the field_key always corresponds to the hand_key, not causing any problems for now
            // console.log("tbody_field key " + this.props.playerID);
        }

        return (
            <div>
                <p>Opponent Field</p>
                <table id="field">
                    <tbody>{tbody_field_other}</tbody>
                </table>
                <p>Your Field</p>
                <table id="field">
                    <tbody>{tbody_field_you}</tbody>
                </table>
            </div>
        );
    }
}
