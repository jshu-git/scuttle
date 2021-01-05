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

const setup = ({ numPlayers }) => {
    const goFirst = Math.floor(Math.random() * 2);

    const { deck, players } = initializeGame(goFirst, numPlayers);

    // initialize game state G
    return {
        players: players,
        deck: deck,
        graveyard: [],

        // effect stuff
        counterChain: [],
        effectCountered: false,

        // jacks stuff
        // key=card object, value=[card obj (needed for 6), owner, list of jacks]
        // i.e. jacks[4 of Hearts ID] = [card object, "1", [Jack of Hearts, Jack of Spades]]
        jacks: {},

        logger: [],

        // play again stuff
        winner: "",
        gameOver: {
            playAgain: [],
            newRoomID: "",
        },

        // turn stuff
        goFirst: goFirst,
    };
};

export const Scuttle = {
    name: `${GAME_NAME}`,
    setup: setup,
    turn: {
        order: {
            first: (G, ctx) => G.goFirst,
            next: (G, ctx) => (ctx.playOrderPos + 1) % ctx.playOrder.length,
        },

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
                        G.players[ctx.currentPlayer].name +
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

            // clear selectedCard always
            for (let i = 0; i < G.players.length; i++) {
                G.players[i].selectedCard = false;
            }

            checkForVictory(G, ctx);
        },
        stages: {
            idle: {
                moves: {
                    // names
                    storeNames,
                },
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

                    toggleSelectedCard,
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
    G.logger.push(G.players[ctx.currentPlayer].name + " ended their turn");
    ctx.events.endTurn();
}
function storeNames(G, ctx, playerList) {
    for (let i = 0; i < playerList.length; i++) {
        G.players[i].name = playerList[i].name;
    }

    G.logger[0] =
        // hack for getting around undefined
        "Turn " +
        ctx.turn +
        ": " +
        G.players[ctx.currentPlayer].name +
        "'s turn";
}

function toggleSelectedCard(G, ctx, card) {
    let player = G.players[ctx.currentPlayer];
    player.selectedCard
        ? (player.selectedCard = false)
        : (player.selectedCard = card);
}
