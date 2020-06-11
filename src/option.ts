/**
 * A type that can express the lack of a value.
 * Used in this library for when a generic type could be nullable.
 */
export type Option<T> = Some<T> | None;

/**
 * The value exists.
 */
export interface Some<T> {
    /**
     * Whether the value exists.
     */
    exists: true;

    /**
     * The value.
     */
    value: T;
}

/**
 * The value does not exist.
 */
export interface None {
    /**
     * Whether the value exists.
     */
    exists: false;
}

/**
 * Creates a Some.
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
