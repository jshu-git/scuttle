import { INVALID_MOVE } from "boardgame.io/core";
import { initializeGame } from "./setup.js";

const setup = ({ playOrder, playOrderPos }) => {
    const { deck, hands, fields } = initializeGame(playOrder, playOrderPos);

    // initialize game state G
    return {
        deck: deck,
        hands: hands,
        fields: fields,
        graveyard: [],
    };
};

export const TicTacToe = {
    setup: setup,

    turn: {
        moveLimit: 1,
        stages: {
            cardEffect: {
                moves: { playAce },
            },
        },
    },

    phases: {
        // draw: {
        //     start: true,
        //     onBegin: (G, ctx) => {
        //         drawHands(G, ctx);
        //         setFields(G, ctx);
        //         // ctx.events.endPhase(); // this fails for some reason, so have to use endIf
        //     },
        //     next: "play",
        //     endIf: (G, ctx) => {
        //         return (
        //             Object.keys(G.hands).length === 2 &&
        //             Object.keys(G.fields).length === 2
        //         );
        //     },
        // },
        play: {
            moves: {
                drawCard,
                playCardValue,
                playCardEffect,
                playCardScuttle,
            },
            start: true,
        },
    },
};

// stage moves
function playAce(G, ctx) {
    console.log("playing ace");
}

// moves
function drawCard(G, ctx) {
    const card = G.deck.pop();
    G.hands[ctx.currentPlayer].push(card);
}

// i is the index of the card in the current player's hand
function playCardValue(G, ctx, i) {
    let hand = G.hands[ctx.currentPlayer];
    let field = G.fields[ctx.currentPlayer];

    if (i == null || i < 0 || i >= hand.length) {
        console.log("playCardValue error");
        return INVALID_MOVE;
    }

    let card = hand[i];
    console.log("playCardValue " + card.id);
    // remove from hand and add to field
    let remove = hand.splice(i, 1)[0];
    field.push(remove);
}

function playCardScuttle(G, ctx, i, j) {
    // let current_hand = G.hands[ctx.currentPlayer];
    let current_player = ctx.playOrder[ctx.playOrderPos];
    let opponent_player =
        ctx.playOrder[(ctx.playOrderPos + 1) % ctx.playOrder.length];

    let current_hand = G.hands[current_player];
    let opponent_field = G.fields[opponent_player];

    let current_card = current_hand[i];
    let target_card = opponent_field[j];

    // can't use J/Q/K to scuttle
    if (
        current_card.Value === "Jack" ||
        current_card.Value === "Queen" ||
        current_card.Value === "King"
    ) {
        console.log("playCardScuttle error, attempt to scuttle with J/Q/K");
        return INVALID_MOVE;
    }

    // card logic
    var temp = current_card.Value;
    var temp2 = target_card.Value;
    if (temp === "Ace") {
        temp = "1";
    }
    if (temp2 === "Ace") {
        temp2 = "1";
    }
    if (parseInt(temp) >= parseInt(temp2)) {
        let remove1 = current_hand.splice(i, 1)[0];
        let remove2 = opponent_field.splice(j, 1)[0];
        G.graveyard.push(remove1);
        G.graveyard.push(remove2);
        console.log(remove1.Value + " SCUTTLE " + remove2.Value);
    } else {
        console.log("playCardScuttle error, scuttle failed");
        return INVALID_MOVE;
    }
    // console.log("playCardScuttle " + card.id);
}

// j is the index of the TARGET card in the OPPONENT's hand
function playCardEffect(G, ctx, i, j) {
    // let current_player = ctx.playOrder[ctx.playOrderPos];
    // let opponent_player =
    //     ctx.playOrder[(ctx.playOrderPos + 1) % ctx.playOrder.length];
    // // console.log("reaching");
    // ctx.events.setActivePlayers({ all: "cardEffect" });
}
