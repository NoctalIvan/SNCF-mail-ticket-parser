## SNCF-mail-ticket-parser

This lib allow the parsing of a SNCF mail into an exploitable data JSON output

# Use

SNCF-mail-ticket-parser can be used:

- as a library, through imporing `parseTicket.js` as a function and calling it with an html string as single argument
- as a standalone, calling `main.js` from the cli

# Standalone execution guide
Prerequisite : Node V8.11.1 or above

```
git clone https://github.com/NoctalIvan/SNCF-mail-ticket-parser.git
cd SNCF-mail-ticket-parser
npm install
node main.js --input [html file path] --output [json file path]
``` 

# Help & Testing
- Tests can be run with mocha using `npm test`
- `main.js`' doc can be obtained with `npm run help`
- A html mock is available in `test/mocks/test.html`, use `npm run try` to run the script with it