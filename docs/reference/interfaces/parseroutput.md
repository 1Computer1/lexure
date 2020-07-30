[lexure](../README.md) › [ParserOutput](parseroutput.md)

# Interface: ParserOutput

Output of the parser.

## Hierarchy

* **ParserOutput**

## Index

### Properties

* [ordered](parseroutput.md#ordered)
* [flags](parseroutput.md#flags)
* [options](parseroutput.md#options)

## Properties

###  ordered

* **ordered**: [Token](token.md)[]

All the tokens that are not flags or options, in order.

___

###  flags

* **flags**: Set\<string\>

The parsed flags.

___

###  options

* **options**: Map\<string, string[]\>

The parsed options mapped to their value.
