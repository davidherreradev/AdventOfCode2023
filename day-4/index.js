import fs from 'fs';
import { parse } from 'path';

const input = fs.readFileSync('./input.txt', 'utf8'); 

const lines = input.split('\n');

let solution1 = 0;
let solution2 = 0;

function createCardFromLine(line) {
    let card = {};
    card.id = line.match(/(?!\Card)\d+(?=:)/g);
    card.winningNumbers = line.match(/(?<=:\s)[^|]+(?=\s\|)/)[0].trim().split(/\s+/).map(Number);
    card.numbers = line.match(/(?<=\|\s).+/)[0].trim().split(/\s+/).map(Number);
    return card;
}

function checkCardForWinnings(card) {
    let matches = 0;
    card.numbers.forEach((number) => {
        if (card.winningNumbers.includes(number)) {
            matches++;
        }
    });

    let points = matches > 0 ? 1 : 0;
    
    for (let i = 1; i < matches; i++) {
        points *= 2;
    }

    return points;
}

function part1(points) {
    return solution1 += points;
}

lines.forEach((line) => {
    let card = createCardFromLine(line);
    part1(checkCardForWinnings(card));
});

console.log("Solution 1: ", solution1);