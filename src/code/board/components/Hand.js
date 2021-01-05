import React, { useEffect } from "react";

import "../board.scss";
import { Row, Col, Image } from "react-bootstrap";
import { CardImages } from "../../../assets/cards.js";

const Hand = (props) => {
    const { G, ctx, moves, playerID } = props;

    const inActionStage = ctx.activePlayers[playerID] === "action";
    const player = G.players[playerID];
    const selectedCard = player.selectedCard;

    // printing
    useEffect(() => {
        console.log("in hand.js selected", selectedCard);
    }, [selectedCard]);

    const hand = player.hand;

    // moves
    const toggleSelectedCard = (card) => {
        moves.toggleSelectedCard(card)
    };

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
            <Row xs={4} sm={4} md={5} className={inActionStage ? "active" : ""}>
                {cells}
            </Row>
        </React.Fragment>
    );
};

export default Hand;
