import React from "react";

// components
import { Field } from "./Field";
import { SpecialField } from "./SpecialField";
import { Graveyard } from "./Graveyard";

import "./board.scss";
import { Row, Col, Image, Container } from "react-bootstrap";
import { CardImages } from "../../assets/cards.js";

export const ChoosingPopup = (props) => {
    const {
        G,
        ctx,
        playerID,
        moves,
        selectedCard,
        setSelectedCard,
        playerIDOpponent,
    } = props;

    // stages
    const inChoosingScuttleStage =
        ctx.activePlayers[playerID] === "choosingScuttle";
    const inChoosingEffectStage =
        ctx.activePlayers[playerID] === "choosingEffect";

    // moves
    const chooseEffectTarget = (targetCard) => {
        moves.chooseEffectTarget(targetCard);
    };

    const scuttle = () => {
        return (
            <React.Fragment>
                <h6>Opponent Field</h6>
                <Row xs={4} sm={4} md={5}>
                    <Field
                        {...props}
                        field={G.fields[playerIDOpponent]}
                        inPopup={true}
                        isOpponentField={true}
                        // for scuttling
                        selectedCard={selectedCard}
                        setSelectedCard={setSelectedCard}
                    />
                </Row>
            </React.Fragment>
        );
    };

    const effect2 = () => {
        return (
            <Row>
                <Col>
                    <h6>Opponent Field</h6>
                    <Row xs={2} sm={2} md={3}>
                        <Field
                            {...props}
                            inPopup={true}
                            field={G.fields[playerIDOpponent]}
                            isOpponentField={true}
                            // don't need to pass selectedcard since it's in counter chain
                        />
                    </Row>
                </Col>
                <Col>
                    <h6>Opponent Special Field</h6>
                    <Row xs={2} sm={2} md={3}>
                        <SpecialField
                            {...props}
                            inPopup={true}
                            specialField={G.specialFields[playerIDOpponent]}
                            isOpponentSpecialField={true}
                        />
                    </Row>
                </Col>
            </Row>
        );
    };

    const effect7 = () => {
        let cells = [];
        let deck = G.deck;

        for (let i = 0; i < 2; i++) {
            let idx = deck.length - 1 - i;
            let card = deck[idx];
            let img = CardImages[card.id];

            cells.push(
                <Col key={card.id}>
                    <Image
                        src={img}
                        thumbnail
                        className={"targetable"}
                        onClick={() => chooseEffectTarget(card)}
                    ></Image>
                </Col>
            );
        }

        return (
            <Row xs={4} sm={4} md={5}>
                {cells}
            </Row>
        );
    };

    const effect9 = () => {
        return (
            <React.Fragment>
                <Row>
                    <Col>
                        <h6>Opponent Field</h6>
                        <Row xs={2} sm={2} md={3}>
                            <Field
                                {...props}
                                inPopup={true}
                                field={G.fields[playerIDOpponent]}
                                isOpponentField={true}
                            />
                        </Row>
                    </Col>
                    <Col>
                        <h6>Opponent Special Field</h6>
                        <Row xs={2} sm={2} md={3}>
                            <SpecialField
                                {...props}
                                inPopup={true}
                                specialField={G.specialFields[playerIDOpponent]}
                                isOpponentSpecialField={true}
                            />
                        </Row>
                    </Col>
                </Row>
                <hr></hr>
                <Row>
                    <Col>
                        <h6>Your Field</h6>
                        <Row xs={4} sm={4} md={5}>
                            <Field
                                {...props}
                                field={G.fields[playerID]}
                                inPopup={true}
                                isPlayerField={true}
                            />
                        </Row>
                    </Col>
                </Row>
            </React.Fragment>
        );
    };

    const effectJ = () => {
        return (
            <React.Fragment>
                <h6>Opponent Field</h6>
                <Row xs={4} sm={4} md={5}>
                    <Field
                        {...props}
                        inPopup={true}
                        field={G.fields[playerIDOpponent]}
                        isOpponentField={true}
                    />
                </Row>
            </React.Fragment>
        );
    };

    const effect3 = () => {
        return (
            <React.Fragment>
                <h6>Graveyard</h6>
                <Graveyard {...props} inPopup={true} />
            </React.Fragment>
        );
    };

    if (inChoosingScuttleStage || inChoosingEffectStage) {
        return (
            <Container className="border popup">
                <h6>
                    <u>Choose Target</u>
                </h6>

                {/* scuttling, opponent field */}
                {inChoosingScuttleStage && (
                    <React.Fragment>{scuttle()}</React.Fragment>
                )}

                {/* 2 opponent field and opponent special field */}
                {selectedCard.Value === "2" && inChoosingEffectStage && (
                    <React.Fragment>{effect2()}</React.Fragment>
                )}
                {/* 3 graveyard */}
                {selectedCard.Value === "3" && inChoosingEffectStage && (
                    <React.Fragment>{effect3()}</React.Fragment>
                )}
                {/* 7 */}
                {selectedCard.Value === "7" && inChoosingEffectStage && (
                    <React.Fragment>{effect7()}</React.Fragment>
                )}
                {/* 9 ALL fields */}
                {selectedCard.Value === "9" && inChoosingEffectStage && (
                    <React.Fragment>{effect9()}</React.Fragment>
                )}
                {/* J opponent field */}
                {selectedCard.Value === "Jack" && inChoosingEffectStage && (
                    <React.Fragment>{effectJ()}</React.Fragment>
                )}
            </Container>
        );
    }
    return <React.Fragment></React.Fragment>;
};