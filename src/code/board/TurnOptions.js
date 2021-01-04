import React from "react";
import "./board.scss";
import { Button } from "react-bootstrap";

export const TurnOptions = (props) => {
    const { G, ctx, playerID, moves, selectedCard } = props;
    const inActionStage = ctx.activePlayers[playerID] === "action";

    // moves
    const drawCard = () => {
        moves.drawCard();
    };
    const endTurn = () => {
        moves.endTurn();
    };

    if (inActionStage) {
        return (
            <React.Fragment>
                <Button
                    size="sm"
                    variant="success"
                    disabled={selectedCard !== false || G.deck.length === 0}
                    onClick={drawCard}
                >
                    Draw ({G.deck.length})
                </Button>{" "}
                <Button
                    size="sm"
                    variant="danger"
                    disabled={G.deck.length !== 0}
                    onClick={endTurn}
                >
                    End Turn
                </Button>
            </React.Fragment>
        );
    }
    return <React.Fragment></React.Fragment>;
};

// export class TurnOptions extends React.Component {
//     render() {
//         // props
//         let selectedCard = this.props.selectedCard;
//         let deck = this.props.deck;

//         return (
//             <React.Fragment>
//                 <Button
//                     size="sm"
//                     variant="success"
//                     disabled={selectedCard !== -1 || deck.length === 0}
//                     onClick={this.props.drawCard}
//                 >
//                     Draw ({deck.length})
//                 </Button>{" "}
//                 <Button
//                     size="sm"
//                     variant="danger"
//                     disabled={deck.length !== 0}
//                     onClick={this.props.endTurn}
//                 >
//                     End Turn
//                 </Button>
//             </React.Fragment>
//         );
//     }
// }
