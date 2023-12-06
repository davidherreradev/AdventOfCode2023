import fs from 'fs';

const input = fs.readFileSync('./input.txt', 'utf8'); 

const lines = input.split('\r\n');

const maxR = 12;
const maxG = 13;
const maxB = 14;

let solution1 = 0;
let solution2 = 0;

function createGameFromLine(line) {
    let game = {};
    game.id = parseInt(line.match(/Game (\d+):/)[1]);
    game.maxValues = {red: 0, green: 0, blue: 0};
    line.match(/(\d+ \w+)/g).forEach(value => {
        let [count, color] = value.split(' ');
        count = parseInt(count);
        game.maxValues[color] = Math.max(game.maxValues[color], count);
    });
    return game;
}

function puzzleCondition1(game) {
    if (game.maxValues.red <= maxR && game.maxValues.green <= maxG && game.maxValues.blue <= maxB) {
        solution1 += game.id;
    }
}

function puzzleCondition2(game) {
    solution2 += game.maxValues.red * game.maxValues.green * game.maxValues.blue;
}

lines.forEach((line) => {
    let game = createGameFromLine(line);
    
    puzzleCondition1(game);
    puzzleCondition2(game);
});

console.log("Solution 1: ", solution1);
console.log("Solution 2: ", solution2);