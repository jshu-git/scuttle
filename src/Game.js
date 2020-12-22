import { INVALID_MOVE } from "boardgame.io/core";

export const TicTacToe = {
    setup: (ctx) => ({
        // cells: Array(9).fill(null),
        deck: shuffle(createDeck()), // change to shuffle on setup later
        hands: {},
        fields: {},
        graveyard: [],
    }),

    turn: {
        moveLimit: 1,
    },

    phases: {
        draw: {
            start: true,
            onBegin: (G, ctx) => {
                drawHands(G, ctx);
                setFields(G, ctx);
                // ctx.events.endPhase(); // this fails for some reason, so have to use endIf
            },
            next: "play",
            endIf: (G, ctx) => {
                return (
                    Object.keys(G.hands).length === 2 &&
                    Object.keys(G.fields).length === 2
                );
            },
        },
        play: {
            moves: { drawCard, playCardValue, playCardEffect, playCardScuttle },
        },
    },
};

// moves
function drawCard(G, ctx) {
    const card = G.deck.pop();
    G.hands[ctx.currentPlayer].push(card);
}

function playCardValue(G, ctx, i) {
    let hand = G.hands[ctx.currentPlayer];
    let field = G.fields[ctx.currentPlayer];

    if (i == null || i < 0 || i >= hand.length) {
        console.log("playcard error");
        return INVALID_MOVE;
    }

    let card = hand[i];
    console.log("playCardValue " + card.id);
    // remove from hand and add to field
    let remove = hand.splice(i, 1)[0];
    field.push(remove);
}

function playCardEffect(G, ctx, i, j) {
    let hand = G.hands[ctx.currentPlayer];
    // let field = G.fields[ctx.currentPlayer];

    let card = hand[i];
    console.log("playCardEffect " + card.id);
}

function playCardScuttle(G, ctx, i, j) {
    let hand = G.hands[ctx.currentPlayer];
    // let field = G.fields[ctx.currentPlayer];

    let card = hand[i];
    console.log("playCardScuttle " + card.id);
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
            var card = {
                Value: values[x],
                Suit: suits[i],
                id: values[x] + suits[i],
            };
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
