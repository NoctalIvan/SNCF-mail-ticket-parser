const assert = require('assert')
const fs = require('fs')

const parseTicket = require('./../parseTicket')

describe('Parser', function() {
  describe('Expample parsing', function() {
    it('should parse the ticket and return a specific JSON', function() {

      const ticket = fs.readFileSync(__dirname + '/mocks/test.html').toString()
      const expectedResult = JSON.parse(fs.readFileSync(__dirname + '/mocks/test-result.json'))
      const result = parseTicket(ticket)
  
      assert.deepStrictEqual(result, expectedResult);
    });
  });
});