/* standalone parseTicket.js wrapper */
const fs = require('fs')
const parseTicket = require('./parseTicket')

const commandLineArgs = require('command-line-args')
const options = commandLineArgs([
  { name: 'input', alias: 'i', type: String},
  { name: 'output', alias: 'o', type: String},
  { name: 'help', alias: 'h', type: Boolean},
])

if(process.argv.length == 2 || options.help){
  console.log('\n Definition:')
  console.log('   train ticket parser - html to json')
  console.log('\n Usage:')
  console.log('   node main.js -i/--input [input file] -o/--output [output file = output.json]')
  console.log('\n Example:')
  console.log('   node main.js -i "./test/mocks/test.html" -o "./testOutput.json')
  return
}

const inputPath = options.input
const outputPath = options.output || './output.json'

if(!inputPath) {
  console.log('Error: input should be defined. See help for list of options')
  return
}

const input = fs.readFileSync(inputPath).toString()
if(!input) {
  console.log('Error: could not read ' + inputPath)
  return
}

const output = parseTicket(input)
try{
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2))
  console.log("done - JSON has been exported to " + outputPath)
} catch (e) {
  console.log('Error: could not save to ' + outputPath)
}