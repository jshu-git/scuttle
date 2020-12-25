import React from "react";
import "../style/board.css";

export class PlayCardEffectOptions extends React.Component {
    render() {
        let has2 = this.props.hand.some((x) => x.Value === "2");

        return (
            <div>
                <button onClick={this.props.accept}>accept</button>
                <button disabled={!has2} onClick={this.props.counter}>
                    counter
                </button>
            </div>
        );
    }
}
