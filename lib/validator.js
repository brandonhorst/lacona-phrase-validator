"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/** @jsx createElement */

var _laconaPhrase = require("lacona-phrase");

var Phrase = _laconaPhrase.Phrase;
var createElement = _laconaPhrase.createElement;

var split = _interopRequire(require("smart-split"));

function* substrings(input, splitOn) {
  var inputs = split(input, splitOn);
  for (var i = 0; i < inputs.length; i += 2) {
    yield inputs.slice(0, i + 1).join("");
  }
}

var Validator = (function (_Phrase) {
  function Validator() {
    _classCallCheck(this, Validator);

    if (_Phrase != null) {
      _Phrase.apply(this, arguments);
    }
  }

  _inherits(Validator, _Phrase);

  _createClass(Validator, {
    validate: {
      value: function* validate(input) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = substrings(input, this.props.splitOn)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var stringPart = _step.value;

            if (this.props.validate(stringPart)) {
              yield {
                words: [{ text: stringPart, input: true }],
                value: stringPart,
                remaining: input.substring(stringPart.length)
              };
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"]) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    },
    describe: {
      value: function describe() {
        return createElement("value", { compute: this.validate.bind(this), limit: this.props.limit });
      }
    }
  }, {
    defaultProps: {
      get: function () {
        return {
          validate: function validate() {
            return true;
          },
          splitOn: ""
        };
      }
    }
  });

  return Validator;
})(Phrase);

module.exports = Validator;