# Creating Unordered Strategies

This is an example of using creating new unordered strategies for parsing flags and options.  
The first one we make will be one where flags and options are specified by an exclamation mark and an equal sign.  

```ts
// An unordered strategy is made of three functions.
// They match either flags, options, or 'compact' options.
const screamingStrategy: UnorderedStrategy = {
    // This one returns the name of the flag.
    // e.g. !flag
    matchFlag(s: string): string | null {
        return s.startsWith('!') ? s.slice(1) : null;
    },

    // This one returns the name of the option.
    // An option does not have the value with it.
    // e.g. !option=
    matchOption(s: string): string | null {
        return s.startsWith('!') && s.endsWith('=')
            ? s.slice(1, -1)
            : null;
    }

    // This one returns the name of the option as well as the value.
    // For your users, you should make this almost identical to the above.
    // e.g. !option=value
    matchCompactOption(s: string): [string, string] | null {
        if (!s.startsWith('!')) {
            return null;
        }

        const i = s.indexOf('=');
        if (i === -1) {
            return null;
        }

        return [s.slice(1, i), s.slice(i)];
    }
};
```

You can now use this with a `Parser`.  

```ts
const lexer = new Lexer('!flag !opt1 1 !opt1=2');
const parser = new Parser(tokens).setUnorderedStrategy(screamingStrategy);
console.log(parser.parse());
>>> {
    ordered: [],
    flags: Set { 'flag' },
    options: Map { 'opt1' => '1', 'opt2' => '2' }
}
```

## Using an Existing Strategy

The above strategy is equivalent to using the built-in `prefixedStrategy`.  

```ts
const screamingStrategy = prefixedStrategy(['!'], ['=']);
```

Note that both the above do not care about case.  
This means that `!foo` and `!Foo` parses as different flags, which you may not want.  
We can augment an existing strategy like so:  

```ts
const screamingStrategy2: UnorderedStrategy = {
    matchFlag(s) {
        return screamingStrategy.matchFlag(s)?.toLowerCase() ?? null;
    },

    matchOption(s) {
        return screamingStrategy.matchOption(s)?.toLowerCase() ?? null;
    },

    matchCompactOption(s) {
        const r = screamingStrategy.matchCompactOption(s);
        if (r == null) {
            return null;
        }

        return [r[0].toLowerCase(), r[1]];
    }
};
```
