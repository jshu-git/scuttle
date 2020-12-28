import React from "react";
import "../style/board.css";
import Button from "react-bootstrap/Button";

export class PlayCardOptions extends React.Component {
    render() {
        // props
        let playerID = this.props.playerID;
        let playerIDOpponent = String(1 - parseInt(playerID));
        let fields = this.props.fields;
        let specialFields = this.props.specialFields;
        let graveyard = this.props.graveyard;
        let deck = this.props.deck;
        let jacks = this.props.jacks;

        let selectedCard = this.props.selectedCard;

        // special cards
        let special =
            selectedCard.Value === "Jack" ||
            selectedCard.Value === "Queen" ||
            selectedCard.Value === "King";

        // value
        let disabledValue = special;

        // scuttle
        let disabledScuttle =
            // scuttle on empty opponent field or special card
            fields[playerIDOpponent].length === 0 || special;

        // special field J/Q checks
        let jackInOpponentField = fields[playerIDOpponent].some(
            (x) => jacks[x.id]
        );
        let jackInPlayerField = fields[playerID].some((x) => jacks[x.id]);
        let numQueensInOpponentSpecialField = specialFields[
            playerIDOpponent
        ].filter((x) => x === "Queen").length;

        // effect
        let disabledEffect =
            // 2 with no jacks in OPPONENT field and no special cards in OPPONENT field
            (selectedCard.Value === "2" &&
                !jackInOpponentField &&
                specialFields[playerIDOpponent].length === 0) ||
            // or >1 queen
            (selectedCard.Value === "2" &&
                numQueensInOpponentSpecialField > 1) ||
            // 3 on empty graveyard
            (selectedCard.Value === "3" && graveyard.length === 0) ||
            // 5 on < 2 deck
            (selectedCard.Value === "5" && deck.length < 2) ||
            // 7 on < 2 deck
            (selectedCard.Value === "7" && deck.length < 2) ||
            // 9 (same as 2), except can 9 your own field so have to check for jack in own field
            (selectedCard.Value === "9" &&
                !jackInOpponentField &&
                !jackInPlayerField &&
                specialFields[playerIDOpponent].length === 0) ||
            (selectedCard.Value === "9" &&
                numQueensInOpponentSpecialField > 1) ||
            // 10 no effect
            selectedCard.Value === "10" ||
            // jack on empty opponent field
            (selectedCard.Value === "Jack" &&
                fields[playerIDOpponent].length === 0) ||
            // or >1 queen
            (selectedCard.Value === "Jack" &&
                numQueensInOpponentSpecialField > 1);

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
