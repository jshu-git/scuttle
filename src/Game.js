import { INVALID_MOVE } from "boardgame.io/core";

export const TicTacToe = {
    setup: (ctx) => ({
        cells: Array(9).fill(null),
        deck: shuffle(createDeck()), // change to shuffle on setup later
        hands: {},
        fields: {},
        graveyard: [],
        // field0: [],
        // field1: [],
    }),

    turn: {
        moveLimit: 1,
    },

    phases: {
        // draw: {
        //     moves: { drawHands },
        //     start: true,
        //     next: "play",
        //     endIf: (G, ctx) => {
        //         return G.hand0.length === 4 && G.hand1.length === 5;
        //     },
        // },
        play: {
            onBegin: (G, ctx) => {
                drawHands(G, ctx);
                setFields(G, ctx);
            },
            moves: { clickCell, drawCard, playCard },
            start: true,
        },
    },

    // moves: {
    //     clickCell,
    //     shuffle,
    // },

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

// moves
// tutorial
function clickCell(G, ctx, id) {
    // validate
    if (G.cells[id] !== null || id < 0 || id > G.cells.length) {
        console.log("click cell error");
        return INVALID_MOVE;
    }
    G.cells[id] = ctx.currentPlayer;
}

function drawCard(G, ctx) {
    const card = G.deck.pop();
    G.hands[ctx.currentPlayer].push(card);
}

// currently either (1) removes card or (2) add to field
function playCard(G, ctx, id) {
    let hand = G.hands[ctx.currentPlayer];
    let field = G.fields[ctx.currentPlayer];

    if (id == null || id < 0 || id >= hand.length) {
        console.log("playcard error");
        return INVALID_MOVE;
    }
    console.log("playCard " + hand[id].Value + " " + hand[id].Suit);

    // remove 1 element at index 'id' (remove from hand)
    // let remove = hand.splice(id, 1)[0];
    // console.log(remove);

    // remove from hand and add to field
    let remove = hand.splice(id, 1)[0];
    field.push(remove);
}

// helpers
function drawHands(G, ctx) {
    G.hands[ctx.playOrder[ctx.playOrderPos]] = [];
    G.hands[ctx.playOrder[ctx.playOrderPos + 1]] = [];

    for (let i = 0; i < 4; i++) {
        const card = G.deck.pop();
        G.hands[ctx.playOrder[ctx.playOrderPos]].push(card);
    }

    for (let i = 0; i < 5; i++) {
        const card = G.deck.pop();
        // still feels hacky, not sure of other way to access both players at once
        G.hands[ctx.playOrder[ctx.playOrderPos + 1]].push(card);
    }
}

function setFields(G, ctx) {
    G.fields[ctx.playOrder[ctx.playOrderPos]] = [];
    G.fields[ctx.playOrder[ctx.playOrderPos + 1]] = [];
}

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
            var card = { Value: values[x], Suit: suits[i], id: values[x] + suits[i] };
            deck.push(card);
        }
    }
    return deck;
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array/46545530#46545530
function shuffle(deck) {
    return deck
        .map((a) => ({ sort: Math.random(), value: a }))
        .sort((a, b) => a.sort - b.sort)
        .map((a) => a.value);
}
