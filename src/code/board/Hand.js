import React, { useEffect } from "react";

import "./board.scss";
import { Row, Col, Image } from "react-bootstrap";
import { CardImages } from "../../assets/cards.js";

export const Hand = (props) => {
    const {
        G,
        ctx,
        playerID,
        selectedCard,
        setSelectedCard,
        isPlayerHand,
    } = props;

    const inActionStage = ctx.activePlayers[playerID] === "action";

    const toggleSelectedCard = (card) => {
        selectedCard ? setSelectedCard(false) : setSelectedCard(card);
    };

    // printing
    useEffect(() => {
        console.log("selected", selectedCard);
    }, [selectedCard]);

    let hand = G.hands[playerID];
    let cells = [];
    for (let i = 0; i < hand.length; i++) {
        let card = hand[i];
        let img = CardImages[card.id];

        cells.push(
            <Col key={card.id}>
                <Image
                    src={img}
                    thumbnail
                    className={inActionStage ? "targetable" : ""}
                    onClick={
                        // note: when using ternary in onClick, have to use ()=>
                        inActionStage
                            ? () => toggleSelectedCard(card)
                            : () => void 0
                    }
                />
            </Col>
        );
    }

    return (
        <React.Fragment>
            {isPlayerHand && (
                <h6>
                    Your Hand ({hand.length}){" "}
                    {selectedCard !== false && (
                        <span>(selected: {selectedCard.id})</span>
                    )}
                </h6>
            )}
            <Row xs={4} sm={4} md={5} className={inActionStage ? "active" : ""}>
                {cells}
            </Row>
        </React.Fragment>
    );
};
