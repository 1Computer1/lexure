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
export default class Parser implements IterableIterator<ParserOutput> {
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

    private static mergeOutputs(px: ParserOutput, py: ParserOutput): ParserOutput {
        return {
            ordered: [...px.ordered, ...py.ordered],
            flags: new Set([...px.flags, ...py.flags]),
            options: new Map([...px.options, ...py.options])
        };
    }

    private static emptyOutput(): ParserOutput {
        return {
            ordered: [],
            flags: new Set(),
            options: new Map()
        };
    }

    private pFlag(): ParserOutput | null {
        const t = this.input[this.position];
        const f = this.unorderedStrategy.matchFlag(t.value);
        if (f == null) {
            return null;
        }

        this.shift(1);

        const output = Parser.emptyOutput();
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

        const output = Parser.emptyOutput();
        output.options.set(o, '');

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

        output.options.set(o, n.value);
        return output;
    }

    private pCompactOption(): ParserOutput | null {
        const t = this.input[this.position];
        const o = this.unorderedStrategy.matchCompactOption(t.value);
        if (o == null) {
            return null;
        }

        this.shift(1);

        const output = Parser.emptyOutput();
        output.options.set(o[0], o[1]);
        return output;
    }

    private pOrdered(): ParserOutput {
        const t = this.input[this.position];
        this.shift(1);

        const output = Parser.emptyOutput();
        output.ordered.push(t);
        return output;
    }

    public [Symbol.iterator](): this {
        return this;
    }

    /**
     * Runs the parser.
     */
    public parse(): ParserOutput {
        return [...this].reduce((a, x) => Parser.mergeOutputs(a, x), Parser.emptyOutput());
    }
}
