import { initializeGame } from "./Setup.js";
import { drawCard, playCardValue, playCardScuttle } from "./ActionMoves.js";
import {
    playCardEffect,
    counter,
    accept,
    chooseTarget,
} from "./EffectMoves.js";

const setup = ({ playOrder, playOrderPos }) => {
    const { deck, hands, fields, special_fields } = initializeGame(playOrder, playOrderPos);

    // initialize game state G
    return {
        deck: deck,
        hands: hands,
        fields: fields,
        graveyard: [],
        special_fields: special_fields,

        // effect stuff
        counter_chain: [],
        effect_countered: false,

        // used to keep track of currentPlayer during a stage, similar to currentPlayer for a turn
        currentPlayerCounterStage: undefined, // is overwritten whenever a cardeffect is played

        // jacks stuff
        // key=card object, value=[owner, list of jacks]
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
                },
            },
            // see EffectMoves.js
            countering: {
                moves: {
                    accept,
                    counter,
                },
            },
            // see EffectMoves.js
            choosing: {
                moves: {
                    chooseTarget,
                },
            },
        },
    },
};
