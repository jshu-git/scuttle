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
            moves: {
                drawCard,
                playCardValue,
                playCardEffect,
                playCardScuttle,
            },
        },
    },
};

// moves
function drawCard(G, ctx) {
    const card = G.deck.pop();
    G.hands[ctx.currentPlayer].push(card);
}

// i is the index of the card in the current player's hand
function playCardValue(G, ctx, i) {
    let hand = G.hands[ctx.currentPlayer];
    let field = G.fields[ctx.currentPlayer];

    if (i == null || i < 0 || i >= hand.length) {
        console.log("playCardValue error");
        return INVALID_MOVE;
    }

    let card = hand[i];
    console.log("playCardValue " + card.id);
    // remove from hand and add to field
    let remove = hand.splice(i, 1)[0];
    field.push(remove);
}

function playCardScuttle(G, ctx, i, j) {
    // let current_hand = G.hands[ctx.currentPlayer];
    let current_player = ctx.playOrder[ctx.playOrderPos];
    let opponent_player =
        ctx.playOrder[(ctx.playOrderPos + 1) % ctx.playOrder.length];

    let current_hand = G.hands[current_player];
    let opponent_field = G.fields[opponent_player];

    let current_card = current_hand[i];
    let target_card = opponent_field[j];

    // can't use J/Q/K to scuttle
    if (
        current_card.Value === "Jack" ||
        current_card.Value === "Queen" ||
        current_card.Value === "King"
    ) {
        console.log("playCardScuttle error, attempt to scuttle with J/Q/K");
        return INVALID_MOVE;
    }

    // card logic
    var temp = current_card.Value;
    var temp2 = target_card.Value;
    if (temp === "Ace") {
        temp = "1";
    }
    if (temp2 === "Ace") {
        temp2 = "1";
    }
    if (parseInt(temp) >= parseInt(temp2)) {
        let remove1 = current_hand.splice(i, 1)[0];
        let remove2 = opponent_field.splice(j, 1)[0];
        G.graveyard.push(remove1);
        G.graveyard.push(remove2);
        console.log(remove1.Value + " SCUTTLE " + remove2.Value);
    } else {
        console.log("playCardScuttle error, scuttle failed");
        return INVALID_MOVE;
    }
    // console.log("playCardScuttle " + card.id);
}

// j is the index of the TARGET card in the OPPONENT's hand
function playCardEffect(G, ctx, i, j) {
    let hand = G.hands[ctx.currentPlayer];
    // let field = G.fields[ctx.currentPlayer];

    let card = hand[i];
    console.log("playCardEffect " + card.id);
}

// helpers
function drawHands(G, ctx) {
    let current = ctx.playOrder[ctx.playOrderPos];
    // wrap around end of playOrder arr
    let next = ctx.playOrder[(ctx.playOrderPos + 1) % ctx.playOrder.length];
    G.hands[current] = [];
    G.hands[next] = [];

    for (let i = 0; i < 4; i++) {
        const card = G.deck.pop();
        G.hands[current].push(card);
    }

    for (let i = 0; i < 5; i++) {
        const card = G.deck.pop();
        G.hands[next].push(card);
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
