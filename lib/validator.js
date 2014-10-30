var lutil = require('lacona-util');

module.exports = {
	scope: {
		validate: function (inputString, data, done) {
			var regex;
			var substrings = lutil.substrings(inputString);
			var l = substrings.length;
			var stringPart;
			var i;

			for (i = 0; i < l; i++) {
				stringPart = substrings[i];

				this.$call(this.validate, stringPart, function (err, isValid) {
					if (err) {
						return done(err);
					} else if (isValid) {
						data({
							display: stringPart,
							value: stringPart
						});
					}
				});
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
}
