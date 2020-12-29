import React from "react";
import "../style/board.css";
import { Button } from "react-bootstrap";

export class TurnOptions extends React.Component {
    render() {
        // props
        let selectedCard = this.props.selectedCard;
        let deck = this.props.deck;

        return (
            <React.Fragment>
                <Button
                    size="sm"
                    disabled={selectedCard !== -1 || deck.length === 0}
                    onClick={this.props.drawCard}
                >
                    Draw
                </Button>
                <Button
                    size="sm"
                    disabled={deck.length !== 0}
                    onClick={this.props.endTurn}
                >
                    End Turn
                </Button>
            </React.Fragment>
        );
    }
}
