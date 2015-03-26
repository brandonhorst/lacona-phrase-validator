/** @jsx createElement */
/* eslint-env mocha */
import {createElement, Phrase} from 'lacona-phrase'
import {expect} from 'chai'
import Validator from '..'
import {Parser} from 'lacona'
import fulltext from 'lacona-util-fulltext'

function from(i) {const a = []; for (let x of i) a.push(x); return a}

describe('validator', () => {
	var parser

	beforeEach(() => {
		parser = new Parser()
	})

	describe('basic usage', () => {
		class Test extends Phrase {
			validateFunction(input) {
				return input === 'validValue'
			}

			defaultFunction() {
				return ['suggestion']
			}

			describe() {
				return <Validator validate={this.validateFunction} suggest={this.defaultFunction}/>
			}
		}

		it('validates input', () => {
			parser.sentences = [<Test />]

			const data1 = from(parser.parse('validValue'))
			expect(data1).to.have.length(1)
			expect(fulltext.match(data1[0])).to.equal('validValue')
			expect(data1[0].result).to.equal('validValue')

			const data2 = from(parser.parse('invalidValue'))
			expect(data2).to.have.length(0)
		})

		it('offers a suggestion', () => {
			parser.sentences = [<Test />]

			const data = from(parser.parse(''))
			expect(data).to.have.length(1)
			expect(fulltext.suggestion(data[0])).to.equal('suggestion')
			expect(data[0].result).to.equal('suggestion')
		})
	})

	describe('in sequence', () => {
		class Test extends Phrase {
			*defaultFunction() {
				yield 'suggestion'
			}

			describe() {
				return (
					<sequence>
						<literal text='test' />
						<Validator suggest={this.defaultFunction} id='test' />
					</sequence>
				)
			}
		}

		it('offers a completion', () => {
			parser.sentences = [<Test />]

			const data = from(parser.parse(''))
			expect(data).to.have.length(1)
			expect(fulltext.suggestion(data[0])).to.equal('test')
			expect(fulltext.completion(data[0])).to.equal('suggestion')
			expect(data[0].result.test).to.equal('suggestion')
		})

	})

	describe('splitOn', () => {
		class Test extends Phrase {
			*defaultFunction() {
				yield ''
			}

			describe() {
				return (
					<sequence>
						<Validator splitOn=' ' id='test' />
						<Validator suggest={this.defaultFunction} />
					</sequence>
				)
			}
		}

		it('allows splits on strings', () => {
			parser.sentences = [<Test />]

			const data = from(parser.parse('anything goes here'))
			expect(data).to.have.length(3)
			expect(fulltext.match(data[0])).to.equal('anything goes here')
			expect(data[0].result.test).to.equal('anything')
			expect(fulltext.match(data[1])).to.equal('anything goes here')
			expect(data[1].result.test).to.equal('anything goes')
			expect(fulltext.match(data[2])).to.equal('anything goes here')
			expect(data[2].result.test).to.equal('anything goes here')
		})
	})

	describe('defaults', () => {
		it('no validate always accepts', () => {
			parser.sentences = [<Validator id='test' />]

			const data = from(parser.parse('anything'))
			expect(data).to.have.length(1)
			expect(fulltext.match(data[0])).to.equal('anything')
			expect(data[0].result).to.equal('anything')
		})

		it('no default suggests nothing', () => {
			parser.sentences = [<Validator />]
			const data = from(parser.parse(''))
			expect(data).to.be.empty
		})
	})
})
