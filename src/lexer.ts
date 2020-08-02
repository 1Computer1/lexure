import { Token, extractCommand, MatchPrefix } from './tokens';

/**
 * The lexer turns input into a list of tokens.
 */
export class Lexer implements IterableIterator<Token> {
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
     *
     * ```ts
     * const lexer = new Lexer('"hello"');
     * lexer.setQuotes([['"', '"']]);
     * const xs = lexer.lex();
     * console.log(xs);
     * >>> [{ value: 'hello', raw: '"hello"', trailing: '' }]
     * ```
     *
     * @param quotes - List of pairs of open and close quotes.
     * It is required that these strings do not contain any whitespace characters.
     * @returns The lexer.
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
     * @returns An iterator result containing the next token.
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

            let inner = this.input.slice(this.position);
            inner = sliceTo(inner, [closeQ]);
            this.shift(inner.length);

            const close = this.match(closeQ) ?? '';
            this.shift(close.length);

            const s = this.pWs();
            return { value: inner, raw: open + inner + close, trailing: s };
        }

        return null;
    }

    private pWord(): Token | null {
        let w = this.matchR(/^\S+/)?.[0];
        if (w == null) {
            return null;
        }

        w = sliceTo(w, this.quotes.flat());
        this.shift(w.length);

        const s = this.pWs();
        return { value: w, raw: w, trailing: s };
    }

    public [Symbol.iterator](): this {
        return this;
    }

    /**
     * Runs the lexer.
     * This consumes the lexer.
     *
     * ```ts
     * const lexer = new Lexer('hello world');
     * const xs = lexer.lex();
     * console.log(xs);
     * >>> [
     *   { value: 'hello', raw: 'hello', trailing: ' ' },
     *   { value: 'world', raw: 'world', trailing: '' }
     * ]
     * ```
     *
     * @returns All the tokens lexed.
     */
    public lex(): Token[] {
        return [...this];
    }

    /**
     * Runs the lexer, matching a prefix and command.
     * This consumes at most two tokens of the lexer.
     * This uses {@linkcode extractCommand} under the hood.
     *
     * ```ts
     * const lexer = new Lexer('!help me');
     * const r = lexer.lexCommand(s => s.startsWith('!') ? 1 : null);
     * if (r != null) {
     *   const [command, getRest] = r;
     *   console.log(command.value);
     *   >>> 'help'
     *   console.log(getRest()[0].value);
     *   >>> 'me'
     * }
     * ```
     *
     * @param matchPrefix - A function that gives the length of the prefix if there is one.
     * @returns The command and the rest of the lexed tokens, as long as the prefix was matched.
     * The rest of the tokens are delayed as a function.
     */
    public lexCommand(matchPrefix: MatchPrefix): [Token, () => Token[]] | null {
        const t1 = this.next();
        if (t1.done) {
            return null;
        }

        const cmd1 = extractCommand(matchPrefix, [t1.value]);
        if (cmd1 != null) {
            return [cmd1, () => [...this]];
        }

        const t2 = this.next();
        if (t2.done) {
            return null;
        }

        const cmd2 = extractCommand(matchPrefix, [t1.value, t2.value]);
        if (cmd2 == null) {
            return null;
        }

        return [cmd2, () => [...this]];
    }
}

function sliceTo(word: string, xs: string[]): string {
    const is = xs.map(x => word.indexOf(x)).filter(x => x !== -1);
    if (is.length === 0) {
        return word;
    }

    const i = Math.min(...is);
    return word.slice(0, i);
}
