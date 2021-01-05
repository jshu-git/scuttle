import React from "react";
import "../board.scss";
import { Button } from "react-bootstrap";

const PlayCardOptions = (props) => {
    const { G, ctx, playerID, moves, playerIDOpponent } = props;

    const inActionStage = ctx.activePlayers[playerID] === "action";
    const player = G.players[playerID];
    const opponent = G.players[playerIDOpponent];
    const selectedCard = player.selectedCard;
    const graveyard = G.graveyard;
    const deck = G.deck;
    const jacks = G.jacks;

    // moves
    const playCardValue = () => {
        moves.playCardValue();
    };
    const playCardScuttle = () => {
        moves.playCardScuttle();
    };
    const playCardEffect = () => {
        moves.playCardEffect(playerID, selectedCard);
    };

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
        opponent.field.length === 0 || special;

    // special field J/Q checks
    let jackInOpponentField = opponent.field.some((x) => jacks[x.id]);
    // let jackInPlayerField = fields[playerID].some((x) => jacks[x.id]);
    let numQueensInOpponentSpecialField = opponent.specialField.filter(
        (x) => x.Value === "Queen"
    ).length;

    // effect
    let disabledEffect =
        // 2 with no jacks in OPPONENT field and no special cards in OPPONENT field
        (selectedCard.Value === "2" &&
            !jackInOpponentField &&
            opponent.specialField.length === 0) ||
        // 3 on empty graveyard
        (selectedCard.Value === "3" && graveyard.length === 0) ||
        // 5 on < 2 deck
        (selectedCard.Value === "5" && deck.length < 2) ||
        // 7 on 1 card in hand
        (selectedCard.Value === "7" && player.hand.length === 1) ||
        // 9 when no cards on field
        (selectedCard.Value === "9" &&
            player.field.length === 0 &&
            opponent.field.length === 0 &&
            opponent.specialField.length === 0) ||
        // 10 no effect
        selectedCard.Value === "10" ||
        // jack on empty opponent field
        (selectedCard.Value === "Jack" && opponent.field.length === 0) ||
        // or > 0 queen
        (selectedCard.Value === "Jack" && numQueensInOpponentSpecialField > 0);

    if (inActionStage && selectedCard !== false) {
        return (
            <React.Fragment>
                <Button
                    size="sm"
                    disabled={disabledValue}
                    onClick={playCardValue}
                >
                    Play Value
                </Button>{" "}
                <Button
                    size="sm"
                    disabled={disabledScuttle}
                    onClick={playCardScuttle}
                >
                    Scuttle
                </Button>{" "}
                <Button
                    size="sm"
                    disabled={disabledEffect}
                    onClick={playCardEffect}
                >
                    Play Effect
                </Button>
            </React.Fragment>
        );
    }
    return <React.Fragment></React.Fragment>;
};

export default PlayCardOptions;
