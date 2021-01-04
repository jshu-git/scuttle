import React from "react";
import "./board.scss";
import { Button } from "react-bootstrap";

export const CounteringOptions = (props) => {
    const { G, ctx, playerID, moves } = props;
    const inCounteringStage = ctx.activePlayers[playerID] === "countering";
    const has2 = G.hands[playerID].some((x) => x.Value === "2");

    // moves
    const accept = () => {
        moves.accept(playerID);
    };
    const counter = () => {
        moves.counter(playerID);
    };

    if (inCounteringStage) {
        return (
            <React.Fragment>
                <Button size="sm" onClick={accept}>
                    Accept
                </Button>{" "}
                <Button size="sm" onClick={counter} disabled={!has2}>
                    Counter
                </Button>
            </React.Fragment>
        );
    }
    return <React.Fragment></React.Fragment>;
};

// export class CounteringOptions extends React.Component {
//     render() {
//         return (
//             <React.Fragment>
//                 <Button size="sm" onClick={this.props.accept}>
//                     Accept
//                 </Button>{" "}
//                 <Button
//                     size="sm"
//                     onClick={this.props.counter}
//                     disabled={!this.props.has2}
//                 >
//                     Counter
//                 </Button>
//             </React.Fragment>
//         );
//     }
// }
