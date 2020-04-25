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
 * Match unordered arguments according to a list of possible words in a case-insensitive manner.
 * Prefixes like '--' and separators like '=' should be apart of the word.
 * @param flags - Words usable as flags.
 * @param options - Words usable as options.
 * @param compactOptions - Words usable as the key of compact options.
 * @returns The strategy.
 */
export function caseInsensitiveStrategy(flags: string[], options: string[], compactOptions: string[]): UnorderedStrategy {
    return {
        matchFlag: (s: string) => {
            s = s.toLowerCase();
            return flags.find(x => s === x.toLowerCase()) ?? null;
        },
        matchOption: (s: string) => {
            s = s.toLowerCase();
            return options.find(x => s === x.toLowerCase()) ?? null;
        },
        matchCompactOption: (s: string) => {
            const s1 = s.toLowerCase();
            const k = compactOptions.find(x => s1.startsWith(x.toLowerCase())) ?? null;
            if (k == null) {
                return null;
            }

            const v = s.slice(k.length);
            return [k, v];
        }
    };
}
