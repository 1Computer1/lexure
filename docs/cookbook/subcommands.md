# Subcommands

This is an example of subcommands, i.e. commands that branch out to different commands based on an argument.  
In this example we will have the root command be `root`, and subcommands `sub1` and `sub2`.  

```ts
function rootCommand(tokens: Token[]): string {
    // Remove the first token and get its value if it exists.
    const sub = tokens.shift()?.value ?? null;
    switch (sub) {
        case 'sub1':
            return sub1Command(tokens);
        case 'sub2':
            return sub2Command(tokens);
        case null:
            // This occurs when there are no tokens left, i.e. `sub == null`.
            return 'No subcommand given.';
        default:
            // This occurs when we are given a string that does not match the above.
            return 'Unknown subcommand.';
    }
}

function sub1Command(tokens: Token[]): string {
    const args = new Args(new Parser(tokens).parse());
    // ...
}

function sub2Command(tokens: Token[]): string {
    const args = new Args(new Parser(tokens).parse());
    // ...
}
```

## Passing Tokens

Note that in the example above, we were passing `Token[]` around instead of `Args`.  
This is for two reasons:

1. Each subcommand may have their own flag parsing strategy.  
This is especially relevant for `exactStrategy` and `caseInsensitiveStrategy`, which may not have delimiters.

2. `Args` is not sensitive to the possibility of flags in between ordered tokens.  
Consider the input `!root --flag sub1`, which `args.single()` will retrieve `sub1`.  
This may not be expected behavior, and the `sub1` command will also have `--flag` if the same `Args` instance is passed to it.  
