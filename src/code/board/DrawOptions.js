import React from "react";
import "../../style/board.css";
import Button from "react-bootstrap/Button";

export class DrawOptions extends React.Component {
    render() {
        // props

        return (
            <React.Fragment>
                <Button 
                    size="sm" 
                    onClick={this.props.acceptDraw}
                    >
                    Accept Draw
                </Button>
                <Button
                    size="sm"
                    onClick={this.props.denyDraw}
                >
                    Deny Draw
                </Button>
            </React.Fragment>
        );
    }
}
