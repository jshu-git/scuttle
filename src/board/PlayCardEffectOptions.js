import React from "react";
import "../style/board.css";

export class PlayCardEffectOptions extends React.Component {
    render() {
        return (
            <div>
                <button onClick={this.props.accept}>accept</button>
                <button onClick={this.props.counter}>counter</button>
            </div>
        );
    }
}
