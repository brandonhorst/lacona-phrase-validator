/** @jsx createElement */
import {createElement, Phrase} from 'lacona-phrase'
import es from 'event-stream'
import {expect} from 'chai'
import Validator from '..'
import {Parser} from 'lacona'
import fulltext from 'lacona-util-fulltext'

describe('validator', function () {
	var parser;

	beforeEach(function () {
		parser = new Parser();
	});

	describe('basic usage', function () {
		class Test extends Phrase {
			validateFunction(inputString, done) {
				done(null, inputString === 'validValue');
			}

			defaultFunction(done) {
				done(null, 'suggestion');
			}

			describe() {
				return <Validator validate={this.validateFunction}
					default={this.defaultFunction} id='test' />
			}
		}

		it('validates an input programmatically', function (done) {
			function callback(err, data) {
				expect(data).to.have.length(3);
				expect(fulltext.match(data[1].data)).to.equal('validValue');
				expect(data[1].data.result.test).to.equal('validValue');
				done();
			}

			parser.sentences = [<Test />];

			es.readArray(['validValue'])
				.pipe(parser)
				.pipe(es.writeArray(callback));
		});

		it('invalidates an input programmatically', function (done) {
			function callback(err, data) {
				expect(data).to.have.length(2);
				done();
			}

			parser.sentences = [<Test />];

			es.readArray(['invalidValue'])
				.pipe(parser)
				.pipe(es.writeArray(callback));
		});

		it('offers a suggestion', function (done) {
			function callback(err, data) {
				expect(data).to.have.length(3);
				expect(fulltext.suggestion(data[1].data)).to.equal('suggestion');
				expect(data[1].data.result.test).to.equal('suggestion');
				done();
			}

			parser.sentences = [<Test />];

			es.readArray([''])
				.pipe(parser)
				.pipe(es.writeArray(callback));
		});
	});

	describe('in sequence', function () {
		class Test extends Phrase {
			defaultFunction(done) {
				done(null, 'suggestion');
			}

			describe() {
				return (
					<sequence>
						<literal text='test' />
						<Validator default={this.defaultFunction} id='test' />
					</sequence>
				)
			}
		}

		it('offers a completion', function (done) {
			function callback(err, data) {
				expect(data).to.have.length(3);
				expect(fulltext.completion(data[1].data)).to.equal('suggestion');
				expect(data[1].data.result.test).to.equal('suggestion');
				done();
			}

			parser.sentences = [<Test />];

			es.readArray([''])
				.pipe(parser)
				.pipe(es.writeArray(callback));
		});

	});

	describe('splitOn', function () {
		class Test extends Phrase {
			defaultFunction(done) {
				done(null, '');
			}

			describe() {
				return (
					<sequence>
						<Validator splitOn=' ' id='test' />
						<Validator default={this.defaultFunction} />
					</sequence>
				)
			}
		}

		it('allows splits on strings', function (done) {
			function callback(err, data) {
				expect(data).to.have.length(5);
				expect(fulltext.match(data[1].data)).to.equal('anything goes here');
				expect(data[1].data.result.test).to.equal('anything');
				expect(fulltext.match(data[2].data)).to.equal('anything goes here');
				expect(data[2].data.result.test).to.equal('anything goes');
				expect(fulltext.match(data[3].data)).to.equal('anything goes here');
				expect(data[3].data.result.test).to.equal('anything goes here');
				done();
			}

			parser.sentences = [<Test />];

			es.readArray(['anything goes here'])
				.pipe(parser)
				.pipe(es.writeArray(callback));
		});
	});

	describe('defaults', function () {
		it('no validate always accepts', function (done) {
			function callback(err, data) {
				expect(data).to.have.length(3);
				expect(fulltext.match(data[1].data)).to.equal('anything');
				expect(data[1].data.result).to.equal('anything');
				done();
			}

			parser.sentences = [<Validator id='test' />];

			es.readArray(['anything'])
				.pipe(parser)
				.pipe(es.writeArray(callback));
		});

		it('no default suggests nothing', function (done) {
			function callback(err, data) {
				expect(data).to.have.length(2);
				done();
			}

			parser.sentences = [<Validator />];

			es.readArray([''])
				.pipe(parser)
				.pipe(es.writeArray(callback));
		});
	});
});
