[lexure](../README.md) › [Parser](parser.md)

# Class: Parser

Parses a list of tokens to separate out flags and options.

## Hierarchy

* **Parser**

## Implements

* IterableIterator\<[ParserOutput](../interfaces/parseroutput.md)\>
* Iterator\<[ParserOutput](../interfaces/parseroutput.md), null, [ParserOutput](../interfaces/parseroutput.md) | undefined\>

## Index

### Constructors

* [constructor](parser.md#constructor)

### Accessors

* [finished](parser.md#finished)

### Methods

* [setInput](parser.md#setinput)
* [setUnorderedStrategy](parser.md#setunorderedstrategy)
* [reset](parser.md#reset)
* [next](parser.md#next)
* [parse](parser.md#parse)

## Constructors

###  constructor

* **new Parser**(input?: [Token](../interfaces/token.md)[]): [Parser](parser.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
input? | [Token](../interfaces/token.md)[] | The input tokens.  |

**Returns:** [Parser](parser.md)

## Accessors

###  finished

* **get finished**(): boolean

Whether the parser is finished.

**Returns:** boolean

## Methods

###  setInput

* **setInput**(input: [Token](../interfaces/token.md)[]): this

Sets the input to use.
This will reset the parser.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
input | [Token](../interfaces/token.md)[] | Input to use. |

**Returns:** this

The parser.

___

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

###  reset

* **reset**(): this

Resets the state of the parser.

**Returns:** this

The parser.

___

###  next

* **next**(output?: [ParserOutput](../interfaces/parseroutput.md)): IteratorResult\<[ParserOutput](../interfaces/parseroutput.md)\>

Gets the next parsed tokens.
If a parser output is passed in, that output will be mutated, otherwise a new one is made.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
output? | [ParserOutput](../interfaces/parseroutput.md) | Parser output to mutate. |

**Returns:** IteratorResult\<[ParserOutput](../interfaces/parseroutput.md)\>

An iterator result containing parser output.

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
