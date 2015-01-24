var lacona = require('lacona');
var substrings = require('lacona-util-phrasehelpers').substrings;

module.exports = lacona.createPhrase({
	name: 'lacona/validator',
	getDefaultProps: function () {
		return {
			default: function (done) { done(); },
			validate: function (input, done) { done(null, true); }
		};
	},
	validate: function (inputString, data, done) {
		var this_ = this;

		if (inputString === '') {
			this_.props.default(function (err, suggestion) {
				if (err) {
					return done(err);
				} else if (suggestion || suggestion === '') {
					data({text: suggestion, value: suggestion});
				}
			});
		} else {
			substrings(inputString, this.props.splitOn).forEach(function (stringPart) {
				this_.props.validate(stringPart, function (err, isValid) {
					if (err) {
						return done(err);
					} else if (isValid) {
						data({text: stringPart, value: stringPart});
					}
				});
			});
		}

		done();
	},
	getValue: function (result) {
		return result.value;
	},
	describe: function () {
		return lacona.value({
			compute: this.validate,
			id: 'value',
			limit: this.props.limit
		});
	}
});
