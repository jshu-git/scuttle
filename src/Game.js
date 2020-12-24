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

        // effect stuff
        counter_chain: [],
        effect_countered: false,
        effect_target_card_id: undefined,

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
function playCardEffect(G, ctx, playerEffect, card_id, effect_target_card_id) {
    // set the target card id
    G.effect_target_card_id = effect_target_card_id;

    // we don't remove card from hand here since counter also uses playCardEffect, and we don't know whose hand is playing
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
}

// effect moves
/*
    target_card_is is only used if the effect requires a target
*/
function accept(G, ctx) {
    let current_player = ctx.playOrder[ctx.playOrderPos];
    let opponent_player =
        ctx.playOrder[(ctx.playOrderPos + 1) % ctx.playOrder.length];
    let current_player_field = G.fields[current_player];
    let opponent_player_field = G.fields[opponent_player];
    let current_player_hand = G.hands[current_player];
    let opponent_player_hand = G.hands[opponent_player];

    // at this point, counter_chain[0] contains the effect card ID, the rest is just 2's
    let effectCard_id = G.counter_chain[0];
    // find and remove the card in current player's hand
    let idx = current_player_hand.findIndex((i) => i.id === effectCard_id);
    let remove = current_player_hand.splice(idx, 1)[0];
    G.graveyard.push(remove);

    switch (remove.Value) {
        case "Ace":
            for (let i = 0; i <= current_player_field.length; i++) {
                G.graveyard.push(current_player_field.pop());
            }
            for (let i = 0; i <= opponent_player_field.length; i++) {
                G.graveyard.push(opponent_player_field.pop());
            }
            break;
        case "2":
            // can only 2 special cards on the field
            break;
        case "3":
            console.log("reaching");
            let target_idx = G.graveyard.findIndex(
                (i) => i.id === G.effect_target_card_id
            );
            let found_card = G.graveyard.splice(target_idx, 1)[0];
            current_player_hand.push(found_card);
                
            break;
        default:
        // code block
    }

    // clear the counter_chain
    G.counter_chain = [];

    // reset effect_countered
    G.effect_countered = false;

    // this ends the turn of the CURRENT PLAYER, and moves control flow to OTHER PLAYER
    ctx.events.endTurn();
    // note: currentPlayerStage doesn't need to be updated
    // it will be immediately overwritten in the next playCardEffect

    // then, turn ends, and onBegin SHOULD sets the stages on the new turn
    // ctx.currentPlayer should be bound to who played the original effect card
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

        // toggle countered
        G.effect_countered = !G.effect_countered;

        // play as its own cardEffect
        // which is added to the counter_chain
        playCardEffect(G, ctx, G.currentPlayerStage, hand[index_of_two].id);

        // discard 2 from hand
        let remove = hand.splice(index_of_two, 1)[0];
        G.graveyard.push(remove);
    }
}
