// import { INVALID_MOVE } from "boardgame.io/core";
export function playCardScuttle(G, ctx) {
    ctx.events.setActivePlayers({
        currentPlayer: "choosingScuttle",
        others: "idle",
    });
}

export function chooseScuttleTarget(G, ctx, target) {
    let player = G.players[ctx.playOrderPos];
    let card = player.selectedCard;
    let opponent = G.players[(ctx.playOrderPos + 1) % ctx.playOrder.length];

    // card logic
    let currValue = card.Value === "Ace" ? "1" : parseInt(card.Value);
    let targValue = target.Value === "Ace" ? "1" : parseInt(target.Value);

    if (parseInt(currValue) >= parseInt(targValue)) {
        let i = player.hand.findIndex((x) => x.id === card.id);
        let remove1 = player.hand.splice(i, 1)[0];

        let j = opponent.field.findIndex((y) => y.id === target.id);
        let remove2 = opponent.field.splice(j, 1)[0];

        G.graveyard.push(remove1);
        G.graveyard.push(remove2);

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

        G.logger.push(
            player.name +
                " used <" +
                card.id +
                ">" +
                " to scuttle <" +
                target.id +
                ">"
        );
        ctx.events.endTurn();
    } else {
        G.logger.push(player.name + " failed their scuttle");
        player.selectedCard = false;
        // reset stages
        ctx.events.setActivePlayers({
            currentPlayer: "action",
            others: "idle",
        });
    }
}
