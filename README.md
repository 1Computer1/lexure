# lexure

Lexer and parser for structured non-technical user input.

## Features

- Parses quoted input with multiple quote types.
- Parses flags and options with customizable parsing implementation.
- Keeps trailing whitespace.
- Always parses input by allowing some mis-inputs.

## Example

```ts
import { Lexer, Parser, Tokens, Unordered } from 'lexure';

const input = 'hello world "cool stuff" --foo --bar=baz';

const lexer = new Lexer(input)
    .setQuotes([['"', '"'], ['“', '”']]);

const tokens = lexer.lex();
>>> [
    Word { value: 'hello', trailing: ' ' },
    Word { value: 'world', trailing: ' ' },
    Quoted { value: '"cool stuff"', innerValue: 'cool stuff', trailing: ' ' },
    Word { value: '--foo', trailing: ' ' },
    Word { value: '--bar=baz', trailing: '' },
]

const parser = new Parser(tokens)
    .setUnorderedStrategy(Unordered.longStrategy());

const res = parser.parse();
>>> {
    ordered: [
        Word { value: 'hello', trailing: ' ' },
        Word { value: 'world', trailing: ' ' },
        Quoted { value: '"cool stuff"', innerValue: 'cool stuff', trailing: ' ' }
    ],
    flags: Set { 'foo' },
    options: Map { 'bar' => 'baz' }
}

const text = Tokens.joinTokens(res.ordered);
>>> 'hello world "cool stuff"'
```

See code for more usages and documentation.
