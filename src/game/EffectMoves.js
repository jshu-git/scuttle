// playCardEffect moves
// countering and choosing stage
import { INVALID_MOVE, PlayerView } from "boardgame.io/core";

/*
    currentPlayerActionStage is the player playing the card effect
    G.currentPlayerCounterStage is the turn of the player who is ABOUT to counter/accept, aka the "opposite" of currentPlayerActionStage
*/
export function playCardEffect(G, ctx, currentPlayerActionStage, card) {
    // push card into counterChain
    G.counterChain.push(card);

    // safe to remove card from hand, it's now saved in counterChain
    let hand = G.hands[currentPlayerActionStage];
    let idx = hand.findIndex((i) => i.id === card.id);
    // let remove = hand.splice(idx, 1)[0];
    hand.splice(idx, 1);

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
                1: "countering",
            },
        });
    } else {
        ctx.events.setActivePlayers({
            value: {
                0: "countering",
                1: "idle",
            },
        });
    }
}

export function counter(G, ctx) {
    // at this point, ctx.currentPlayer is STILL the player who played the FIRST effect, so we can't use that as a reference
    // this is why we have to use our own G.currentPlayerCounterStage

    // currentPlayerCounterStage holds which player's "turn" of the stage is aka who has option to counter
    // check if this player has a 2
    let hand = G.hands[G.currentPlayerCounterStage];
    let twoIndex = hand.findIndex((x) => x.Value === "2");
    // console.log("index of two is: ",twoIndex)

    // toggle countered
    G.effectCountered = !G.effectCountered;

    // play as its own cardEffect
    // which is added to the counterChain
    playCardEffect(G, ctx, G.currentPlayerCounterStage, hand[twoIndex]);
}

export function accept(G, ctx) {
    // check if effect was countered
    if (G.effectCountered) {
        cleanupCounterChain(G);
        ctx.events.endTurn();
        return;
    }

    // effect card is at counterChain[0]
    // check if effect requires target
    let no_target = ["Ace", "4", "5", "6", "8", "Queen", "King"].some(
        (x) => G.counterChain[0].Value === x
    );

    if (no_target) {
        // immediate card effect
        doEffect(G, ctx);
        // cleanup
        cleanupCounterChain(G);
        ctx.events.endTurn();
    } else {
        ctx.events.setActivePlayers({
            currentPlayer: "choosingEffect",
            others: "idle",
        });
    }
}

function doEffect(G, ctx) {
    let current_player = ctx.playOrder[ctx.playOrderPos];
    let opponent_player =
        ctx.playOrder[(ctx.playOrderPos + 1) % ctx.playOrder.length];
    let current_player_hand = G.hands[current_player];
    let opponent_player_hand = G.hands[opponent_player];
    let current_player_field = G.fields[current_player];
    let opponent_player_field = G.fields[opponent_player];
    let current_player_special_field = G.specialFields[current_player];
    let opponent_player_special_field = G.specialFields[opponent_player];

    let jacks = G.jacks;
    let graveyard = G.graveyard;
    let fields = G.fields;
    let deck = G.deck;

    let card = G.counterChain[0];

    switch (card.Value) {
        // clear field
        case "Ace":
            console.log("reaching ace case");
            // while (current_player_field.length > 0) {
            //     graveyard.push(current_player_field.pop());
            // }
            // while (opponent_player_field.length > 0) {
            //     graveyard.push(opponent_player_field.pop());
            // }

            // // clear jacks
            // for (let id in jacks) {
            //     let card = jacks[id][0];
            //     let owner = jacks[id][1];
            //     let jacklist = jacks[id][2];

            //     //  add jacks to graveyard
            //     while (jacklist.length > 0) {
            //         graveyard.push(jacklist.pop());
            //     }
            //     // clear key
            //     delete jacks[card.id];
            // }
            break;
        // discard 2
        case "4":
            console.log("reaching 4 case");
            // if (opponent_player_hand.length === 0) {
            //     console.log("bm, no cards to discard");
            // } else if (opponent_player_hand.length === 1) {
            //     var discarded = opponent_player_hand.splice(0, 1)[0];
            //     graveyard.push(discarded);
            // } else {
            //     for (var i = 0; i < 2; i++) {
            //         var discarded = opponent_player_hand.splice(
            //             Math.floor(Math.random() * opponent_player_hand.length),
            //             1
            //         )[0];
            //         graveyard.push(discarded);
            //     }
            // }
            break;
        // draw 2
        case "5":
            console.log("reaching 5 case");
            // current_player_hand.push(deck.pop());
            // current_player_hand.push(deck.pop());
            break;
        // clear all special cards
        case "6":
            console.log("reaching 6 case");

            // clear special fields
            while (current_player_special_field.length > 0) {
                graveyard.push(current_player_special_field.pop());
            }
            while (opponent_player_special_field.length > 0) {
                graveyard.push(opponent_player_special_field.pop());
            }

            for (let id in jacks) {
                let card = jacks[id][0];
                let owner = jacks[id][1];
                let jacklist = jacks[id][2];

                // check the owner of each jack and see if they're in the correct field
                if (owner !== current_player) {
                    let idx = current_player_field.findIndex(
                        (x) => card.id === x.id
                    );
                    let remove = current_player_field.splice(idx, 1)[0];
                    opponent_player_field.push(remove);
                } else if (owner !== opponent_player) {
                    let idx = opponent_player_field.findIndex(
                        (x) => card.id === x.id
                    );
                    let remove = opponent_player_field.splice(idx, 1)[0];
                    current_player_field.push(remove);
                }

                //  add jacks to graveyard
                while (jacklist.length > 0) {
                    graveyard.push(jacklist.pop());
                }
                // clear key
                delete jacks[card.id];
            }
            break;
        // fall through
        case "8":
        case "Queen":
        case "King":
            console.log("reaching 8||Q||K case");
            // remove from counter chain
            let special = G.counterChain.splice(0, 1)[0];
            current_player_special_field.push(special);
            break;
        default:
            console.log("default case, something went wrong");
            break;
    }
}

