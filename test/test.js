var chai = require('chai');
var stream = require('stream');
var expect = chai.expect;

var validator = require('..');
var lacona = require('lacona');
var fulltext = require('lacona-util-fulltext');

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

	beforeEach(function () {
		parser = new lacona.Parser();
	});

	describe('basic usage', function () {
		var test;

		beforeEach(function() {
			test = lacona.createPhrase({
				name: 'test/test',
				validateFunction: function (inputString, done) {
					done(null, inputString === 'validValue');
				},
				defaultFunction: function (done) {
					done(null, 'suggestion');
				},
				describe: function () {
					return validator({
						validate: this.validateFunction,
						default: this.defaultFunction,
						id: 'test'
					});
				}
			});
		});

		it('validates an input programmatically', function (done) {
			function callback(data) {
				expect(data).to.have.length(3);
				expect(fulltext.match(data[1].data)).to.equal('validValue');
				expect(data[1].data.result.test).to.equal('validValue');
				done();
			}

			parser.sentences = [test()];

			toStream(['validValue'])
				.pipe(parser)
				.pipe(toArray(callback));
		});

		it('invalidates an input programmatically', function (done) {
			function callback(data) {
				expect(data).to.have.length(2);
				done();
			}

			parser.sentences = [test()];

			toStream(['invalidValue'])
				.pipe(parser)
				.pipe(toArray(callback));
		});

		it('offers a suggestion', function (done) {
			function callback(data) {
				expect(data).to.have.length(3);
				expect(fulltext.suggestion(data[1].data)).to.equal('suggestion');
				expect(data[1].data.result.test).to.equal('suggestion');
				done();
			}

			parser.sentences = [test()];

			toStream([''])
				.pipe(parser)
				.pipe(toArray(callback));
		});
	});

	describe('in sequence', function () {
		var test;

		beforeEach(function() {
			test = lacona.createPhrase({
				name: 'test/test',
				defaultFunction: function (done) {
					done(null, 'suggestion');
				},
				describe: function () {
					return lacona.sequence({children: [
						lacona.literal({text: 'test'}),
						validator({
							validate: this.validateFunction,
							default: this.defaultFunction,
							id: 'test'
						})
					]})
				}
			});
		});

		it('offers a completion', function (done) {
			function callback(data) {
				expect(data).to.have.length(3);
				expect(fulltext.completion(data[1].data)).to.equal('suggestion');
				expect(data[1].data.result.test).to.equal('suggestion');
				done();
			}

			parser.sentences = [test()];

			toStream([''])
				.pipe(parser)
				.pipe(toArray(callback));
		});

	});

	describe('splitOn', function () {
		var test;
		beforeEach(function () {
			test = lacona.createPhrase({
				name: 'test/test',
				describe: function () {
					return lacona.sequence({children: [
						validator({splitOn: /( )/, id: 'test'}),
						validator({default: function (done) { done(null, ''); }})
					]});
				}
			});
		});

		it('allows splits on regex', function (done) {
			function callback(data) {
				expect(data).to.have.length(5);
				expect(fulltext.match(data[1].data)).to.equal('anything goes here');
				expect(data[1].data.result.test).to.equal('anything');
				expect(fulltext.match(data[2].data)).to.equal('anything goes here');
				expect(data[2].data.result.test).to.equal('anything goes');
				expect(fulltext.match(data[3].data)).to.equal('anything goes here');
				expect(data[3].data.result.test).to.equal('anything goes here');
				done();
			}

			parser.sentences = [test()];

			toStream(['anything goes here'])
				.pipe(parser)
				.pipe(toArray(callback));
		});
	});

	describe('defaults', function () {
		var test;
		beforeEach(function() {
			test = lacona.createPhrase({
				name: 'test/test',
				describe: function () {
					return validator({
						id: 'test'
					});
				}
			});
		});

		it('no validate always accepts', function (done) {
			function callback(data) {
				expect(data).to.have.length(3);
				expect(fulltext.match(data[1].data)).to.equal('anything');
				expect(data[1].data.result.test).to.equal('anything');
				done();
			}

			parser.sentences = [test()];

			toStream(['anything'])
				.pipe(parser)
				.pipe(toArray(callback));
		});

		it('no default suggests nothing', function (done) {
			function callback(data) {
				expect(data).to.have.length(2);
				done();
			}

			parser.sentences = [test()];

			toStream([''])
				.pipe(parser)
				.pipe(toArray(callback));
		});
	});
});
