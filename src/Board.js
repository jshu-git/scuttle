import React from "react";
import "./style/board.css";

export class TicTacToeBoard extends React.Component {
    constructor(props) {
        super(props);
        // index is index of selected card
        this.state = {
            showPlayCardOptions: false,
            index: 0,
            isScuttling: false,
            showGraveyard: false,
            // showTwoPrompt: false,
        };
        // don't think we need this https://stackoverflow.com/questions/42556083/what-does-bindthis-in-constructor-do-in-reactjs
        // this.togglePlayCardOptions = this.togglePlayCardOptions.bind(this);
    }

    /*
        this function is called when a card is clicked
        it toggles the card options
        it sets state.index to the index of the clicked card to keep track of it for when an option is executed
    */
    togglePlayCardOptions = (i) => {
        this.setState(
            { showPlayCardOptions: !this.state.showPlayCardOptions, index: i },
            () => {
                console.log("index is ", this.state.index);
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

    toggleGraveyard = () => {
        this.setState({ showGraveyard: !this.state.showGraveyard });
    };

    // toggleTwoPrompt = () => {
    //     this.setState(
    //         {
    //             showPlayCardOptions: false,
    //             showTwoPrompt: true,
    //         },
    //         () => {
    //             console.log();
    //         }
    //     );
    // };

    // this function calls Game.js playCardValue
    playCardValue = (id) => {
        // toggle off the card options
        this.setState({ showPlayCardOptions: false });
        this.props.moves.playCardValue(id);
    };

    playCardScuttle = (i, j) => {
        // toggle off the card options
        this.setState({ isScuttling: false });
        this.props.moves.playCardScuttle(i, j);
    };

    render() {
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
                        onClick={
                            // can only scuttle opponent's field
                            this.state.isScuttling && k !== this.props.playerID
                                ? () =>
                                      this.playCardScuttle(
                                          this.state.index,
                                          idx
                                      )
                                : () => void 0
                        }
                        className={
                            this.state.isScuttling && k !== this.props.playerID
                                ? "activeScuttle"
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
                    className={this.props.isActive ? "active" : ""}
                    onClick={
                        this.props.isActive
                            ? () => this.togglePlayCardOptions(i)
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
                <td key={card.id}>
                    {card.Value} of {card.Suit}
                </td>
            );
        }
        tbody_graveyard.push(
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
                {this.props.isActive && !this.state.showPlayCardOptions && (
                    <button onClick={() => this.props.moves.drawCard()}>
                        Draw Card
                    </button>
                )}

                {/* card options toggle */}
                {this.props.isActive && this.state.showPlayCardOptions && (
                    <div>
                        {/* calls the local playCardValue with the set state */}
                        <button
                            onClick={() => this.playCardValue(this.state.index)}
                        >
                            playCardValue
                        </button>
                        <button onClick={() => this.toggleChoosingScuttle()}>
                            playCardScuttle
                        </button>
                        <button>playCardEffect</button>
                    </div>
                )}

                <br></br>
                <br></br>
                <br></br>

                {/* cardeffect toggle */}
                {/* {this.state.showTwoPrompt && (
                    <p>
                        {this.props.ctx.currentPlayer === this.props.playerID
                            ? "Opponent is deciding 2"
                            : "do you wanna play 2"}
                    </p>
                )} */}

                {winner}
            </div>
        );
    }
}
