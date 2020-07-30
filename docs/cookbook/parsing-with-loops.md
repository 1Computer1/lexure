# Parsing With Loops

This is an example of using the loop utilities alongside Args.  
In particular, we will combine `loopAsync` and `Args#singleParseAsync`.  

To facilitate the example, assume that the following functions exists in this made-up library `talking`:  

```ts
// -------
// talking
// -------

/**
 * Gets input from the user you are talking to.
 * Returns null if they do not answer.
 */
export function ask(): Promise<string | null>;

/**
 * Sends a message to the user.
 */
export function say(s: string): Promise<void>;
```

Essentially, we want the user to give use an input, and if that input is invalid, we will prompt them for it.  
An example conversation could be like so:  

```
User: !add 1 b
You:  Invalid input b, please give a valid number:
User: ok
You:  Invalid input ok, please give a valid number:
User: 3
You:  That adds to 4.
```

Now, we will write a function on top of `loopAsync`.  

```ts
// ----------
// helpers.ts
// ----------

import { Result, loopAsync, step, fail, finish } from 'lexure';
import { ask, say } from 'talking';

/**
 * An error that can occur when parsing.
 */
export enum ParseError {
    PARSE_FAILURE,  // A general parse error e.g. invalid input.
    NO_INPUT_GIVEN, // No input was given.
    TOO_MANY_TRIES  // Took too many tries to give a good input.
}

/**
 * This function will reply with a message based on the error.
 */
export function sayError(e: ParseError): Promise<void> {
    switch (e) {
        case ParseError.PARSE_FAILURE:
            return say('Invalid input.');

        case ParseError.NO_INPUT_GIVEN:
            return say('You did not give a value in time.');

        case ParseError.TOO_MANY_TRIES:
            return say('You took too many tries.');
    }
}

// Type synonyms, because it gets long.
type Parser<T> = (x: string) => Result<T, ParseError>;
type ParserAsync<T> = (x: string) => Promise<Result<T, ParseError>>;

/**
 * This function wraps an existing parser with a loop, allowing us to prompt until the user inputs correctly.
 * In other words, it is a higher-order function.
 * We will also take in a string, for the expected type of value.
 */
export async function loopParse<T>(expected: string, parse: Parser<T>): ParserAsync<T> {
    // We return a `Parser<T>`, which is a function.
    return (s: string) => {
        // We will use an integer to count how many retries have been taken.
        const retries = 0;

        // `loopAsync` takes an object of functions.
        // Each function must return a `LoopAction`, which is one of `step`, `fail`, or `finish`.
        return loopAsync(s, {
            // This function will be called to prompt for input.
            async getInput() {
                // Allow only three tries.
                // That is, there can only be three calls to `ask`.
                if (retries >= 3) {
                    // `fail` exits us out of the loop.
                    // It should be called with an error.
                    return fail(ParseError.TOO_MANY_TRIES);
                }

                const s = await ask();
                retries++;
                if (s == null) {
                    return fail(ParseError.NO_INPUT_GIVEN);
                }

                // `step` tells the loop to continue.
                // Within `getInput`, it must contain a string to pass to `parse`.
                return step(s);
            }

            // This function is called to parse the input from `getInput`.
            async parse(s) {
                const res = parse(s);
                if (res.success) {
                    // `finish` exits us out the loop too.
                    // It should be called with the successfully parsed value.
                    return finish(res.value);
                }

                // We will tell the user their problem here.
                // We don't actually care about the error value from `res`, though you can do that in your design.
                await say(`Invalid input ${s}, please give a valid ${expected}:`);

                // This `fail` does not exit the loop immediately.
                // Instead, it goes back to `getInput` to try again.
                return fail(ParseError.PARSE_FAILURE);
            }

            // You might notice that `fail` acts differently in `getInput` and `parse`.
            // There are two more optional functions, `onInputError` and `onParseError`, that changes that behavior.
            // That is also where the values passed to `fail` are used.
            // They won't be used here, since they are for more complicated loops.
        });

        // In the end, `loopAsync` will return a `Promise<Result<T, ParseError>>` so we are done here.
    };
}
```

Now we can use our new function.  

```ts
// ------
// add.ts
// ------

import { Args, Result, ok, err } from 'lexure';
import { ParseError, loopParse, sayError } from './helpers';
import { ask, say } from 'talking';

/**
 * This is a command that adds two numbers.
 */
export async function addCommand(args: Args): Promise<void> {
    // `Args#singleParseAsync` takes the next ordered token and passes it to a parser.
    // If the parser succeeds, `n1` will give us the value and `args` will consume the token.
    // Otherwise, we should exit.
    const n1 = await args.singleParseAsync(loopParse('number', parseNumber));
    if (!n1.success) return sayError(n1.error);

    const n2 = await args.singleParseAsync(loopParse('number', parseNumber));
    if (!n2.success) return sayError(n2.error);

    const z = n1.value + n2.value;
    return say(`That adds to ${z}.`);
}

/**
 * This parses a number.
 */
function parseNumber(x: string): Result<number, ParseError> {
    const n = Number(x);
    return isNaN(n) ? err(ParseError.PARSE_FAILURE) : ok(n);
}
```
