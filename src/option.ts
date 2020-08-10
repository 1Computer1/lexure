/**
 * A type that can express the lack of a value.
 * Used in this library for when a generic type could be nullable.
 * @typeparam T - Type of results.
 */
export type Option<T> = Some<T> | None;

/**
 * The value exists.
 * @typeparam T - Type of results.
 */
export interface Some<T> {
    /**
     * If this is a Some, this is true.
     */
    readonly exists: true;

    /**
     * The value, which only exists on a Some.
     */
    readonly value: T;
}

/**
 * The value does not exist.
 */
export interface None {
    /**
     * If this is a None, this is false.
     */
    readonly exists: false;

    readonly value?: undefined;
}

/**
 * Creates a Some.
 * @typeparam T - Type of results.
 * @param x - Value to use.
 * @returns An Option.
 */
export function some<T>(x: T): Some<T> {
    return { exists: true, value: x };
}

/**
 * Creates a None.
 * @returns An Option.
 */
export function none(): None {
    return { exists: false };
}

/**
 * Creates an Option from a value that could be null or undefined.
 *
 * ```ts
 * console.log(maybeOption(1));
 * >>> { exists: true, value: 1 }
 *
 * console.log(maybeOption(null));
 * >>> { exists: false }
 *
 * console.log(maybeOption(undefined));
 * >>> { exists: false }
 * ```
 * @param x - A nullable value.
 * @returns An Option.
 */
export function maybeOption<T>(x: T | null | undefined): Option<T> {
    if (x == null) {
        return none();
    }

    return some(x);
}

/**
 * Gets the first Some from many Options.
 * @param xs - The Options.
 * @return The first Some, or None if there were no Some.
 */
export function orOption<T>(...xs: Option<T>[]): Option<T> {
    for (const x of xs) {
        if (x.exists) {
            return x;
        }
    }

    return none();
}
