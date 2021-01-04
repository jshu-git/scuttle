import React from "react";
import "./board.scss";
import { Col, Image } from "react-bootstrap/";
import { CardImages } from "../../assets/cards.js";

export const SpecialField = (props) => {
    const {
        G,
        ctx,
        playerID,
        moves,
        inPopup,
        isPlayerSpecialField,
        isOpponentSpecialField,
    } = props;
    
    // stages
    const inChoosingEffectStage =
        ctx.activePlayers[playerID] === "choosingEffect";

    // moves
    const chooseEffectTarget = (targetCard, targetField) => {
        moves.chooseEffectTarget(targetCard, targetField);
    };

    const onClick = (targetCard) => {
        if (inPopup) {
            if (inChoosingEffectStage) {
                if (isOpponentSpecialField) {
                    return () =>
                        chooseEffectTarget(targetCard, "opponentSpecialField");
                } else if (isPlayerSpecialField) {
                    return () =>
                        chooseEffectTarget(targetCard, "playerSpecialField");
                }
            }
        }
        return () => void 0;
    };

    let cells = [];
    let specialField = G.specialFields[playerID];

    for (let i = 0; i < specialField.length; i++) {
        let card = specialField[i];
        let img = CardImages[card.id];

        cells.push(
            <Col key={card.id}>
                <Image
                    src={img}
                    thumbnail
                    className={inPopup ? "targetable" : ""}
                    onClick={() => onClick(card)}
                ></Image>
            </Col>
        );
    }

    return cells;
};

// export class SpecialField extends React.Component {
//     onClick = (targetCard) => {
//         if (this.props.inPopup) {
//             if (this.props.inChoosingEffectStage) {
//                 if (this.props.isOpponentSpecialField) {
//                     return () =>
//                         this.props.chooseEffectTarget(
//                             targetCard,
//                             "opponentSpecialField"
//                         );
//                 } else if (this.props.isPlayerSpecialField) {
//                     return () =>
//                         this.props.chooseEffectTarget(
//                             targetCard,
//                             "playerSpecialField"
//                         );
//                 }
//             }
//         }
//         return () => void 0;
//     };

//     render() {
//         let cells = [];
//         let specialField = this.props.specialField;

//         for (let i = 0; i < specialField.length; i++) {
//             let card = specialField[i];
//             let img = CardImages[card.id];

//             cells.push(
//                 <Col key={card.id}>
//                     <Image
//                         src={img}
//                         thumbnail
//                         className={this.props.inPopup ? "targetable" : ""}
//                         onClick={this.onClick(card)}
//                     ></Image>
//                 </Col>
//             );
//         }

//         return cells;
//     }
// }
