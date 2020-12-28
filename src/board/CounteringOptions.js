import React from "react";
import "../style/board.css";
import Button from "react-bootstrap/Button";

export class CounteringOptions extends React.Component {
    render() {
        // props
        let hand = this.props.hand;
        let playerIDOpponent = this.props.playerIDOpponent;
        let specialFields = this.props.specialFields;

        let has2 = hand.some((x) => x.Value === "2");

        let numQueensInOpponentSpecialField = specialFields[
            playerIDOpponent
        ].filter((x) => x === "Queen").length;

        return (
            <React.Fragment>
                <Button size="sm" onClick={this.props.accept}>
                    Accept
                </Button>
                <Button
                    size="sm"
                    onClick={this.props.counter}
                    disabled={!has2 || numQueensInOpponentSpecialField > 1}
                >
                    Counter
                </Button>
            </React.Fragment>
        );
    }
}