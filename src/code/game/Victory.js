function checkForVictory(G, ctx) {
    let player = G.players[ctx.playOrderPos];
    let opponent = G.players[(ctx.playOrderPos + 1) % ctx.playOrder.length];
    let hand = player.hand;
    let deck = G.deck;

    let points = player.field.map((x) => x.Point).reduce((a, b) => a + b, 0);
    let numKings = player.specialField.filter((x) => x.Value === "King").length;

    let win = points >= 21 - 7 * numKings;

    if (win) {
        G.winner = player.name;
        G.logger.push(player.name + " wins!");
    }

    let draw =
        deck.length === 0 &&
        (hand.every((i) => i.Value === "Jack") || hand.length === 0) &&
        opponent.hand.every(
            (i) => i.Value === "Jack" || opponent.hand.length === 0
        );
    if (draw) {
        G.winner = "draw";
    }
}

export { checkForVictory };
