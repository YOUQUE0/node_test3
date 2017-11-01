var fortune = require('../lib/fortune.js');
var expect = require('chai').expect;

suite('Fortune cookie tests', function () {
	expect(typeof fortune.getFortune() === 'string');
});