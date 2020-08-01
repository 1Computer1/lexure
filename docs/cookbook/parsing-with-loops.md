# Parsing With Loops

This is an example of using the loop utilities alongside Args.  
In particular, we will combine `loopAsync`, `loop1Async`, and `Args#singleParseAsync`.  
Though, note that everything here applies to the non-async variants too.  

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
You:  Invalid input b, please give a valid number.
User: ok
You:  Invalid input ok, please give a valid number.
User: 3
You:  That adds to 4.
```

And, if they try too many times:  

```
User: !add 1 b
You:  Invalid input b, please give a valid number.
User: bad
You:  Invalid input bad, please give a valid number.
User: badder
You:  Invalid input badder, please give a valid number.
User: baddest
You:  Invalid input baddest, please give a valid number.
You:  You took too many tries.
```

Now, we will write functions on top of `loopAsync` and `loop1Async`.  

```ts
// ----------
// helpers.ts
// ----------

import { Args, Result, LoopStrategyAsync, loopAsync, loop1Async, err, ok, step, fail, finish } from 'lexure';
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
 * This function creates a loop strategy that has inputs `string`, outputs `T`, and has errors `ParseError`.
 * A loop strategy is basically a bunch of functions that define the behavior of our input loop.
 * This includes where to get input, when to exit, and so on.
 */
function makeLoopStrategy<T>(expected: string, runParser: Parser<T>): LoopStrategyAsync<string, T, ParseError> {
    // To count the number of retries.
    let retries = 0;

    // Each function must return a `LoopAction`, which is one of `step`, `fail`, or `finish`.
    return {
        // This function will be called to prompt for input.
        // When using a loop strategy with `loopAsync`, this gets skipped the first time since we have an initial input.
        // On the other hand, `loop1Async` will call this the first time around.
        async getInput() {
            // Allow only three tries.
            if (retries >= 3) {
                // `fail` exits us out of the loop with an error.
                return fail(ParseError.TOO_MANY_TRIES);
            }

            const s = await ask();
            retries++;
            if (s == null) {
                return fail(ParseError.NO_INPUT_GIVEN);
            }

            // `step` tells the loop to continue with the input `s`.
            return step(s);
        },

        // This function is called to parse the input from `getInput`.
        // It is also called to parse the initial input from `loopAsync`.
        async parse(s: string) {
            const res = runParser(s);
            if (res.success) {
                // `finish` exits us out the loop with the resulting value.
                return finish(res.value);
            }

            // We will tell the user their problem here.
            // We don't actually care about the error value from `res`, though you can do that in your design.
            // For a more robust design, you can imagine passing custom formatters into `makeLoopStrategy` instead.
            await say(`Invalid input ${s}, please give a valid ${expected}:`);

            // This `fail` does not exit the loop immediately, it goes back to `getInput`.
            return fail(ParseError.PARSE_FAILURE);
        }

        // You might notice that `fail` acts differently in `getInput` and `parse`.
        // There are two more optional functions, `onInputError` and `onParseError`, that changes that behavior.
        // That is also where the values passed to `fail` are used.
        // They won't be used here, since they are for more complicated loops.
    };
}

/**
 * This function wraps an existing parser with a loop, allowing us to prompt until the user inputs correctly.
 * In other words, it is a higher-order function.
 * We will also take in a string, for the expected type of value.
 */
export function loopParse<T>(expected: string, runParser: Parser<T>): ParserAsync<T> {
    // We return a `ParserAsync<T>`, which is a function.
    return (init: string) => loopAsync(makeLoopStrategy(expected, runParser));
}

/**
 * This function is the same as `loopParse`, but wraps `loop1Async` instead.
 * Since `loop1Async` does not take in an initial input, we won't be using this with `Args`.
 */
export async function loop1Parse<T>(expected: string, runParser: Parser<T>): Promise<Result<T, ParseError>> {
    await say(`No input given, please give a valid ${expected}.`);
    return loop1Async(makeLoopStrategy(expected, runParser));
}

/**
 * A function that combines the above with `Args#singleParseAsync`.
 */
export async function singleParseWithLoop<T>(
    args: Args,
    expected: string,
    parser: Parser<T>
): Promise<Result<T, ParseError>> {
    // `Args#singleParseAsync` takes the next ordered token and passes it to a parser.
    // If there are tokens to parse, we will return the result of the loop and parser,
    // and `args` will consider the token to be used.
    // If there are no tokens left, `Args#singleParseAsync` returns null, so `??` will move on to `loop1Parse`.
    // That is, there was no input in the first place so we should prompt for it.
    return await args.singleParseAsync(loopParse(expected, parser))
        ?? await loop1Parse(expected, parser);
}
```

Now we can use our new functions.  

```ts
// ------
// add.ts
// ------

import { Args, Result, ok, err } from 'lexure';
import { ask, say } from 'talking';
import { ParseError, singleParseWithLoop, sayError } from './helpers';

export async function addCommand(args: Args): Promise<void> {
    const n1 = await singleParseWithLoop(args, 'number', parseNumber);
    if (!n1.success) {
        return sayError(n1.error);
    }

    const n2 = await singleParseWithLoop(args, 'number', parseNumber);
    if (!n2.success) {
        return sayError(n2.error);
    }

    const z = n1.value + n2.value;
    return say(`That adds to ${z}.`);
}

function parseNumber(x: string): Result<number, ParseError> {
    const n = Number(x);
    return isNaN(n) ? err(ParseError.PARSE_FAILURE) : ok(n);
}
```
