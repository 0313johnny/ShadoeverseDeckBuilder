// This code is rewrite from https://www.geeksforgeeks.org/how-to-design-a-tiny-url-or-url-shortener
// The original code is contributed by gfgking.

//  charset="UTF-8"

//  Javascript program to encode Shadowverse cards' id
//  card id format contain five parts:
//  1. card packs (3 digits)
//  2. class (forestcraft, swordcraft, runecraft etc.)
//     0 = neutral
//     1 = forestcraft
//     2 = swordcraft
//     3 = runecraft
//     4 = dragoncraft
//     5 = shadowcraft
//     6 = bloodcraft
//     7 = heavencraft
//     8 = portalcraft
//  3. rarity (1 to 4 represent copper, silver, gold, and legendary in order)
//  4. type (1 to 4 represent follower, amulet, countable amulet, and spell in order)
//  5. serial (3 digits)

//  Encoding id using 64 characters including 0-9, A-Z, a-z ,'-' and '_'.
//  The algorithm is same as Radix64 but the mapping string is different.

function idToHash(n)
{
    // Map to store 64 possible characters
    let map = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";

    let hash = [];

    // Convert given integer id to a base 64 number
    while (n)
    {
        // use above map to store actual character
        // in short url
        hash.push(map[n % 64]);
        n = Math.floor(n / 64);
    }

    // Reverse hash to complete base conversion
    hash.reverse();

    return hash.join("");
}

// Function to get integer ID back from a card hash
function hashToID(hash) {
    let id = 0; // initialize result

    // A simple base conversion logic
    for (let i = 0; i < hash.length; i++) {
        if ('0' <= hash[i] && hash[i] <= '9')
            id = id * 64 + hash[i].charCodeAt(0) - '0'.charCodeAt(0);
        if ('A' <= hash[i] && hash[i] <= 'Z')
            id = id * 64 + hash[i].charCodeAt(0) - 'A'.charCodeAt(0) + 10;
        if ('a' <= hash[i] && hash[i] <= 'z')
            id = id * 64 + hash[i].charCodeAt(0) - 'a'.charCodeAt(0) + 36;
        if (hash[i] === '-')
            id = id * 64 + 62;
        if (hash[i] === '_')
            id = id * 64 + 63;
    }
    return id;
}

// gamemode
const GAMEMODE = {
    UNLIMITED: 1,
    "2PICK": 2,
    ROTATION: 3,
    OPEN6: 4,
    NORMAL: 1,
    CROSS_OVER: 6
};

const DECK_CLASS = {
    NEUTRAL: 0,
    FORESTCRAFT: 1,
    SQORDCRAFT: 2,
    RUNECRAFT: 3,
    DRAGONCRAFT: 4,
    SHADOWCRAFT: 5,
    BLOODCRAFT: 6,
    HEAVENCRAFT: 7,
    PORTALCRAFT: 8
};

// TODO: 將參數優化為單一object
// Function to generate deck URL
function createDeckURL(gamemode, deckClass, cardIDArr, lang)
{
    let path = "https://shadowverse-portal.com/deck/";

    //  hash the card ID
    cardIDArr.forEach(function(card, index) {
        cardIDArr[index] = idToHash(card);
    });

    let cardIdStr = cardIDArr.join(".");
    let url = `${path}${gamemode}.${deckClass}.${cardIdStr}?lang=${lang}`;

    return url;
}

// Function to scrap card id from deck URL
// return a deck object
function getDeckFromURL(url)
{
    const removedPart = "https://shadowverse-portal.com/deck/";
    const result = url.replace(removedPart, "");

    // example: 3.8.7S8Aw.7S8Aw.7ePaY.7ePaY.7ePaY.......
    // 3 = gamemode, 8 = class, others = cards and language
    let parts = result.split(".");
    let gamemode  = parts[0];
    let deckClass = parts[1];
    let cards     = parts.slice(2);

    // get language from last card's string
    splittedInfo = cards[39].split("?lang=");
    cards[39]    = splittedInfo[0];
    let language = splittedInfo[1];

    // decoding card hash
    cards.forEach(function(card, index) {
        cards[index] = hashToID(card);
    });

    let deck = {
        gamemode: gamemode,
        deckClass: deckClass,
        lang: language,
        cards: cards
    }

    return deck;
}
