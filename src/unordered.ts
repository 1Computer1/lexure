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
 * The matching is done in a case-sensitive manner.
 * Also note that if the input contains multiple of the separators, the matching may be ambiguous.
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

function findPairing(ps: Pairing, p: (w: string) => boolean): [string, string] | null {
    for (const [k, ws] of Object.entries(ps)) {
        for (const w of ws) {
            if (p(w)) {
                return [k, w];
            }
        }
    }

    return null;
}

/**
 * Match unordered arguments according to a record of the names to the list of words.
 * Prefixes like '--' and separators like '=' should be a part of the word.
 * This function uses
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator}
 * which can compare in different locales and different sensitivities.
 * Note that this only works for en-US if you are below Node 13.0.0.
 *
 * ```ts
 * const st = matchingStrategy({ flag: ['--flag', '-f'] }, {});
 * console.log(st.matchFlag('--flag'));
 * >>> 'flag'
 *
 * console.log(st.matchOption('-f'));
 * >>> 'flag'
 *
 * const stbase = matchingStrategy({ flag: ['--flag'] }, {}, 'en-US', { sensitivity: 'base' });
 * console.log(stbase.matchFlag('--FLAG'));
 * >>> 'flag'
 *
 * console.log(stbase.matchFlag('--flág'));
 * >>> 'flag'
 * ```
 *
 * @param flags - Words usable as flags.
 * @param options - Words usable as options.
 * They should be ordered by length in non-increasing order.
 * @param locales - Locale(s) to use.
 * @param collatorOptions - Options for comparing strings.
 * See {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator/Collator}
 * for more information.
 * @returns The strategy.
 */
export function matchingStrategy(
    flags: Pairing,
    options: Pairing,
    locales?: string | string[] | undefined,
    collatorOptions?: Intl.CollatorOptions
): UnorderedStrategy {
    const compare = new Intl.Collator(locales, collatorOptions).compare;
    const eq = (w: string, s: string): boolean => compare(w, s) === 0;

    return {
        matchFlag(s: string) {
            const res = findPairing(flags, w => eq(w, s));
            return res?.[0] ?? null;
        },

        matchOption(s: string) {
            const res = findPairing(options, w => eq(w, s));
            return res?.[0] ?? null;
        },

        matchCompactOption(s: string) {
            const res = findPairing(options, w => eq(w, s.slice(0, w.length)));
            if (res == null) {
                return null;
            }

            const [k, w] = res;
            const v = s.slice(w.length);
            return [k, v];
        }
    };
}

/**
 * Creates a new strategy that maps the names of flags and options in an unordered strategy.
 * ```ts
 * const st1 = longStrategy();
 *
 * console.log(st1.matchFlag('--foo'), st1.matchFlag('--FOO'));
 * >>> 'foo' 'FOO'
 *
 * const st2 = mapStrategy(longStrategy(), k => k.toLowerCase());
 *
 * console.log(st2.matchFlag('--foo'), st1.matchFlag('--FOO'));
 * >>> 'foo' 'foo'
 * ```
 * @param strat - A strategy.
 * @param f - Creates a new name from the old name, or return null to not include it.
 * @returns A new strategy.
 */
export function mapKeys(strat: UnorderedStrategy, f: (s: string) => string | null): UnorderedStrategy {
    return {
        matchFlag(s: string) {
            const m = strat.matchFlag(s);
            return m == null ? null : f(m);
        },

        matchOption(s: string) {
            const m = strat.matchOption(s);
            return m == null ? null : f(m);
        },

        matchCompactOption(s: string) {
            const m = strat.matchCompactOption(s);
            if (m == null) {
                return null;
            }

            const k = f(m[0]);
            return k == null ? null : [k, m[1]];
        }
    };
}

/**
 * Creates a new strategy that renames the names of flags and options of another strategy.
 * This is done according to a record of the names to a list of words.
 * This function uses
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator}
 * which can compare in different locales and different sensitivities.
 * Note that this only works for en-US if you are below Node 13.0.0.
 *
 * ```ts
 * const st = renameStrategy(longStrategy(), { foo: ['bar'] });
 *
 * console.log(st.matchFlag('--bar'));
 * >>> 'foo'
 * ```
 *
 * @param strat - A strategy.
 * @param keys - The pairing of keys.
 * @param keepNotFound - Whether to keep keys that are not found in `keys`; defaults to true.
 * @param locales - Locale(s) to use.
 * @param collatorOptions - Options for comparing strings.
 * See {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator/Collator}
 * for more information.
 * @returns A new strategy.
 */
export function renameKeys(
    strat: UnorderedStrategy,
    keys: Pairing,
    keepNotFound = true,
    locales?: string | string[] | undefined,
    collatorOptions?: Intl.CollatorOptions
): UnorderedStrategy {
    const compare = new Intl.Collator(locales, collatorOptions).compare;
    const eq = (w: string, s: string): boolean => compare(w, s) === 0;

    return mapKeys(strat, k => {
        const res = findPairing(keys, w => eq(w, k))?.[0] ?? null;
        return keepNotFound && res == null ? k : res;
    });
}
