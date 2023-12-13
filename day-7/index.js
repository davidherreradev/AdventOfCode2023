import fs from 'fs';

const hands = fs.readFileSync('./input.txt', 'utf8').split('\r\n')
                .map((hand) => {
                    const [cards, bid] = hand.split(' ');
                    return [cards.split(''), bid];
                });

const types = ['high card', 'one pair', 'two pair', 'three of a kind', 'full house', 'four of a kind', 'five of a kind'];

function getMatches([cards]) {
    const counts = cards.reduce((acc, card) => ({ ...acc, [card]: (acc[card] || 0) + 1 }), {});
    return Object.entries(counts).filter(([card, count]) => count > 1).map(([card, count]) => ({ card, count }));
}

function assignType([cards, bid, matches]) {
    const totalMatches = matches.reduce((total, { count }) => total + count, 0);
    let type;

    if (totalMatches === 0) {
        type = types[0]; // high card
    } else if (totalMatches === 2 && matches.length === 1) {
        type = types[1]; // one pair
    } else if (totalMatches === 4 && matches.length === 2) {
        type = types[2]; // two pair
    } else if (totalMatches === 3 && matches.length === 1) {
        type = types[3]; // three of a kind
    } else if (totalMatches === 5 && matches.length === 2) {
        type = types[4]; // full house
    } else if (totalMatches === 4 && matches.length === 1) {
        type = types[5]; // four of a kind
    } else if (totalMatches === 5 && matches.length === 1) {
        type = types[6]; // five of a kind
    }

    return type;
}

function getCardValue(card) {
    return ' TJQKA'.indexOf(card) > 0 ? ' TJQKA'.indexOf(card) + 9 : parseInt(card);
}

function getRank(type) {
    return types.indexOf(type) + 1;
}

function rank(hands, part1, part2) {
    return hands.sort((hand1, hand2) => {
        let rank1 = getRank(hand1[3]);
        let rank2 = getRank(hand2[3]);

        if (rank1 === rank2) {
            for (let i = 0; i < hand1[0].length; i++) {
                let value1 = getCardValue(hand1[0][i]);
                let value2 = getCardValue(hand2[0][i]);

                if (value1 !== value2) {
                    return value1 - value2;
                }
            }
        }

        return rank1 - rank2;
    });
}

function getBestHand(hand) {
    const cards = [...hand[0]];
    const wildCardIndices = cards.reduce((indices, card, index) => {
        if (card === 'J') indices.push(index);
        return indices;
    }, []);

    if (wildCardIndices.length === 0) {
        return hand;
    }

    let bestHand = null;
    let bestType = null;

    const possibleCards = 'A23456789TJQK';
    const combinations = Math.pow(possibleCards.length, wildCardIndices.length);

    for (let i = 0; i < combinations; i++) {
        let combination = i;
        for (let j = 0; j < wildCardIndices.length; j++) {
            cards[wildCardIndices[j]] = possibleCards[combination % possibleCards.length];
            combination = Math.floor(combination / possibleCards.length);
        }

        const matches = getMatches([cards]);
        const type = assignType([cards, hand[1], matches]);
        if (!bestType || getRank(type) > getRank(bestType)) {
            bestHand = [cards, hand[1], matches, type];
            bestType = type;
        }
    }

    return bestHand;
}

function part1(hands) {
    const handsWithMatchesAndTypes = hands.map(hand => {
        const matches = getMatches(hand);
        return [...hand, matches, assignType([...hand, matches])];
    });
    const rankedHands = rank(handsWithMatchesAndTypes, true);
    return rankedHands.reduce((solution, [cards, bid], i) => solution + parseInt(bid) * (i + 1), 0);
}

function part2(hands) {
    const handsWithMatchesAndTypes = hands.map(hand => {
        const bestHand = getBestHand(hand);
        const matches = getMatches(bestHand);
        return [...bestHand, matches, assignType([...bestHand, matches])];
    });
    const rankedHands = rank(handsWithMatchesAndTypes, false, true);
    return rankedHands.reduce((solution, [cards, bid], i) => solution + parseInt(bid) * (i + 1), 0);
}

console.log('Solution 1: ' + part1(hands));
console.log('Solution 2: ' + part2(hands));