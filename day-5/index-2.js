
import timeIt from './timeIt.js'
import fs from 'fs'

function parseFile(textFile) {
  const text = fs.readFileSync(textFile, 'utf8')
  // parse the file at blank lines into groups of lines
  const lines = text.split(/\r?\n/)
  // create a group of elements splitted at each '' in the lines array
  const groups = lines.reduce((groups, line) => {
    if (line.length === 0) {
      groups.push([])
    } else {
      groups[groups.length - 1].push(line)
    }
    return groups
  }, [[]])
  return groups
}

function getSeeds(seedsLine) {
  let seeds = []
  seeds = seedsLine[0].split(' ').slice(1)
  seeds = seeds.map(Number)
  return seeds
}

function getSourceToDestMap(group) {
  let sourceDest = []
  group.slice(1).forEach(element => {
    let numbers = element.split(' ')
    numbers = numbers.map(Number)
    sourceDest.push(numbers)
  });
  return sourceDest
}

function convertToDest(seeds, sourceDestArrays) {
  let dests = []
  seeds.forEach(seed => {
    let val = seed
    let newVal = val
    sourceDestArrays.forEach(sourceDestArray => {
      newVal = val
      let stop = false
      sourceDestArray.forEach(sourceDest => {
        let dest = sourceDest[0]
        let source = sourceDest[1]
        let range = sourceDest[2]
        if (source <= val && val <= source + range && !stop) {
          newVal = val - source + dest
          stop = true
        }
      })
      val = newVal
    })
    dests.push(newVal)
  })
  return dests
}

function mapSeedsToLocations(seeds, groups) {
  let sourceDestArrays = []
  groups.slice(1).forEach(group => {
    sourceDestArrays.push(getSourceToDestMap(group))
  })
  let dests = convertToDest(seeds, sourceDestArrays)
  return dests
}

function answerPartOne() {
  const fileName = process.argv[2] ? process.argv[2] : "input.txt"
  const groups = parseFile(fileName)
  const seeds = getSeeds(groups[0])
  const locations = mapSeedsToLocations(seeds, groups)
  const min = Math.min(...locations)
  console.log(min)
}

console.log("Part one:")
const timedAnswerPartOne = timeIt(answerPartOne)
timedAnswerPartOne()

console.log()

function calcMinSeedsIfSeedsIsRange(seeds, groups) {
  let sourceDestArrays = []
  groups.slice(1).forEach(group => {
    sourceDestArrays.push(getSourceToDestMap(group))
  })
  let pairs = []
  for (let i = 0; i < seeds.length; i+=2) {
    pairs.push([seeds[i], seeds[i + 1]])
  }
  let answer = 1000000000000000
  pairs.forEach(pair => {
    console.log(pair)
    for(let i=pair[0]; i<=pair[0]+pair[1]-1; i++) {
      let variable = [i]

      answer = Math.min(answer, convertToDest(variable, sourceDestArrays)[0])
    }
  })
  return answer
}

function answerPartTwo() {
  const fileName = process.argv[2] ? process.argv[2] : "input.txt"
  const groups = parseFile(fileName)
  const seeds = getSeeds(groups[0])
  console.log(calcMinSeedsIfSeedsIsRange(seeds, groups))
}

console.log("Part two:")
const timedAnswerPartTwo = timeIt(answerPartTwo)
timedAnswerPartTwo()