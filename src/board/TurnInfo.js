import React from "react";

import "../style/board.css";

export class TurnInfo extends React.Component {
    render() {
        // props
        let currentPlayer = this.props.currentPlayer;
        let deck = this.props.deck;
        let selectedCard = this.props.selectedCard;

        return (
            <React.Fragment>
                <h5>Current Turn: Player {currentPlayer}</h5>
                <hr></hr>
            </React.Fragment>
        );
    }
}
