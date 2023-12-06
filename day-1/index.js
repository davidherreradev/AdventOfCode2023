import fs from 'fs';

const input = fs.readFileSync('./input.txt', 'utf8');

const lines = input.split('\n');

let sum1 = 0;
let sum2 = 0;

const digits = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const wordToInt = digits.reduce((acc, w, i) => ({...acc, [w]: i + 1}), {});

const convertToInt = (s) => {
  if (digits.includes(s)) return wordToInt[s];
  else return Number.parseInt(s);
}

const getValue = (pattern, line) => {
  const matches = [...line.matchAll(pattern)];
  if (matches.length > 0) {
    const fnum = convertToInt(matches[0][1]);
    const lnum = convertToInt(matches[matches.length - 1][1]);
    return fnum * 10 + lnum;
  }
  return 0
}

const re1 = /(\d)/g
const re2 = /(?=(\d|one|two|three|four|five|six|seven|eight|nine))/g
lines.forEach((line) => {
  const cv1 = getValue(re1, line);
  const cv2 = getValue(re2, line);
  sum1 += cv1;;
  sum2 += cv2
})

console.log("Part 1 Sum", sum1)
console.log("Part 2 Sum", sum2)

