import type { Option, Result } from '@sapphire/result';
import { LoopAction, step, finish, fail } from './loopAction';
import { none, some } from './option';

/**
 * Converts an Option to a Result.
 * - Some -> Ok
 * - None -> Err
 * @param x - The Option.
 * @param error - The error if None.
 * @returns A Result.
 */
export function someToOk<T, E>(x: Option<T>, error: E): Result<T, E> {
    return x.okOr(error);
}

/**
 * Converts a Result to an Option.
 * - Ok -> Some
 * - Err -> None
 * @param x - The Result.
 * @returns An Option.
 */
export function okToSome<T, E>(x: Result<T, E>): Option<T> {
    return x.match<Option<T>>({
        ok: (v) => some(v),
        err: () => none,
    });
}

/**
 * Converts a Result to an Option.
 * - Ok -> None
 * - Err -> Some
 * @param x - The Result.
 * @returns An Option.
 */
export function errToSome<T, E>(x: Result<T, E>): Option<E> {
    return x.match<Option<E>>({
        ok: () => none,
        err: (e) => some(e),
    });
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
    return x.match<LoopAction<A, B, E>>({
        some: (v) => step(v),
        none: () => fail(error),
    });
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
    return x.match<LoopAction<A, B, E>>({
        some: (v) => finish(v),
        none: () => fail(error),
    });
}

/**
 * Converts a Result to a LoopAction.
 * - Ok -> Step
 * - Err -> Fail
 * @param x - The Result.
 * @returns A LoopAction.
 */
export function okToStep<A, B, E>(x: Result<A, E>): LoopAction<A, B, E> {
    return x.match<LoopAction<A, B, E>>({
        ok: (v) => step(v),
        err: (e) => fail(e),
    });
}

/**
 * Converts a Result to a LoopAction.
 * - Ok -> Finish
 * - Err -> Fail
 * @param x - The Result.
 * @returns A LoopAction.
 */
export function okToFinish<A, B, E>(x: Result<B, E>): LoopAction<A, B, E> {
    return x.match<LoopAction<A, B, E>>({
        ok: (v) => finish(v),
        err: (e) => fail(e),
    });
}
