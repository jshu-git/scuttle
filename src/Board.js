import React from "react";
import "./style/board.css";

export class TicTacToeBoard extends React.Component {
    constructor(props) {
        super(props);
        // index is index of selected card
        this.state = { showCardOptions: false, index: 0, isScuttling: false };
        this.toggleCardOptions = this.toggleCardOptions.bind(this);
    }

    /*
        this function is called when a card is clicked
        it toggles the card options
        it sets state.index to the index of the clicked card to keep track of it for when an option is executed
    */
    toggleCardOptions = (i) => {
        this.setState(
            { showCardOptions: !this.state.showCardOptions, index: i },
            () => {
                console.log("index is ", this.state.index);
            }
        );
    };

    toggleChoosingScuttle = () => {
        this.setState(
            {
                showCardOptions: false,
                isScuttling: true,
            },
            () => {
                console.log("isScuttling is ", this.state.isScuttling);
            }
        );
    };

    // this function calls Game.js playCardValue
    playCardValue = (id) => {
        // toggle off the card options
        this.setState({ showCardOptions: false });
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
        let field_other_len = 0;
        let field_you_len = 0;
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
                field_you_len = f.length;
                tbody_field_you.push(<tr key={k}>{cells_field}</tr>);
            } else {
                field_other_len = f.length;
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
                    onClick={() => this.toggleCardOptions(i)}
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

        return (
            <div>
                <p>Current Turn: Player {this.props.ctx.currentPlayer}</p>
                <hr></hr>
                <table id="field">
                    <thead>
                        <tr>
                            <th colSpan={field_other_len}>Opponent Field</th>
                        </tr>
                    </thead>
                    <tbody>{tbody_field_other}</tbody>
                </table>
                <table id="field">
                    <thead>
                        <tr>
                            <th colSpan={field_you_len}>Your Field</th>
                        </tr>
                    </thead>
                    <tbody>{tbody_field_you}</tbody>
                </table>
                <table id="hand">
                    <thead>
                        <tr>
                            <th colSpan={hand.length}>Your Hand</th>
                        </tr>
                    </thead>
                    <tbody>{tbody_hand}</tbody>
                </table>

                {/* card options toggle */}
                {this.state.showCardOptions && (
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

                {winner}
            </div>
        );
    }
}
