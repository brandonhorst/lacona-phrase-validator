module.exports = {
	scope: {
		validate: function (inputString, data, done) {
			this.$call(this.validate, inputString, function (err, isValid) {
				if (err) {
					return done(err);
				} else if (isValid) {
					data({
						display: inputString,
						value: inputString
					});
				}
				done();
			});
		}
	},

	schema: {
		name: 'validator',
		root: {
			type: 'value',
			compute: 'validate',
			id: '@value'
		}
	}
}