import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";

// components
import { Hand } from "./Hand";
import { PlayCardOptions } from "./PlayCardOptions";
import { CounteringOptions } from "./CounteringOptions";
import { Field } from "./Field";
import { SpecialField } from "./SpecialField";
import { Graveyard } from "./Graveyard";
import { Fields } from "./Fields";
import { TurnOptions } from "./TurnOptions";
import { Logger } from "./Logger";
import { ChoosingPopup } from "./ChoosingPopup";
import PlayAgain from "./PlayAgain";

// bootstrap
import { Container, Jumbotron, Row, Col } from "react-bootstrap";

export const Board = (props) => {
    const [selectedCard, setSelectedCard] = useState(false);
    const [showGraveyard, setShowGraveyard] = useState(false);

    // extra props
    let playerIDOpponent = String(1 - parseInt(props.playerID));

    // player 0 has to set the player's actual screen names due to the way boardgame.io works
    //   useEffect(() => {
    //     if (props.playerID === "0") {
    //       props.moves.storeNames(props.gameMetadata);
    //     }
    //   }, [props.playerID, props.moves, props.gameMetadata]);

    return (
        <div className="board-area">
            {/* logger */}
            <Container>
                <Logger {...props} />
            </Container>

            {/* show opponent hand */}
            {/* no way around ugly headers */}
            <Container>
                <h6>
                    Opponent Hand ({props.G.hands[playerIDOpponent].length})
                </h6>
                {(props.G.specialFields[props.playerID].some(
                    (x) => x.Value === "8"
                ) ||
                    // show hand after game is over
                    props.G.winner !== "") && (
                    <Hand {...props} playerID={playerIDOpponent} />
                )}
            </Container>

            {/* fields */}
            <Container className="container-field">
                <Jumbotron>
                    <Fields {...props} playerIDOpponent={playerIDOpponent} />
                </Jumbotron>
            </Container>

            {/* hand */}
            <Container>
                <h6>
                    Your Hand ({props.G.hands[props.playerID].length}){" "}
                    {selectedCard !== false && (
                        <span>(selected: {selectedCard.id})</span>
                    )}
                </h6>
                <Hand
                    {...props}
                    selectedCard={selectedCard}
                    setSelectedCard={setSelectedCard}
                />
            </Container>

            {/* turn stuff */}
            {/* playcard options */}
            <Container>
                <PlayCardOptions
                    {...props}
                    selectedCard={selectedCard}
                    playerIDOpponent={playerIDOpponent}
                />
            </Container>
            {/* countering options */}
            <Container>
                <CounteringOptions {...props} />
            </Container>
            {/* turn options */}
            <Container>
                <TurnOptions {...props} selectedCard={selectedCard} />
            </Container>

            {/* graveyard button is always visible */}
            <Container>
                <Graveyard
                    {...props}
                    showGraveyard={showGraveyard}
                    setShowGraveyard={setShowGraveyard}
                />
            </Container>
        </div>
    );
};
