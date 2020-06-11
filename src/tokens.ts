/**
 * Represents a token.
 */
export type Token = Word | Quoted;

/**
 * A normal word.
 */
export interface Word {
    /**
     * The value of the token.
     */
    readonly value: string;

    /**
     * Trailing whitespace.
     */
    readonly trailing: string;
}

/**
 * A quoted substring.
 */
export interface Quoted {
    /**
     * The value of the token without quotes.
     */
    readonly value: string;

    /**
     * The value of the token with quotes.
     */
    readonly quoted: string;

    /**
     * Trailing whitespace.
     */
    readonly trailing: string;
}

/**
 * Joins tokens together.
 * @param tokens - Tokens to join.
 * @param lossless - Whether to keep trailing whitespace.
 * @returns The joined string.
 */
export function joinTokens(tokens: Token[], lossless = true): string {
    return lossless
        ? tokens.map(t => t.value + t.trailing).join('')
        : tokens.map(t => t.value).join(' ');
}

/**
 * Extracts a command from the first one or two tokens from a list of tokens.
 * The command format is '<prefix> <command>', and the space is optional.
 * @param matchPrefix - A function that gives the length of the prefix if there is one.
 * @param tokens - Tokens to check.
 * @param mutate - Whether to mutate the list of tokens.
 * @returns The name of the command.
 */
export function extractCommand(matchPrefix: (s: string) => number | null, tokens: Token[], mutate = true): string | null {
    if (tokens.length < 1) {
        return null;
    }

    const plen = matchPrefix(tokens[0].value);
    if (plen == null) {
        return null;
    }

    if (tokens[0].value.length === plen) {
        if (tokens.length < 2) {
            return null;
        }

        if (mutate) {
            tokens.shift();
            return tokens.shift()!.value;
        }

        return tokens[1].value;
    }

    if (mutate) {
        return tokens.shift()!.value.slice(plen);
    }

    return tokens[0].value.slice(plen);
}
