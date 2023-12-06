import fs from 'fs';

const input = fs.readFileSync('./input.txt', 'utf8'); 

const lines = input.split('\r\n');
const matrix = lines.map(line => line.split('')); // create matrix from input
const symbolRegex = /[^\w\.\s]/g; //excluding periods for this puzzle
const digitRegex = /\d/g;
const starRegex = /\*/g;

let numbers = []; // numbers from matrix rows
let partNumbers = []; // numbers that are part numbers
let stars = []; // all stars in the matrix

let solution1 = 0;
let solution2 = 0;

// find all neighboring values of a cell
function findNeighborValues(x, y) {
    let neighbors = [];
    // check top
    if (matrix[x-1] && matrix[x-1][y]) {
        neighbors.push(matrix[x-1][y]);
    }
    // check top-right
    if (matrix[x-1] && matrix[x-1][y+1]) {
        neighbors.push(matrix[x-1][y+1]);
    }
    // check right
    if (matrix[x][y+1]) {
        neighbors.push(matrix[x][y+1]);
    }
    // check bottom-right
    if (matrix[x+1] && matrix[x+1][y+1]) {
        neighbors.push(matrix[x+1][y+1]);
    }
    // check bottom
    if (matrix[x+1] && matrix[x+1][y]) {
        neighbors.push(matrix[x+1][y]);
    }
    //check bottom-left
    if (matrix[x+1] && matrix[x+1][y-1]) {
        neighbors.push(matrix[x+1][y-1]);
    }
    // check left
    if (matrix[x][y-1]) {
        neighbors.push(matrix[x][y-1]);
    }
    // check top-left
    if (matrix[x-1] && matrix[x-1][y-1]) {
        neighbors.push(matrix[x-1][y-1]);
    }
    return neighbors;
}

// a gear's ratio is the product of it's part numbers
function gearRatio(partNum1, partNum2) {
    return partNum1 * partNum2;
}

// First, find all the stars
matrix.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
        if (cell === '*') {
            stars.push({ x: rowIndex, y: columnIndex });
        }
    });
});

// Then, process the numbers
matrix.forEach((row, rowIndex) => {
    let currentNumber = '';
    let currentDigits = [];
    row.forEach((cell, columnIndex) => {
        if (cell.match(digitRegex)) {
            currentNumber += cell;
            currentDigits.push({
                digit: parseInt(cell),
                x: rowIndex,
                y: columnIndex,
                neighboringValues: findNeighborValues(rowIndex, columnIndex) || []
            });
        } else if (currentNumber) {
            let star = stars.find(star => 
                currentDigits.some(digit => 
                    Math.abs(digit.x - star.x) <= 1 && Math.abs(digit.y - star.y) <= 1
                )
            );
            numbers.push({
                number: parseInt(currentNumber),
                digits: currentDigits,
                star: star || null
            });
            currentNumber = '';
            currentDigits = [];
        }
    });
    if (currentNumber) {
        let star = stars.find(star => 
            currentDigits.some(digit => 
                Math.abs(digit.x - star.x) <= 1 && Math.abs(digit.y - star.y) <= 1
            )
        );
        numbers.push({
            number: parseInt(currentNumber),
            digits: currentDigits,
            star: star || null
        });
    }
});

// check if any of the digits in a number have a neighboring value that is a symbolRegex
numbers.forEach(number => {
    let isValid = number.digits.some(digit => {
        return digit.neighboringValues.some(value => {
            return symbolRegex.test(value);
        });
    });
    if (isValid) {
        partNumbers.push({
            number: number.number,
            star: number.star // coordinates of the star that neighbors this number
        });
    }
});

// check if part numbers have matching stars, if so add that star to gears array
let tempGears = partNumbers.reduce((acc, item) => {
    if (item.star) {
        let key = `${item.star.x}-${item.star.y}`;
        if (!acc[key]) {
            acc[key] = {
                star: item.star,
                partNumbers: []
            };
        }
        acc[key].partNumbers.push(item.number);
    }
    return acc;
}, {});

let gears = Object.values(tempGears).filter(gear => gear.partNumbers.length > 1).map((gear, index) => ({
    gear: index + 1,
    ...gear
}));


let ratiodGears = gears.map(gear => ({
    ...gear,
    ratio: gearRatio(gear.partNumbers[0], gear.partNumbers[1])
}));

solution1 = partNumbers.reduce((acc, partNumber) => {
    return acc + partNumber.number;
}, 0);

solution2 = ratiodGears.reduce((acc, gear) => {
    return acc + gear.ratio;
}, 0);

console.log("Solution 1: ", solution1);
console.log("Solution 2: ", solution2);
