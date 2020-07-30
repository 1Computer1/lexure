/**
 * A type used to express computations that can fail.
 * @typeparam T - Type of results.
 * @typeparam E - Type of errors.
 */
export type Result<T, E> = Ok<T> | Err<E>;

/**
 * The computation is successful.
 * @typeparam T - Type of results.
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
 * @typeparam E - Type of errors.
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
 * @typeparam T - Type of results.
 * @param x - Value to use.
 * @returns A Result.
 */
export function ok<T>(x: T): Ok<T> {
    return { success: true, value: x };
}

/**
 * Creates an Err.
 * @typeparam E - Type of errors.
 * @param x - Value to use.
 * @returns A Result.
 */
export function err<E>(x: E): Err<E> {
    return { success: false, error: x };
}

/**
 * Creates an Err with null value.
 * @returns A Result.
 */
export function err_(): Err<null> {
    return { success: false, error: null };
}
