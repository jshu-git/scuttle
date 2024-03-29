// action stage moves
// import { INVALID_MOVE } from "boardgame.io/core";

export function drawCard(G, ctx) {
    const card = G.deck.pop();
    G.hands[ctx.currentPlayer].push(card);
    ctx.events.endTurn();
}

export function playCardValue(G, ctx, card) {
    let hand = G.hands[ctx.currentPlayer];
    let field = G.fields[ctx.currentPlayer];

    let idx = hand.findIndex((i) => i.id === card.id);
    let remove = hand.splice(idx, 1)[0];
    field.push(remove);
    ctx.events.endTurn();
}