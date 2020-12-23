import React from "react";
import "./style/board.css";

export class Hand extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showPlayCardOptions: false,
            index: 0,
        };
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

    render() {
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

        return (
            <table>
                <thead>
                    <tr>
                        <th colSpan={hand.length}>Your Hand</th>
                    </tr>
                </thead>
                <tbody>{tbody_hand}</tbody>
            </table>
        );
    }
}
