import React from "react";
import "../style/board.css";
// components
import { Hand } from "./Hand";
import { PlayCardOptions } from "./PlayCardOptions";
import { CounteringOptions } from "./CounteringOptions";
import { Field } from "./Field";
import { Graveyard } from "./Graveyard";
import { ChoosingEffect7 } from "./ChoosingEffect7";

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
        // at this point, selectedCard is already in counter_chain, so we can reset it
        this.setState({ selectedCard: -1 });
    };

    chooseEffectTarget = (targetCard) => {
        console.log(
            "chooseTarget: ",
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
        let hand = this.props.G.hands[playerID];
        let graveyard = this.props.G.graveyard;
        let deck = this.props.G.deck;
        let fields = this.props.G.fields;
        let specialFields = this.props.G.specialFields;
        let selectedCard = this.state.selectedCard;
        let jacks = this.props.G.jacks;

        // stages
        let in_action =
            this.props.ctx.activePlayers[this.props.playerID] === "action";
        let in_countering =
            this.props.ctx.activePlayers[this.props.playerID] === "countering";
        let choosingEffect =
            this.props.ctx.activePlayers[this.props.playerID] ===
            "choosingEffect";
        let choosingScuttle =
            this.props.ctx.activePlayers[this.props.playerID] ===
            "choosingScuttle";

        // let targeting_disabled =
        //     graveyard.length === 0 &&
        //     fields[playerID].length === 0 &&
        //     fields[playerIDOpponent].length === 0 &&
        //     specialFields[playerID].length === 0 &&
        //     specialFields[playerIDOpponent].length === 0;

        return (
            <div>
                <p>Current Turn: Player {this.props.ctx.currentPlayer}</p>
                {/* deck info */}
                <p>Deck Count: {deck.length}</p>
                <hr></hr>
                <p>
                    {this.state.selectedCard === -1
                        ? "undefed"
                        : this.state.selectedCard.id}
                </p>

                {/* graveyard */}
                <button onClick={() => this.toggleGraveyard()}>
                    View Graveyard
                </button>
                <p>Graveyard Count: {graveyard.length}</p>
                {this.state.showGraveyard && (
                    <Graveyard
                        playerID={playerID}
                        graveyard={graveyard}
                        choosingEffect={choosingEffect}
                        chooseEffectTarget={this.chooseEffectTarget}
                    />
                )}

                {/* fields */}
                <p>Opponent Field</p>
                <Field
                    // for display
                    playerID={playerIDOpponent}
                    field={fields[playerIDOpponent]}
                    jacks={jacks}
                    // stages
                    choosingScuttle={choosingScuttle}
                    choosingEffect={choosingEffect}
                    // for functions
                    selectedCard={selectedCard}
                    chooseScuttleTarget={this.chooseScuttleTarget}
                    chooseEffectTarget={this.chooseEffectTarget}
                />
                <p>Your Field</p>
                <Field
                    // for display
                    playerID={playerID}
                    field={fields[playerID]}
                    jacks={jacks}
                    // stages
                    choosingScuttle={choosingScuttle}
                    choosingEffect={choosingEffect}
                    // for functions
                    selectedCard={selectedCard}
                    chooseScuttleTarget={this.chooseScuttleTarget}
                    chooseEffectTarget={this.chooseEffectTarget}
                />

                {/* hand */}
                <Hand
                    playerID={playerID}
                    hand={hand}
                    in_action={in_action}
                    toggleSelectedCard={this.toggleSelectedCard}
                />

                {/* draw card */}
                {in_action && selectedCard === -1 && (
                    <button onClick={() => this.props.moves.drawCard()}>
                        Draw Card
                    </button>
                )}

                {/* playerCard options */}
                {in_action && selectedCard !== -1 && (
                    <PlayCardOptions
                        playCardValue={this.playCardValue}
                        playCardScuttle={this.playCardScuttle}
                        playCardEffect={this.playCardEffect}
                    />
                )}

                {choosingEffect && selectedCard.Value === "7" && (
                    <ChoosingEffect7
                        playerID={playerID}
                        deck={deck}
                        // targetable={in_choosing}
                        chooseEffectTarget={this.chooseEffectTarget}
                    />
                )}

                {/* effectCard options */}
                {in_countering && (
                    <CounteringOptions
                        // no passing ()
                        accept={this.props.moves.accept}
                        counter={this.props.moves.counter}
                        hand={hand}
                    />
                )}
            </div>
        );
    }
}
