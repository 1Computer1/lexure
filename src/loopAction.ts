/**
 * A type used to express actions in the loop.
 * Each action can have a value with it.
 * @typeparam A - Type of step results.
 * @typeparam B - Type of finish results.
 * @typeparam E - Type of errors.
 */
export type LoopAction<A, B, E> = Step<A> | Finish<B> | Fail<E>;

/**
 * Tag for the loop action variants.
 */
export enum LoopTag {
    STEP = 'step',
    FINISH = 'finish',
    FAIL = 'fail'
}

/**
 * The loop should continue being stepped through.
 * @typeparam A - Type of step results.
 */
export interface Step<A> {
    /**
     * Whether the loop should continue.
     */
    action: LoopTag.STEP;

    /**
     * The resulting value.
     */
    value: A;
}

/**
 * The loop should finish successfully.
 * @typeparam B - Type of finish results.
 */
export interface Finish<B> {
    /**
     * Whether the loop should continue.
     */
    action: LoopTag.FINISH;

    /**
     * The resulting value.
     */
    value: B;
}

/**
 * The loop should fail due to an error.
 * @typeparam E - Type of errors.
 */
export interface Fail<E> {
    /**
     * Whether the loop should continue.
     */
    action: LoopTag.FAIL;

    /**
     * The resulting error.
     */
    error: E;
}

/**
 * Creates a Step.
 * @typeparam A - Type of step results.
 * @param x - Value to use.
 * @returns A LoopAction.
 */
export function step<A>(x: A): Step<A> {
    return { action: LoopTag.STEP, value: x };
}

/**
 * Creates a Step with null value.
 * @returns A LoopAction.
 */
export function step_(): Step<null> {
    return { action: LoopTag.STEP, value: null };
}

/**
 * Creates a Finish.
 * @typeparam B - Type of finish results.
 * @param x - Value to use.
 * @returns A LoopAction.
 */
export function finish<B>(x: B): Finish<B> {
    return { action: LoopTag.FINISH, value: x };
}

/**
 * Creates a Fail.
 * @typeparam E - Type of errors.
 * @param x - Value to use.
 * @returns A LoopAction.
 */
export function fail<E>(x: E): Fail<E> {
    return { action: LoopTag.FAIL, error: x };
}
