[lexure](../README.md) › ["parserOutput"](../modules/_parseroutput_.md) › [ParserOutput](_parseroutput_.parseroutput.md)

# Interface: ParserOutput

Output of the parser.

## Hierarchy

* **ParserOutput**

## Index

### Properties

* [flags](_parseroutput_.parseroutput.md#flags)
* [options](_parseroutput_.parseroutput.md#options)
* [ordered](_parseroutput_.parseroutput.md#ordered)

## Properties

###  flags

• **flags**: *Set‹string›*

*Defined in [parserOutput.ts:15](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/parserOutput.ts#L15)*

The parsed flags.

___

###  options

• **options**: *Map‹string, string[]›*

*Defined in [parserOutput.ts:20](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/parserOutput.ts#L20)*

The parsed options mapped to their value.

___

###  ordered

• **ordered**: *[Token](_tokens_.token.md)[]*

*Defined in [parserOutput.ts:10](https://github.com/1Computer1/lexure/blob/5f4fd4c/src/parserOutput.ts#L10)*

All the tokens that are not flags or options, in order.
