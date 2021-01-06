export const initializeGame = (goFirst, numPlayers) => {
    let deck = createDeck();
    shuffle(deck);

    // initialize players
    let players = [];
    for (let i = 0; i < numPlayers; i++) {
        var p = {
            id: i,
            name: "",
            hand: drawHand(deck, goFirst, i),
            field: [],
            specialField: [],
            selectedCard: false,
        };
        players.push(p);
    }

    return { deck, players };
};

function drawHand(deck, goFirst, id) {
    let temp = [];
    if (id === goFirst) {
        for (let i = 0; i < 4; i++) {
            const card = deck.pop();
            temp.push(card);
        }
    } else {
        for (let i = 0; i < 5; i++) {
            const card = deck.pop();
            temp.push(card);
        }
    }
    return temp;
}

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

export const shuffle = (arr) => {
    // shuffle deck (using Fisher-Yates algorithm, might've been overkill since deck is only ~20 at most)
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
};
