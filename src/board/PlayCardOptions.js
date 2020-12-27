import React from "react";
import "../style/board.css";

export class PlayCardOptions extends React.Component {
    render() {
        return (
            <div>
                <button onClick={this.props.playCardValue}>
                    playCardValue
                </button>
                <button onClick={this.props.playCardScuttle}>
                    playCardScuttle
                </button>
                <button onClick={this.props.playCardEffect}>
                    playCardEffect
                </button>
            </div>
        );
    }
}
