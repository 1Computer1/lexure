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
* [nextMut](parser.md#nextmut)
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

```ts
const parser = new Parser(tokens)
  .setUnorderedStrategy(longStrategy())
  .parse();
```

**Parameters:**

Name | Type |
------ | ------ |
s | [UnorderedStrategy](../interfaces/unorderedstrategy.md) |

**Returns:** this

The parser.

___

###  next

* **next**(): IteratorResult\<[ParserOutput](../interfaces/parseroutput.md)\>

Gets the next parsed tokens.

**Returns:** IteratorResult\<[ParserOutput](../interfaces/parseroutput.md)\>

___

###  nextMut

* **nextMut**(output: [ParserOutput](../interfaces/parseroutput.md)): IteratorResult\<null\>

Gets the next parsed tokens and mutates a given parser output.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
output | [ParserOutput](../interfaces/parseroutput.md) | Output to mutate.  |

**Returns:** IteratorResult\<null\>

___

###  [Symbol.iterator]

* **[Symbol.iterator]**(): this

**Returns:** this

___

###  parse

* **parse**(): [ParserOutput](../interfaces/parseroutput.md)

Runs the parser.

```ts
const lexer = new Lexer(input);
const tokens = lexer.lex();
const parser = new Parser(tokens);
const output = parser.parse();
```

**Returns:** [ParserOutput](../interfaces/parseroutput.md)

The parser output.
