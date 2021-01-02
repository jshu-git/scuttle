import React from "react";

import "./board.scss";

export class Logger extends React.Component {
    render() {
        // props
        let currentPlayer = this.props.currentPlayer;

        return (
            <React.Fragment>
                <h5>Current Turn: {currentPlayer}</h5>
                <hr></hr>
            </React.Fragment>
        );
    }
}
