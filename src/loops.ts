import type { Result } from '@sapphire/result';
import { LoopAction, fail, step_, LoopTag } from './loopAction';
import { err, ok } from './result';

const { STEP, FINISH, FAIL } = LoopTag;

/**
 * A strategy for running an input loop.
 * @typeparam A - Input type.
 * @typeparam Z - Output type.
 * @typeparam E - Error type.
 */
export interface LoopStrategy<A, Z, E> {
    /**
     * Gets new input from somewhere e.g. reading a line.
     * @returns A loop action that can: step with the input; finish with some parsed value; fail due to an error.
     */
    getInput(): LoopAction<A, Z, E>;

    /**
     * Parses given input into the desired type.
     * @param input - The input.
     * @returns A loop action that can: step on; finish with some parsed value; fail due to an error.
     */
    parse(input: A): LoopAction<null, Z, E>;

    /**
     * Handles error on getting new input.
     * This function intercepts the `fail` case of `getInput`.
     * @param error - The error encountered.
     * @returns A loop action that can: step on; finish with some parsed value; fail due to an error.
     */
    onInputError?(error: E): LoopAction<null, Z, E>;

    /**
     * Handles error on parsing input.
     * This function intercepts the `fail` case of `parse`.
     * @param error - The error encountered.
     * @param input - The input that could not be parsed.
     * @returns A loop action that can: step on; finish with some parsed value; fail due to an error.
     */
    onParseError?(error: E, input: A): LoopAction<null, Z, E>;
}

/**
 * A strategy for running an input loop asynchronously via `Promise`.
 * @typeparam A - Input type.
 * @typeparam Z - Output type.
 * @typeparam E - Error type.
 */
export interface LoopStrategyAsync<A, Z, E> {
/**
     * Gets new input from somewhere e.g. reading a line.
     * @returns A loop action that can: step with the input; finish with some parsed value; fail due to an error.
     */
    getInput(): Promise<LoopAction<A, Z, E>>;

    /**
     * Parses given input into the desired type.
     * @param input - The input.
     * @returns A loop action that can: step on; finish with some parsed value; fail due to an error.
     */
    parse(input: A): Promise<LoopAction<null, Z, E>>;

    /**
     * Handles error on getting new input.
     * This function intercepts the `fail` case of `getInput`.
     * @param error - The error encountered.
     * @returns A loop action that can: step on; finish with some parsed value; fail due to an error.
     */
    onInputError?(error: E): Promise<LoopAction<null, Z, E>>;

    /**
     * Handles error on parsing input.
     * This function intercepts the `fail` case of `parse`.
     * @param error - The error encountered.
     * @param input - The input that could not be parsed.
     * @returns A loop action that can: step on; finish with some parsed value; fail due to an error.
     */
    onParseError?(error: E, input: A): Promise<LoopAction<null, Z, E>>;
}

/**
 * Runs a loop which continuously gets input and attempts to parse it.
 * The loop strategy used will determine how the loop continues and ends.
 *
 * ```ts
 * const getInputFromSomewhere = () => '2';
 *
 * const x = loop('1', {
 *   getInput() {
 *     const i = getInputFromSomewhere();
 *     return i == null ? fail('no input') : step(i);
 *   },
 *
 *   parse(x: string) {
 *     const n = Number(x);
 *     return isNaN(n) ? fail('bad input') : finish(n);
 *   }
 * });
 *
 * console.log(x);
 * >>> 1
 * ```
 *
 * @typeparam A - Input type.
 * @typeparam Z - Output type.
 * @typeparam E - Error type.
 * @param intialInput - The first input to parse.
 * @param strat - The loop strategy to use.
 * @returns Either the parsed value or an error.
 */
export function loop<A, Z, E>(intialInput: A, strat: LoopStrategy<A, Z, E>): Result<Z, E> {
    let inp = intialInput;
    let parsed = strat.parse(inp);
    for (;;) {
        switch (parsed.action) {
            case FINISH:
                return ok(parsed.value);

            case FAIL: {
                const r = strat.onParseError?.(parsed.error, inp) ?? step_();
                switch (r.action) {
                    case FINISH:
                        return ok(r.value);

                    case FAIL:
                        return err(r.error);
                }
            }
        }

        const got = strat.getInput();
        switch (got.action) {
            case STEP: {
                inp = got.item;
                parsed = strat.parse(inp);
                break;
            }

            case FINISH:
                return ok(got.value);

            case FAIL: {
                const r = strat.onInputError?.(got.error) ?? fail(got.error);
                switch (r.action) {
                    case FINISH:
                        return ok(r.value);

                    case FAIL:
                        return err(r.error);
                }
            }
        }
    }
}

