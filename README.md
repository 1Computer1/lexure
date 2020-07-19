# lexure

`npm i lexure`  

Parser and utilities for non-technical user input.  
[Documentation available here](https://github.com/1Computer1/lexure/tree/master/docs).

## Features

- Parses quoted input with multiple quote types.
- Parses flags and options with customizable parsing implementation.
- Keeps trailing whitespace.
- Always parses input by allowing some mis-inputs.
- Includes a convenient wrapper to retrieve arguments.
- Includes abstractions for creating an input loop.

## Example

First, import lexure:  

```ts
// TypeScript or ES Module
import * as Lexure from 'lexure';

// CommonJS
const Lexure = require('lexure');
```

Consider some user input in the form of a command like so:  

```ts
const input = '!hello world "cool stuff" --foo --bar=baz a b c';
```

We first tokenize the input string to individual tokens.  
As you can see, lexure supports custom open and close quotes for devices with special keyboards and other locales.  

The `!hello` part of the input is usually interpreted as a command, which the Lexer class can handle too.  
The remaining input is delayed as a function so that you can ignore the rest of the input if it is an invalid command.  

```ts
const lexer = new Lexure.Lexer(input)
    .setQuotes([
        ['"', '"'],
        ['“', '”']
    ]);

const res = lexer.lexCommand(s => s.startsWith('!') ? 1 : null);

const cmd = res[0];
>>> { value: 'hello', raw: 'hello', trailing: ' ' }

const tokens = res[1]();
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

const out = parser.parse();
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

Lexure.joinTokens(out.ordered)
>>> 'world "cool stuff" a b c'
```

A wrapper class Args is available for us to retrieve the arguments from the output of the parser.  
It keeps track of what has already been retrieved and has several helpful methods.  

```ts
const args = new Lexure.Args(out);

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

Suppose we would like to prompt the user input, and retry until a valid input is given.  
Lexure has various functions for this, in which the logic of an input loop is abstracted out.  

```ts
// Suppose we have access to this function that prompts the user.
// You can imagine this as a CLI or chat bot.
function prompt(): string | null {
    return '100';
}

const result = Lexure.loop1(null, {
    getInput() {
        const input = prompt();
        if (input == null) {
            return Lexure.fail('no input');
        } else {
            return Lexure.step(input);
        }
    }

    parse(s: string) {
        const n = Number(s);
        if (isNaN(n)) {
            return Lexure.fail('cannot parse input');
        } else {
            return Lexure.finish(n);
        }
    }
});

result
>>> { success: true, value: 100 }
```
