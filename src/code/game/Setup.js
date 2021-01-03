export const initializeGame = (playOrder, playOrderPos) => {
    let deck = createDeck();

    shuffle(deck);

    let hands = drawHands(deck, playOrder, playOrderPos);
    let fields = setFields(playOrder, playOrderPos);
    let specialFields = setSpecialFields(playOrder, playOrderPos);
    return { deck, hands, fields, specialFields };
};

// also used for create images
export function createDeck() {
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
                Point:
                    values[x] === "Ace"
                        ? 1
                        : parseInt(values[x])
                        ? parseInt(values[x])
                        : 0,
            };
            deck.push(card);
        }
    }
    return deck;
}

function drawHands(deck, playOrder, playOrderPos) {
    let hands = {};

    let current = playOrder[playOrderPos];
    // wrap around end of playOrder arr
    let next = playOrder[(playOrderPos + 1) % playOrder.length];

    hands[current] = [];
    hands[next] = [];

    // randomize if else for loops with a random toggle, basically math.rnaomd 01, if 0 

    for (let i = 0; i < 4; i++) {
        const card = deck.pop();
        hands[current].push(card);
    }

    for (let i = 0; i < 5; i++) {
        const card = deck.pop();
        hands[next].push(card);
    }

    return hands;
}

export const shuffle = (arr) => {
    // shuffle deck (using Fisher-Yates algorithm, might've been overkill since deck is only ~20 at most)
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
};

function setFields(playOrder, playOrderPos) {
    let fields = {};

    let current = playOrder[playOrderPos];
    let next = playOrder[(playOrderPos + 1) % playOrder.length];

    fields[current] = [];
    fields[next] = [];
    return fields;
}

function setSpecialFields(playOrder, playOrderPos) {
    let specialFields = {};

    let current = playOrder[playOrderPos];
    let next = playOrder[(playOrderPos + 1) % playOrder.length];

    specialFields[current] = [];
    specialFields[next] = [];
    return specialFields;
}

