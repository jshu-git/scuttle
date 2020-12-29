import { initializeGame } from "./Setup.js";
import { drawCard, playCardValue } from "./ActionMoves.js";
import { playCardScuttle, chooseScuttleTarget } from "./ScuttleMoves.js";
import {
    playCardEffect,
    chooseEffectTarget,
    counter,
    accept,
} from "./EffectMoves.js";

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
        // used to keep track of currentPlayer during a stage, similar to currentPlayer for a turn
        currentPlayerCounterStage: undefined, // is overwritten whenever a cardeffect is played

        // jacks stuff
        // key=card object, value=[card obj, owner, list of jacks]
        // i.e. jacks[4 of Hearts ID] = [card object, "1", [Jack of Hearts, Jack of Spades]]
        jacks: {},
    };
};

export const TicTacToe = {
    setup: setup,
    turn: {
        onBegin: (G, ctx) => {
            ctx.events.setActivePlayers({
                currentPlayer: "action",
                others: "idle",
            });
        },
        stages: {
            idle: {
                moves: {},
            },
            // see ActionMoves.js
            action: {
                moves: {
                    drawCard,
                    playCardValue,
                    playCardEffect,
                    playCardScuttle,
                    endTurn,
                },
            },
            // see EffectMoves.js
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
        },
    },

    // victory condition
    endIf: (G, ctx) => {
        if (isVictory(G, ctx)) {
            return { winner: ctx.currentPlayer };
        }
        if (isDraw(G, ctx)) {
            return { draw: true };
        }
    },
    onEnd: (G, ctx) => {
        ctx.events.setActivePlayers({
            value: {
                0: "idle",
                1: "idle",
            },
        });
    },
};

const isVictory = (G, ctx) => {
    let player = ctx.currentPlayer;
    let field = G.fields[player];
    let specialField = G.specialFields[player];
    let points = field.map((x) => x.Point).reduce((a, b) => a + b, 0);
    let numKings = specialField.filter((x) => x.Value === "King").length;

    return points >= 21 - 7 * numKings;
};

const isDraw = (G, ctx) => {
    let player = ctx.playOrder[ctx.playOrderPos];
    let opponent = ctx.playOrder[(ctx.playOrderPos + 1) % ctx.playOrder.length];
    let hand = G.hands[player];
    let opponentHand = G.hands[opponent];
    let deck = G.deck;

    console.log(
        String(deck.length === 0),
        String(hand.every((i) => i.Value === "Jack")),
        String(hand.length === 0),
        String(opponentHand.every((i) => i.Value === "Jack")),
        String(opponentHand.length === 0)
    );

    return (
        deck.length === 0 &&
        (hand.every((i) => i.Value === "Jack") || hand.length === 0) &&
        opponentHand.every(
            (i) => i.Value === "Jack" || opponentHand.length === 0
        )
    );
};

// game moves
export function endTurn(G, ctx) {
    ctx.events.endTurn();
}
