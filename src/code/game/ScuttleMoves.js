// import { INVALID_MOVE } from "boardgame.io/core";
export function playCardScuttle(G, ctx) {
    ctx.events.setActivePlayers({
        currentPlayer: "choosingScuttle",
        others: "idle",
    });
}

export function chooseScuttleTarget(G, ctx, card, target) {
    let current_player = ctx.playOrder[ctx.playOrderPos];
    let opponent_player =
        ctx.playOrder[(ctx.playOrderPos + 1) % ctx.playOrder.length];

    let current_hand = G.hands[current_player];
    let opponent_field = G.fields[opponent_player];

    let current_card = current_hand.find((i) => i.id === card.id);
    let target_card = opponent_field.find((i) => i.id === target.id);

    // card logic
    let curr =
        current_card.Value === "Ace" ? "1" : parseInt(current_card.Value);
    let targ = target_card.Value === "Ace" ? "1" : parseInt(target_card.Value);

    if (parseInt(curr) >= parseInt(targ)) {
        let i = current_hand.findIndex((x) => x.id === card.id);
        let remove1 = current_hand.splice(i, 1)[0];
        let j = opponent_field.findIndex((y) => y.id === target.id);
        let remove2 = opponent_field.splice(j, 1)[0];

        // remove jack
        let jacks = G.jacks;
        if (jacks[target.id]) {
            let card = jacks[target.id][0];
            // let owner = jacks[target.id][1];
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

        G.logger.push(
            G.names[ctx.currentPlayer] +
                "used <" +
                card.id +
                ">" +
                " to scuttle <" +
                target.id +
                ">"
        );
        ctx.events.endTurn();
    } else {
        // reset stages
        ctx.events.setActivePlayers({
            currentPlayer: "action",
            others: "idle",
        });
    }
}
