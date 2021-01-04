import React from "react";

import "./board.scss";
import { Col, Image } from "react-bootstrap";

import { CardImages } from "../../assets/cards.js";

export const Field = (props) => {
    const {
        G,
        ctx,
        playerID,
        field,
        moves,
        inPopup,
        isPlayerField,
        isOpponentField,
        selectedCard,
        setSelectedCard,
    } = props;

    // stages
    const inChoosingScuttleStage =
        ctx.activePlayers[playerID] === "choosingScuttle";
    const inChoosingEffectStage =
        ctx.activePlayers[playerID] === "choosingEffect";

    // determining onclick (only for popup)
    const onClick = (targetCard) => {
        if (inPopup) {
            if (inChoosingScuttleStage && isOpponentField) {
                moves.chooseScuttleTarget(selectedCard, targetCard);
                setSelectedCard(false);
            } else if (inChoosingEffectStage) {
                if (isOpponentField) {
                    moves.chooseEffectTarget(targetCard, "opponentField");
                } else if (isPlayerField) {
                    moves.chooseEffectTarget(targetCard, "playerField");
                }
            }
        }
    };

    let jacks = G.jacks;
    let cells = [];

    const style = {
        // for jack text
        textAlign: "center",
    };

    for (let i = 0; i < field.length; i++) {
        let card = field[i];
        let img = CardImages[card.id];
        // let owner, numJacked;
        // if (jacks[card]) {
        //     owner = jacks[card][0];
        //     numJacked = jacks[card][1].length;
        // }

        cells.push(
            <Col key={card.id} style={style}>
                <Image
                    src={img}
                    thumbnail
                    style={style}
                    className={inPopup ? "targetable" : ""}
                    onClick={() => onClick(card)}
                ></Image>
                {jacks[card.id] && (
                    <span>
                        ({jacks[card.id][1]},j
                        {jacks[card.id][2].length})
                    </span>
                )}
            </Col>
        );
    }
    return cells;
};
