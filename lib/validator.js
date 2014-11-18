var lutil = require('lacona-util');

module.exports = {
	scope: {
		validate: function (inputString, data, done) {
			var regex;
			var substrings = lutil.substrings(inputString);
			var l = substrings.length;
			var stringPart;
			var i;

			if (inputString === "") {
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
}
