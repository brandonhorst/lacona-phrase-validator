"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/** @jsx createElement */

var _laconaPhrase = require("lacona-phrase");

var Phrase = _laconaPhrase.Phrase;
var createElement = _laconaPhrase.createElement;

function substrings(inputString) {
  var splitOn = arguments[1] === undefined ? "" : arguments[1];

  var result = [];
  var inputs = inputString.split(splitOn);
  for (var i = 0; i < inputs.length; i++) {
    result.push(inputs.slice(0, i + 1).join(splitOn));
  }
  return result;
}

var Validator = (function () {
  function Validator() {
    _classCallCheck(this, Validator);
  }

  _prototypeProperties(Validator, null, {
    validate: {
      value: function validate(inputString, data, done) {
        var _this = this;

        if (inputString === "") {
          this.props["default"](function (err, suggestion) {
            if (err) return done(err);

            if (suggestion || suggestion === "") {
              data({ text: suggestion, value: suggestion });
            }
          });
        } else {
          substrings(inputString, this.props.splitOn).forEach(function (stringPart) {
            _this.props.validate(stringPart, function (err, isValid) {
              if (err) return done(err);
              if (isValid) data({ text: stringPart, value: stringPart });
            });
          });
        }
        done();
      },
      writable: true,
      configurable: true
    },
    getValue: {
      value: function getValue(result) {
        return result.value;
      },
      writable: true,
      configurable: true
    },
    describe: {
      value: function describe() {
        return createElement("value", { compute: this.validate.bind(this), id: "value",
          limit: this.props.limit, fuzzy: "none" });
      },
      writable: true,
      configurable: true
    }
  });

  return Validator;
})();

module.exports = Validator;

Validator.defaultProps = {
  "default": function _default(done) {
    done();
  },
  validate: function validate(input, done) {
    done(null, true);
  }
};