[lexure](../README.md) › ["lexer"](../modules/_lexer_.md) › [Lexer](_lexer_.lexer.md)

# Class: Lexer

The lexer turns input into a list of tokens.

## Hierarchy

* **Lexer**

## Implements

* IterableIterator‹[Token](../interfaces/_tokens_.token.md)›

## Index

### Constructors

* [constructor](_lexer_.lexer.md#constructor)

### Accessors

* [finished](_lexer_.lexer.md#finished)

### Methods

* [[Symbol.iterator]](_lexer_.lexer.md#[symbol.iterator])
* [lex](_lexer_.lexer.md#lex)
* [next](_lexer_.lexer.md#next)
* [setQuotes](_lexer_.lexer.md#setquotes)

## Constructors

###  constructor

\+ **new Lexer**(`input`: string): *[Lexer](_lexer_.lexer.md)*

*Defined in [lexer.ts:10](https://github.com/1Computer1/lexure/blob/abecae6/src/lexer.ts#L10)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`input` | string | Input string.  |

**Returns:** *[Lexer](_lexer_.lexer.md)*

## Accessors

###  finished

• **get finished**(): *boolean*

*Defined in [lexer.ts:32](https://github.com/1Computer1/lexure/blob/abecae6/src/lexer.ts#L32)*

Whether the lexer is finished.

**Returns:** *boolean*

## Methods

###  [Symbol.iterator]

▸ **[Symbol.iterator]**(): *this*

*Defined in [lexer.ts:129](https://github.com/1Computer1/lexure/blob/abecae6/src/lexer.ts#L129)*

**Returns:** *this*

___

###  lex

▸ **lex**(): *[Token](../interfaces/_tokens_.token.md)[]*

*Defined in [lexer.ts:136](https://github.com/1Computer1/lexure/blob/abecae6/src/lexer.ts#L136)*

Runs the lexer.

**Returns:** *[Token](../interfaces/_tokens_.token.md)[]*

___

###  next

▸ **next**(): *IteratorResult‹[Token](../interfaces/_tokens_.token.md)›*

*Defined in [lexer.ts:56](https://github.com/1Computer1/lexure/blob/abecae6/src/lexer.ts#L56)*

Gets the next token.

**Returns:** *IteratorResult‹[Token](../interfaces/_tokens_.token.md)›*

___

###  setQuotes

▸ **setQuotes**(`quotes`: [string, string][]): *this*

*Defined in [lexer.ts:24](https://github.com/1Computer1/lexure/blob/abecae6/src/lexer.ts#L24)*

Sets the quotes to use.
This can be done in the middle of lexing.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`quotes` | [string, string][] | List of pairs of open and close quotes.  |

**Returns:** *this*
