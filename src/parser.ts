import { UnorderedStrategy, noStrategy } from './unordered';
import { Token } from './tokens';
import { ParserOutput, emptyOutput, mergeOutputs } from './parserOutput';

/**
 * Parses a list of tokens to separate out flags and options.
 */
export class Parser implements IterableIterator<ParserOutput> {
    private readonly input: Token[];

    private unorderedStrategy: UnorderedStrategy = noStrategy();
    private position = 0;

    /**
     * @param input - The input tokens.
     */
    public constructor(input: Token[]) {
        this.input = input;
    }

    /**
     * Sets the strategy for parsing unordered arguments.
     * This can be done in the middle of parsing.
     * 
     * ```ts
     * const parser = new Parser(tokens)
     *   .setUnorderedStrategy(longStrategy())
     *   .parse();
     * ```
     * 
     * @returns The parser.
     */
    public setUnorderedStrategy(s: UnorderedStrategy): this {
        this.unorderedStrategy = s;
        return this;
    }

    /**
     * Whether the parser is finished.
     */
    public get finished(): boolean {
        return this.position >= this.input.length;
    }

    private shift(n: number): void {
        this.position += n;
    }

    /**
     * Gets the next parsed tokens.
     */
    public next(): IteratorResult<ParserOutput> {
        if (this.finished) {
            return { done: true, value: null };
        }
        
        const ts = this.processToken();
        if (ts == null) {
            throw new Error('Unexpected end of input (this should never happen).');
        }

        return { done: false, value: ts };
    }

    private processToken(): ParserOutput {
        return this.pFlag() || this.pOption() || this.pCompactOption() || this.pOrdered();
    }

    private pFlag(): ParserOutput | null {
        const t = this.input[this.position];
        const f = this.unorderedStrategy.matchFlag(t.value);
        if (f == null) {
            return null;
        }

        this.shift(1);

        const output = emptyOutput();
        output.flags.add(f);
        return output;
    }

    private pOption(): ParserOutput | null {
        const t = this.input[this.position];
        const o = this.unorderedStrategy.matchOption(t.value);
        if (o == null) {
            return null;
        }

        this.shift(1);

        const output = emptyOutput();
        output.options.set(o, []);

        const n = this.input[this.position];
        if (n == null) {
            return output;
        }

        const bad = (this.unorderedStrategy.matchFlag(n.value)
                || this.unorderedStrategy.matchOption(n.value)
                || this.unorderedStrategy.matchCompactOption(n.value)) != null;

        if (bad) {
            return output;
        }

        this.shift(1);

        const xs = output.options.get(o);
        xs!.push(n.value);
        return output;
    }

    private pCompactOption(): ParserOutput | null {
        const t = this.input[this.position];
        const o = this.unorderedStrategy.matchCompactOption(t.value);
        if (o == null) {
            return null;
        }

        this.shift(1);

        const output = emptyOutput();
        output.options.set(o[0], [o[1]]);
        return output;
    }

    private pOrdered(): ParserOutput {
        const t = this.input[this.position];
        this.shift(1);

        const output = emptyOutput();
        output.ordered.push(t);
        return output;
    }

    public [Symbol.iterator](): this {
        return this;
    }

    /**
     * Runs the parser.
     * 
     * ```ts
     * const lexer = new Lexer(input);
     * const tokens = lexer.lex();
     * const parser = new Parser(tokens);
     * const output = parser.parse();
     * ```
     * 
     * @returns The parser output.
     */
    public parse(): ParserOutput {
        return mergeOutputs(...this);
    }
}
