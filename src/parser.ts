import { UnorderedStrategy, noStrategy } from './unordered';
import { Token } from "./tokens";

/**
 * Output of the parser.
 */
export interface ParserOutput {
    /**
     * All the tokens that are not flags or options, in order.
     */
    ordered: Token[];

    /**
     * The parsed flags.
     */
    flags: Set<string>;

    /**
     * The parsed options mapped to their value.
     */
    options: Map<string, string>;
}

/**
 * Parses a list of tokens to separate out flags and options.
 */
export default class Parser implements IterableIterator<Token[]> {
    private readonly input: Token[];

    private unorderedStrategy: UnorderedStrategy = noStrategy();
    private position = 0;
    private output: ParserOutput = { ordered: [], flags: new Set(), options: new Map() };

    /**
     * @param input - The input tokens.
     */
    public constructor(input: Token[]) {
        this.input = input;
    }

    /**
     * Sets the strategy for parsing unordered arguments.
     * This can be done in the middle of parsing.
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
    public next(): IteratorResult<Token[]> {
        if (this.finished) {
            return { done: true, value: null };
        }
        
        const ts = this.processToken();
        if (ts == null) {
            throw new Error('Unexpected end of input (this should never happen).');
        }

        return { done: false, value: ts };
    }

    /**
     * Gets the parser output.
     */
    public getOutput(): ParserOutput {
        return this.output;
    }

    private processToken(): Token[] | null {
        return this.pFlag() || this.pOption() || this.pCompactOption() || this.pOrdered();
    }

    private pFlag(): Token[] | null {
        const t = this.input[this.position];
        const f = this.unorderedStrategy.matchFlag(t.value);
        if (f == null) {
            return null;
        }

        this.shift(1);
        this.output.flags.add(f);
        return [t];
    }

    private pOption(): Token[] | null {
        const t = this.input[this.position];
        const o = this.unorderedStrategy.matchOption(t.value);
        if (o == null) {
            return null;
        }

        this.shift(1);
        this.output.options.set(o, '');

        const n = this.input[this.position];
        if (n == null) {
            return [t];
        }

        const bad = (this.unorderedStrategy.matchFlag(n.value)
                || this.unorderedStrategy.matchOption(n.value)
                || this.unorderedStrategy.matchCompactOption(n.value)) != null;

        if (bad) {
            return [t];
        }

        this.shift(1);
        this.output.options.set(o, n.value);
        return [t, n];
    }

    private pCompactOption(): Token[] | null {
        const t = this.input[this.position];
        const o = this.unorderedStrategy.matchCompactOption(t.value);
        if (o == null) {
            return null;
        }

        this.shift(1);
        this.output.options.set(o[0], o[1]);
        return [t];
    }

    private pOrdered(): Token[] | null {
        const t = this.input[this.position];
        this.shift(1);
        this.output.ordered.push(t);
        return [t];
    }

    public [Symbol.iterator](): this {
        return this;
    }

    /**
     * Runs the parser.
     */
    public parse(): ParserOutput {
        [...this];
        return this.getOutput();
    }
}
