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
     * The value of the token.
     */
    readonly value: string;

    /**
     * The value without quotes.
     */
    readonly innerValue: string;

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
