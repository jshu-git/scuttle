import React from "react";
import "../style/board.css";
import Button from "react-bootstrap/Button";

export class PlayCardOptions extends React.Component {
    render() {
        // props
        let selectedCard = this.props.selectedCard;
        let opponentField = this.props.opponentField;
        let graveyard = this.props.graveyard;
        let deck = this.props.deck;

        // special cards
        let special =
            selectedCard.Value === "Jack" ||
            selectedCard.Value === "Queen" ||
            selectedCard.Value === "King";

        // value
        let disabledValue = special;

        // scuttle
        let disabledScuttle =
            // scuttle on empty opponent field
            opponentField.length === 0 || special;

        // effect
        let disabledEffect =
            // 2 unimplemented, should be no special cards on field
            selectedCard.Value === "2" ||
            // 3 on empty graveyard
            (selectedCard.Value === "3" && graveyard.length === 0) ||
            // 5 on < 2 deck
            (selectedCard.Value === "5" && deck.length < 2) ||
            // 7 on < 2 deck
            (selectedCard.Value === "7" && deck.length < 2) ||
            // 9 unimplemented
            selectedCard.Value === "9" ||
            // 10 no effect
            selectedCard.Value === "10" ||
            // jack on empty opponent field
            (selectedCard.Value === "Jack" && opponentField.length === 0);

        return (
            <React.Fragment>
                <Button
                    size="sm"
                    disabled={disabledValue}
                    onClick={this.props.playCardValue}
                >
                    playCardValue
                </Button>
                <Button
                    size="sm"
                    disabled={disabledScuttle}
                    onClick={this.props.playCardScuttle}
                >
                    playCardScuttle
                </Button>
                <Button
                    size="sm"
                    disabled={disabledEffect}
                    onClick={this.props.playCardEffect}
                >
                    playCardEffect
                </Button>
            </React.Fragment>
        );
    }
}
