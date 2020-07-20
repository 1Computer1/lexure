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
* [lexCommand](lexer.md#lexcommand)

## Constructors

###  constructor

* **new Lexer**(input: string): [Lexer](lexer.md)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
input | string | Input string.  |

**Returns:** [Lexer](lexer.md)

## Accessors

###  finished

* **get finished**(): boolean

Whether the lexer is finished.

**Returns:** boolean

## Methods

###  setQuotes

* **setQuotes**(quotes: [string, string][]): this

Sets the quotes to use.
This can be done in the middle of lexing.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
quotes | [string, string][] | List of pairs of open and close quotes. |

**Returns:** this

The lexer.

___

###  next

* **next**(): IteratorResult\<[Token](../interfaces/token.md)\>

Gets the next token.

**Returns:** IteratorResult\<[Token](../interfaces/token.md)\>

An iterator result containing the next token.

___

###  [Symbol.iterator]

* **[Symbol.iterator]**(): this

**Returns:** this

___

###  lex

* **lex**(): [Token](../interfaces/token.md)[]

Runs the lexer.
This consumes the lexer.

**Returns:** [Token](../interfaces/token.md)[]

All the tokens lexed.

___

###  lexCommand

* **lexCommand**(matchPrefix: [MatchPrefix](../README.md#matchprefix)): [[Token](../interfaces/token.md), function] | null

Runs the lexer, matching a prefix and command.
This consumes at most two tokens of the lexer.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
matchPrefix | [MatchPrefix](../README.md#matchprefix) | A function that gives the length of the prefix if there is one. |

**Returns:** [[Token](../interfaces/token.md), function] | null

The command and the rest of the lexed tokens, as long as the prefix was matched.
The rest of the tokens are delayed as a function.
