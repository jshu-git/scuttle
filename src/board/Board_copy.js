import React from "react";
import "../style/board.css";
import { Hand } from "./Hand";
import { PlayCardOptions } from "./PlayCardOptions";
import { PlayCardEffectOptions } from "./PlayCardEffectOptions";
import { Field } from "./Field";
import { Graveyard } from "./Graveyard";
import { ChoosingEffect7 } from "./ChoosingEffect7";

export class TicTacToeBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            choosingPlayCardOption: false,
            selected_card: undefined,
            showGraveyard: false,
            choosingScuttle: false,
        };
    }

    togglePlayCardOptions = (card) => {
        this.setState(
            {
                choosingPlayCardOption: !this.state.choosingPlayCardOption,
                selected_card: card,
            },
            () => {
                console.log(
                    "selected_card id is ",
                    this.state.selected_card.id
                );
            }
        );
    };

    playCardValue = () => {
        console.log("playCardValue: ", this.state.selected_card.id);
        this.setState({ choosingPlayCardOption: false });
        this.props.moves.playCardValue(this.state.selected_card.id);
    };

    toggleChoosingScuttle = () => {
        this.setState({
            choosingPlayCardOption: false,
            choosingScuttle: true,
        });
    };

    playCardScuttle = (target_card) => {
        this.setState({ choosingScuttle: false });

        console.log(
            "playCardScuttle: ",
            this.state.selected_card.id,
            "target: ",
            target_card.id
        );

        this.props.moves.playCardScuttle(this.state.selected_card, target_card);
    };

    playCardEffect = () => {
        this.setState({
            choosingPlayCardOption: false,
        });

        console.log("playCardEffect: ", this.state.selected_card.id);

        // kicks off the playcardeffect code, which can branch into target
        this.props.moves.playCardEffect(
            parseInt(this.props.ctx.currentPlayer),
            this.state.selected_card
        );
    };

    playCardEffectWithTarget = (target_card) => {
        console.log(
            "playCardEffectWithTarget: ",
            this.state.selected_card.id,
            "target: ",
            target_card.id
        );

        this.props.moves.playCardEffectWithTarget(
            parseInt(this.props.ctx.currentPlayer),
            target_card
        );
    };

    toggleGraveyard = () => {
        this.setState({ showGraveyard: !this.state.showGraveyard });
    };

    render() {
        // important props to be passed
        let playerID = this.props.playerID;
        let playerID_opponent = String(1 - parseInt(this.props.playerID));
        let hand = this.props.G.hands[playerID];
        let graveyard = this.props.G.graveyard;
        let deck = this.props.G.deck;
        let fields = this.props.G.fields;

        // stages
        let in_action =
            this.props.ctx.activePlayers[this.props.playerID] === "action";
        let in_effect =
            this.props.ctx.activePlayers[this.props.playerID] === "effect";
        let in_choosing =
            this.props.ctx.activePlayers[this.props.playerID] === "choosing";

        return (
            <div>
                <p>Current Turn: Player {this.props.ctx.currentPlayer}</p>
                {/* deck info */}
                <p>Deck Count: {deck.length}</p>
                <hr></hr>

                {/* graveyard */}
                <button onClick={() => this.toggleGraveyard()}>
                    View Graveyard
                </button>
                <p>Graveyard Count: {this.props.G.graveyard.length}</p>
                {this.state.showGraveyard && (
                    <Graveyard
                        playerID={playerID}
                        graveyard={graveyard}
                        targetable={
                            in_choosing &&
                            this.state.selected_card.Value === "3"
                        }
                        playCardEffectWithTarget={this.playCardEffectWithTarget}
                    />
                )}

                {/* fields */}
                <p>Opponent Field</p>
                <Field
                    playerID={playerID_opponent}
                    field={this.props.G.fields[playerID_opponent]}
                    targetable={
                        // scuttling
                        (in_action && this.state.choosingScuttle) ||
                        // using effect
                        (in_choosing &&
                            this.state.selected_card.Value === "9") ||
                        (in_choosing &&
                            this.state.selected_card.Value === "Jack")
                    }
                    playCardScuttle={this.playCardScuttle}
                    playCardEffectWithTarget={this.playCardEffectWithTarget}
                    choosingScuttle={this.state.choosingScuttle}
                    in_choosing={in_choosing}
                />
                <p>Your Field</p>
                <Field
                    playerID={playerID}
                    field={this.props.G.fields[playerID]}
                    targetable={
                        in_choosing && this.state.selected_card.Value === "9"
                    }
                    playCardEffectWithTarget={this.playCardEffectWithTarget}
                    choosingScuttle={this.state.choosingScuttle}
                    in_choosing={in_choosing}
                />

                {/* hand */}
                <Hand
                    playerID={playerID}
                    hand={hand}
                    active={in_action && !this.state.choosingScuttle}
                    togglePlayCardOptions={this.togglePlayCardOptions}
                />

                {/* draw card */}
                {in_action &&
                    !this.state.choosingPlayCardOption &&
                    !this.state.choosingScuttle && (
                        <button onClick={() => this.props.moves.drawCard()}>
                            Draw Card
                        </button>
                    )}

                {/* playerCard options */}
                {in_action && this.state.choosingPlayCardOption && (
                    <PlayCardOptions
                        playCardValue={this.playCardValue}
                        toggleChoosingScuttle={this.toggleChoosingScuttle}
                        playCardEffect={this.playCardEffect}
                        // used for parameter checks
                        selected_card={this.state.selected_card}
                        deck={deck}
                        graveyard={graveyard}
                        field={fields[playerID]}
                        opponent_field={fields[playerID_opponent]}
                    />
                )}

                {in_choosing && this.state.selected_card.Value === "7" && (
                    <ChoosingEffect7
                        playerID={playerID}
                        deck={deck}
                        targetable={in_choosing}
                        playCardEffectWithTarget={this.playCardEffectWithTarget}
                    />
                )}

                {/* effectCard options */}
                {in_effect && (
                    <PlayCardEffectOptions
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
