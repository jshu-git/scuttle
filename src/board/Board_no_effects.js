import React from "react";
import "../style/board.css";
import { Hand } from "./Hand";
import { PlayCardOptions } from "./PlayCardOptions";
import { PlayCardEffectOptions } from "./PlayCardEffectOptions";
import { Field } from "./Field";
import { Graveyard } from "./Graveyard";
import { ChoosingEffect7Table } from "./ChoosingEffect7Table";

export class TicTacToeBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            choosingPlayCardOption: false,
            selected_card_id: undefined,
            showGraveyard: false,

            // playCard stuff
            choosingScuttle: false,
            choosingEffect: false,
            choosingEffect7: false,
        };
    }

    /*
        this function is called when a card is clicked
        it toggles the card options
    */
    togglePlayCardOptions = (card_id) => {
        this.setState({
            choosingPlayCardOption: !this.state.choosingPlayCardOption,
            selected_card_id: card_id,
        });
    };

    playCardValue = () => {
        console.log("playCardValue: ", this.state.selected_card_id);
        // toggle off the cardOptions
        this.setState({ choosingPlayCardOption: false });
        // make the move
        this.props.moves.playCardValue(this.state.selected_card_id);
    };

    /*
        called when playCardScuttle
        choosingScuttle means the player is in the process of choosing a card to scuttle
    */
    toggleChoosingScuttle = () => {
        this.setState({
            choosingPlayCardOption: false,
            choosingScuttle: true,
        });
    };

    playCardScuttle = (target_card_id) => {
        // toggle off scuttling phase
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

    /*
        first, this checks if the card has an effect that requires no target
        if so, then do the move. else, enter choosingEffect phase
    */
    toggleChoosingEffect = () => {
        this.setState({
            choosingPlayCardOption: false,
        });

        let check_card = this.state.selected_card_id;
        // these DON'T require target
        let no_target = ["Ace", "4", "5", "6", "8", "Queen", "King"].some((x) =>
            check_card.includes(x)
        );
        // console.log(no_target);

        if (no_target) {
            this.playCardEffect();
        } else {
            this.setState({
                choosingEffect: true,
            });
        }

        if (check_card.includes("7")) {
            this.setState({
                choosingEffect7: true,
            });
        }
    };

    playCardEffect = (target_card_id) => {
        // showPlayCardOptions is already set to false, from toggler
        this.setState({ choosingEffect: false, choosingEffect7: false });

        console.log(
            "playCardEffect ",
            this.state.selected_card_id,
            "target: ",
            this.target_card_id
        );

        // make move
        this.props.moves.playCardEffect(
            parseInt(this.props.ctx.currentPlayer),
            this.state.selected_card_id,
            target_card_id
        );
    };

    toggleGraveyard = () => {
        this.setState({ showGraveyard: !this.state.showGraveyard });
    };

    // will depend on choosingEffect or choosingScuttle
    targetableOpponentField = () => {
        if (this.state.choosingScuttle) {
            return this.state.choosingScuttle;
        }
        if (this.state.choosingEffect) {
            // 9 can target opponent field
            var check = this.state.selected_card_id;
            if (check.includes("9")) {
                return true;
            }
        }
        return false;
    };

    cancelChoosing = () => {
        // toggleplaycardoptions is already false when these were chosen
        this.setState({
            choosingScuttle: false,
            choosingEffect: false,
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

        let isChoosing =
            this.state.choosingScuttle || this.state.choosingEffect;

        return (
            <div>
                {/* turn info */}
                <p>
                    choosingPlayCardOption:{" "}
                    {String(this.state.choosingPlayCardOption)}
                </p>
                <p>selected_card_id: {String(this.state.selected_card_id)}</p>
                <p>choosingScuttle: {String(this.state.choosingScuttle)}</p>
                {/* <p>canDrawCard: {String(this.state.canDrawCard)}</p> */}
                <p>in_action: {String(in_action)}</p>
                <p>in_effect: {String(in_effect)}</p>
                <p>choosingEffect: {String(this.state.choosingEffect)}</p>
                <p>choosingEffect7: {String(this.state.choosingEffect7)}</p>
                <hr></hr>
                <p>Current Turn: Player {this.props.ctx.currentPlayer}</p>
                {/* deck info */}
                <p>Deck Count: {this.props.G.deck.length}</p>

                {/* graveyard */}
                <button onClick={() => this.toggleGraveyard()}>
                    View Graveyard
                </button>
                <p>Graveyard Count: {this.props.G.graveyard.length}</p>
                {this.state.showGraveyard && (
                    <Graveyard
                        playerID={playerID}
                        graveyard={graveyard}
                        // targetable={in_action && this.targetableGraveyard()}
                        // targetable={
                        //     in_action &&
                        //     this.state.choosingEffect &&
                        //     this.state.selected_card_id.includes("3")
                        // }
                        playCardEffect={this.playCardEffect}
                    />
                )}

                {/* fields */}
                <p>Opponent Field</p>
                <Field
                    playerID={playerID_opponent}
                    field={this.props.G.fields[playerID_opponent]}
                    // all of these are necessary to determine which playCard happens at runtime
                    // targetable={in_action && this.targetableOpponentField()}
                    playCardScuttle={this.playCardScuttle}
                    playCardEffect={this.playCardEffect}
                    choosingScuttle={this.state.choosingScuttle}
                    choosingEffect={this.state.choosingEffect}
                />
                <p>Your Field</p>
                <Field
                    playerID={playerID}
                    field={this.props.G.fields[playerID]}
                    // targetable={in_action && this.targetableYourField()}
                    // targetable={
                    //     in_action &&
                    //     this.state.choosingEffect &&
                    //     this.state.selected_card_id.includes("9")
                    // }
                    playCardEffect={this.playCardEffect}
                    choosingScuttle={this.state.choosingScuttle}
                    choosingEffect={this.state.choosingEffect}
                />

                {/* hand */}
                <Hand
                    playerID={playerID}
                    hand={hand}
                    active={in_action && !isChoosing}
                    togglePlayCardOptions={this.togglePlayCardOptions}
                />

                {/* draw card */}
                {in_action &&
                    !this.state.choosingPlayCardOption &&
                    !isChoosing && (
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
                        toggleChoosingEffect={this.toggleChoosingEffect}
                    />
                )}

                {in_action && this.state.choosingEffect7 && (
                    <ChoosingEffect7Table
                        playerID={playerID}
                        deck={this.props.G.deck}
                        targetable={in_action && this.state.choosingEffect7}
                        playCardEffect={this.playCardEffect}
                    />
                )}

                {/* cancel button */}
                {/* cannot cancel 7 effect */}
                {in_action && isChoosing && !this.state.choosingEffect7 && (
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
                    />
                )}
            </div>
        );
    }
}
