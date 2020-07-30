import { Option, some, none } from './option';
import { Result, ok, err } from './result';
import { LoopAction, step, finish, fail } from './loopAction';

/**
 * Converts an Option to a Result.
 * - Some -> Ok
 * - None -> Err
 * @param x - The Option.
 * @param error - The error if None.
 * @returns A Result.
 */
export function someToOk<T, E>(x: Option<T>, error: E): Result<T, E> {
    if (x.exists) {
        return ok(x.value);
    }

    return err(error);
}

/**
 * Converts a Result to an Option.
 * - Ok -> Some
 * - Err -> None
 * @param x - The Result.
 * @returns An Option.
 */
export function okToSome<T, E>(x: Result<T, E>): Option<T> {
    if (x.success) {
        return some(x.value);
    }

    return none();
}

/**
 * Converts a Result to an Option.
 * - Ok -> None
 * - Err -> Some
 * @param x - The Result.
 * @returns An Option.
 */
export function errToSome<T, E>(x: Result<T, E>): Option<E> {
    if (!x.success) {
        return some(x.error);
    }

    return none();
}

/**
 * Converts an Option to a LoopAction.
 * - Some -> Step
 * - None -> Fail
 * @param x - The Option.
 * @param error - The error if None.
 * @returns A LoopAction.
 */
export function someToStep<A, B, E>(x: Option<A>, error: E): LoopAction<A, B, E> {
    if (x.exists) {
        return step(x.value);
    }

    return fail(error);
}

/**
 * Converts an Option to a LoopAction.
 * - Some -> Finish
 * - None -> Fail
 * @param x - The Option.
 * @param error - The error if None.
 * @returns A LoopAction.
 */
export function someToFinish<A, B, E>(x: Option<B>, error: E): LoopAction<A, B, E> {
    if (x.exists) {
        return finish(x.value);
    }

    return fail(error);
}

/**
 * Converts a Result to a LoopAction.
 * - Ok -> Step
 * - Err -> Fail
 * @param x - The Result.
 * @returns A LoopAction.
 */
export function okToStep<A, B, E>(x: Result<A, E>): LoopAction<A, B, E> {
    if (x.success) {
        return step(x.value);
    }

    return fail(x.error);
}

/**
 * Converts a Result to a LoopAction.
 * - Ok -> Finish
 * - Err -> Fail
 * @param x - The Result.
 * @returns A LoopAction.
 */
export function okToFinish<A, B, E>(x: Result<B, E>): LoopAction<A, B, E> {
    if (x.success) {
        return finish(x.value);
    }

    return fail(x.error);
}
