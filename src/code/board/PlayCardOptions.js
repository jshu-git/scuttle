import React from "react";
import "./board.scss";
import { Button } from "react-bootstrap";

export class PlayCardOptions extends React.Component {
    render() {
        // props
        let playerID = this.props.playerID;
        let playerIDOpponent = this.props.playerIDOpponent;
        let fields = this.props.fields;
        let specialFields = this.props.specialFields;
        let graveyard = this.props.graveyard;
        let deck = this.props.deck;
        let jacks = this.props.jacks;
        let hand = this.props.hand; 

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
        // let jackInPlayerField = fields[playerID].some((x) => jacks[x.id]);
        let numQueensInOpponentSpecialField = specialFields[
            playerIDOpponent
        ].filter((x) => x.Value === "Queen").length;

        // effect
        let disabledEffect =
            // 2 with no jacks in OPPONENT field and no special cards in OPPONENT field
            (selectedCard.Value === "2" &&
                !jackInOpponentField &&
                specialFields[playerIDOpponent].length === 0) ||
            // 3 on empty graveyard
            (selectedCard.Value === "3" && graveyard.length === 0) ||
            // 5 on < 2 deck
            (selectedCard.Value === "5" && deck.length < 2) ||
            // 7 on 1 card in hand
            (selectedCard.Value === "7" && hand[playerID].length === 1 && hand[playerID].length > deck.length) ||
            // 9 when no cards on field
            (selectedCard.Value === "9" &&
                fields[playerID].length === 0 &&
                fields[playerIDOpponent].length === 0 &&
                specialFields[playerIDOpponent].length === 0) ||
            // 10 no effect
            selectedCard.Value === "10" ||
            // jack on empty opponent field
            (selectedCard.Value === "Jack" &&
                fields[playerIDOpponent].length === 0) ||
            // or > 0 queen
            (selectedCard.Value === "Jack" &&
                numQueensInOpponentSpecialField > 0);

        return (
            <React.Fragment>
                <Button
                    size="sm"
                    disabled={disabledValue}
                    onClick={this.props.playCardValue}
                >
                    Play Value
                </Button>{" "}
                <Button
                    size="sm"
                    disabled={disabledScuttle}
                    onClick={this.props.playCardScuttle}
                >
                    Scuttle
                </Button>{" "}
                <Button
                    size="sm"
                    disabled={disabledEffect}
                    onClick={this.props.playCardEffect}
                >
                    Play Effect
                </Button>
            </React.Fragment>
        );
    }
}
