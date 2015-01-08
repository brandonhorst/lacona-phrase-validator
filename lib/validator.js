var lutil = require('lacona-util');

module.exports = {
	scope: {
		validate: function (inputString, data, done) {
			var substrings;
			var stringPart;
			var i, l;

			function stringIsValid(err, isValid) {
				if (err) {
					return done(err);
				} else if (isValid) {
					data({
						display: stringPart,
						value: stringPart
					});
				}
			}

			if (inputString === '') {
				if (this.default) {
					this.$call(this.default, function (err, suggestion) {
						if (err) {
							return done(err);
						} else {
							data({
								display: suggestion,
								value: suggestion
							});
						}
					});
				}
			} else {
				if (this.validate) {
					substrings = lutil.substrings(inputString);
					for (i = 0, l = substrings.length; i < l; i++) {
						stringPart = substrings[i];

						this.$call(this.validate, stringPart, stringIsValid);
					}
				}
			}

			done();
		}
	},

	phrases: [{
		name: 'validator',
		root: {
			type: 'value',
			compute: 'validate',
			id: '@value'
		}
	}]
};
