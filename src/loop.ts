import { LoopAction, fail, step_ } from './loopAction';
import { Result, ok, err } from './result';

/**
 * A strategy for running an input loop.
 * @typeparam S - Custom state type.
 * @typeparam A - Input type.
 * @typeparam Z - Output type.
 * @typeparam E - Error type.
 */
export interface LoopStrategy<S, A, Z, E> {
    /**
     * Gets new input from somewhere e.g. reading a line.
     * @param state - Custom state.
     * @returns A loop action that can: step with the input; finish with some parsed value; fail due to an error.
     */
    getInput(state: S): LoopAction<A, Z, E>;

    /**
     * Parses given input into the desired type.
     * @param input - The input.
     * @param state - Custom state.
     * @returns A loop action that can: step on; finish with some parsed value; fail due to an error.
     */
    parse(input: A, state: S): LoopAction<null, Z, E>;

    /**
     * Handles error on getting new input.
     * This function intercepts the `fail` case of `getInput`.
     * @param error - The error encountered.
     * @param state - Custom state.
     * @returns A loop action that can: step on; finish with some parsed value; fail due to an error.
     */
    onInputError?(error: E, state: S): LoopAction<null, Z, E>;

    /**
     * Handles error on parsing input.
     * This function intercepts the `fail` case of `parse`.
     * @param error - The error encountered.
     * @param input - The input that could not be parsed.
     * @param state - Custom state.
     * @returns A loop action that can: step on; finish with some parsed value; fail due to an error.
     */
    onParseError?(error: E, input: A, state: S): LoopAction<null, Z, E>;
}

/**
 * A strategy for running an input loop asynchronously via `Promise`.
 * @typeparam S - Custom state type.
 * @typeparam A - Input type.
 * @typeparam Z - Output type.
 * @typeparam E - Error type.
 */
export interface LoopStrategyAsync<S, A, Z, E> {
/**
     * Gets new input from somewhere e.g. reading a line.
     * @param state - Custom state.
     * @returns A loop action that can: step with the input; finish with some parsed value; fail due to an error.
     */
    getInput(state: S): Promise<LoopAction<A, Z, E>>;

    /**
     * Parses given input into the desired type.
     * @param input - The input.
     * @param state - Custom state.
     * @returns A loop action that can: step on; finish with some parsed value; fail due to an error.
     */
    parse(input: A, state: S): Promise<LoopAction<null, Z, E>>;

    /**
     * Handles error on getting new input.
     * This function intercepts the `fail` case of `getInput`.
     * @param error - The error encountered.
     * @param state - Custom state.
     * @returns A loop action that can: step on; finish with some parsed value; fail due to an error.
     */
    onInputError?(error: E, state: S): Promise<LoopAction<null, Z, E>>;

    /**
     * Handles error on parsing input.
     * This function intercepts the `fail` case of `parse`.
     * @param error - The error encountered.
     * @param input - The input that could not be parsed.
     * @param state - Custom state.
     * @returns A loop action that can: step on; finish with some parsed value; fail due to an error.
     */
    onParseError?(error: E, input: A, state: S): Promise<LoopAction<null, Z, E>>;
}

/**
 * Runs a loop which continuously gets input and attempts to parse it.
 * The loop strategy used will determine how the loop continues and ends.
 * @typeparam S - Custom state type.
 * @typeparam A - Input type.
 * @typeparam Z - Output type.
 * @typeparam E - Error type.
 * @param intialInput - The first input to parse.
 * @param state - Custom state to thread along the loop.
 * @param strat - The loop strategy to use.
 * @returns Either the parsed value or an error.
 */
