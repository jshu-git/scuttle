import { initializeGame } from "./Setup.js";
import { drawCard, playCardValue } from "./ActionMoves.js";
import { playCardScuttle, chooseScuttleTarget } from "./ScuttleMoves.js";
import {
    playCardEffect,
    chooseEffectTarget,
    counter,
    accept,
    cleanupCounterChain,
} from "./EffectMoves.js";
import { checkForVictory } from "./Victory.js";
import { playAgain, setNewRoom } from "./PlayAgainMoves.js";

import { GAME_NAME } from "../../config";

const setup = ({ playOrder, playOrderPos }) => {
    const { deck, hands, fields, specialFields } = initializeGame(
        playOrder,
        playOrderPos
    );

    // initialize game state G
    return {
        deck: deck,
        hands: hands,
        fields: fields,
        graveyard: [],
        specialFields: specialFields,

        // effect stuff
        counterChain: [],
        effectCountered: false,

        // jacks stuff
        // key=card object, value=[card obj (needed for 6), owner, list of jacks]
        // i.e. jacks[4 of Hearts ID] = [card object, "1", [Jack of Hearts, Jack of Spades]]
        jacks: {},
        names: {},
        logger: [],

        // play again stuff
        winner: "",
        gameOver: {
            playAgain: [],
            newRoomID: "",
        },
    };
};

export const Scuttle = {
    name: `${GAME_NAME}`,
    setup: setup,
    turn: {
        onBegin: (G, ctx) => {
            ctx.events.setActivePlayers({
                currentPlayer: "action",
                others: "idle",
            });

            // only log in onbegin if no winner yet
            if (G.winner === "") {
                G.logger.push(
                    // will be undefined for very first but immediately overwritten
                    "Turn " +
                        ctx.turn +
                        ": " +
                        G.names[ctx.currentPlayer] +
                        "'s turn"
                );
            } else {
                ctx.events.setActivePlayers({
                    currentPlayer: "playAgain",
                    others: "playAgain",
                });
            }
        },
        onEnd: (G, ctx) => {
            cleanupCounterChain(G);
            checkForVictory(G, ctx);
        },
        stages: {
            idle: {
                moves: {},
            },
            action: {
                moves: {
                    drawCard,
                    endTurn,
                    playCardValue,
                    playCardScuttle,
                    playCardEffect,
                    // names
                    storeNames,
                },
            },
            countering: {
                moves: {
                    accept,
                    counter,
                },
            },
            choosingScuttle: {
                moves: {
                    chooseScuttleTarget,
                },
            },
            choosingEffect: {
                moves: {
                    chooseEffectTarget,
                },
            },

            playAgain: {
                moves: {
                    playAgain,
                    setNewRoom,
                },
            },
        },
    },
};

// game moves
function endTurn(G, ctx) {
    G.logger.push(G.names[ctx.currentPlayer] + " ended their turn");
    ctx.events.endTurn();
}

// names
function storeNames(G, ctx, playerList) {
    for (let i = 0; i < playerList.length; i++) {
        G.names[i] = playerList[i].name;
    }

    G.logger[0] =
        // hack for getting around undefined
        "Turn " + ctx.turn + ": " + G.names[ctx.currentPlayer] + "'s turn";
}
