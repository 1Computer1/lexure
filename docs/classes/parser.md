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

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
input | [Token](../interfaces/token.md)[] | The input tokens.  |

**Returns:** [Parser](parser.md)

## Accessors

###  finished

* **get finished**(): boolean

Whether the parser is finished.

**Returns:** boolean

## Methods

###  setUnorderedStrategy

* **setUnorderedStrategy**(s: [UnorderedStrategy](../interfaces/unorderedstrategy.md)): this

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

Gets the next parsed tokens.

**Returns:** IteratorResult\<[ParserOutput](../interfaces/parseroutput.md)\>

___

###  [Symbol.iterator]

* **[Symbol.iterator]**(): this

**Returns:** this

___

###  parse

* **parse**(): [ParserOutput](../interfaces/parseroutput.md)

Runs the parser.

**Returns:** [ParserOutput](../interfaces/parseroutput.md)
