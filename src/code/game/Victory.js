export function isVictory(G, ctx) {
    let player = ctx.currentPlayer;
    let field = G.fields[player];
    let specialField = G.specialFields[player];
    let points = field.map((x) => x.Point).reduce((a, b) => a + b, 0);
    let numKings = specialField.filter((x) => x.Value === "King").length;

    let ret = points >= 21 - 7 * numKings;

    return ret;
}

export function isDraw(G, ctx) {
    let player = ctx.playOrder[ctx.playOrderPos];
    let opponent = ctx.playOrder[(ctx.playOrderPos + 1) % ctx.playOrder.length];
    let hand = G.hands[player];
    let opponentHand = G.hands[opponent];
    let deck = G.deck;

    let ret =
        deck.length === 0 &&
        (hand.every((i) => i.Value === "Jack") || hand.length === 0) &&
        opponentHand.every(
            (i) => i.Value === "Jack" || opponentHand.length === 0
        );

    return ret;
}
