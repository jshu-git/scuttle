import React from "react";
import "../style/board.css";
import { Hand } from "./Hand";
import { PlayCardOptions } from "./PlayCardOptions";
import { PlayCardEffectOptions } from "./PlayCardEffectOptions";
import { Fields } from "./Fields";
import { Graveyard } from "./Graveyard";

export class TicTacToeBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            choosingPlayCardOption: false,
            selected_card_id: null,
            choosingScuttle: false,
            showGraveyard: false,

            // effect stuff
            // selected card during an effect (if any)
            isChoosingEffect: false,

            canDrawCard: true,
        };
    }

    /*
        this function is called when a card is clicked
        it toggles the card options
        
        ...it also resets...
    */
    togglePlayCardOptions = (card_id) => {
        this.setState(
            {
                choosingPlayCardOption: !this.state.choosingPlayCardOption,
                selected_card_id: card_id,
                canDrawCard: !this.state.canDrawCard,

                // reset these, in case player changed their mind
                // choosingScuttle: false,
                // isChoosingEffect: false,
            },
            () => {
                console.log(
                    "choosingPlayCardOption is now: ",
                    this.state.choosingPlayCardOption,
                    "selected_card_id is: ",
                    this.state.selected_card_id,
                    "choosingScuttle is now: ",
                    this.state.choosingScuttle,
                    "isChoosingEffect is now: ",
                    this.state.isChoosingEffect
                );
            }
        );
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
        this.setState(
            {
                choosingPlayCardOption: false,
                choosingScuttle: true,
            },
            () => {
                console.log(
                    "choosingPlayCardOption is now: ",
                    this.state.choosingPlayCardOption,
                    "choosingScuttle is now: ",
                    this.state.choosingScuttle
                );
            }
        );
    };

    playCardScuttle = (target_id) => {
        // turn off scuttling phase
        this.setState({ isScuttling: false });
        // make move
        this.props.moves.playCardScuttle(
            this.state.selected_card_id,
            target_id
        );
    };

    render() {
        // important props to be passed
        let playerID = this.props.playerID;
        let hand = this.props.G.hands[playerID];
        let fields = this.props.G.fields;
        let graveyard = this.props.G.graveyard;

        // stages
        let in_action =
            this.props.ctx.activePlayers[this.props.playerID] === "action";
        let in_effect =
            this.props.ctx.activePlayers[this.props.playerID] === "effect";

        return (
            <div>
                {/* turn info */}
                <p>
                    choosingPlayCardOption:{" "}
                    {String(this.state.choosingPlayCardOption)}
                </p>
                <p>selected_card_id: {String(this.state.selected_card_id)}</p>
                <p>choosingScuttle: {String(this.state.choosingScuttle)}</p>
                <p>canDrawCard: {String(this.state.canDrawCard)}</p>
                <p>in_action: {String(in_action)}</p>
                <p>in_effect: {String(in_effect)}</p>
                {/* <p>isChoosingEffect: {this.state.this.state.isChoosingEffect}</p> */}

                <hr></hr>
                <p>Current Turn: Player {this.props.ctx.currentPlayer}</p>

                {/* deck info */}
                <p>Deck Count: {this.props.G.deck.length}</p>

                {/* graveyard */}
                <Graveyard playerID={playerID} graveyard={graveyard} />

                {/* BOTH fields */}
                <Fields playerID={playerID} fields={fields} />

                {/* hand */}
                <Hand
                    playerID={playerID}
                    hand={hand}
                    active={in_action && !this.state.choosingScuttle}
                    togglePlayCardOptions={this.togglePlayCardOptions}
                />

                {/* draw card */}
                {this.state.canDrawCard && (
                    <button onClick={() => this.props.moves.drawCard()}>
                        Draw Card
                    </button>
                )}

                {/* playerCard options */}
                {this.state.choosingPlayCardOption && (
                    <PlayCardOptions
                        playCardValue={this.playCardValue}
                        toggleChoosingScuttle={this.toggleChoosingScuttle}
                    />
                )}

                {/* effectCard options */}
                {in_effect && <PlayCardEffectOptions />}
            </div>
        );
    }
}
