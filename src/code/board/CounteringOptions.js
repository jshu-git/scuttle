import React from "react";
import "./board.scss";
import { Button } from "react-bootstrap";

export class CounteringOptions extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Button size="sm" onClick={this.props.accept}>
                    Accept
                </Button>{" "}
                <Button
                    size="sm"
                    onClick={this.props.counter}
                    disabled={!this.props.has2}
                >
                    Counter
                </Button>
            </React.Fragment>
        );
    }
}
