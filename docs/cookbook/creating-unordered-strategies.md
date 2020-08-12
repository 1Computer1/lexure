# Creating Unordered Strategies

This is an example of using creating unordered strategies for parsing flags and options.  
There are the following built-in strategies:  

- `prefixedStrategy` for matching structured flags.
- `longStrategy`, same as `prefixedStrategy(['--'], ['='])`.
- `longShortStrategy`, same as `prefixedStrategy(['--', '-'], ['='])`.
- `matchingStrategy` for matching strings in a locale-sensitive manner.

Example of `prefixedStrategy` (and its derivatives):  

```ts
const tokens = new Lexer('--nix /dos').lex();

const nix = longShortStrategy();
const parserNix = new Parser(tokens).setUnorderedStrategy(nix);
console.log(parser.parse());
>>> {
    ordered: ['/dos'],
    flags: Set { 'nix' },
    options: Map {}
}

const dos = prefixedStrategy(['/'], [':']);
const parserDos = new Parser(tokens).setUnorderedStrategy(dos);
console.log(parser.parse());
>>> {
    ordered: ['--nix'],
    flags: Set { 'dos' },
    options: Map {}
}
```

The `matchingStrategy` takes in a record of words to use, and will give back the key.  
Example of `matchingStrategy`:  

```ts
const st = matchingStrategy({ foo: ['foo', 'fooooo'] }, { bar: ['bar:'] });
console.log(st.matchFlag('fooooo'));
>>> 'foo'

console.log(st.matchCompactOption('bar:baz'));
>>> ['bar', 'baz']
```

This strategy supports [locales and collator options](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator/Collator); you can use this to do case-insensitive matching, among other kinds of matching.  

```ts
const st = matchingStrategy({ foo: ['foo', 'fooooo'] }, { bar: ['bar:'] }, 'en-US', { sensitivity: 'base' });
console.log(st.matchFlag('foOoOo'));
>>> 'foo'

console.log(st.matchCompactOption('bár:baz'));
>>> ['bar', 'baz']
```

## Augment an Existing Strategy

We can augment an existing strategy using the `mapKeys` and the `renameKeys` functions.  
The `mapKeys` function lets us transform all the keys or remove them from being matched.  
We can use it to lowercase all the keys for example.  

```ts
const st = mapKeys(longStrategy(), k => k.toLowerCase());
console.log(st.matchFlag('--FOO'));
>>> 'foo'
```

The `renameKeys` function is best used to map aliases of flags and options to one name.  
Like `matchingStrategy`, it support locales and collator options.  
Below, we tell it to map "flag" and "f" to "flag", keep keys that are not found, and be base-sensitive when comparing.  

```ts
const st = renameKeys(longStrategy(), { flag: ['flag', 'f'] }, true, 'en-US', { sensitivity: 'base' });
console.log(st.matchFlag('--F'));
>>> 'flag'
```

## Custom Strategies

We will make a strategy where flags and options are specified by an exclamation mark and an equal sign.  
It wil be equivalent to `prefixedStrategy(['!'], ['='])`.  

```ts
// An unordered strategy is made of three functions.
// They match either flags, options, or 'compact' options.
// For best results, if one matcher accepts a string, none of the other matchers should.
const screamingStrategy: UnorderedStrategy = {
    // This one returns the name of the flag.
    // e.g. !flag
    matchFlag(s: string): string | null {
        return s.startsWith('!') && !s.includes('=') ? s.slice(1) : null;
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
const tokens = new Lexer('!flag !opt1 1 !opt1=2').lex();
const parser = new Parser(tokens).setUnorderedStrategy(screamingStrategy);
console.log(parser.parse());
>>> {
    ordered: [],
    flags: Set { 'flag' },
    options: Map { 'opt1' => '1', 'opt2' => '2' }
}
```
