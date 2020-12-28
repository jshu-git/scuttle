import { INVALID_MOVE } from "boardgame.io/core";
export function playCardScuttle(G, ctx) {
    ctx.events.setActivePlayers({
        currentPlayer: "choosingScuttle",
        others: "idle",
    });
}

// canTargetField is TRUE if player targeted in the correct field
export function chooseScuttleTarget(G, ctx, card, target) {
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

        // remove jack
        let jacks = G.jacks;
        if (jacks[target.id]) {
            let card = jacks[target.id][0];
            let owner = jacks[target.id][1];
            let jacklist = jacks[target.id][2];
            //  add jacks to graveyard
            while (jacklist.length > 0) {
                G.graveyard.push(jacklist.pop());
            }
            // clear key
            delete jacks[card.id];
        }

        G.graveyard.push(remove1);
        G.graveyard.push(remove2);
        ctx.events.endTurn();
    } else {
        console.log("playCardScuttle error, scuttle failed");
        return INVALID_MOVE;
    }
}
