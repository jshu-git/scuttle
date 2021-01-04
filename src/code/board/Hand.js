import React, { useState, useEffect } from "react";

import "./board.scss";
import { Row, Col, Image } from "react-bootstrap";
import { CardImages } from "../../assets/cards.js";

export const Hand = (props) => {
    const { G, ctx, playerID, selectedCard, setSelectedCard } = props;
    const inActionStage = ctx.activePlayers[playerID] === "action";

    const toggleSelectedCard = (card) => {
        selectedCard ? setSelectedCard(false) : setSelectedCard(card);
    };

    useEffect(() => {
        console.log("selected", selectedCard);
    }, [selectedCard]);

    let hand = G.hands[playerID];
    let cells = [];
    for (let i = 0; i < hand.length; i++) {
        let card = hand[i];
        let img = CardImages[card.id];

        cells.push(
            <Col key={card.id}>
                <Image
                    src={img}
                    thumbnail
                    className={inActionStage ? "targetable" : ""}
                    onClick={
                        // note: when using ternary in onClick, have to use ()=>
                        inActionStage
                            ? () => toggleSelectedCard(card)
                            : () => void 0
                    }
                />
            </Col>
        );
    }
    return (
        <Row xs={4} sm={4} md={5} className={inActionStage ? "active" : ""}>
            {cells}
        </Row>
    );
};

// export class Hand extends React.Component {
//     render() {
//         let hand = this.props.hand;
//         let cells = [];

//         for (let i = 0; i < hand.length; i++) {
//             let card = hand[i];
//             let img = CardImages[card.id];

//             cells.push(
//                 <Col key={card.id}>
//                     <Image
//                         src={img}
//                         thumbnail
//                         className={this.props.inActionStage ? "targetable" : ""}
//                         onClick={
//                             // note: when using ternary in onClick, have to use ()=>
//                             this.props.inActionStage
//                                 ? () => this.props.toggleSelectedCard(card)
//                                 : () => void 0
//                         }
//                     />
//                 </Col>
//             );
//         }

//         return (
//             <Row
//                 xs={4}
//                 sm={4}
//                 md={5}
//                 className={this.props.inActionStage ? "active" : ""}
//             >
//                 {cells}
//             </Row>
//         );
//     }
// }
