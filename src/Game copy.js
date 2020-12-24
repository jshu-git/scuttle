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
        counter_chain: [],
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
            action: {
                moves: {
                    drawCard,
                    playCardValue,
                    playCardEffect,
                    playCardScuttle,
                },
            },
            idle: {
                moves: {},
            },
            effect: {
                moves: {
                    accept,
                    counter,
                },
            },
        },
    },
};

// action moves
function drawCard(G, ctx) {
    const card = G.deck.pop();
    G.hands[ctx.currentPlayer].push(card);
    ctx.events.endTurn();
}

// i is the index of the card in the current player's hand
function playCardValue(G, ctx, card_id) {
    let hand = G.hands[ctx.currentPlayer];
    let field = G.fields[ctx.currentPlayer];

    let idx = hand.findIndex((i) => i.id === card_id);
    let remove = hand.splice(idx, 1)[0];
    field.push(remove);
    ctx.events.endTurn();
}

function playCardScuttle(G, ctx, card_id, target_id) {
    let current_player = ctx.playOrder[ctx.playOrderPos];
    let opponent_player =
        ctx.playOrder[(ctx.playOrderPos + 1) % ctx.playOrder.length];

    let current_hand = G.hands[current_player];
    let opponent_field = G.fields[opponent_player];

    let current_card = current_hand.find((i) => i.id === card_id);
    let target_card = opponent_field.find((i) => i.id === target_id);

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
        let i = current_hand.findIndex((x) => x.id === card_id);
        let remove1 = current_hand.splice(i, 1)[0];
        let j = opponent_field.findIndex((y) => y.id === target_id);
        let remove2 = opponent_field.splice(j, 1)[0];

        // let remove1 = current_hand.filter((i) => i.id === card_id)[0];
        // i have no fking idea why this doesnt work
        // let remove2 = opponent_field.filter((j) => j.id === target_id)[0];

        G.graveyard.push(remove1);
        G.graveyard.push(remove2);
        console.log(remove1.Value + " SCUTTLE " + remove2.Value);
        ctx.events.endTurn();
    } else {
        console.log("playCardScuttle error, scuttle failed");
        return INVALID_MOVE;
    }
    // console.log("playCardScuttle " + card.id);
}

/*
    card_id is the card_id played (as effect) by p0
    p0 is the player playing the card effect
    p1 is the player who has the option to accept/counter
*/
function playCardEffect(G, ctx, card_id, p0, p1) {
    console.log("playing card effect: ", p0);
    console.log("playing counter: ", p1);

    // push card into counter_chain
    G.counter_chain.push(card_id);
    // console.log(G.counter_chain);
    // let current_player = ctx.playOrder[ctx.playOrderPos];
    // let opponent_player =
    // ctx.playOrder[(ctx.playOrderPos + 1) % ctx.playOrder.length];
    // console.log(ctx.playOrder[ctx.playOrderPos]);

    /*
        do card effect processing
        ...
    */

    // set stage
    // ctx.events.setActivePlayers({
    //     value: {
    //         p0: "idle",
    //         p1: "effect",
    //     },
    // });
    ctx.events.setActivePlayers({ currentPlayer: "idle", others: "effect" });
}

// effect moves
function accept(G, ctx) {
    // this ends the turn of the CURRENT PLAYER
    // moves control flow to OTHER PLAYER
    ctx.events.endTurn();

    // remove everything in counter chain

    // then, turn ends, and onBegin SHOULD sets the stages on the new turn
}

/*
    p1 is countering the effect played by p0
*/
function counter(G, ctx, p0, p1) {
    // at this point, ctx.currentPlayer is STILL the player who played the FIRST effect, so we can't use that as a reference

    // check if have 2
    let hand = G.hands[p1];
    let index_of_two = hand.findIndex((x) => x.Value === "2");

    // alternatively, can search for 2 in Board and not allow counter button
    if (index_of_two === undefined) {
        console.log("no two");
    } else {
        // play as its own cardEffect
        // which is added to the counter_chain
        playCardEffect(G, ctx, hand[index_of_two].id, p1, p0);

        // remove 2
        // let remove = hand.splice(index_of_two, 1)[0];
        // G.graveyard.push(remove);
        // // remove effect card
        // console.log("used 2");
        // // at the end,
        // ctx.events.setActivePlayers({
        //     currentPlayer: "action",
        //     others: "idle",
        // });
    }

    // const values = hand.map((i) => i.Value);
    // // console.log(values);
    // if (!values.some((i) => i === "2")) {
    //     console.log("no two");
    // }
    // return symbols.every(i => i !== null && i === symbols[0]);
}
