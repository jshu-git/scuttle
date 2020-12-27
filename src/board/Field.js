import React from "react";
import "../style/board.css";

export class Field extends React.Component {
    onClick = (targetCard) => {
        if (this.props.choosingScuttleStage) {
            return () => this.props.chooseScuttleTarget(targetCard);
        } else if (this.props.choosingEffectStage) {
            return () => this.props.chooseEffectTarget(targetCard);
        }
        return () => void 0;
    };

    render() {
        let tbody_field = [];
        let cells_field = [];
        let field = this.props.field;
        let jacks = this.props.jacks;

        for (let i = 0; i < field.length; i++) {
            let card = field[i];
            // let owner, numJacked;
            // if (jacks[card]) {
            //     owner = jacks[card][0];
            //     numJacked = jacks[card][1].length;
            // }

            cells_field.push(
                <td
                    key={card.id}
                    // className={"targetable"}
                    onClick={this.onClick(card)}
                >
                    {card.Value} of {card.Suit}{" "}
                    {jacks[card.id] && (
                        <span>
                            (Owner: {jacks[card.id][1]} numJacked:{" "}
                            {jacks[card.id][2].length})
                        </span>
                    )}
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
