// playCardEffect moves
// countering and choosing stage
import { INVALID_MOVE, PlayerView } from "boardgame.io/core";

/*
    currentPlayerActionStage is the player playing the card effect
    G.currentPlayerCounterStage is the turn of the player who is ABOUT to counter/accept, aka the "opposite" of currentPlayerActionStage
*/
export function playCardEffect(G, ctx, currentPlayerActionStage, card) {
    // push card into counter_chain
    G.counter_chain.push(card);

    // safe to remove card from hand, it's now saved in counter_chain
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

export function accept(G, ctx) {
    // check if effect was countered
    if (G.effect_countered) {
        cleanup_counter_chain(G);
        ctx.events.endTurn();
        return;
    }

    // effect card is at counter_chain[0]
    // check if effect requires target
    let no_target = ["Ace", "4", "5", "6", "8", "Queen", "King"].some(
        (x) => G.counter_chain[0].Value === x
    );

    if (no_target) {
        // immediate card effect
        doEffect(G, ctx);
        // cleanup
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
export function chooseTarget(G, ctx, target_card) {
    // same as before

    // check if effect was countered
    if (G.effect_countered) {
        cleanup_counter_chain(G);
        ctx.events.endTurn();
        return;
    }

    // do targeting effect
    doEffectTarget(G, ctx, target_card);
    // cleanup
    cleanup_counter_chain(G);
    ctx.events.endTurn();
}

export function counter(G, ctx) {
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
}

// helpers
function doEffect(G, ctx) {
    let current_player = ctx.playOrder[ctx.playOrderPos];
    let opponent_player =
        ctx.playOrder[(ctx.playOrderPos + 1) % ctx.playOrder.length];
    let current_player_field = G.fields[current_player];
    let opponent_player_field = G.fields[opponent_player];
    let current_player_hand = G.hands[current_player];
    let opponent_player_hand = G.hands[opponent_player];
    let jacks = G.jacks;
    let graveyard = G.graveyard;

    let fields = G.fields;
    let card = G.counter_chain[0];
    let deck = G.deck;

    let current_player_special_field = G.special_fields[current_player];
    let opponent_player_special_field = G.special_fields[opponent_player];

    switch (card.Value) {
        // clear field
        case "Ace":
            console.log("reaching ace case");
            while (current_player_field.length > 0) {
                graveyard.push(current_player_field.pop());
            }
            while (opponent_player_field.length > 0) {
                graveyard.push(opponent_player_field.pop());
            }

            // clear jacks
            for (let id in jacks) {
                let card = jacks[id][0];
                let owner = jacks[id][1];
                let jacklist = jacks[id][2];

                //  add jacks to graveyard
                while (jacklist.length > 0) {
                    graveyard.push(jacklist.pop());
                }
                // clear key
                delete jacks[card.id];
            }

            break;
        // discard 2
        case "4":
            console.log("reaching 4 case");
            if (opponent_player_hand.length === 0) {
                console.log("bm, no cards to discard");
            } else if (opponent_player_hand.length === 1) {
                var discarded = opponent_player_hand.splice(0, 1)[0];
                graveyard.push(discarded);
            } else {
                for (var i = 0; i < 2; i++) {
                    var discarded = opponent_player_hand.splice(
                        Math.floor(Math.random() * opponent_player_hand.length),
                        1
                    )[0];
                    graveyard.push(discarded);
                }
            }
            break;
        // draw 2
        case "5":
            console.log("reaching 5 case");
            current_player_hand.push(deck.pop());
            current_player_hand.push(deck.pop());
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

            // no jacks
            if (Object.keys(jacks).length === 0) {
                console.log("no jacks on field");
                break;
            }

            for (let id in jacks) {
                let card = jacks[id][0];
                let owner = jacks[id][1];
                let jacklist = jacks[id][2];

                // the jacked card can only be in 1 of these fields
                if (
                    current_player_field.some(
                        (x) => card.id === x.id && owner !== current_player
                    )
                ) {
                    let idx = current_player_field.findIndex(
                        (x) => card.id === x.id && owner !== current_player
                    );
                    let remove = current_player_field.splice(idx, 1)[0];
                    opponent_player_field.push(remove);
                } else if (
                    opponent_player_field.some(
                        (x) => card.id === x.id && owner !== opponent_player
                    )
                ) {
                    let idx = opponent_player_field.findIndex(
                        (x) => card.id === x.id && owner !== current_player
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
}

function doEffectTarget(G, ctx, target_card) {
    let current_player = ctx.playOrder[ctx.playOrderPos];
    let opponent_player =
        ctx.playOrder[(ctx.playOrderPos + 1) % ctx.playOrder.length];
    let current_player_field = G.fields[current_player];
    let opponent_player_field = G.fields[opponent_player];
    let current_player_hand = G.hands[current_player];
    let opponent_player_hand = G.hands[opponent_player];
    let jacks = G.jacks;

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

            // remove from counter chain since it's going into jacks{}
            let jack = G.counter_chain.splice(0, 1)[0];

            // first time
            if (jacks[target_card.id] === undefined) {
                // set key=card.id and value=[card object, "owner", [list of jacks]] (2 element list)
                jacks[target_card.id] = [target_card, opponent_player, [jack]];
            } else {
                // let owner, list =
                jacks[target_card.id][2].push(jack);
            }
            // console.log(JSON.parse(JSON.stringify(jacks)));
            // remove from opponent side and add to your side
            let idx = opponent_player_field.findIndex(
                (i) => i.id === target_card.id
            );
            let remove = opponent_player_field.splice(idx, 1)[0];
            current_player_field.push(remove);
            break;
        default:
            console.log("reaching default yes target");
            break;
    }
}

// takes everything in counter chain and adds it to graveyard
function cleanup_counter_chain(G) {
    for (var i = 0; i < G.counter_chain.length; i++) {
        G.graveyard.push(G.counter_chain[i]);
    }
    G.counter_chain = [];

    // reset effect_countered
    G.effect_countered = false;
}
