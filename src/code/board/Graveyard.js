import React from "react";

import "./board.scss";
import { Row, Col, Image, Button } from "react-bootstrap";

import { CardImages } from "../../assets/cards.js";

export const Graveyard = (props) => {
    const { G, moves, showGraveyard, setShowGraveyard, inPopup } = props;

    // state toggler
    const toggleGraveyard = () => {
        setShowGraveyard(!showGraveyard);
    };

    // moves
    const chooseEffectTarget = (targetCard) => {
        moves.chooseEffectTarget(targetCard);
    };

    let cells = [];
    for (let i = 0; i < G.graveyard.length; i++) {
        let card = G.graveyard[i];
        let img = CardImages[card.id];
        cells.push(
            <Col key={card.id}>
                <Image
                    src={img}
                    thumbnail
                    className={inPopup ? "targetable" : ""}
                    onClick={
                        inPopup
                            ? // we know we're in graveyard, so don't need to pass targetField
                              () => chooseEffectTarget(card)
                            : () => void 0
                    }
                ></Image>
            </Col>
        );
    }

    let button = (
        <Button
            size="sm"
            variant="outline-secondary"
            disabled={G.graveyard.length === 0}
            onClick={toggleGraveyard}
        >
            View Graveyard ({G.graveyard.length})
        </Button>
    );

    if (showGraveyard) {
        return (
            <React.Fragment>
                {button}
                <h6>Graveyard</h6>
                <Row xs={4} sm={4} md={5}>
                    {cells}
                </Row>
            </React.Fragment>
        );
    }
    return <React.Fragment>{button}</React.Fragment>;
};

// export class Graveyard extends React.Component {
//     render() {
//         let graveyard = this.props.graveyard;
//         let cells = [];

//         for (let i = 0; i < graveyard.length; i++) {
//             let card = graveyard[i];
//             let img = CardImages[card.id];
//             cells.push(
//                 <Col key={card.id}>
//                     <Image
//                         src={img}
//                         thumbnail
//                         className={this.props.inPopup ? "targetable" : ""}
//                         onClick={
//                             this.props.inPopup
//                                 ? // we know we're in graveyard, so don't need to pass targetField
//                                   () => this.props.chooseEffectTarget(card)
//                                 : () => void 0
//                         }
//                     ></Image>
//                 </Col>
//             );
//         }

//         return (
//             <Row xs={4} sm={4} md={5}>
//                 {cells}
//             </Row>
//         );
//     }
// }
