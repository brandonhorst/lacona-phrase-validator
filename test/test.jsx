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

	it('validates input', () => {
		function validate (input) {
			return input === 'validValue'
		}

		parser.sentences = [<Validator validate={validate} />]

		const data1 = from(parser.parse('validValue'))
		expect(data1).to.have.length(1)
		expect(fulltext.match(data1[0])).to.equal('validValue')
		expect(data1[0].result).to.equal('validValue')

		const data2 = from(parser.parse('invalidValue'))
		expect(data2).to.have.length(0)
	})

	it('no validate always accepts', () => {
		parser.sentences = [<Validator id='test' />]

		const data = from(parser.parse('anything'))
		expect(data).to.have.length(1)
		expect(fulltext.match(data[0])).to.equal('anything')
		expect(data[0].result).to.equal('anything')
	})

	it('allows splits on strings', () => {
		class Test extends Phrase {
			describe() {
				return (
					<sequence>
						<Validator splitOn=' ' id='validator' />
						<choice>
							<literal text=' test' />
							<literal text='thing' />
						</choice>
					</sequence>
				)
			}
		}

		parser.sentences = [<Test />]

		const data = from(parser.parse('anything goes test'))
		expect(data).to.have.length(3)
		expect(fulltext.all(data[0])).to.equal('anything goes test')
		expect(data[0].result.validator).to.equal('anything goes')
		expect(fulltext.all(data[1])).to.equal('anything goes test test')
		expect(data[1].result.validator).to.equal('anything goes test')
		expect(fulltext.all(data[2])).to.equal('anything goes testthing')
		expect(data[2].result.validator).to.equal('anything goes test')
	})

	it('allows splits on regex (with weird parens)', () => {
		class Test extends Phrase {
			describe() {
				return (
					<sequence>
						<Validator splitOn={/(( )())/} id='validator' />
						<choice>
							<literal text=' test' />
							<literal text='thing' />
						</choice>
					</sequence>
				)
			}
		}

		parser.sentences = [<Test />]

		const data = from(parser.parse('anything goes test'))
		expect(data).to.have.length(3)
		expect(fulltext.all(data[0])).to.equal('anything goes test')
		expect(data[0].result.validator).to.equal('anything goes')
		expect(fulltext.all(data[1])).to.equal('anything goes test test')
		expect(data[1].result.validator).to.equal('anything goes test')
		expect(fulltext.all(data[2])).to.equal('anything goes testthing')
		expect(data[2].result.validator).to.equal('anything goes test')
	})
})
