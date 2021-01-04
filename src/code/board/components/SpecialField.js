import React from "react";
import "../board.scss";
import { Col, Image } from "react-bootstrap/";
import { CardImages } from "../../../assets/cards.js";

const SpecialField = (props) => {
    const {
        ctx,
        playerID,
        specialField,
        moves,
        inPopup,
        isPlayerSpecialField,
        isOpponentSpecialField,
    } = props;

    // stages
    const inChoosingEffectStage =
        ctx.activePlayers[playerID] === "choosingEffect";

    // moves
    const chooseEffectTarget = (targetCard, targetField) => {
        moves.chooseEffectTarget(targetCard, targetField);
    };

    const onClick = (targetCard) => {
        if (inPopup) {
            if (inChoosingEffectStage) {
                if (isOpponentSpecialField) {
                    return () =>
                        chooseEffectTarget(targetCard, "opponentSpecialField");
                } else if (isPlayerSpecialField) {
                    return () =>
                        chooseEffectTarget(targetCard, "playerSpecialField");
                }
            }
        }
        return () => void 0;
    };

    let cells = [];

    for (let i = 0; i < specialField.length; i++) {
        let card = specialField[i];
        let img = CardImages[card.id];

        cells.push(
            <Col key={card.id}>
                <Image
                    src={img}
                    thumbnail
                    className={inPopup ? "targetable" : ""}
                    onClick={() => onClick(card)}
                ></Image>
            </Col>
        );
    }

    return cells;
};

export default SpecialField;
