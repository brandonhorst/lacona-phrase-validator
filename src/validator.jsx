/** @jsx createElement */
import {Phrase, createElement} from 'lacona-phrase'

function substrings(inputString, splitOn = '') {
  let result = []
  let inputs = inputString.split(splitOn)
  for (let i = 0; i < inputs.length; i++) {
    result.push(inputs.slice(0, i + 1).join(splitOn));
  }
  return result;
}

export default class Validator extends Phrase {
  validate(inputString, data, done) {
    if (inputString === '') {
      this.props.default((err, suggestion) => {
        if (err) return done(err)

        if (suggestion || suggestion === '') {
          data({text: suggestion, value: suggestion})
        }
      })
    } else {
      substrings(inputString, this.props.splitOn).forEach(stringPart => {
        this.props.validate(stringPart, (err, isValid) => {
          if (err) return done(err)
          if (isValid) data({text: stringPart, value: stringPart})
        })
      })
    }
    done()
  }

  getValue(result) {
    return result.value;
  }

  describe() {
    return <value compute={this.validate.bind(this)} id='value'
      limit={this.props.limit} fuzzy='none' />
  }
}
Validator.defaultProps = {
  default: function (done) { done(); },
  validate: function (input, done) { done(null, true); }
}
