# suplex

Lexer and parser for structured non-technical user input.

## Features

- Parses quoted input with multiple quote types.
- Parses flags and options with customizable parsing implementation.
- Keeps trailing whitespace.
- Always parses input by allowing some mis-inputs.

## Example

```ts
import { lexer, parser, token, unordered } from 'suplex';

const input = 'hello world "cool stuff" --foo --bar=baz';

const l = new lexer.Lexer(input)
    .setQuotes([['"', '"'], ['“', '”']]);

const tokens = l.lex();
>>> [
    Word { value: 'hello', trailing: ' ' },
    Word { value: 'world', trailing: ' ' },
    Quoted { value: '"cool stuff"', innerValue: 'cool stuff', trailing: ' ' },
    Word { value: '--foo', trailing: ' ' },
    Word { value: '--bar=baz', trailing: '' },
]

const p = new parser.Parser(tokens)
    .setUnorderedStrategy(unordered.longStrategy());

const res = p.parse();
>>> {
    ordered: [
        Word { value: 'hello', trailing: ' ' },
        Word { value: 'world', trailing: ' ' },
        Quoted { value: '"cool stuff"', innerValue: 'cool stuff', trailing: ' ' }
    ],
    flags: Set { 'foo' },
    options: Map { 'bar' => 'baz' }
}

const text = token.joinTokens(res.ordered);
>>> 'hello world "cool stuff"'
```

See code for more usages and documentation.
