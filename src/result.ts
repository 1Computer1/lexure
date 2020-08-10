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
     * If this is an Ok, this is true.
     */
    readonly success: true;

    /**
     * The resulting value, which only exists on an Ok.
     */
    readonly value: T;

    readonly error?: undefined
}

/**
 * The computation failed.
 * @typeparam E - Type of errors.
 */
export interface Err<E> {
    /**
     * If this an Err, this is false.
     */
    readonly success: false;

    readonly value?: undefined

    /**
     * The resulting error, which only exists on an Err.
     */
    readonly error: E;
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

/**
 * Creates a Result from a value that could be null or undefined.
 *
 * ```ts
 * console.log(maybeResult(1, 'bad'));
 * >>> { success: true, value: 1 }
 *
 * console.log(maybeResult(null, 'bad'));
 * >>> { success: false, error: 'bad' }
 *
 * console.log(maybeResult(undefined, 'bad'));
 * >>> { success: false, error: 'bad' }
 * ```
 * @param x - A nullable value.
 * @param e - The error to use.
 * @returns A Result.
 */
export function maybeResult<T, E>(x: T | null | undefined, e: E): Result<T, E> {
    if (x == null) {
        return err(e);
    }

    return ok(x);
}

/**
 * Gets the first Ok from many Results.
 * @param x - The first Result.
 * @param xs - The remaining Results; this encoding is to ensure there is at least one Result.
 * @return The first Ok, or all the Errs if there were no Ok.
 */
export function orResultAll<T, E>(x: Result<T, E>, ...xs: Result<T, E>[]): Result<T, E[]> {
    if (x.success) {
        return x;
    }

    const es = [x.error];
    for (const x of xs) {
        if (x.success) {
            return x;
        }

        es.push(x.error);
    }

    return err(es);
}

/**
 * Gets the first Ok from many Results.
 * @param x - The first Result.
 * @param xs - The remaining Results; this encoding is to ensure there is at least one Result.
 * @return The first Ok, or the first Err if there were no Ok.
 */
export function orResultFirst<T, E>(x: Result<T, E>, ...xs: Result<T, E>[]): Result<T, E> {
    if (x.success) {
        return x;
    }

    const e = x.error;
    for (const x of xs) {
        if (x.success) {
            return x;
        }
    }

    return err(e);
}

/**
 * Gets the first Ok from many Results.
 * @param x - The first Result.
 * @param xs - The remaining Results; this encoding is to ensure there is at least one Result.
 * @return The first Ok, or the last Err if there were no Ok.
 */
export function orResultLast<T, E>(x: Result<T, E>, ...xs: Result<T, E>[]): Result<T, E> {
    if (x.success) {
        return x;
    }

    let e = x.error;
    for (const x of xs) {
        if (x.success) {
            return x;
        }

        e = x.error;
    }

    return err(e);
}
