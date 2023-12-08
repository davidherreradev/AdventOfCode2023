import fs from 'fs';

const input = fs.readFileSync('./input.txt', 'utf8'); 

const lines = input.split('\n');

let cards = [];
let solution1 = 0;
let solution2 = 0;

function createCard(line) {
    let card = {};
    card.id = parseInt(line.match(/(?!\Card)\d+(?=:)/));
    card.winningNumbers = line.match(/(?<=:\s)[^|]+(?=\s\|)/)[0].trim().split(/\s+/).map(Number);
    card.numbers = line.match(/(?<=\|\s).+/)[0].trim().split(/\s+/).map(Number);
    card.matches = findMatches(card);
    card.points = calcPoints(card.matches)
    return card;
}

function findMatches(card) {
    let matches = 0;
    card.numbers.forEach((number) => {
        if (card.winningNumbers.includes(number)) {
            matches++;
        }
    });
    return matches;
}

function findCopies(cards, cardId) {
    let card = cards.find(card => card.id === cardId);
    if (!card || card.matches === 0) {
        return 0;
    }

    let totalCopies = 0;
    for (let i = 1; i <= card.matches; i++) {
        let copyId = card.id + i;
        if (copyId <= cards.length) {
            totalCopies += 1 + findCopies(cards, copyId);
        }
    }

    return totalCopies;
}

function calcPoints(matches) {

    return matches > 0 ? (1 << (matches - 1)) : 0;
}

function totalCardAmount(cards) {
    const totalCopies = cards.reduce((total, card) => total + card.copies, 0);
    return solution2 = cards.length + totalCopies;
}

lines.forEach((line) => {
    let card = createCard(line);
    solution1 += card.points;
    cards.push(card);
});

cards.forEach(card => {
    card.copies = findCopies(cards, card.id);
});

totalCardAmount(cards);

console.log("Solution 1: ", solution1);
console.log("Solution 2: ", solution2);