export function loop<S, A, Z, E>(
    intialInput: A,
    state: S,
    strat: LoopStrategy<S, A, Z, E>
): Result<Z, E> {
    let inp = intialInput;
    let parsed = strat.parse(inp, state);
    for (;;) {
        switch (parsed.action) {
            case 'finish':
                return ok(parsed.value);
            
            case 'fail': {
                const r = strat.onParseError?.(parsed.error, inp, state) ?? step_();
                switch (r.action) {
                    case 'finish':
                        return ok(r.value);
                    
                    case 'fail':
                        return err(r.error);
                }
            }
        }

        const got = strat.getInput(state);
        switch (got.action) {            
            case 'step': {
                inp = got.value;
                parsed = strat.parse(inp, state);
                break;
            }

            case 'finish':
                return ok(got.value);

            case 'fail': {
                const r = strat.onInputError?.(got.error, state) ?? fail(got.error);
                switch (r.action) {
                    case 'finish':
                        return ok(r.value);

                    case 'fail':
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
 * @typeparam S - Custom state type.
 * @typeparam A - Input type.
 * @typeparam Z - Output type.
 * @typeparam E - Error type.
 * @param state - Custom state to thread along the loop.
 * @param strat - The loop strategy to use.
 * @returns Either the parsed value or an error.
 */
export function loop1<S, A, Z, E>(
    state: S,
    strat: LoopStrategy<S, A, Z, E>
): Result<Z, E> {
    for (;;) {
        const got = strat.getInput(state);
        switch (got.action) {
            case 'step': {
                const inp = got.value;
                const parsed = strat.parse(inp, state);
                switch (parsed.action) {
                    case 'finish':
                        return ok(parsed.value);

                    case 'fail': {
                        const r = strat.onParseError?.(parsed.error, inp, state) ?? step_();
                        switch (r.action) {
                            case 'finish':
                                return ok(r.value);

                            case 'fail':
                                return err(r.error);
                        }
                    }
                }

                break;
            }

            case 'finish':
                return ok(got.value);

            case 'fail': {
                const r = strat.onInputError?.(got.error, state) ?? fail(got.error);
                switch (r.action) {
                    case 'finish':
                        return ok(r.value);

                    case 'fail':
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
 * @typeparam S - Custom state type.
 * @typeparam A - Input type.
 * @typeparam Z - Output type.
 * @typeparam E - Error type.
 * @param intialInput - The first input to parse.
 * @param state - Custom state to thread along the loop.
 * @param strat - The loop strategy to use.
 * @returns Either the parsed value or an error.
 */
export async function loopAsync<S, A, Z, E>(
    intialInput: A,
    state: S,
    strat: LoopStrategyAsync<S, A, Z, E>
): Promise<Result<Z, E>> {
    let inp = intialInput;
    let parsed = await strat.parse(inp, state);
    for (;;) {
        switch (parsed.action) {
            case 'finish':
                return ok(parsed.value);
            
            case 'fail': {
                const r = await strat.onParseError?.(parsed.error, inp, state) ?? step_();
                switch (r.action) {
                    case 'finish':
                        return ok(r.value);
                    
                    case 'fail':
                        return err(r.error);
                }
            }
        }

        const got = await strat.getInput(state);
        switch (got.action) {            
            case 'step': {
                inp = got.value;
                parsed = await strat.parse(inp, state);
                break;
            }

            case 'finish':
                return ok(got.value);

            case 'fail': {
                const r = await strat.onInputError?.(got.error, state) ?? fail(got.error);
                switch (r.action) {
                    case 'finish':
                        return ok(r.value);

                    case 'fail':
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
 * @typeparam S - Custom state type.
 * @typeparam A - Input type.
 * @typeparam Z - Output type.
 * @typeparam E - Error type.
 * @param state - Custom state to thread along the loop.
 * @param strat - The loop strategy to use.
 * @returns Either the parsed value or an error.
 */
export async function loop1Async<S, A, Z, E>(
    state: S,
    strat: LoopStrategyAsync<S, A, Z, E>
): Promise<Result<Z, E>> {
    for (;;) {
        const got = await strat.getInput(state);
        switch (got.action) {
            case 'step': {
                const inp = got.value;
                const parsed = await strat.parse(inp, state);
                switch (parsed.action) {
                    case 'finish':
                        return ok(parsed.value);

                    case 'fail': {
                        const r = await strat.onParseError?.(parsed.error, inp, state) ?? step_();
                        switch (r.action) {
                            case 'finish':
                                return ok(r.value);

                            case 'fail':
                                return err(r.error);
                        }
                    }
                }

                break;
            }

            case 'finish':
                return ok(got.value);

            case 'fail': {
                const r = await strat.onInputError?.(got.error, state) ?? fail(got.error);
                switch (r.action) {
                    case 'finish':
                        return ok(r.value);

                    case 'fail':
                        return err(r.error);
                }
            }
        }
    }
}
