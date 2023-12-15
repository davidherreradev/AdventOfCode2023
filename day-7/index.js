import fs from 'fs';

const hands = fs.readFileSync('./input.txt', 'utf8').split('\r\n')
                .map((hand) => {
                    const [cards, bid] = hand.split(' ');
                    return [cards.split(''), parseInt(bid)];
                });

const types = ['high card', 'one pair', 'two pair', 'three of a kind', 'full house', 'four of a kind', 'five of a kind'];

function getMatches(cards) {
    const counts = cards.reduce((acc, card) => ({ ...acc, [card]: (acc[card] || 0) + 1 }), {});
    return Object.entries(counts).filter(([card, count]) => count > 1).map(([card, count]) => ({ card, count }));
}

function assignType(cards, matches) {
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

function getCardValue(card, isPart2 = false) {
    if (isPart2 && card === 'J') {
        return 1;
    }
    return ' TJQKA'.indexOf(card) > 0 ? ' TJQKA'.indexOf(card) + 9 : parseInt(card);
}

function getRank(type) {
    return types.indexOf(type) + 1;
}

function rank(hands, isPart2 = false) {
    return hands.sort((hand1, hand2) => {
        let rank1 = getRank(hand1[2]);
        let rank2 = getRank(hand2[2]);

        if (rank1 === rank2) {
            for (let i = 0; i < hand1[0].length; i++) {
                let value1 = getCardValue(hand1[0][i], isPart2); // compare replaced card values by default
                let value2 = getCardValue(hand2[0][i], isPart2); // compare replaced card values by default

                if (hand1[3] && hand2[3]) {
                    // if original card values are available, use them for comparison
                    value1 = getCardValue(hand1[3][i], isPart2);
                    value2 = getCardValue(hand2[3][i], isPart2);
                }

                if (value1 !== value2) {
                    return value2 - value1;
                }
            }
        }

        return rank2 - rank1;
    });
}

function wildCardReRank(rankedHands) {
    const updatedHands = rankedHands.map(([cards, bid, type]) => {
        const originalCards = [...cards];
        const counts = cards.reduce((acc, card) => ({ ...acc, [card]: (acc[card] || 0) + 1 }), {});
        delete counts['J']; // remove Jokers from counts
        const mostOccurringCard = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, '2'); // default to '2' if no other cards

        const updatedCards = cards.map(card => card === 'J' ? mostOccurringCard : card);
        const updatedType = assignType(updatedCards, getMatches(updatedCards));

        return [updatedCards, bid, updatedType, originalCards]; // include original card values
    });

    const reRankedHands = rank(updatedHands, true);

    return reRankedHands;
}

// Part 1
function part1() {
    const handsWithMatches = hands.map(hand => [hand[0], hand[1], assignType(hand[0], getMatches(hand[0]))]);
    const rankedHands = rank(handsWithMatches);
    const totalWinningsPart = rankedHands.reduce((total, hand, index) => total + hand[1] * (rankedHands.length - index), 0);
    return console.log('Part 1:', totalWinningsPart);
}

function part2() {
    const handsWithMatches = hands.map(hand => [hand[0], hand[1], assignType(hand[0], getMatches(hand[0]))]);
    const rankedHands = rank(handsWithMatches);
    const reRankedHands = wildCardReRank(rankedHands);
    const totalWinningsPart = reRankedHands.reduce((total, hand, index) => total + hand[1] * (reRankedHands.length - index), 0);
    return console.log('Part 2:', totalWinningsPart);
}

part1();
part2();