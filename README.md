# lacona-phrase-validator

lacona phrase that validates input programmatically, but does not suggest anything

## Properties

  * `validate: Function(input: String)`: Expected to return a `Boolean` representing whether or not `input` is valid
  * `splitOn: String|RegExp`
  * `limit: Integer`: passed on to underlying `value`
