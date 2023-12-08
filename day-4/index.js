import fs from 'fs';
import { parse } from 'path';

const input = fs.readFileSync('./input.txt', 'utf8'); 

const lines = input.split('\n');

let cards = [];
let solution1 = 0;
let solution2 = 0;

function createCard(line) {
    let card = {};
    card.id = parseInt(line.match(/(?!\Card)\d+(?=:)/g));
    card.winningNumbers = line.match(/(?<=:\s)[^|]+(?=\s\|)/)[0].trim().split(/\s+/).map(Number);
    card.numbers = line.match(/(?<=\|\s).+/)[0].trim().split(/\s+/).map(Number);
    card.matches = findMatches(card);
    card.points = pointsFromMatches(card.matches)
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

function pointsFromMatches(matches) {

    let points = matches > 0 ? 1 : 0;
    
    for (let i = 1; i < matches; i++) {
        points *= 2;
    }

    return points;
}

function part1(card) {
    let points = card.points;
    return solution1 += points;
}

function part2(cards) {
    const totalCopies = cards.reduce((total, card) => total + card.copies, 0);
    return solution2 = cards.length + totalCopies;
}

lines.forEach((line) => {
    let card = createCard(line);
    part1(card);
    cards.push(card);
});

cards.forEach(card => {
    card.copies = findCopies(cards, card.id);
    part2(cards);
});

console.log("Solution 1: ", solution1);
console.log("Solution 2: ", solution2);