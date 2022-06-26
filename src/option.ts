import { Option } from '@sapphire/result';

const { some, none } = Option;

/**
 * Gets the first Some from many Options.
 * @param xs - The Options.
 * @return The first Some, or None if there were no Some.
 */
export function orOption<T>(...xs: Option<T>[]): Option<T> {
    for (const x of xs) {
        if (x.isSome()) {
            return x;
        }
    }

    return none;
}

export { Option, some, none };
