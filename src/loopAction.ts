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
     * If this is a Step, this is 'step'.
     */
    readonly action: LoopTag.STEP;

    /**
     * The item to step with.
     */
    readonly item: A;

    readonly value?: undefined;

    readonly error?: undefined;
}

/**
 * The loop should finish successfully.
 * @typeparam B - Type of finish results.
 */
export interface Finish<B> {
    /**
     * If this is a Finish, this is 'finish'.
     */
    readonly action: LoopTag.FINISH;

    readonly item?: undefined;

    /**
     * The resulting value.
     */
    readonly value: B;

    readonly error?: undefined;
}

/**
 * The loop should fail due to an error.
 * @typeparam E - Type of errors.
 */
export interface Fail<E> {
    /**
     * If this is a Fail, this is 'fail'.
     */
    readonly action: LoopTag.FAIL;

    readonly item?: undefined;

    readonly value?: undefined;

    /**
     * The resulting error.
     */
    readonly error: E;
}

/**
 * Creates a Step.
 * @typeparam A - Type of step results.
 * @param x - Value to use.
 * @returns A LoopAction.
 */
export function step<A>(x: A): Step<A> {
    return { action: LoopTag.STEP, item: x };
}

/**
 * Creates a Step with null value.
 * @returns A LoopAction.
 */
export function step_(): Step<null> {
    return { action: LoopTag.STEP, item: null };
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

/**
 * Creates a Fail with null value.
 * @returns A LoopAction.
 */
export function fail_(): Fail<null> {
    return { action: LoopTag.FAIL, error: null };
}
