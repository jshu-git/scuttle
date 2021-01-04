import React from "react";

import "../board.scss";
import { Row, Col, Image } from "react-bootstrap";

import { CardImages } from "../../../assets/cards.js";

const Graveyard = (props) => {
    const { G, moves, inPopup } = props;

    // moves
    const chooseEffectTarget = (targetCard) => {
        moves.chooseEffectTarget(targetCard);
    };

    let cells = [];
    for (let i = 0; i < G.graveyard.length; i++) {
        let card = G.graveyard[i];
        let img = CardImages[card.id];
        cells.push(
            <Col key={card.id}>
                <Image
                    src={img}
                    thumbnail
                    className={inPopup ? "targetable" : ""}
                    onClick={
                        inPopup
                            ? // we know we're in graveyard, so don't need to pass targetField
                              () => chooseEffectTarget(card)
                            : () => void 0
                    }
                ></Image>
            </Col>
        );
    }

    return (
        <React.Fragment>
            <h6>Graveyard</h6>
            <Row xs={4} sm={4} md={5}>
                {cells}
            </Row>
        </React.Fragment>
    );
};

export default Graveyard;
