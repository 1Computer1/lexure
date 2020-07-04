[lexure](../README.md) › [Parser](parser.md)

# Class: Parser

Parses a list of tokens to separate out flags and options.

## Hierarchy

* **Parser**

## Implements

* IterableIterator\<[ParserOutput](../interfaces/parseroutput.md)\>

## Index

### Constructors

* [constructor](parser.md#constructor)

### Accessors

* [finished](parser.md#finished)

### Methods

* [setUnorderedStrategy](parser.md#setunorderedstrategy)
* [next](parser.md#next)
* [[Symbol.iterator]](parser.md#[symbol.iterator])
* [parse](parser.md#parse)

## Constructors

###  constructor

* **new Parser**(input: [Token](../interfaces/token.md)[]): [Parser](parser.md)

*Defined in [parser.ts:12](https://github.com/1Computer1/lexure/blob/83985ea/src/parser.ts#L12)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
input | [Token](../interfaces/token.md)[] | The input tokens.  |

**Returns:** [Parser](parser.md)

## Accessors

###  finished

* **get finished**(): boolean

*Defined in [parser.ts:33](https://github.com/1Computer1/lexure/blob/83985ea/src/parser.ts#L33)*

Whether the parser is finished.

**Returns:** boolean

## Methods

###  setUnorderedStrategy

* **setUnorderedStrategy**(s: [UnorderedStrategy](../interfaces/unorderedstrategy.md)): this

*Defined in [parser.ts:25](https://github.com/1Computer1/lexure/blob/83985ea/src/parser.ts#L25)*

Sets the strategy for parsing unordered arguments.
This can be done in the middle of parsing.

**Parameters:**

Name | Type |
------ | ------ |
s | [UnorderedStrategy](../interfaces/unorderedstrategy.md) |

**Returns:** this

___

###  next

* **next**(): IteratorResult\<[ParserOutput](../interfaces/parseroutput.md)\>

*Defined in [parser.ts:44](https://github.com/1Computer1/lexure/blob/83985ea/src/parser.ts#L44)*

Gets the next parsed tokens.

**Returns:** IteratorResult\<[ParserOutput](../interfaces/parseroutput.md)\>

___

###  [Symbol.iterator]

* **[Symbol.iterator]**(): this

*Defined in [parser.ts:130](https://github.com/1Computer1/lexure/blob/83985ea/src/parser.ts#L130)*

**Returns:** this

___

###  parse

* **parse**(): [ParserOutput](../interfaces/parseroutput.md)

*Defined in [parser.ts:137](https://github.com/1Computer1/lexure/blob/83985ea/src/parser.ts#L137)*

Runs the parser.

**Returns:** [ParserOutput](../interfaces/parseroutput.md)
