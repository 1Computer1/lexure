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

```ts
const lexer = new Lexer('"hello"');
lexer.setQuotes([['"', '"']]);
const xs = lexer.lex();
console.log(xs);
>>> [{ value: 'hello', raw: '"hello"', trailing: '' }]
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
quotes | [string, string][] | List of pairs of open and close quotes. It is required that these strings do not contain any whitespace characters. |

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

```ts
const lexer = new Lexer('hello world');
const xs = lexer.lex();
console.log(xs);
>>> [
  { value: 'hello', raw: 'hello', trailing: ' ' },
  { value: 'world', raw: 'world', trailing: '' }
]
```

**Returns:** [Token](../interfaces/token.md)[]

All the tokens lexed.

___

###  lexCommand

* **lexCommand**(matchPrefix: [MatchPrefix](../README.md#matchprefix)): [[Token](../interfaces/token.md), function] | null

Runs the lexer, matching a prefix and command.
This consumes at most two tokens of the lexer.
This uses [`extractCommand`](../README.md#extractcommand) under the hood.

```ts
const lexer = new Lexer('!help me');
const r = lexer.lexCommand(s => s.startsWith('!') ? 1 : null);
if (r != null) {
  const [command, getRest] = r;
  console.log(command.value);
  >>> 'help'
  console.log(getRest()[0].value);
  >>> 'me'
}
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
matchPrefix | [MatchPrefix](../README.md#matchprefix) | A function that gives the length of the prefix if there is one. |

**Returns:** [[Token](../interfaces/token.md), function] | null

The command and the rest of the lexed tokens, as long as the prefix was matched.
The rest of the tokens are delayed as a function.
