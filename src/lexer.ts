import { Token, Word, Quoted } from './tokens';

/**
 * The lexer turns input into a list of tokens.
 */
export default class Lexer implements IterableIterator<Token> {
    private readonly input: string;

    private quotes: [string, string][] = [];
    private position = 0;

    /**
     * @param input - Input string.
     */
    public constructor(input: string) {
        this.input = input;
    }

    /**
     * Sets the quotes to use.
     * This can be done in the middle of lexing.
     * @param quotes - List of pairs of open and close quotes.
     */
    public setQuotes(quotes: [string, string][]): this {
        this.quotes = quotes;
        return this;
    }

    /**
     * Whether the lexer is finished.
     */
    public get finished(): boolean {
        return this.position >= this.input.length;
    }

    private match(s: string): string | null {
        const sub = this.input.slice(this.position, this.position + s.length);
        if (s === sub) {
            return sub;
        }

        return null;
    }

    private matchR(r: RegExp): RegExpMatchArray | null {
        return this.input.slice(this.position).match(r);
    }

    private shift(n: number): void {
        this.position += n;
    }

    /**
     * Gets the next token.
     */
    public next(): IteratorResult<Token> {
        if (this.finished) {
            return { done: true, value: null };
        }

        const t = this.nextToken();
        if (t == null) {
            throw new Error('Unexpected end of input (this should never happen).');
        }

        return { done: false, value: t };
    }

    private nextToken(): Token | null {
        if (this.position === 0) {
            this.pWs();
        }

        return this.pQuoted() || this.pWord();
    }

    private pWs(): string {
        const w = this.matchR(/^\s*/)?.[0] ?? '';
        this.shift(w.length);
        return w;
    }

    private pQuoted(): Token | null {
        for (const [openQ, closeQ] of this.quotes) {
            const open = this.match(openQ);
            if (open == null) {
                continue;
            }

            this.shift(open.length);

            let inner = this.matchR(/^[^]+/)?.[0] ?? '';
            inner = Lexer.sliceTo(inner, [closeQ]);
            this.shift(inner.length);

            const close = this.match(closeQ) ?? '';
            this.shift(close.length);

            const s = this.pWs();
            return new Quoted(open + inner + close, inner, s);
        }

        return null;
    }

    private pWord(): Token | null {
        let w = this.matchR(/^\S+/)?.[0];
        if (w == null) {
            return null;
        }

        w = Lexer.sliceTo(w, this.quotes.flat());
        this.shift(w.length);

        const s = this.pWs();
        return new Word(w, s);
    }

    private static sliceTo(word: string, xs: string[]): string {
        const is = xs.map(x => word.indexOf(x));
        const i = Math.min(...is);
        if (i !== -1) {
            return word.slice(0, i);
        }

        return word;
    }

    public [Symbol.iterator](): this {
        return this;
    }

    /**
     * Runs the lexer.
     */
    public lex(): Token[] {
        return [...this];
    }
}
