function checkForVictory(G, ctx) {
    let player = ctx.playOrder[ctx.playOrderPos];
    let opponent = ctx.playOrder[(ctx.playOrderPos + 1) % ctx.playOrder.length];
    let hand = G.hands[player];
    let opponentHand = G.hands[opponent];
    let deck = G.deck;
    let field = G.fields[player];
    let specialField = G.specialFields[player];
    let points = field.map((x) => x.Point).reduce((a, b) => a + b, 0);
    let numKings = specialField.filter((x) => x.Value === "King").length;
    let names = G.names;

    let win = points >= 21 - 7 * numKings;

    if (win) {
        G.winner = names[player];
        G.logger.push(names[player] + " wins!");
    }

    let draw =
        deck.length === 0 &&
        (hand.every((i) => i.Value === "Jack") || hand.length === 0) &&
        opponentHand.every(
            (i) => i.Value === "Jack" || opponentHand.length === 0
        );
    if (draw) {
        G.winner = "draw";
    }
}

export { checkForVictory };
