import React from "react";
import "../style/board.css";
import { Button } from "react-bootstrap";

export class CounteringOptions extends React.Component {
    render() {
        // props
        let hand = this.props.hand;

        let has2 = hand.some((x) => x.Value === "2");

        return (
            <React.Fragment>
                <Button size="sm" onClick={this.props.accept}>
                    Accept
                </Button>{" "}
                <Button size="sm" onClick={this.props.counter} disabled={!has2}>
                    Counter
                </Button>
            </React.Fragment>
        );
    }
}
