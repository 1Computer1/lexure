/**
 * Represents a token.
 */
export class Token {
    /**
     * The value of the token.
     */
    public readonly value: string;

    /**
     * Trailing whitespace.
     */
    public readonly trailing: string;

    /**
     * @param value - The value of the token.
     * @param trailing - Trailing whitespace.
     */
    public constructor(value: string, trailing: string) {
        this.value = value;
        this.trailing = trailing;
    }
}

/**
 * A normal word.
 */
export class Word extends Token {

}

/**
 * A quoted substring.
 */
export class Quoted extends Token {
    /**
     * The value without quotes.
     */
    public readonly innerValue: string;

    /**
     * @param value - The value of the token.
     * @param innerValue - The value without quotes.
     * @param trailing - Trailing whitespace.
     */
    public constructor(value: string, innerValue: string, trailing: string) {
        super(value, trailing);

        this.innerValue = innerValue;
    }
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
