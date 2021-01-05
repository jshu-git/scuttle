import React, { useState, useEffect } from "react";

// components
import {
    Hand,
    PlayCardOptions,
    CounteringOptions,
    Graveyard,
    Fields,
    TurnOptions,
    Logger,
    ChoosingPopup,
    PlayAgain,
} from "./components";

// bootstrap
import { Container, Jumbotron, Button } from "react-bootstrap";

export const Board = (props) => {
    const { G, ctx, playerID, moves, gameMetadata } = props;

    // states
    const [showGraveyard, setShowGraveyard] = useState(false);

    // player 0 has to set the player's actual screen names due to the way boardgame.io works
    useEffect(() => {
        if (playerID === "0") {
            // moves.storeNames(gameMetadata);
        }
    }, [playerID, moves, gameMetadata]);

    // extra props
    const playerIDOpponent = String(1 - parseInt(playerID));
    const player = G.players[playerID];

    const graveyardButton = (
        <Button
            size="sm"
            variant="outline-secondary"
            disabled={G.graveyard.length === 0}
            onClick={() => setShowGraveyard(!showGraveyard)}
        >
            View Graveyard ({G.graveyard.length})
        </Button>
    );

    return (
        <div className="board-area">
            {/* logger */}
            <Container>
                <Logger {...props} />
            </Container>

            {/* play again */}
            <Container>{G.winner !== "" && <PlayAgain {...props} />}</Container>

            {/* show opponent hand */}
            <Container>
                <h6>
                    Opponent Hand ({G.players[playerIDOpponent].hand.length}){" "}
                </h6>
                {(player.specialField.some((x) => x.Value === "8") ||
                    G.winner !== "") && (
                    <Hand {...props} playerID={playerIDOpponent} />
                )}
            </Container>

            {/* fields */}
            <Container className="container-field">
                <Jumbotron>
                    <Fields {...props} playerIDOpponent={playerIDOpponent} />
                </Jumbotron>
            </Container>

            {/* choosing popup (in its own container) */}
            <ChoosingPopup {...props} playerIDOpponent={playerIDOpponent} />

            {/* hand */}
            <Container>
                <h6>
                    Your Hand ({player.hand.length}){" "}
                    {player.selectedCard !== false && (
                        <span>(selected: {player.selectedCard.id})</span>
                    )}
                </h6>
                <Hand {...props} />
            </Container>

            {/* turn stuff */}
            {/* playcard options */}
            <Container>
                <PlayCardOptions
                    {...props}
                    playerIDOpponent={playerIDOpponent}
                />
            </Container>
            {/* countering options */}
            <Container>
                <CounteringOptions {...props} />
            </Container>
            {/* turn options */}
            <Container>
                <TurnOptions {...props} />
            </Container>

            {/* graveyard */}
            <Container>
                {graveyardButton}
                {showGraveyard && (
                    <Graveyard
                        {...props}
                        showGraveyard={showGraveyard}
                        setShowGraveyard={setShowGraveyard}
                    />
                )}
            </Container>
        </div>
    );
};
