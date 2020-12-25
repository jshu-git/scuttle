import React from "react";
import "../style/board.css";

export class PlayCardOptions extends React.Component {
    render() {
        let isSpecialCard =
            this.props.selected_card_id.includes("Jack") ||
            this.props.selected_card_id.includes("Queen") ||
            this.props.selected_card_id.includes("King");
        let isNoEffectCard = this.props.selected_card_id.includes("10");
        // cannot play 7 on < 2 card deck
        let is7AndEmptyDeck =
            this.props.selected_card_id.includes("7") &&
            this.props.deck.length < 2;

        return (
            <div>
                <button
                    disabled={isSpecialCard}
                    onClick={this.props.playCardValue}
                >
                    playCardValue
                </button>
                <button
                    disabled={isSpecialCard}
                    onClick={this.props.toggleChoosingScuttle}
                >
                    playCardScuttle
                </button>
                <button
                    disabled={isNoEffectCard || is7AndEmptyDeck}
                    onClick={this.props.playCardEffect}
                >
                    playCardEffect
                </button>
            </div>
        );
    }
}
