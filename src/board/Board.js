import React from "react";
import "./style/board.css";

export class TicTacToeBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showPlayCardOptions: false,
            selected_card_id: null,
            isScuttling: false,
            showGraveyard: false,

            // effect stuff
            // selected card during an effect (if any)
            isChoosingEffect: false,
        };
        // don't think we need this https://stackoverflow.com/questions/42556083/what-does-bindthis-in-constructor-do-in-reactjs
        // this.togglePlayCardOptions = this.togglePlayCardOptions.bind(this);
    }

    /*
        this function is called when a card is clicked
        it toggles the card options
        it sets state.index to the index of the clicked card to keep track of it for when an option is executed
    */
    togglePlayCardOptions = (card_id) => {
        this.setState(
            {
                showPlayCardOptions: !this.state.showPlayCardOptions,
                selected_card_id: card_id,
                isScuttling: false,
                isChoosingEffect: false,
            },
            () => {
                console.log(
                    "selected_card_id is ",
                    this.state.selected_card_id
                );
            }
        );
    };

    /*
        this function is called when a card is playCardScuttle
        it toggles off the card options
        isScuttling means the player is in the process of choosing a card to scuttle
    */
    toggleChoosingScuttle = () => {
        this.setState(
            {
                showPlayCardOptions: false,
                isScuttling: true,
            },
            () => {
                console.log("isScuttling is ", this.state.isScuttling);
            }
        );
    };

    toggleChoosingEffect = () => {
        this.setState(
            {
                showPlayCardOptions: false,
                isChoosingEffect: true,
            },
            () => {
                console.log(
                    "isChoosingEffect is ",
                    this.state.isChoosingEffect
                );
            }
        );
    };

    checkEffectRequiresTarget = () => {
        console.log("isChoosingEffect is ", this.state.isChoosingEffect);
        var check = this.state.selected_card_id;
        if (
            check.indexOf("Ace") !== -1 ||
            check.indexOf("4") !== -1 ||
            check.indexOf("5") !== -1 ||
            check.indexOf("6") !== -1 ||
            check.indexOf("7") !== -1 ||
            check.indexOf("8") !== -1 ||
            check.indexOf("9") !== -1 ||
            check.indexOf("King") !== -1
        ) {
            return false;
        }
        return true;
    };

    toggleGraveyard = () => {
        this.setState({ showGraveyard: !this.state.showGraveyard });
    };

    playCardValue = () => {
        // toggle off the card options
        console.log("playCardValue: ", this.state.selected_card_id);
        this.setState({ showPlayCardOptions: false });
        this.props.moves.playCardValue(this.state.selected_card_id);
    };

    // may need to add check for if opponent field is nonempty
    playCardScuttle = (target_id) => {
        // toggle off scuttling phase
        this.setState({ isScuttling: false });

        this.props.moves.playCardScuttle(
            this.state.selected_card_id,
            target_id
        );
    };

    playCardEffect = (target_id) => {
        this.setState({ showPlayCardOptions: false, isChoosingEffect: false });

        // only the currentPlayer could have clicked on this
        this.props.moves.playCardEffect(
            parseInt(this.props.ctx.currentPlayer),
            this.state.selected_card_id,
            target_id
        );
    };

    accept = () => {
        this.props.moves.accept();
    };

    // card.id is the target
    fieldOnClick(k, target_card_id) {
        // can only scuttle opponent's field
        if (this.state.isScuttling && k !== this.props.playerID) {
            return () => this.playCardScuttle(target_card_id);
        }
        // can choose effect on either field
        else if (
            this.state.isChoosingEffect &&
            // 3 can't choose on field though
            this.state.selected_card_id.indexOf("3") === -1
        ) {
            return () => this.playCardEffect(target_card_id);
        }
        return () => void 0;
    }

    graveyardOnClick(target_card_id) {
        // only 3 can choose in graveyard
        if (
            this.state.isChoosingEffect &&
            this.state.selected_card_id.indexOf("3") !== -1
        ) {
            return () => this.playCardEffect(target_card_id);
        }
        return () => void 0;
    }

    render() {
        // a replacement for isActive since players are always in an active "state"
        let is_idle =
            this.props.ctx.activePlayers[this.props.playerID] === "idle";
        let is_action =
            this.props.ctx.activePlayers[this.props.playerID] === "action";
        let is_effect =
            this.props.ctx.activePlayers[this.props.playerID] === "effect";

        // field stuff
        let tbody_field_other = [];
        let tbody_field_you = [];
        let fields = this.props.G.fields;
        // key is player, value is the corresponding field
        for (let k in fields) {
            let cells_field = [];
            // f = field array
            let f = fields[k];

            for (let idx in f) {
                let card = f[idx];

                cells_field.push(
                    <td
                        key={card.id}
                        onClick={this.fieldOnClick(k, card.id)}
                        className={
                            (is_action &&
                                this.state.isScuttling &&
                                k !== this.props.playerID) ||
                            // 3 can't target field
                            (is_action &&
                                this.state.isChoosingEffect &&
                                this.state.selected_card_id.indexOf("3") === -1)
                                ? "canTarget"
                                : ""
                        }
                    >
                        {card.Value} of {card.Suit}
                    </td>
                );
            }

            // add cells to the correct field (your field always on bottom)
            if (k === this.props.playerID) {
                tbody_field_you.push(<tr key={k}>{cells_field}</tr>);
            } else {
                tbody_field_other.push(<tr key={k}>{cells_field}</tr>);
            }

            // the field_key always corresponds to the hand_key, not causing any problems for now
            // console.log("tbody_field key " + this.props.playerID);
        }

        // hand stuff
        // hand is a table that is 1 row long
        let tbody_hand = [];
        let cells_hand = [];
        // ***important*** playerID matches with G.hands
        // console.log("hello playerid " + this.props.playerID);
        let hand = this.props.G.hands[this.props.playerID];
        for (let i = 0; i < hand.length; i++) {
            let card = hand[i];
            cells_hand.push(
                <td
                    key={card.id}
                    className={is_action ? "active" : ""}
                    onClick={
                        is_action
                            ? () => this.togglePlayCardOptions(card.id)
                            : () => void 0
                    }
                >
                    {card.Value} of {card.Suit}
                </td>
            );
        }
        // the key here is tied to playerID
        // console.log("tbody_hand key " + this.props.playerID);
        tbody_hand.push(<tr key={this.props.playerID}>{cells_hand}</tr>);

        // winner stuff
        let winner = null;
        if (this.props.ctx.gameover) {
            // winner =
            //     this.props.ctx.gameover.winner !== undefined ? (
            //         <div id="winner">
            //             Winner: {this.props.ctx.gameover.winner}
            //         </div>
            //     ) : (
            //         <div id="winner">Draw!</div>
            //     );
        }

        // graveyard stuff
        // graveyard is a BIG table that is 1 row long
        let tbody_graveyard = [];
        let cells_graveyard = [];
        let graveyard = this.props.G.graveyard;
        for (let i = 0; i < graveyard.length; i++) {
            let card = graveyard[i];
            cells_graveyard.push(
                <td
                    key={card.id}
                    onClick={this.graveyardOnClick(card.id)}
                    className={this.state.isChoosingEffect ? "canTarget" : ""}
                >
                    {card.Value} of {card.Suit}
                </td>
            );
        }
        tbody_graveyard.push(
            // not sure if the key matters here
            <tr key={this.props.playerID}>{cells_graveyard}</tr>
        );

        return (
            <div>
                <p>Current Turn: Player {this.props.ctx.currentPlayer}</p>
                <p>Deck Count: {this.props.G.deck.length}</p>

                <p>Graveyard Count: {this.props.G.graveyard.length}</p>
                {/* graveyard toggle */}
                <button onClick={() => this.toggleGraveyard()}>
                    View Graveyard
                </button>
                {this.state.showGraveyard && (
                    <table>
                        <tbody>{tbody_graveyard}</tbody>
                    </table>
                )}

                <hr></hr>
                <p>Opponent Field</p>
                <table id="field">
                    <tbody>{tbody_field_other}</tbody>
                </table>
                <p>Your Field</p>
                <table id="field">
                    <tbody>{tbody_field_you}</tbody>
                </table>

                {/* <p>Your Special Field</p>
                <table id="field" style={{ float: "right" }}>
                    <tbody>
                        <tr>
                            <td>henlo</td>
                        </tr>
                    </tbody>
                </table> */}

                <table id="hand">
                    <thead>
                        <tr>
                            <th colSpan={hand.length}>Your Hand</th>
                        </tr>
                    </thead>
                    <tbody>{tbody_hand}</tbody>
                </table>

                {/* draw card button */}
                {is_action &&
                    !this.state.showPlayCardOptions &&
                    !this.state.isScuttling &&
                    !this.state.isChoosingEffect &&
                    // no draw during an effect
                    this.props.ctx.activePlayers[this.props.playerID] !==
                        "effect" && (
                        <button onClick={() => this.props.moves.drawCard()}>
                            Draw Card
                        </button>
                    )}

                {/* card options toggle */}
                {is_action && this.state.showPlayCardOptions && (
                    <div>
                        <button onClick={() => this.playCardValue()}>
                            playCardValue
                        </button>
                        <button onClick={() => this.toggleChoosingScuttle()}>
                            playCardScuttle
                        </button>
                        <button
                            onClick={
                                this.checkEffectRequiresTarget()
                                    ? () => this.toggleChoosingEffect()
                                    : () => this.playCardEffect()
                            }
                        >
                            playCardEffect
                        </button>
                    </div>
                )}

                {/* effect card options */}
                {this.props.ctx.activePlayers[this.props.playerID] ===
                    "effect" && (
                    <div>
                        <button onClick={() => this.accept()}>accept</button>
                        <button onClick={() => this.counter()}>counter</button>
                    </div>
                )}
            </div>
        );
    }
}
