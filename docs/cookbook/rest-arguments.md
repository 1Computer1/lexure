# Rest Arguments

This is an example of using `Arg#many` and `joinTokens` to get the rest of the arguments.  

```ts
// ------
// say.ts
// ------

import { Args, joinTokens } from 'lexure';

export function sayCommand(args: Args): [string, string] {
    const tokens = args.many();
    // This joins the tokens with the trailing space and raw values.
    const rest1 = joinTokens(tokens);
    // This joins the tokens with a space and unquoted values.
    const rest2 = joinTokens(tokens, ' ', false);
    return [rest1, rest2];
}
```

Now the function can be used.  

```ts
// --------
// index.ts
// --------

// To save on time, assume `args` is from '!say text   "quoted text"'.
// Note the three spaces and the quotes.

console.log(sayCommand(args));
>>> [
    'text   "quoted text"', // Trailing space and raw values.
    'text quoted text'      // A space and unquoted values.
]
```
