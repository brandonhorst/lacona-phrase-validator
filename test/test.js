var chai = require('chai');
var expect = chai.expect;
var validator = require('../lib/validator');
var sinon = require('sinon');
var Parser = require('lacona').Parser;

chai.use(require('sinon-chai'));

describe('validator', function () {
	var parser;

	var grammar = {
		scope: {
			validateFunction: function (inputString, done) {
				done(null, inputString === 'validValue');
			}
		},
		schema: {
			root: {
				type: 'validator',
				validate: 'validateFunction',
				id: 'test'
			},
			run: ''
		}
	};

	beforeEach(function () {
		parser = new Parser().understand(validator);
	});

	it('validates an input programmatically', function (done) {
		var handleData = sinon.spy(function (data) {
			expect(data.match[0].string).to.equal('validValue');
			expect(data.result.test).to.equal('validValue');
		});

		var handleEnd = function () {
			expect(handleData).to.have.been.called.once;
			done();
		};

		parser
		.understand(grammar)
		.on('data', handleData)
		.on('end', handleEnd)
		.parse('validValue');
	});

	it('invalidates an input programmatically', function (done) {
		var handleData = sinon.spy();

		var handleEnd = function () {
			expect(handleData).to.not.have.been.called;
			done();
		};

		parser
		.understand(grammar)
		.on('data', handleData)
		.on('end', handleEnd)
		.parse('invalidValue');
	});
});