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
            selected_card_id: undefined,
            showGraveyard: false,
            choosingScuttle: false,
        };
    }

    togglePlayCardOptions = (card_id) => {
        this.setState(
            {
                choosingPlayCardOption: !this.state.choosingPlayCardOption,
                selected_card_id: card_id,
            },
            () => {
                console.log(
                    "selected_card_id is ",
                    this.state.selected_card_id
                );
            }
        );
    };

    playCardValue = () => {
        console.log("playCardValue: ", this.state.selected_card_id);
        this.setState({ choosingPlayCardOption: false });
        this.props.moves.playCardValue(this.state.selected_card_id);
    };

    toggleChoosingScuttle = () => {
        this.setState({
            choosingPlayCardOption: false,
            choosingScuttle: true,
        });
    };

    playCardScuttle = (target_card_id) => {
        this.setState({ choosingScuttle: false });

        console.log(
            "playCardScuttle: ",
            this.state.selected_card_id,
            "target: ",
            target_card_id
        );

        this.props.moves.playCardScuttle(
            this.state.selected_card_id,
            target_card_id
        );
    };

    playCardEffect = () => {
        this.setState({
            choosingPlayCardOption: false,
        });

        console.log("playCardEffect: ", this.state.selected_card_id);

        // kicks off the playcardeffect code, which can branch into target
        this.props.moves.playCardEffect(
            parseInt(this.props.ctx.currentPlayer),
            this.state.selected_card_id
        );
    };

    playCardEffectWithTarget = (target_card_id) => {
        console.log(
            "playCardEffectWithTarget: ",
            this.state.selected_card_id,
            "target: ",
            target_card_id
        );

        this.props.moves.playCardEffectWithTarget(
            parseInt(this.props.ctx.currentPlayer),
            target_card_id
        );
    };

    toggleGraveyard = () => {
        this.setState({ showGraveyard: !this.state.showGraveyard });
    };

    cancelChoosing = () => {
        // toggleplaycardoptions is already false
        this.setState({
            choosingScuttle: false,
        });
    };

    render() {
        // important props to be passed
        let playerID = this.props.playerID;
        let playerID_opponent = String(1 - parseInt(this.props.playerID));
        let hand = this.props.G.hands[playerID];
        let graveyard = this.props.G.graveyard;

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
                <p>Deck Count: {this.props.G.deck.length}</p>
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
                            this.state.selected_card_id.includes("3")
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
                            this.state.selected_card_id.includes("9")) ||
                        (in_choosing &&
                            this.state.selected_card_id.includes("Jack"))
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
                        in_choosing && this.state.selected_card_id.includes("9")
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
                        selected_card_id={this.state.selected_card_id}
                        deck={this.props.G.deck}
                        playCardValue={this.playCardValue}
                        toggleChoosingScuttle={this.toggleChoosingScuttle}
                        playCardEffect={this.playCardEffect}
                    />
                )}

                {in_choosing && this.state.selected_card_id.includes("7") && (
                    <ChoosingEffect7
                        playerID={playerID}
                        deck={this.props.G.deck}
                        targetable={in_choosing}
                        playCardEffectWithTarget={this.playCardEffectWithTarget}
                    />
                )}

                {/* cancel button */}
                {/* cannot cancel while in  */}
                {in_action && this.state.choosingScuttle && (
                    <button onClick={() => this.cancelChoosing()}>
                        Cancel
                    </button>
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
