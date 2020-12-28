import React from "react";
import "../style/board.css";
import Button from "react-bootstrap/Button";

export class TurnOptions extends React.Component {
    render() {
        // props
        let selectedCard = this.props.selectedCard;

        return (
            <React.Fragment>
                <Button
                    size="sm"
                    disabled={selectedCard !== -1}
                    onClick={this.props.drawCard}
                >
                    Draw
                </Button>
                <Button size="sm" disabled={true}>
                    Concede
                </Button>
            </React.Fragment>
        );
    }
}
