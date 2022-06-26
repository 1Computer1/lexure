import { Result } from '@sapphire/result';

const { ok, err } = Result;

/**
 * Gets the first Ok from many Results.
 * @param x - The first Result.
 * @param xs - The remaining Results; this encoding is to ensure there is at least one Result.
 * @return The first Ok, or all the Errs if there were no Ok.
 */
export function orResultAll<T, E>(x: Result<T, E>, ...xs: Result<T, E>[]): Result<T, E[]> {
    if (x.isOk()) {
        return x as Result<T, E[]>;
    }

    const es = [x.unwrapErr()];
    for (const x of xs) {
        if (x.isOk()) {
            return x as Result<T, E[]>;
        }

        es.push(x.unwrapErr());
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
    if (x.isOk()) {
        return x;
    }

    const e = x.unwrapErr();
    for (const x of xs) {
        if (x.isOk()) {
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
    if (x.isOk()) {
        return x;
    }

    let e = x.unwrapErr();
    for (const x of xs) {
        if (x.isOk()) {
            return x;
        }

        e = x.unwrapErr();
    }

    return err(e);
}

export { ok, err, Result };
