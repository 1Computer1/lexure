/**
 * A type used to express computations that can fail.
 */
export type Result<T, E> = Ok<T> | Err<E>;

/**
 * The computation is successful.
 */
export interface Ok<T> {
    /**
     * Whether the computation is successful.
     */
    success: true;

    /**
     * The resulting value.
     */
    value: T;
}

/**
 * The computation failed.
 */
export interface Err<E> {
    /**
     * Whether the computation is successful.
     */
    success: false;

    /**
     * The resulting error.
     */
    error: E;
}

/**
 * Creates an Ok.
 * @param x - Value to use.
 * @returns A Result.
 */
export function ok<T>(x: T): Ok<T> {
    return { success: true, value: x };
}

/**
 * Creates an Err.
 * @param x - Value to use.
 * @returns A Result.
 */
export function err<T>(x: T): Err<T> {
    return { success: false, error: x };
}
