[lexure](../README.md) › ["parser"](../modules/_parser_.md) › [Parser](_parser_.parser.md)

# Class: Parser

Parses a list of tokens to separate out flags and options.

## Hierarchy

* **Parser**

## Implements

* IterableIterator‹[ParserOutput](../interfaces/_parseroutput_.parseroutput.md)›

## Index

### Constructors

* [constructor](_parser_.parser.md#constructor)

### Accessors

* [finished](_parser_.parser.md#finished)

### Methods

* [[Symbol.iterator]](_parser_.parser.md#[symbol.iterator])
* [next](_parser_.parser.md#next)
* [parse](_parser_.parser.md#parse)
* [setUnorderedStrategy](_parser_.parser.md#setunorderedstrategy)

## Constructors

###  constructor

\+ **new Parser**(`input`: [Token](../interfaces/_tokens_.token.md)[]): *[Parser](_parser_.parser.md)*

*Defined in [parser.ts:12](https://github.com/1Computer1/lexure/blob/abecae6/src/parser.ts#L12)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`input` | [Token](../interfaces/_tokens_.token.md)[] | The input tokens.  |

**Returns:** *[Parser](_parser_.parser.md)*

## Accessors

###  finished

• **get finished**(): *boolean*

*Defined in [parser.ts:33](https://github.com/1Computer1/lexure/blob/abecae6/src/parser.ts#L33)*

Whether the parser is finished.

**Returns:** *boolean*

## Methods

###  [Symbol.iterator]

▸ **[Symbol.iterator]**(): *this*

*Defined in [parser.ts:130](https://github.com/1Computer1/lexure/blob/abecae6/src/parser.ts#L130)*

**Returns:** *this*

___

###  next

▸ **next**(): *IteratorResult‹[ParserOutput](../interfaces/_parseroutput_.parseroutput.md)›*

*Defined in [parser.ts:44](https://github.com/1Computer1/lexure/blob/abecae6/src/parser.ts#L44)*

Gets the next parsed tokens.

**Returns:** *IteratorResult‹[ParserOutput](../interfaces/_parseroutput_.parseroutput.md)›*

___

###  parse

▸ **parse**(): *[ParserOutput](../interfaces/_parseroutput_.parseroutput.md)*

*Defined in [parser.ts:137](https://github.com/1Computer1/lexure/blob/abecae6/src/parser.ts#L137)*

Runs the parser.

**Returns:** *[ParserOutput](../interfaces/_parseroutput_.parseroutput.md)*

___

###  setUnorderedStrategy

▸ **setUnorderedStrategy**(`s`: [UnorderedStrategy](../interfaces/_unordered_.unorderedstrategy.md)): *this*

*Defined in [parser.ts:25](https://github.com/1Computer1/lexure/blob/abecae6/src/parser.ts#L25)*

Sets the strategy for parsing unordered arguments.
This can be done in the middle of parsing.

**Parameters:**

Name | Type |
------ | ------ |
`s` | [UnorderedStrategy](../interfaces/_unordered_.unorderedstrategy.md) |

**Returns:** *this*
