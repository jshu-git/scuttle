import React from "react";
import "../style/board.css";
import Button from "react-bootstrap/Button";

export class CounteringOptions extends React.Component {
    render() {
        let has2 = this.props.hand.some((x) => x.Value === "2");

        return (
            <React.Fragment>
                <Button size="sm" onClick={this.props.accept}>
                    Accept
                </Button>
                <Button size="sm" onClick={this.props.counter} disabled={!has2}>
                    Counter
                </Button>
            </React.Fragment>
        );
    }
}