/**
 * Runs a loop which continuously gets input and attempts to parse it.
 * The loop strategy used will determine how the loop continues and ends.
 * This variant has no initial input.
 *
 * ```ts
 * const getInputFromSomewhere = () => '2';
 *
 * const x = loop1({
 *   getInput() {
 *     const i = getInputFromSomewhere();
 *     return i == null ? fail('no input') : step(i);
 *   },
 *
 *   parse(x: string) {
 *     const n = Number(x);
 *     return isNaN(n) ? fail('bad input') : finish(n);
 *   }
 * });
 *
 * console.log(x);
 * >>> 2
 * ```
 *
 * @typeparam A - Input type.
 * @typeparam Z - Output type.
 * @typeparam E - Error type.
 * @param strat - The loop strategy to use.
 * @returns Either the parsed value or an error.
 */
export function loop1<A, Z, E>(strat: LoopStrategy<A, Z, E>): Result<Z, E> {
    for (;;) {
        const got = strat.getInput();
        switch (got.action) {
            case STEP: {
                const inp = got.item;
                const parsed = strat.parse(inp);
                switch (parsed.action) {
                    case FINISH:
                        return ok(parsed.value);

                    case FAIL: {
                        const r = strat.onParseError?.(parsed.error, inp) ?? step_();
                        switch (r.action) {
                            case FINISH:
                                return ok(r.value);

                            case FAIL:
                                return err(r.error);
                        }
                    }
                }

                break;
            }

            case FINISH:
                return ok(got.value);

            case FAIL: {
                const r = strat.onInputError?.(got.error) ?? fail(got.error);
                switch (r.action) {
                    case FINISH:
                        return ok(r.value);

                    case FAIL:
                        return err(r.error);
                }
            }
        }
    }
}

/**
 * Runs a loop which continuously gets input and attempts to parse it.
 * The loop strategy used will determine how the loop continues and ends.
 * This variant of the function is asynchronous using `Promise`.
 * @typeparam A - Input type.
 * @typeparam Z - Output type.
 * @typeparam E - Error type.
 * @param intialInput - The first input to parse.
 * @param strat - The loop strategy to use.
 * @returns Either the parsed value or an error.
 */
export async function loopAsync<A, Z, E>(intialInput: A, strat: LoopStrategyAsync<A, Z, E>): Promise<Result<Z, E>> {
    let inp = intialInput;
    let parsed = await strat.parse(inp);
    for (;;) {
        switch (parsed.action) {
            case FINISH:
                return ok(parsed.value);

            case FAIL: {
                const r = await strat.onParseError?.(parsed.error, inp) ?? step_();
                switch (r.action) {
                    case FINISH:
                        return ok(r.value);

                    case FAIL:
                        return err(r.error);
                }
            }
        }

        const got = await strat.getInput();
        switch (got.action) {
            case STEP: {
                inp = got.item;
                parsed = await strat.parse(inp);
                break;
            }

            case FINISH:
                return ok(got.value);

            case FAIL: {
                const r = await strat.onInputError?.(got.error) ?? fail(got.error);
                switch (r.action) {
                    case FINISH:
                        return ok(r.value);

                    case FAIL:
                        return err(r.error);
                }
            }
        }
    }
}

/**
 * Runs a loop which continuously gets input and attempts to parse it.
 * The loop strategy used will determine how the loop continues and ends.
 * This variant has no initial input.
 * This variant of the function is asynchronous using `Promise`.
 * @typeparam A - Input type.
 * @typeparam Z - Output type.
 * @typeparam E - Error type.
 * @param strat - The loop strategy to use.
 * @returns Either the parsed value or an error.
 */
export async function loop1Async<A, Z, E>(strat: LoopStrategyAsync<A, Z, E>): Promise<Result<Z, E>> {
    for (;;) {
        const got = await strat.getInput();
        switch (got.action) {
            case STEP: {
                const inp = got.item;
                const parsed = await strat.parse(inp);
                switch (parsed.action) {
                    case FINISH:
                        return ok(parsed.value);

                    case FAIL: {
                        const r = await strat.onParseError?.(parsed.error, inp) ?? step_();
                        switch (r.action) {
                            case FINISH:
                                return ok(r.value);

                            case FAIL:
                                return err(r.error);
                        }
                    }
                }

                break;
            }

            case FINISH:
                return ok(got.value);

            case FAIL: {
                const r = await strat.onInputError?.(got.error) ?? fail(got.error);
                switch (r.action) {
                    case FINISH:
                        return ok(r.value);

                    case FAIL:
                        return err(r.error);
                }
            }
        }
    }
}
