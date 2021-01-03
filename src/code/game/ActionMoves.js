// action stage moves
// import { INVALID_MOVE } from "boardgame.io/core";

export function drawCard(G, ctx) {
    const card = G.deck.pop();
    G.hands[ctx.currentPlayer].push(card);

    G.logger.push(G.names[ctx.currentPlayer] + " drew a card");
    ctx.events.endTurn();
}

export function playCardValue(G, ctx, card) {
    console.log("reaching inside actionmove sbeing");
    let hand = G.hands[ctx.currentPlayer];
    let field = G.fields[ctx.currentPlayer];

    let idx = hand.findIndex((i) => i.id === card.id);
    let remove = hand.splice(idx, 1)[0];
    field.push(remove);

    G.logger.push(
        G.names[ctx.currentPlayer] + " played <" + card.id + "> as value"
    );
    ctx.events.endTurn();
    console.log("reaching inside actionmoves end");
    console.log("in moves hand", JSON.parse(JSON.stringify(hand)));
    console.log("in moves field", JSON.parse(JSON.stringify(field)));
}
