import React from "react";
import "../style/board.css";

export class PlayCardOptions extends React.Component {
    render() {
        // disabled = these checks are true
        let empty_scuttle = this.props.opponent_field.length == 0;

        let special =
            this.props.selected_card.Value === "Jack" ||
            this.props.selected_card.Value === "Queen" ||
            this.props.selected_card.Value === "King";

        // check for jack in opponent? and special fields
        // let two = this.props.selected_card.Value === "2";

        let three =
            this.props.selected_card.Value === "3" &&
            this.props.graveyard.length === 0;

        // let four = this.props.selected_card.Value === "4";
        // let five = this.props.selected_card.Value === "5";
        // let six = this.props.selected_card.Value === "6";

        let seven =
            this.props.selected_card.Value === "7" &&
            this.props.deck.length < 2;

        // let eight =
        //     this.props.selected_card.Value === "8"

        let nine =
            (this.props.selected_card.Value === "9" &&
                this.props.field.length === 0) ||
            (this.props.selected_card.Value === "9" &&
                this.props.opponent_field.length === 0);

        // 10 no card effect
        let ten = this.props.selected_card.Value === "10";

        let jack =
            this.props.selected_card.Value === "Jack" &&
            this.props.opponent_field.length === 0;

        // let queen =
        //     this.props.selected_card.Value === "Queen"

        // let king =
        // this.props.selected_card.Value === "King"

        return (
            <div>
                <button disabled={special} onClick={this.props.playCardValue}>
                    playCardValue
                </button>
                <button
                    disabled={empty_scuttle || special}
                    onClick={this.props.toggleChoosingScuttle}
                >
                    playCardScuttle
                </button>
                <button
                    disabled={three || seven || nine || ten || jack}
                    onClick={this.props.playCardEffect}
                >
                    playCardEffect
                </button>
            </div>
        );
    }
}
