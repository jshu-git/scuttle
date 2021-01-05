// action stage moves
// import { INVALID_MOVE } from "boardgame.io/core";

export function drawCard(G, ctx) {
    let player = G.players[ctx.currentPlayer];

    const card = G.deck.pop();
    player.hand.push(card);

    G.logger.push(player.name + " drew a card");
    ctx.events.endTurn();
}

export function playCardValue(G, ctx) {
    let player = G.players[ctx.currentPlayer];
    let card = player.selectedCard;

    let idx = player.hand.findIndex((i) => i.id === card.id);
    let remove = player.hand.splice(idx, 1)[0];
    player.field.push(remove);

    G.logger.push(player.name + " played <" + card.id + "> as value");
    ctx.events.endTurn();
}
