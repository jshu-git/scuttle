import React from "react";
import "./style/board.css";
//this is a test comment

export class Hand extends React.Component {
    onClick(id) {
        this.props.moves.drawCard();
    }

    render() {
        return (
            <div>
                <table id="board">
                    <tbody>
                        <tr>
                            <td onClick={() => this.onClick()}>hello</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}
