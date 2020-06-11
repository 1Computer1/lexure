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
 * Gets the quoted value if the token is quoted, otherwise gets the value.
 * @param token - The token.
 * @returns The value.
 */
export function getOriginal(token: Token): string {
    if ('quoted' in token) {
        return token.quoted;
    }

    return token.value;
}

/**
 * Joins tokens together.
 * By default, this keeps as much of the original input as possible.
 * @param tokens - Tokens to join.
 * @param separator - The separator, if null, will use original trailing whitespace; defaults to null.
 * @param keepQuotes - Whether to keep quotes; defaults to true.
 * @returns The joined string.
 */
export function joinTokens(tokens: Token[], separator: string | null = null, keepQuotes = true): string {
    if (separator != null && !keepQuotes) {
        return tokens.map(t => t.value).join(separator);
    }

    const xs = [];
    for (let i = 0; i < tokens.length - 1; i++) {
        const t = tokens[i];
        xs.push(keepQuotes ? getOriginal(t) : t.value);
        xs.push(separator ?? t.trailing);
    }

    const last = tokens[tokens.length - 1];
    xs.push(keepQuotes ? getOriginal(last) : last.value);
    return xs.join('');
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
