import React from "react";
import "../style/board.css";

// components
import { Hand } from "./Hand";
import { PlayCardOptions } from "./PlayCardOptions";
import { CounteringOptions } from "./CounteringOptions";
import { Field } from "./Field";
import { SpecialField } from "./SpecialField";
import { Graveyard } from "./Graveyard";
import { TurnOptions } from "./TurnOptions";
import { TurnInfo } from "./TurnInfo";
import { ChoosingPopup } from "./ChoosingPopup";

// bootstrap
import { Container, Button, Jumbotron, Row, Col } from "react-bootstrap";

export class ScuttleBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCard: -1,
            showGraveyard: false,
        };
    }

    // togglers
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
    toggleGraveyard = () => {
        this.setState({ showGraveyard: !this.state.showGraveyard });
    };

    // action moves
    drawCard = () => {
        this.props.moves.drawCard();
    };
    endTurn = () => {
        this.props.moves.endTurn();
    };
    playCardValue = () => {
        console.log("playCardValue: ", this.state.selectedCard.id);
        this.props.moves.playCardValue(this.state.selectedCard);
        this.setState({ selectedCard: -1 });
    };
    playCardScuttle = () => {
        this.props.moves.playCardScuttle();
    };
    playCardEffect = () => {
        // kicks off the playcardeffect code, which can branch into target
        this.props.moves.playCardEffect(
            this.props.playerID,
            this.state.selectedCard
        );
        // at this point, selectedCard is at counter_chain[0], so we can reset it
        this.setState({ selectedCard: -1 });
    };

    // countering moves
    accept = () => {
        this.props.moves.accept();
    };
    counter = () => {
        this.props.moves.counter(this.props.playerID);
    };

    // choosing moves
    chooseScuttleTarget = (targetCard) => {
        console.log(
            "scuttleCard:",
            this.state.selectedCard.id,
            "target:",
            targetCard.id
        );

        this.props.moves.chooseScuttleTarget(
            this.state.selectedCard,
            targetCard
        );
        this.setState({ selectedCard: -1 });
    };
    chooseEffectTarget = (targetCard, targetField) => {
        console.log(
            // "chooseEffectTarget:",
            // this.state.selectedCard.id,
            "target:",
            targetCard.id,
            "targetField",
            targetField
        );
        this.props.moves.chooseEffectTarget(targetCard, targetField);
    };

    render() {
        // props
        let playerID = this.props.playerID;
        let playerIDOpponent = this.props.playerIDOpponent;
        let hands = this.props.G.hands;
        let currentPlayer = this.props.ctx.currentPlayer;
        let graveyard = this.props.G.graveyard;
        let deck = this.props.G.deck;
        let fields = this.props.G.fields;
        let specialFields = this.props.G.specialFields;
        let selectedCard = this.state.selectedCard;
        let jacks = this.props.G.jacks;

        // stages
        let activePlayers = this.props.ctx.activePlayers;
        let inActionStage = activePlayers[playerID] === "action";
        let inCounteringStage = activePlayers[playerID] === "countering";
        let inChoosingEffectStage =
            activePlayers[playerID] === "choosingEffect";
        let inChoosingScuttleStage =
            activePlayers[playerID] === "choosingScuttle";

        return (
            <div>
                {/* turn information */}
                <Container>
                    {this.props.ctx.gameover && this.props.ctx.gameover.winner && (
                        <h1>
                            WINNER: {/* {this.props.ctx.gameover.winner} */}
                            {this.props.playerName}
                            {/* playerName is tied to playerID which is tied to winner */}
                        </h1>
                    )}
                    {this.props.ctx.gameover &&
                        !this.props.ctx.gameover.winner && <h1>DRAW!</h1>}
                    <TurnInfo currentPlayer={currentPlayer} />
                </Container>

                {/* 8 effect */}
                <Container>
                    <h6>Opponent Hand ({hands[playerIDOpponent].length})</h6>
                    {specialFields[playerID].some((x) => x.Value === "8") && (
                        <Hand
                            playerID={playerIDOpponent}
                            hand={hands[playerIDOpponent]}
                        />
                    )}
                </Container>

                {/* fields */}
                <Container className="container-field">
                    <Jumbotron>
                        {/* opponent player fields */}
                        <Row>
                            <Col>
                                <h6>Opponent Field</h6>
                                <Row md={3}>
                                    <Field
                                        field={fields[playerIDOpponent]}
                                        jacks={jacks}
                                    />
                                </Row>
                            </Col>
                            <Col>
                                <h6>Opponent Special Field</h6>
                                <Row md={3}>
                                    <SpecialField
                                        specialField={
                                            specialFields[playerIDOpponent]
                                        }
                                    />
                                </Row>
                            </Col>
                        </Row>

                        <hr></hr>

                        {/* current player fields */}
                        <Row>
                            <Col>
                                <h6>Your Field</h6>
                                <Row md={3}>
                                    <Field
                                        field={fields[playerID]}
                                        jacks={jacks}
                                    />
                                </Row>
                            </Col>
                            <Col>
                                <h6>Your Special Field</h6>
                                <Row md={3}>
                                    <SpecialField
                                        specialField={specialFields[playerID]}
                                    />
                                </Row>
                            </Col>
                        </Row>
                    </Jumbotron>
                </Container>

                {/* choosing popup */}
                {(inChoosingScuttleStage || inChoosingEffectStage) && (
                    <Container className="border popup">
                        <h6>
                            <u>Choose Target</u>
                        </h6>
                        <ChoosingPopup
                            // props
                            selectedCard={
                                inChoosingScuttleStage
                                    ? selectedCard
                                    : this.props.G.counterChain[0]
                            }
                            deck={deck}
                            jacks={jacks}
                            graveyard={graveyard}
                            playerField={fields[playerID]}
                            opponentField={fields[playerIDOpponent]}
                            playerSpecialField={specialFields[playerID]}
                            opponentSpecialField={
                                specialFields[playerIDOpponent]
                            }
                            // stages
                            inChoosingScuttleStage={inChoosingScuttleStage}
                            inChoosingEffectStage={inChoosingEffectStage}
                            // moves
                            chooseScuttleTarget={this.chooseScuttleTarget}
                            chooseEffectTarget={this.chooseEffectTarget}
                        />
                    </Container>
                )}

                {/* hand */}
                <Container>
                    <h6>
                        Your Hand ({hands[playerID].length}){" "}
                        {selectedCard !== -1 && (
                            <span>(selected: {selectedCard.id})</span>
                        )}
                    </h6>
                    <Hand
                        hand={hands[playerID]}
                        // for onclick
                        inActionStage={inActionStage}
                        toggleSelectedCard={this.toggleSelectedCard}
                    />
                </Container>

                {/* turn stuff */}
                {/* playcard options */}
                {inActionStage && selectedCard !== -1 && (
                    <Container>
                        <PlayCardOptions
                            // moves
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
                            playerID={playerID}
                            accept={this.accept}
                            counter={this.counter}
                            has2={hands[playerID].some((x) => x.Value === "2")}
                        />
                    </Container>
                )}

                {/* turn options */}
                {inActionStage && (
                    <Container>
                        <TurnOptions
                            // draw card
                            selectedCard={selectedCard}
                            drawCard={this.drawCard}
                            deck={deck}
                            // end turn
                            endTurn={this.endTurn}
                        />
                    </Container>
                )}

                {/* graveyard button is always visible */}
                <Container>
                    <Button
                        size="sm"
                        variant="outline-secondary"
                        disabled={graveyard.length === 0}
                        onClick={this.toggleGraveyard}
                    >
                        View Graveyard ({graveyard.length})
                    </Button>
                    {this.state.showGraveyard && (
                        <React.Fragment>
                            <h6>Graveyard</h6>
                            <Graveyard graveyard={graveyard} />
                        </React.Fragment>
                    )}
                </Container>

                <hr></hr>
                <hr></hr>
            </div>
        );
    }
}
