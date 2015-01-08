var chai = require('chai');
var stream = require('stream');
var expect = chai.expect;

var validator = require('..');
var Parser = require('lacona').Parser;

function toStream(strings) {
	var newStream = new stream.Readable({objectMode: true});

	strings.forEach(function (string) {
		newStream.push(string);
	});
	newStream.push(null);

	return newStream;
}

function toArray(done) {
	var newStream = new stream.Writable({objectMode: true});
	var list = [];
	newStream.write = function(obj) {
		list.push(obj);
	};

	newStream.end = function() {
		done(list);
	};

	return newStream;
}


describe('validator', function () {
	var parser;

	var grammar = {
		scope: {
			validateFunction: function (inputString, done) {
				done(null, inputString === 'validValue');
			},
			defaultFunction: function (done) {
				done(null, 'suggestion');
			}
		},
		phrases: [{
			name: 'test',
			root: {
				type: 'validator',
				validate: 'validateFunction',
				default: 'defaultFunction',
				id: 'test'
			}
		}],
		dependencies: [validator]
	};

	beforeEach(function () {
		parser = new Parser({sentences: ['test']});
	});

	it('validates an input programmatically', function (done) {
		function callback(data) {
			expect(data).to.have.length(3);
			expect(data[1].data.match[0].string).to.equal('validValue');
			expect(data[1].data.result.test).to.equal('validValue');
			done();
		}

		parser.understand(grammar);

		toStream(['validValue'])
			.pipe(parser)
			.pipe(toArray(callback));
	});

	it('invalidates an input programmatically', function (done) {
		function callback(data) {
			expect(data).to.have.length(2);
			done();
		}

		parser.understand(grammar);

		toStream(['invalidValue'])
			.pipe(parser)
			.pipe(toArray(callback));
	});

	it('offers a suggestion', function (done) {
		function callback(data) {
			expect(data).to.have.length(3);
			expect(data[1].data.suggestion.words[0].string).to.equal('suggestion');
			expect(data[1].data.result.test).to.equal('suggestion');
			done();
		}

		parser.understand(grammar);

		toStream([''])
			.pipe(parser)
			.pipe(toArray(callback));
	});
});
