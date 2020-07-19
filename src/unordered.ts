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
    return {
        matchFlag: (s: string) => s.match(/^--([^=]+)$/)?.[1] ?? null,
        matchOption: (s: string) => s.match(/^--(.+)=$/)?.[1] ?? null,
        matchCompactOption: (s: string) => {
            const m = s.match(/^--(.+)=(.+)$/);
            if (m == null) {
                return null;
            }

            return [m[1], m[2]];
        }
    };
}

/**
 * Match unordered arguments according to conventional syntax.
 * '--flag' or '-f' is a flag.
 * '--opt=' is an option.
 * '--opt=123' or '-o123' is a compact option.
 * @returns The strategy.
 */
export function longShortStrategy(): UnorderedStrategy {
    return {
        matchFlag: (s: string) => s.match(/^--([^=]+)$/)?.[1] ?? s.match(/^-([^=])$/)?.[1] ?? null,
        matchOption: (s: string) => s.match(/^--(.+)=$/)?.[1] ?? null,
        matchCompactOption: (s: string) => {
            const m = s.match(/^--(.+)=(.+)$/) || s.match(/^-([^-])(.+)$/);
            if (m == null) {
                return null;
            }

            return [m[1], m[2]];
        }
    };
}

/**
 * Match unordered arguments with custom prefix and separator.
 * The prefix is the part the preceeds the key name, e.g. '--' in '--foo'.
 * The separator is the part that delimits the key and value e.g. '=' in '--key=value'.
 * @param prefixes - The prefixes to use for unordered arguments.
 * @param separators - The symbol to use to separate the key and value in options.
 * @returns The strategy.
 */
export function prefixedStrategy(prefixes: string[], separators: string[]): UnorderedStrategy {
    return {
        matchFlag: (s: string) => {
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
        matchOption: (s: string) => {
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
        matchCompactOption: (s: string) => {
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
 * Match unordered arguments according to a list of possible words in a case-sensitive manner.
 * Prefixes like '--' and separators like '=' should be a part of the word.
 * @param flags - Words usable as flags.
 * @param options - Words usable as options.
 * @param compactOptions - Words usable as the key of compact options.
 * @returns The strategy.
 */
export function exactStrategy(flags: string[], options: string[], compactOptions: string[]): UnorderedStrategy {
    return {
        matchFlag: (s: string) => {
            return flags.find(x => s === x) ?? null;
        },
        matchOption: (s: string) => {
            return options.find(x => s === x) ?? null;
        },
        matchCompactOption: (s: string) => {
            const k = compactOptions.find(x => s.startsWith(x)) ?? null;
            if (k == null) {
                return null;
            }

            const v = s.slice(k.length);
            return [k, v];
        }
    };
}

/**
 * Match unordered arguments according to a list of possible words in a case-insensitive manner.
 * Prefixes like '--' and separators like '=' should be a part of the word.
 * @param flags - Words usable as flags.
 * @param options - Words usable as options.
 * @param compactOptions - Words usable as the key of compact options.
 * @param locale - The locale(s) to use to compare case.
 * @returns The strategy.
 */
export function caseInsensitiveStrategy(
    flags: string[],
    options: string[],
    compactOptions: string[],
    locale?: string | string[]
): UnorderedStrategy {
    return {
        matchFlag: (s: string) => {
            s = s.toLocaleLowerCase(locale);
            return flags.find(x => s === x.toLocaleLowerCase(locale)) ?? null;
        },
        matchOption: (s: string) => {
            s = s.toLocaleLowerCase(locale);
            return options.find(x => s === x.toLocaleLowerCase(locale)) ?? null;
        },
        matchCompactOption: (s: string) => {
            const s1 = s.toLocaleLowerCase(locale);
            const k = compactOptions.find(x => s1.startsWith(x.toLocaleLowerCase(locale))) ?? null;
            if (k == null) {
                return null;
            }

            const v = s.slice(k.length);
            return [k, v];
        }
    };
}
