lacona-phrase-validator
=======================

Lacona phrase that validates input programmatically, but does not suggest

Properties:

  * `validate` - name of a function declared on the `scope`. It is passed a string and a callback. It should call the callback with either an error, or a boolean representing whether or not the string is valid.
  * `default` - name of a function declared on the `scope`. It is passed a callback. It should call the callback with some string, which the phrase will use before it has any input to validate.
