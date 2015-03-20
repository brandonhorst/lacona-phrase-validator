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
      *default() {},
      validate() {return true},
      splitOn: ''
    }
  }

  *validate (input) {
    if (input === '') {
      for (let suggestion of this.props.default()) {
        yield {text: suggestion, value: suggestion}
      }
    } else {
      for (let stringPart of substrings(input, this.props.splitOn)) {
        if (this.props.validate(stringPart)) {
          yield {text: stringPart, value: stringPart}
        }
      }
    }
  }

  describe() {
    return <value compute={this.validate.bind(this)} limit={this.props.limit} fuzzy='none' />
  }
}
