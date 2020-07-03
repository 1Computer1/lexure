# lexure

`npm i lexure`  

Lexer and parser for structured non-technical user input.  

## Features

- Parses quoted input with multiple quote types.
- Parses flags and options with customizable parsing implementation.
- Keeps trailing whitespace.
- Always parses input by allowing some mis-inputs.
- Includes a convenient wrapper to retrieve arguments.

## Example

First, import lexure:  

```ts
// TypeScript or ES Module
import * as lexure from 'lexure';

// CommonJS
const lexure = require('lexure');
```

Consider some user input in the form of a command like so:  

```ts
const input = '!hello world "cool stuff" --foo --bar=baz a b c';
```

We first tokenize the input string to individual tokens.  
As you can see, lexure supports custom open and close quotes for devices with special keyboards and other locales.  

```ts
const lexer = new Lexure.Lexer(input)
    .setQuotes([
        ['"', '"'],
        ['“', '”']
    ]);

const tokens = lexer.lex();
>>> [
    { value: '!hello',     raw: '!hello',       trailing: ' ' },
    { value: 'world',      raw: 'world',        trailing: ' ' },
    { value: 'cool stuff', raw: '"cool stuff"', trailing: ' ' },
    { value: '--foo',      raw: '--foo',        trailing: ' ' },
    { value: '--bar=baz',  raw: '--bar=baz',    trailing: ' ' },
    { value: 'a',          raw: 'a',            trailing: ' ' },
    { value: 'b',          raw: 'b',            trailing: ' ' },
    { value: 'c',          raw: 'c',            trailing: ''  }
]
```

The `!hello` part of the input is usually interpreted as a command, for which lexure has a utility function that will extract it from the tokens.  

```ts
Lexure.extractCommand(s => s.startsWith('!') ? 1 : null, tokens)
>>> { value: 'hello', raw: 'hello', trailing: ' ' }

Lexure.tokens
>>> [
    { value: 'world',      raw: 'world',        trailing: ' ' },
    { value: 'cool stuff', raw: '"cool stuff"', trailing: ' ' },
    { value: '--foo',      raw: '--foo',        trailing: ' ' },
    { value: '--bar=baz',  raw: '--bar=baz',    trailing: ' ' },
    { value: 'a',          raw: 'a',            trailing: ' ' },
    { value: 'b',          raw: 'b',            trailing: ' ' },
    { value: 'c',          raw: 'c',            trailing: ''  }
]
```

Now, we can take the tokens and parse them into a structure.  
In lexure, you are free to describe how you want to match unordered arguments like flags.  
There are also several built-in strategies for common usecases.  

```ts
const parser = new Lexure.Parser(tokens)
    .setUnorderedStrategy(Lexure.longStrategy());

const res = parser.parse();
>>> {
    ordered: [
        { value: 'world',      raw: 'world',        trailing: ' ' },
        { value: 'cool stuff', raw: '"cool stuff"', trailing: ' ' },
        { value: 'a',          raw: 'a',            trailing: ' ' },
        { value: 'b',          raw: 'b',            trailing: ' ' },
        { value: 'c',          raw: 'c',            trailing: ''  }
    ],
    flags: Set { 'foo' },
    options: Map { 'bar' => ['baz'] }
}

Lexure.joinTokens(res.ordered)
>>> 'world "cool stuff" a b c'
```

A utility wrapper class is available for us to retrieve the arguments from the output of the parser.  
It keeps track of what has already been retrieved and has several helpful methods.  

```ts
const args = new Lexure.Args(res);

args.single()
>>> 'world'

args.single()
>>> 'cool stuff'

args.findMap(x => x === 'c' ? Lexure.some('it was a C') : Lexure.none())
>>> { exists: true, value: 'it was a C' }

args.many()
>>> [
    { value: 'a', raw: 'a', trailing: ' ' },
    { value: 'b', raw: 'b', trailing: ' ' }
]

args.flag('foo')
>>> true

args.option('bar')
>>> 'baz'
```
