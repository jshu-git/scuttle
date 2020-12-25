import React from "react";
import "../style/board.css";

export class PlayCardOptions extends React.Component {
    render() {
        return (
            <div>
                <button onClick={this.props.playCardValue}>
                    playCardValue
                </button>
                <button onClick={this.props.toggleChoosingScuttle}>
                    playCardScuttle
                </button>
                <button onClick={this.props.toggleChoosingEffect}>
                    playCardEffect
                </button>
            </div>
        );
    }
}
