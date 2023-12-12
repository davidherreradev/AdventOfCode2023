import fs from 'fs';

const input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

const times = input[0].split(/\s+/).splice(1);
const distances = input[1].split(/\s+/).splice(1);

function calcWinningTimes(time, distance) {
    let winningTimes = [];


    for (let i = 0; i < time; i++) {
        let buttonHold = i;
        let remainingTime = time - buttonHold;

        if(remainingTime * buttonHold > distance) {
            winningTimes.push(i);
        }
    }
    return winningTimes;
}

function calcMarginOfError(allWinningTimes) {
    let margins = [];
    for (let i = 0; i < allWinningTimes.length; i++) {
        margins.push(allWinningTimes[i].length);
    }
    
    return margins.reduce((a, b) => a * b); 
}

function part1() {
    let allWinningTimes = [];
    for (let i = 0; i < times.length; i++) {
        allWinningTimes.push(calcWinningTimes(times[i], distances[i]));
    }
    
    console.log("Solution 1: " + calcMarginOfError(allWinningTimes));   
}

function part2() {
    const realTimes = times.join('');
    const realDistances = distances.join('');
    let allWinningTimes = [];
    allWinningTimes.push(calcWinningTimes(realTimes, realDistances));
    
    console.log("Solution 1: " + calcMarginOfError(allWinningTimes));
}

part1();
part2();