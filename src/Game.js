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

        // used to keep track of currentPlayer during a stage, similar to currentPlayer for a turn
        currentPlayerStage: undefined, // is overwritten whenever a cardeffect is played
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
    playerEffect is the player playing the card effect (a number)
    card_id is the card_id played (as effect) (by playerEffect)
    G.currentPlayerStage is the turn of the player who is ABOUT to counter/accept, aka the "opposite" of playerEffect
*/
function playCardEffect(G, ctx, card_id, playerEffect) {
    // push card into counter_chain
    G.counter_chain.push(card_id);

    // set player stage
    // this should point to who HAS THE OPTION TO COUNTER
    G.currentPlayerStage = 1 - playerEffect; // a number

    // set stage
    if (playerEffect === 0) {
        ctx.events.setActivePlayers({
            value: {
                0: "idle",
                1: "effect",
            },
        });
    } else {
        ctx.events.setActivePlayers({
            value: {
                0: "effect",
                1: "idle",
            },
        });
    }

    // but what about the effect?
    // how to determine whether or not to execute and discard?

    /*
        IF NOT COUNTERED (not sure how to check for this)
        do card effect processing
        ...
    */
    // discard the card from p0's hand
    // let hand = G.hands[p0];
    // let idx = hand.findIndex((i) => i.id === card_id);
    // let remove = hand.splice(idx, 1)[0];
    // G.graveyard.push(remove);
}

// effect moves
function accept(G, ctx) {
    // this ends the turn of the CURRENT PLAYER
    // moves control flow to OTHER PLAYER
    ctx.events.endTurn();
    // note: currentPlayerStage doesn't need to be updated
    // it will be immediately overwritten in the next playCardEffect



    G.counter_chain = [];

    // then, turn ends, and onBegin SHOULD sets the stages on the new turn

    // ctx.currentPlayer should be bound to who played the original effect card

    // let current_player = ctx.playOrder[ctx.playOrderPos];
    // let opponent_player =
    //     ctx.playOrder[(ctx.playOrderPos + 1) % ctx.playOrder.length];
}

function counter(G, ctx) {
    // at this point, ctx.currentPlayer is STILL the player who played the FIRST effect, so we can't use that as a reference
    // this is why we have to use our own G.currentPlayerStage

    // currentPlayerStage holds which player's "turn" of the stage is aka who has option to counter
    // check if this player has a 2
    let hand = G.hands[G.currentPlayerStage];
    let index_of_two = hand.findIndex((x) => x.Value === "2");
    // console.log("index of two is: ",index_of_two)

    // alternatively in Board, can search and not allow counter button
    if (index_of_two === -1) {
        console.log("no two, forced to accept");
    } else {
        console.log("have two");

        // play as its own cardEffect
        // which is added to the counter_chain
        playCardEffect(G, ctx, hand[index_of_two].id, G.currentPlayerStage);

        // discard 2 from hand
        let remove = hand.splice(index_of_two, 1)[0];
        G.graveyard.push(remove);
    }
}