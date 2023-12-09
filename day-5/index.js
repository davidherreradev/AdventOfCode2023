import fs from 'fs';

const almanac = fs.readFileSync('./input.txt', 'utf8');
const seeds = almanac.split('\r\n')[0].split('seeds: ')[1].split(' ');
const maps = almanac.match(/map:\r\n(\d+ \d+ \d+(\r\n|$))*/gm)
              .map(map => map.split('\r\n').filter(i => i !== 'map:' && i !== ''));

// Precompute the ranges for each map
const precomputedRanges = maps.map(map => map.map(row => {
    const [destStart, srcStart, rangeLength] = row.split(' ').map(i => parseInt(i));
    return [[destStart, destStart + rangeLength - 1], [srcStart, srcStart + rangeLength - 1]];
}));

function calculateDestination(source, ranges) {
    for (const [destRange, srcRange] of ranges) {
        const [destStart, destEnd] = destRange;
        const [srcStart, srcEnd] = srcRange;

        if (source >= srcStart && source <= srcEnd) {
            return destStart + (source - srcStart);
        }
    }
    return source;
}

function processSeed(seed, ranges) {
    let result = parseInt(seed);
    ranges.forEach(range => {
        result = calculateDestination(result, range);
    });
    return result;
}

function findLowestLocation(seeds, ranges) {
    let minLocation = Infinity;
    seeds.forEach(seed => {
        const location = processSeed(seed, ranges);
        if (location < minLocation) {
            minLocation = location;
        }
    });
    return minLocation;
}

function findLowestLocationForRanges(seeds, ranges) {
    let minLocation = Infinity;

    for (let i = 0; i < seeds.length; i += 2) {
        const start = parseInt(seeds[i]);
        const count = parseInt(seeds[i + 1]);

        for (let j = 0; j < count; j++) {
            const seed = start + j;
            const location = processSeed(seed, ranges);
            if (location < minLocation) {
                minLocation = location;
            }
        }
    }

    return minLocation;
}

const part1Seeds = seeds.map(Number);
console.log(`Solution 1: ${findLowestLocation(part1Seeds, precomputedRanges)}`);

console.log(`Solution 2: ${findLowestLocationForRanges(seeds, precomputedRanges)}`);
