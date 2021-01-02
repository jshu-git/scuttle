import React from "react";

// components
import { Field } from "./Field";
import { SpecialField } from "./SpecialField";
import { Graveyard } from "./Graveyard";

import "./board.scss";
import { Row, Col, Image } from "react-bootstrap";
import { CardImages } from "../../assets/cards.js";

export class ChoosingPopup extends React.Component {
    scuttle = () => {
        return (
            <React.Fragment>
                <h6>Opponent Field</h6>
                <Row xs={4} sm={4} md={5}>
                    <Field
                        inPopup={true}
                        // for display
                        field={this.props.opponentField}
                        jacks={this.props.jacks}
                        // onclick
                        inChoosingScuttleStage={true}
                        chooseScuttleTarget={this.props.chooseScuttleTarget}
                        isOpponentField={true}
                    />
                </Row>
            </React.Fragment>
        );
    };

    effect2 = () => {
        return (
            <Row>
                <Col>
                    <h6>Opponent Field</h6>
                    <Row xs={2} sm={2} md={3}>
                        <Field
                            inPopup={true}
                            field={this.props.opponentField}
                            jacks={this.props.jacks}
                            inChoosingEffectStage={
                                this.props.inChoosingEffectStage
                            }
                            chooseEffectTarget={this.props.chooseEffectTarget}
                            isOpponentField={true}
                        />
                    </Row>
                </Col>
                <Col>
                    <h6>Opponent Special Field</h6>
                    <Row xs={2} sm={2} md={3}>
                        <SpecialField
                            inPopup={true}
                            specialField={this.props.opponentSpecialField}
                            inChoosingEffectStage={
                                this.props.inChoosingEffectStage
                            }
                            chooseEffectTarget={this.props.chooseEffectTarget}
                            isOpponentSpecialField={true}
                        />
                    </Row>
                </Col>
            </Row>
        );
    };

    effect7 = () => {
        let cells = [];
        let deck = this.props.deck;

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
                        onClick={() => this.props.chooseEffectTarget(card)}
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

    effect9 = () => {
        return (
            <React.Fragment>
                <Row>
                    <Col>
                        <h6>Opponent Field</h6>
                        <Row xs={2} sm={2} md={3}>
                            <Field
                                inPopup={true}
                                field={this.props.opponentField}
                                jacks={this.props.jacks}
                                inChoosingEffectStage={
                                    this.props.inChoosingEffectStage
                                }
                                chooseEffectTarget={
                                    this.props.chooseEffectTarget
                                }
                                isOpponentField={true}
                            />
                        </Row>
                    </Col>
                    <Col>
                        <h6>Opponent Special Field</h6>
                        <Row xs={2} sm={2} md={3}>
                            <SpecialField
                                inPopup={true}
                                specialField={this.props.opponentSpecialField}
                                inChoosingEffectStage={
                                    this.props.inChoosingEffectStage
                                }
                                chooseEffectTarget={
                                    this.props.chooseEffectTarget
                                }
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
                                inPopup={true}
                                field={this.props.playerField}
                                jacks={this.props.jacks}
                                inChoosingEffectStage={
                                    this.props.inChoosingEffectStage
                                }
                                chooseEffectTarget={
                                    this.props.chooseEffectTarget
                                }
                                isPlayerField={true}
                            />
                        </Row>
                    </Col>
                </Row>
            </React.Fragment>
        );
    };

    effectJ = () => {
        return (
            <React.Fragment>
                <h6>Opponent Field</h6>
                <Row xs={4} sm={4} md={5}>
                    <Field
                        inPopup={true}
                        field={this.props.opponentField}
                        jacks={this.props.jacks}
                        inChoosingEffectStage={this.props.inChoosingEffectStage}
                        chooseEffectTarget={this.props.chooseEffectTarget}
                        isOpponentField={true}
                    />
                </Row>
            </React.Fragment>
        );
    };

    effect3 = () => {
        return (
            <React.Fragment>
                <h6>Graveyard</h6>
                <Graveyard
                    inPopup={true}
                    graveyard={this.props.graveyard}
                    // onclick
                    inChoosingEffectStage={this.props.inChoosingEffectStage}
                    chooseEffectTarget={this.props.chooseEffectTarget}
                />
            </React.Fragment>
        );
    };

    render() {
        // props
        let selectedCard = this.props.selectedCard;
        // stages
        let inChoosingScuttleStage = this.props.inChoosingScuttleStage;
        let inChoosingEffectStage = this.props.inChoosingEffectStage;

        return (
            <React.Fragment>
                {/* scuttling, opponent field */}
                {inChoosingScuttleStage && (
                    <React.Fragment>{this.scuttle()}</React.Fragment>
                )}

                {/* 2 opponent field and opponent special field */}
                {selectedCard.Value === "2" && inChoosingEffectStage && (
                    <React.Fragment>{this.effect2()}</React.Fragment>
                )}

                {/* 3 graveyard */}
                {selectedCard.Value === "3" && inChoosingEffectStage && (
                    <React.Fragment>{this.effect3()}</React.Fragment>
                )}
                {/* 7 */}
                {selectedCard.Value === "7" && inChoosingEffectStage && (
                    <React.Fragment>{this.effect7()}</React.Fragment>
                )}
                {/* 9 ALL fields */}
                {selectedCard.Value === "9" && inChoosingEffectStage && (
                    <React.Fragment>{this.effect9()}</React.Fragment>
                )}
                {/* J opponent field */}
                {selectedCard.Value === "Jack" && inChoosingEffectStage && (
                    <React.Fragment>{this.effectJ()}</React.Fragment>
                )}
            </React.Fragment>
        );
    }
}
