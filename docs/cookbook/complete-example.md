# Complete Example

This is a complete example of using lexure from the lexer to the arguments wrapper.  

```ts
// -----------
// myparser.ts
// -----------
import { Lexer, Parser, Args, prefixedStrategy } from 'lexure';

/**
 * This function, given a command string, will return a pair which contains the name of the command and the arguments.
 * It will return null if the string does not start with the correct prefix of '!'.
 */
export function parseCommand(s: string): [string, Args] | null {
    const lexer = new Lexer(s)
        .setQuotes([
            ['"', '"'], // Double quotes
            ['“', '”'], // Fancy quotes (on iOS)
            ["「", "」"]  // Corner brackets (CJK)
        ]);             // Add more as you see fit!

    const lout = lexer.lexCommand(s => s.startsWith('!') : 1 | null);
    if (lout == null) {
        return null;
    }

    const [command, getTokens] = lout;
    const tokens = getTokens();
    const parser = new Parser(tokens)
        .setUnorderedStrategy(prefixedStrategy(
            ['--', '-', '—'], // Various flag prefixes including em dash.
            ['=', ':']        // Various separators for options.
        ));

    const pout = parser.parse();
    return new Args(pout);
}
```

```ts
// ------------
// mycommand.ts
// ------------
import { parseCommand } from 'myparser';

/**
 * This function runs a command that replies with a string.
 */
export function runCommand(s: string): string {
    const out = parseCommand(s);
    if (out == null) {
        return 'Not a command.';
    }

    const [command, args] = out;
    if (command === 'add') {
        // These calls to `Args#single` can give a string or null.
        const x = args.single();
        const y = args.single();
        // Which means this could give NaN on bad inputs.
        const z = Number(x) + Number(y);
        return `The answer is ${x + y}.`;
    } else {
        return 'Not an implemented command.';
    }
}
```

```ts
// --------
// index.ts
// --------
import { runCommand } from 'mycommand';

console.log(runCommand('!add 1 2'));
>>> The answer is 3.

console.log(runCommand('!add 1'));
>>> The answer is NaN.

console.log(runCommand('!foo'));
>>> Not an implemented command.

console.log(runCommand('hello'));
>>> Not a command.
```
