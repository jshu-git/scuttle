import { INVALID_MOVE } from "boardgame.io/core";

export const TicTacToe = {
    setup: () => ({
        cells: Array(9).fill(null),
        deck: createDeck(),
    }),

    turn: {
        moveLimit: 1,
    },

    moves: {
        clickCell: (G, ctx, id) => {
            // validate
            if (G.cells[id] !== null || id < 0 || id > G.cells.length) {
                console.log(INVALID_MOVE);
                return INVALID_MOVE;
            }
            G.cells[id] = ctx.currentPlayer;
        },

        shuffle: (G, ctx) => {
            G.deck = shuffleDeck(G.deck);
        },
    },

    // victory condition
    endIf: (G, ctx) => {
        if (IsVictory(G.cells)) {
            return { winner: ctx.currentPlayer };
        }
        if (IsDraw(G.cells)) {
            return { draw: true };
        }
    },
};

// helpers
function IsVictory(cells) {
    const positions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    const isRowComplete = (row) => {
        const symbols = row.map((i) => cells[i]);
        return symbols.every((i) => i !== null && i === symbols[0]);
    };

    return positions.map(isRowComplete).some((i) => i === true);
}

function IsDraw(cells) {
    return cells.filter((c) => c === null).length === 0;
}

// https://www.thatsoftwaredude.com/content/6196/coding-a-card-deck-in-javascript
function createDeck() {
    var suits = ["Spades", "Diamonds", "Clubs", "Hearts"];
    var values = [
        "Ace",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "Jack",
        "Queen",
        "King",
    ];
    var deck = [];
    for (var i = 0; i < suits.length; i++) {
        for (var x = 0; x < values.length; x++) {
            var card = { Value: values[x], Suit: suits[i] };
            deck.push(card);
        }
    }
    return deck;
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array/46545530#46545530
function shuffleDeck(deck) {
    return deck
        .map((a) => ({ sort: Math.random(), value: a }))
        .sort((a, b) => a.sort - b.sort)
        .map((a) => a.value);
}
