[lexure](../README.md) › [Lexer](lexer.md)

# Class: Lexer

The lexer turns input into a list of tokens.

## Hierarchy

* **Lexer**

## Implements

* IterableIterator\<[Token](../interfaces/token.md)\>

## Index

### Constructors

* [constructor](lexer.md#constructor)

### Accessors

* [finished](lexer.md#finished)

### Methods

* [setQuotes](lexer.md#setquotes)
* [next](lexer.md#next)
* [[Symbol.iterator]](lexer.md#[symbol.iterator])
* [lex](lexer.md#lex)

## Constructors

###  constructor

* **new Lexer**(input: string): [Lexer](lexer.md)

*Defined in [lexer.ts:10](https://github.com/1Computer1/lexure/blob/de74dcc/src/lexer.ts#L10)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
input | string | Input string.  |

**Returns:** [Lexer](lexer.md)

## Accessors

###  finished

* **get finished**(): boolean

*Defined in [lexer.ts:32](https://github.com/1Computer1/lexure/blob/de74dcc/src/lexer.ts#L32)*

Whether the lexer is finished.

**Returns:** boolean

## Methods

###  setQuotes

* **setQuotes**(quotes: [string, string][]): this

*Defined in [lexer.ts:24](https://github.com/1Computer1/lexure/blob/de74dcc/src/lexer.ts#L24)*

Sets the quotes to use.
This can be done in the middle of lexing.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
quotes | [string, string][] | List of pairs of open and close quotes.  |

**Returns:** this

___

###  next

* **next**(): IteratorResult\<[Token](../interfaces/token.md)\>

*Defined in [lexer.ts:56](https://github.com/1Computer1/lexure/blob/de74dcc/src/lexer.ts#L56)*

Gets the next token.

**Returns:** IteratorResult\<[Token](../interfaces/token.md)\>

___

###  [Symbol.iterator]

* **[Symbol.iterator]**(): this

*Defined in [lexer.ts:129](https://github.com/1Computer1/lexure/blob/de74dcc/src/lexer.ts#L129)*

**Returns:** this

___

###  lex

* **lex**(): [Token](../interfaces/token.md)[]

*Defined in [lexer.ts:136](https://github.com/1Computer1/lexure/blob/de74dcc/src/lexer.ts#L136)*

Runs the lexer.

**Returns:** [Token](../interfaces/token.md)[]
