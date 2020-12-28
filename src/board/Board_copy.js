import React from "react";
import "../style/board.css";
// components
import { Hand } from "./Hand";
import { PlayCardOptions } from "./PlayCardOptions";
import { CounteringOptions } from "./CounteringOptions";
import { Field } from "./Field";
import { SpecialField } from "./SpecialField";
import { Graveyard } from "./Graveyard";
import { ChoosingEffect7 } from "./ChoosingEffect7";
import { TurnOptions } from "./TurnOptions";
import { TurnInfo } from "./TurnInfo";

// bootstrap
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Jumbotron from "react-bootstrap/Jumbotron";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export class TicTacToeBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCard: -1,
            showGraveyard: false,
        };
    }

    toggleSelectedCard = (card) => {
        this.setState(
            {
                selectedCard: this.state.selectedCard === -1 ? card : -1,
            },
            () => {
                this.state.selectedCard === -1
                    ? console.log("unselected")
                    : console.log(
                          "selectedCard id is ",
                          this.state.selectedCard.id
                      );
            }
        );
    };

    playCardValue = () => {
        console.log("playCardValue: ", this.state.selectedCard.id);
        this.props.moves.playCardValue(this.state.selectedCard);
        this.setState({ selectedCard: -1 });
    };

    playCardScuttle = () => {
        this.props.moves.playCardScuttle();
    };

    chooseScuttleTarget = (targetCard) => {
        console.log(
            "scuttleCard: ",
            this.state.selectedCard.id,
            "target: ",
            targetCard.id
        );

        this.props.moves.chooseScuttleTarget(
            this.state.selectedCard,
            targetCard
        );
        this.setState({ selectedCard: -1 });
    };

    playCardEffect = () => {
        // kicks off the playcardeffect code, which can branch into target
        this.props.moves.playCardEffect(
            parseInt(this.props.ctx.currentPlayer),
            this.state.selectedCard
        );
        // at this point, selectedCard is at counter_chain[0], so we can reset it
        this.setState({ selectedCard: -1 });
    };

    chooseEffectTarget = (targetCard) => {
        console.log(
            "chooseEffectTarget: ",
            this.state.selectedCard.id,
            "target: ",
            targetCard.id
        );
        this.props.moves.chooseEffectTarget(targetCard);
    };

    toggleGraveyard = () => {
        this.setState({ showGraveyard: !this.state.showGraveyard });
    };

    render() {
        // important props to be passed
        let playerID = this.props.playerID;
        let playerIDOpponent = String(1 - parseInt(this.props.playerID));
        let currentPlayer = this.props.ctx.currentPlayer;
        let hand = this.props.G.hands[playerID];
        let graveyard = this.props.G.graveyard;
        let deck = this.props.G.deck;
        let fields = this.props.G.fields;
        let specialFields = this.props.G.specialFields;
        let selectedCard = this.state.selectedCard;
        let jacks = this.props.G.jacks;

        // stages
        let inActionStage =
            this.props.ctx.activePlayers[this.props.playerID] === "action";
        let inCounteringStage =
            this.props.ctx.activePlayers[this.props.playerID] === "countering";
        let inChoosingEffectStage =
            this.props.ctx.activePlayers[this.props.playerID] ===
            "choosingEffect";
        let inChoosingScuttleStage =
            this.props.ctx.activePlayers[this.props.playerID] ===
            "choosingScuttle";

        return (
            <div>
                {/* turn information */}
                <Container>
                    <TurnInfo
                        currentPlayer={currentPlayer}
                        deck={deck}
                        selectedCard={selectedCard}
                    />
                </Container>

                {/* fields */}
                <Container>
                    <Jumbotron>
                        {/* opponent player fields */}
                        <Row>
                            <Col>
                                <h6>Opponent Field</h6>
                                <Field
                                    // for display
                                    field={fields[playerIDOpponent]}
                                    jacks={jacks}
                                    // stages
                                    inChoosingScuttleStage={
                                        inChoosingScuttleStage
                                    }
                                    inChoosingEffectStage={
                                        inChoosingEffectStage
                                    }
                                    // functions
                                    selectedCard={selectedCard}
                                    chooseScuttleTarget={
                                        this.chooseScuttleTarget
                                    }
                                    chooseEffectTarget={this.chooseEffectTarget}
                                />
                            </Col>
                            <Col>
                                <h6>Opponent Special Field</h6>
                                <SpecialField
                                    // for display
                                    specialField={
                                        specialFields[playerIDOpponent]
                                    }
                                />
                            </Col>
                        </Row>

                        <hr></hr>

                        {/* current player fields */}
                        <Row>
                            <Col>
                                <h6>Your Field</h6>
                                <Field
                                    // for display
                                    field={fields[playerID]}
                                    jacks={jacks}
                                    // stages
                                    inChoosingScuttleStage={
                                        inChoosingScuttleStage
                                    }
                                    inChoosingEffectStage={
                                        inChoosingEffectStage
                                    }
                                    // functions
                                    selectedCard={selectedCard}
                                    // chooseScuttleTarget={this.chooseScuttleTarget} // no scuttling on your field
                                    chooseEffectTarget={this.chooseEffectTarget}
                                />
                            </Col>
                            <Col>
                                <h6>Your Special Field</h6>
                                <SpecialField
                                    // for display
                                    specialField={specialFields[playerID]}
                                />
                            </Col>
                        </Row>
                    </Jumbotron>
                </Container>
                {/* <p>Your Special Field</p> */}

                {/* hand */}
                <Container>
                    <Hand
                        playerID={playerID}
                        hand={hand}
                        // for targetable/onclick
                        inActionStage={inActionStage}
                        toggleSelectedCard={this.toggleSelectedCard}
                    />
                </Container>

                {/* turn stuff */}
                {/* playcard options */}
                {inActionStage && selectedCard !== -1 && (
                    <Container>
                        <PlayCardOptions
                            playCardValue={this.playCardValue}
                            playCardScuttle={this.playCardScuttle}
                            playCardEffect={this.playCardEffect}
                            // props for disabling buttons
                            playerID={playerID}
                            playerIDOpponent={playerIDOpponent}
                            fields={fields}
                            specialFields={specialFields}
                            selectedCard={selectedCard}
                            graveyard={graveyard}
                            deck={deck}
                            jacks={jacks}
                        />
                    </Container>
                )}

                {/* countering options */}
                {inCounteringStage && (
                    <Container>
                        <CounteringOptions
                            accept={this.props.moves.accept}
                            counter={this.props.moves.counter}
                            // for disabled
                            hand={hand}
                        />
                    </Container>
                )}

                {/* 7 effect */}
                {inChoosingEffectStage &&
                    this.props.G.counterChain[0].Value === "7" && (
                        <Container>
                            <ChoosingEffect7
                                deck={deck}
                                // function
                                chooseEffectTarget={this.chooseEffectTarget}
                            />
                        </Container>
                    )}

                {/* turn options */}
                {inActionStage && (
                    <Container>
                        <TurnOptions
                            // draw card
                            selectedCard={selectedCard}
                            drawCard={this.props.moves.drawCard}
                            deck={deck}
                            // concede
                            // TODO
                        />
                    </Container>
                )}

                {/* graveyard is always visible */}

                <Container>
                    <Graveyard
                        playerID={playerID}
                        graveyard={graveyard}
                        showGraveyard={this.state.showGraveyard}
                        toggleGraveyard={this.toggleGraveyard}
                        // effects
                        inChoosingEffectStage={inChoosingEffectStage}
                        chooseEffectTarget={this.chooseEffectTarget}
                    />
                </Container>

                <hr></hr>
                <hr></hr>
            </div>
        );
    }
}
