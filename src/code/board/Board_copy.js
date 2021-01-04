import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";

// components
import { Hand } from "./Hand";
import { PlayCardOptions } from "./PlayCardOptions";
import { CounteringOptions } from "./CounteringOptions";
import { Field } from "./Field";
import { SpecialField } from "./SpecialField";
import { Graveyard } from "./Graveyard";
import { TurnOptions } from "./TurnOptions";
import { Logger } from "./Logger";
import { ChoosingPopup } from "./ChoosingPopup";
import PlayAgain from "./PlayAgain";

// bootstrap
import { Container, Button, Jumbotron, Row, Col } from "react-bootstrap";

export const Board = (props) => {
    const [selectedCard, setSelectedCard] = useState(false);
    const [showGraveyard, setShowGraveyard] = useState(false);

    // player 0 has to set the player's actual screen names due to the way boardgame.io works
    //   useEffect(() => {
    //     if (props.playerID === "0") {
    //       props.moves.storeNames(props.gameMetadata);
    //     }
    //   }, [props.playerID, props.moves, props.gameMetadata]);

    return (
        <div className="board-area">
            {/* hand */}
            <Container>
                {/* <h6>
                    Your Hand ({hands[playerID].length}){" "}
                    {selectedCard !== -1 && (
                        <span>(selected: {selectedCard.id})</span>
                    )}
                </h6> */}
                <Hand
                    {...props}
                    selectedCard={selectedCard}
                    setSelectedCard={setSelectedCard}
                />
            </Container>
        </div>
    );
};
