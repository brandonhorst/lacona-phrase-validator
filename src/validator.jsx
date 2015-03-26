/** @jsx createElement */
import {Phrase, createElement} from 'lacona-phrase'

function substrings (input, splitOn) {
  let result = []
  let inputs = input.split(splitOn)
  for (let i = 0; i < inputs.length; i++) {
    result.push(inputs.slice(0, i + 1).join(splitOn))
  }
  return result
}

export default class Validator extends Phrase {
  static get defaultProps () {
    return {
      suggest() {return []},
      validate() {return true},
      splitOn: ''
    }
  }

  *suggest () {
    for (let string of this.props.suggest()) {
      yield {suggestion: string, value: string}
    }
  }

  *validate (input) {
    for (let stringPart of substrings(input, this.props.splitOn)) {
      if (this.props.validate(stringPart)) {
        yield {
          words: [{text: stringPart, input: true}],
          value: stringPart,
          remaining: input.substring(stringPart.length)
        }
      }
    }
  }

  describe() {
    return <value compute={this.validate.bind(this)} suggest={this.suggest.bind(this)} limit={this.props.limit} />
  }
}
