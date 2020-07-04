/**
 * A type used to express actions in the loop.
 * Each action can have a value with it.
 */
export type LoopAction<A, B, E> = Step<A> | Finish<B> | Fail<E>;

/**
 * The loop should continue being stepped through.
 */
export interface Step<T> {
    /**
     * Whether the loop should continue.
     */
    action: 'step';

    /**
     * The resulting value.
     */
    value: T;
}

/**
 * The loop should finish successfully.
 */
export interface Finish<T> {
    /**
     * Whether the loop should continue.
     */
    action: 'finish';

    /**
     * The resulting value.
     */
    value: T;
}

/**
 * The loop should fail due to an error.
 */
export interface Fail<E> {
    /**
     * Whether the loop should continue.
     */
    action: 'fail';

    /**
     * The resulting error.
     */
    error: E;
}

/**
 * Creates a Step.
 * @param x - Value to use.
 * @returns A LoopAction.
 */
export function step<T>(x: T): Step<T> {
    return { action: 'step', value: x };
}

/**
 * Creates a Step with null value.
 * @returns A LoopAction.
 */
export function step_(): Step<null> {
    return { action: 'step', value: null };
}

/**
 * Creates a Finish.
 * @param x - Value to use.
 * @returns A LoopAction.
 */
export function finish<T>(x: T): Finish<T> {
    return { action: 'finish', value: x };
}

/**
 * Creates a Fail.
 * @param x - Value to use.
 * @returns A LoopAction.
 */
export function fail<T>(x: T): Fail<T> {
    return { action: 'fail', error: x };
}
