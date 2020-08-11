/**
 * A strategy to match unordered arguments in parsing.
 */
export interface UnorderedStrategy {
    /**
     * Match a flag.
     * @param s - The string.
     * @returns The name of the flag.
     */
    matchFlag(s: string): string | null;

    /**
     * Match an option.
     * @param s - The string.
     * @returns The name of the option.
     */
    matchOption(s: string): string | null;

    /**
     * Match a compact option.
     * @param s - The string.
     * @returns A pair containing the name of the option and the value.
     */
    matchCompactOption(s: string): [string, string] | null;
}

/**
 * Do not match any unordered argument at all.
 * @returns The strategy.
 */
export function noStrategy(): UnorderedStrategy {
    return {
        matchFlag: () => null,
        matchOption: () => null,
        matchCompactOption: () => null
    };
}

/**
 * Match unordered arguments according to conventional syntax.
 * '--flag' is a flag.
 * '--opt=' is an option.
 * '--opt=123' is a compact option.
 * @returns The strategy.
 */
export function longStrategy(): UnorderedStrategy {
    return prefixedStrategy(['--'], ['=']);
}

/**
 * Match unordered arguments according to conventional syntax.
 * '--flag' or '-flag' is a flag.
 * '--opt=' or '-opt=' is an option.
 * '--opt=123' or '-opt=123' is a compact option.
 * @returns The strategy.
 */
export function longShortStrategy(): UnorderedStrategy {
    return prefixedStrategy(['--', '-'], ['=']);
}

/**
 * Match unordered arguments with custom prefix and separator.
 * The prefix is the part the preceeds the key name, e.g. '--' in '--foo'.
 * The separator is the part that delimits the key and value e.g. '=' in '--key=value'.
 * It is expected that there are no spaces in the prefixes and separators.
 *
 * ```ts
 * const st = prefixedStrategy(['--'], ['=']);
 * console.log(st.matchFlag('--f'));
 * >>> 'f'
 *
 * console.log(st.matchOption('--opt='));
 * >>> 'opt'
 *
 * console.log(st.matchCompactOption('--opt=15'));
 * >>> ['opt', '15']
 * ```
 *
 * @param prefixes - The prefixes to use for unordered arguments.
 * They should be ordered by length in non-increasing order.
 * @param separators - The symbols to use to separate the key and value in options.
 * They should be ordered by length in non-increasing order.
 * @returns The strategy.
 */
export function prefixedStrategy(prefixes: string[], separators: string[]): UnorderedStrategy {
    return {
        matchFlag(s: string) {
            const pre = prefixes.find(x => s.startsWith(x));
            if (pre == null) {
                return null;
            }

            s = s.slice(pre.length);
            const sep = separators.find(x => s.includes(x));
            if (sep != null) {
                return null;
            }

            return s;
        },

        matchOption(s: string) {
            const pre = prefixes.find(x => s.startsWith(x));
            if (pre == null) {
                return null;
            }

            s = s.slice(pre.length);
            const sep = separators.find(x => s.endsWith(x));
            if (sep == null) {
                return null;
            }

            return s.slice(0, -sep.length);
        },

        matchCompactOption(s: string) {
            const pre = prefixes.find(x => s.startsWith(x));
            if (pre == null) {
                return null;
            }

            s = s.slice(pre.length);
            const sep = separators.find(x => s.includes(x));
            if (sep == null) {
                return null;
            }

            const i = s.indexOf(sep);
            if (i + sep.length === s.length) {
                return null;
            }

            const k = s.slice(0, i);
            const v = s.slice(i + sep.length);
            return [k, v];
        }
    };
}

/**
 * Pairing of flag/option names to the words usable for them.
 */
type Pairing = Record<string, string[]>;

/**
 * Match unordered arguments according to a record of the names to the list of words in a case-sensitive manner.
 * Prefixes like '--' and separators like '=' should be a part of the word.
 * For case-insensitive matching, use {@linkcode caseInsensitiveStrategy}.
 *
 * ```ts
 * const st = exactStrategy({ flag: ['--flag', '-f'] }, {});
 * console.log(st.matchFlag('--flag'));
 * >>> 'flag'
 *
 * console.log(st.matchOption('-f'));
 * >>> 'flag'
 * ```
 *
 * @param flags - Words usable as flags.
 * @param options - Words usable as options.
 * They should be ordered by length in non-increasing order.
 * @returns The strategy.
 */
export function exactStrategy(flags: Pairing, options: Pairing): UnorderedStrategy {
    return {
        matchFlag(s: string) {
            return Object.entries(flags)
                .find(xs => xs[1].some(x => s === x))?.[0] ?? null;
        },

        matchOption(s: string) {
            return Object.entries(options)
                .find(xs => xs[1].some(x => s === x))?.[0] ?? null;
        },

        matchCompactOption(s: string) {
            const k = Object.entries(options)
                .find(xs => xs[1].some(x => s.startsWith(x)))?.[0] ?? null;

            if (k == null) {
                return null;
            }

            const v = s.slice(k.length);
            return [k, v];
        }
    };
}

/**
 * Match unordered arguments according to a record of the names to a list of words in a case-insensitive manner.
 * Prefixes like '--' and separators like '=' should be a part of the word.
 * For case-sensitive matching, use {@linkcode exactStrategy}.
 *
 * ```ts
 * const st = caseInsensitiveStrategy({ flag: ['--flag', '-f'] }, {});
 * console.log(st.matchFlag('--FlAg'));
 * >>> 'flag'
 *
 * console.log(st.matchOption('-F'));
 * >>> 'flag'
 * ```
 *
 * @param flags - Words usable as flags.
 * @param options - Words usable as options.
 * They should be ordered by length in non-increasing order.
 * @param locale - The locale(s) to use to compare case.
 * @returns The strategy.
 */
export function caseInsensitiveStrategy(
    flags: Pairing,
    options: Pairing,
    locale?: string | string[]
): UnorderedStrategy {
    return {
        matchFlag(s: string) {
            s = s.toLocaleLowerCase(locale);
            return Object.entries(flags)
                .find(xs => xs[1].some(x => s === x.toLocaleLowerCase(locale)))?.[0] ?? null;
        },

        matchOption(s: string) {
            s = s.toLocaleLowerCase(locale);
            return Object.entries(options)
                .find(xs => xs[1].some(x => s === x.toLocaleLowerCase(locale)))?.[0] ?? null;
        },

        matchCompactOption(s: string) {
            const s1 = s.toLocaleLowerCase(locale);
            const k = Object.entries(options)
                .find(xs => xs[1].some(x => s1.startsWith(x.toLocaleLowerCase(locale))))?.[0] ?? null;

            if (k == null) {
                return null;
            }

            const v = s.slice(k.length);
            return [k, v];
        }
    };
}
