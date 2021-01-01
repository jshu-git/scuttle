import React from "react";

import "./board.scss";

export class WinnerScreen extends React.Component {
    render() {
        // props
        let winnerName = this.props.winnerName
        

        return (
            <React.Fragment>
                <h1>Winner: {winnerName}</h1>
                <hr></hr>
            </React.Fragment>
        );
    }
}
