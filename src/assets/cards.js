import { createDeck } from "../game/Setup.js";
let deck = createDeck();

export const CardImages = createImages(deck);

function createImages(deck) {
    let list = {};
    for (let card of deck) {
        switch (card.Value) {
            case "Ace":
                list[card.id] = require("./svgs/" +
                    1 +
                    card.Suit.charAt(0).toLowerCase() +
                    ".svg");
                break;
            case "Jack":
                list[card.id] = require("./svgs/" +
                    "j" +
                    card.Suit.charAt(0).toLowerCase() +
                    ".svg");
                break;

            case "Queen":
                list[card.id] = require("./svgs/" +
                    "q" +
                    card.Suit.charAt(0).toLowerCase() +
                    ".svg");
                break;
            case "King":
                list[card.id] = require("./svgs/" +
                    "k" +
                    card.Suit.charAt(0).toLowerCase() +
                    ".svg");
                break;
            default:
                list[card.id] = require("./svgs/" +
                    parseInt(card.Value) +
                    card.Suit.charAt(0).toLowerCase() +
                    ".svg");
                break;
        }
    }
    // console.log(list);
    list["hidden"] = require("./svgs/b.svg");
    return list;
}
