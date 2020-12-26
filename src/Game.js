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

        // used to keep track of currentPlayer during a stage, similar to currentPlayer for a turn
        currentPlayerCounterStage: undefined, // is overwritten whenever a cardeffect is played
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
            choosing: {
                moves: {
                    playCardEffectWithTarget,
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

function playCardValue(G, ctx, card) {
    let hand = G.hands[ctx.currentPlayer];
    let field = G.fields[ctx.currentPlayer];

    let idx = hand.findIndex((i) => i.id === card.id);
    let remove = hand.splice(idx, 1)[0];
    field.push(remove);
    ctx.events.endTurn();
}

function playCardScuttle(G, ctx, card, target) {
    let current_player = ctx.playOrder[ctx.playOrderPos];
    let opponent_player =
        ctx.playOrder[(ctx.playOrderPos + 1) % ctx.playOrder.length];

    let current_hand = G.hands[current_player];
    let opponent_field = G.fields[opponent_player];

    let current_card = current_hand.find((i) => i.id === card.id);
    let target_card = opponent_field.find((i) => i.id === target.id);

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
        let i = current_hand.findIndex((x) => x.id === card.id);
        let remove1 = current_hand.splice(i, 1)[0];
        let j = opponent_field.findIndex((y) => y.id === target.id);
        let remove2 = opponent_field.splice(j, 1)[0];

        G.graveyard.push(remove1);
        G.graveyard.push(remove2);
        ctx.events.endTurn();
    } else {
        console.log("playCardScuttle error, scuttle failed");
        return INVALID_MOVE;
    }
}

/*
    currentPlayerActionStage is the player playing the card effect (a number)
    card_id is the card_id played (as effect) (by currentPlayerActionStage)
    G.currentPlayerCounterStage is the turn of the player who is ABOUT to counter/accept, aka the "opposite" of currentPlayerActionStage
*/
function playCardEffect(G, ctx, currentPlayerActionStage, card) {
    // push card into counter_chain
    G.counter_chain.push(card);

    // remove card from hand, it's now saved in counter_chain
    let hand = G.hands[currentPlayerActionStage];
    let idx = hand.findIndex((i) => i.id === card.id);
    let remove = hand.splice(idx, 1)[0];

    // special cards immediately go through
    if (["8", "Jack", "Queen", "King"].some((x) => card.Value === x)) {
        return accept(G, ctx);
    }

    // set player counter stage
    // this should point to who HAS THE OPTION TO COUNTER
    G.currentPlayerCounterStage = 1 - currentPlayerActionStage; // a number

    // set stage
    if (currentPlayerActionStage === 0) {
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

function accept(G, ctx) {
    // check if effect was countered
    if (G.effect_countered) {
        cleanup_counter_chain(G);
        ctx.events.endTurn();
        return;
    }

    let current_player = ctx.playOrder[ctx.playOrderPos];
    let opponent_player =
        ctx.playOrder[(ctx.playOrderPos + 1) % ctx.playOrder.length];
    let current_player_field = G.fields[current_player];
    let opponent_player_field = G.fields[opponent_player];
    let current_player_hand = G.hands[current_player];
    let opponent_player_hand = G.hands[opponent_player];

    // effect card is at [0]
    let card = G.counter_chain[0];

    // check if card effect requires target
    let no_target = ["Ace", "4", "5", "6", "8", "Queen", "King"].some(
        (x) => card.Value === x
    );

    if (no_target) {
        switch (card.Value) {
            // clear field
            case "Ace":
                console.log("reaching ace case");
            // while (current_player_field.length > 0) {
            //     G.graveyard.push(current_player_field.pop());
            // }
            // while (opponent_player_field.length > 0) {
            //     G.graveyard.push(opponent_player_field.pop());
            // }
            // break;
            // discard 2
            case "4":
                console.log("reaching 4 case");
                // if (opponent_player_hand.length === 0) {
                //     console.log("bm, no cards to discard");
                // } else if (opponent_player_hand.length === 1) {
                //     var discarded = opponent_player_hand.splice(0, 1)[0];
                //     console.log("discarded:", discarded.id);
                //     G.graveyard.push(discarded);
                // } else {
                //     for (var i = 0; i < 2; i++) {
                //         var discarded = opponent_player_hand.splice(
                //             Math.floor(
                //                 Math.random() * opponent_player_hand.length
                //             ),
                //             1
                //         )[0];
                //         console.log("discarded:", discarded.id);
                //         G.graveyard.push(discarded);
                //     }
                // }
                break;
            // draw 2
            case "5":
                console.log("reaching 5 case");
                // if (G.deck.length === 0) {
                //     console.log("no cards left in deck");
                // } else if (G.deck.length === 1) {
                //     current_player_hand.push(G.deck.pop());
                // } else {
                //     current_player_hand.push(G.deck.pop());
                //     current_player_hand.push(G.deck.pop());
                // }
                break;
            // clear all special cards
            case "6":
                console.log("reaching 6 case");
                break;
            case "8":
                console.log("reaching 8 case");
                break;
            case "Queen":
                console.log("reaching Q case");
                break;
            case "King":
                console.log("reaching K case");
                break;
            default:
                console.log("reaching default no_target");
                break;
        }
        cleanup_counter_chain(G);
        ctx.events.endTurn();
    } else {
        ctx.events.setActivePlayers({
            currentPlayer: "choosing",
            others: "idle",
        });
    }
}

// this is basically accept but there's a target
function playCardEffectWithTarget(G, ctx, target_card) {
    // same as before

    // check if effect was countered
    if (G.effect_countered) {
        cleanup_counter_chain(G);
        ctx.events.endTurn();
        return;
    }

    let current_player = ctx.playOrder[ctx.playOrderPos];
    let opponent_player =
        ctx.playOrder[(ctx.playOrderPos + 1) % ctx.playOrder.length];
    let current_player_field = G.fields[current_player];
    let opponent_player_field = G.fields[opponent_player];
    let current_player_hand = G.hands[current_player];
    let opponent_player_hand = G.hands[opponent_player];

    let card = G.counter_chain[0];

    switch (card.Value) {
        // can only 2 special card
        case "2":
            console.log("reaching 2 case");
            break;
        // search graveyard
        case "3":
            console.log("reaching 3 case");
            let target_idx = G.graveyard.findIndex(
                (i) => i.id === target_card.id
            );
            // this was failing because i didn't do [0]
            let found_card = G.graveyard.splice(target_idx, 1)[0];
            current_player_hand.push(found_card);
            break;
        // pick 1 of top 2 cards
        case "7":
            console.log("reaching 7 case");
            // retrieve top 2 cards
            let one = G.deck.pop();
            let two = G.deck.pop();
            console.log("one", one.id, "two", two.id);
            // check target
            if (target_card.id === one.id) {
                current_player_hand.push(one);
                G.deck.push(two);
            } else {
                current_player_hand.push(two);
                G.deck.push(one);
            }
            break;
        case "9":
            console.log("reaching 9 case");
            break;
        // not possible to play 10 as effect
        case "Jack":
            console.log("reaching jack case");
            break;
        default:
            console.log("reaching default yes target");
            break;
    }
    cleanup_counter_chain(G);
    ctx.events.endTurn();
}

// counter button only enabled if have 2 in hand, so no need to check again
function counter(G, ctx) {
    // at this point, ctx.currentPlayer is STILL the player who played the FIRST effect, so we can't use that as a reference
    // this is why we have to use our own G.currentPlayerCounterStage

    // currentPlayerCounterStage holds which player's "turn" of the stage is aka who has option to counter
    // check if this player has a 2
    let hand = G.hands[G.currentPlayerCounterStage];
    let index_of_two = hand.findIndex((x) => x.Value === "2");
    // console.log("index of two is: ",index_of_two)

    // toggle countered
    G.effect_countered = !G.effect_countered;

    // play as its own cardEffect
    // which is added to the counter_chain
    playCardEffect(G, ctx, G.currentPlayerCounterStage, hand[index_of_two]);

    // discarded in playCardEffect 2 from hand, added to counter_chain
}

function cleanup_counter_chain(G) {
    for (var i = 0; i < G.counter_chain.length; i++) {
        G.graveyard.push(G.counter_chain[i]);
    }
    G.counter_chain = [];

    // reset effect_countered
    G.effect_countered = false;
}