// this is basically accept but there's a target
export function chooseEffectTarget(G, ctx, targetCard, targetField) {
    // don't have to check counter chain since that is checked at accept()

    // do targeting effect
    let valid = doEffectTarget(G, ctx, targetCard, targetField);
    // cleanup
    if (valid) {
        cleanupCounterChain(G);
        ctx.events.endTurn();
    } else {
        console.log("selected an invalid field");
    }
}

function doEffectTarget(G, ctx, targetCard, targetField) {
    let current_player = ctx.playOrder[ctx.playOrderPos];
    let opponent_player =
        ctx.playOrder[(ctx.playOrderPos + 1) % ctx.playOrder.length];
    let current_player_field = G.fields[current_player];
    let opponent_player_field = G.fields[opponent_player];
    let current_player_hand = G.hands[current_player];
    let opponent_player_hand = G.hands[opponent_player];
    let jacks = G.jacks;
    let graveyard = G.graveyard;
    let deck = G.deck;

    let card = G.counterChain[0];

    switch (card.Value) {
        // can only 2 special card
        case "2":
            console.log("reaching 2 case");
            break;
        // search graveyard
        case "3":
            console.log("reaching 3 case");
            // if (targetField !== "graveyard") {
            //     return false;
            // }
            // let target_idx = G.graveyard.findIndex(
            //     (i) => i.id === targetCard.id
            // );
            // // // this was failing because i didn't do [0]
            // let found_card = G.graveyard.splice(target_idx, 1)[0];
            // current_player_hand.push(found_card);
            break;
        // pick 1 of top 2 cards
        case "7":
            console.log("reaching 7 case");
            // if (targetField !== "7Field") {
            //     return false;
            // }

            // // retrieve top 2 cards
            // let one = G.deck.pop();
            // let two = G.deck.pop();
            // // console.log("one", one.id, "two", two.id);

            // // check target
            // if (targetCard.id === one.id) {
            //     current_player_hand.push(one);
            //     G.deck.push(two);
            // } else {
            //     current_player_hand.push(two);
            //     G.deck.push(one);
            // }
            break;
        case "9":
            console.log("reaching 9 case", targetField);
            if (
                targetField === "graveyard" ||
                targetField === "playerSpecialField"
            ) {
                return false;
            }

            // special fields
            if (targetField === "opponentSpecialField") {
                // do specialfield processing
            }
            // jack processing
            else {
                if (
                    targetField !== "opponentField" &&
                    targetField !== "playerField"
                ) {
                    return false;
                }

                if (!jacks[targetCard.id]) {
                    console.log("did not select a jacked card");
                    return false;
                }

                /*  steps:
                    1. 9 goes to graveyard and 1 jack goes to the top of deck
                    2. if that card now has no jacks on it, change its owner to current player
                    3. if the card is not on your field, add it your field. if it was already on your field, don't have to do anything
                */
                // begin step 1
                // 9 already goes into graveyard from counter chain cleanup
                // the targetCard should just be the card with jacks on it
                console.log(
                    "sanity check for 9",
                    targetCard.id,
                    jacks[targetCard.id][0].id
                );

                // let card = jacks[targetCard.id][0]; // this always stays the same
                let owner = jacks[targetCard.id][1];
                let jacklist = jacks[targetCard.id][2];

                // find 1 jack and put on top of deck
                let idx_jack = jacklist.findIndex((i) => i.Value === "Jack");
                let remove_jack = jacklist.splice(idx_jack, 1)[0];
                deck.push(remove_jack);

                // step 2
                // this effectively changes the owner to the current player (if jacklist === 0), because the next time this card is jacked, its owner will be set in jacks{}
                // in other words, the card just becomes a plain old card as if it was never jacked
                if (jacklist.length === 0) {
                    delete jacks[targetCard.id];
                }

                // step 3
                if (targetField === "opponentField") {
                    // remove from opponent and add card to your side
                    let idx = opponent_player_field.findIndex(
                        (i) => i.id === targetCard.id
                    );
                    let remove = opponent_player_field.splice(idx, 1)[0];
                    current_player_field.push(remove);
                }
            }

            // remember trying to 9 something in GY
            break;
        // not possible to play 10 as effect
        case "Jack":
            console.log("reaching jack case");
            if (targetField !== "opponentField") {
                return false;
            }

            // remove from counter chain since it's going into jacks{}
            let jack = G.counterChain.splice(0, 1)[0];

            // first time
            if (!jacks[targetCard.id]) {
                // set key=card.id and value=[card object, "owner", [list of jacks]] (2 element list)
                jacks[targetCard.id] = [targetCard, opponent_player, [jack]];
            } else {
                jacks[targetCard.id][2].push(jack);
            }

            // remove from opponent side and add to your side
            let idx = opponent_player_field.findIndex(
                (i) => i.id === targetCard.id
            );
            let remove = opponent_player_field.splice(idx, 1)[0];
            current_player_field.push(remove);
            break;
        default:
            console.log("default case, something went wrong");
            break;
    }
    return true;
}

// takes everything in counter chain and adds it to graveyard
// so if you need anything from counter chain for an effect, it has to be extracted first
function cleanupCounterChain(G) {
    for (var i = 0; i < G.counterChain.length; i++) {
        G.graveyard.push(G.counterChain[i]);
    }
    G.counterChain = [];

    // reset effectCountered
    G.effectCountered = false;
}
