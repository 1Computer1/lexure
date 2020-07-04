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

*Defined in [parserOutput.ts:10](https://github.com/1Computer1/lexure/blob/f9054d8/src/parserOutput.ts#L10)*

All the tokens that are not flags or options, in order.

___

###  flags

* **flags**: Set\<string\>

*Defined in [parserOutput.ts:15](https://github.com/1Computer1/lexure/blob/f9054d8/src/parserOutput.ts#L15)*

The parsed flags.

___

###  options

* **options**: Map\<string, string[]\>

*Defined in [parserOutput.ts:20](https://github.com/1Computer1/lexure/blob/f9054d8/src/parserOutput.ts#L20)*

The parsed options mapped to their value.
