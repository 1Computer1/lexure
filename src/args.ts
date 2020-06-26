import { ParserOutput } from './parserOutput';
import { Token } from './tokens';
import { Option, some, none } from './option';

/**
 * A wrapper around the parser output for retrieving command arguments.
 */
export class Args {
    /**
     * The parser output.
     */
    public readonly parserOutput: ParserOutput;

    /**
     * The indices of the ordered tokens already retrieved.
     */
    public readonly usedIndices: Set<number> = new Set();

    /**
     * The current position in the ordered tokens.
     * Increments from 0.
     */
    public position = 0;

    /**
     * The current position backwards in the ordered tokens.
     * Decrements from the end.
     */
    public positionFromEnd: number;

    /**
     * @param parserOutput - The parser output.
     */
    public constructor(parserOutput: ParserOutput) {
        this.parserOutput = parserOutput;
        this.positionFromEnd = parserOutput.ordered.length - 1;
    }

    /**
     * Whether all ordered tokens have been used.
     */
    public get finished(): boolean {
        return this.usedIndices.size === this.parserOutput.ordered.length;
    }

    /**
     * The amount of ordered tokens.
     */
    public get length(): number {
        return this.parserOutput.ordered.length;
    }

    /**
     * The amount of remaining ordered tokens.
     */
    public get remaining(): number {
        return this.parserOutput.ordered.length - this.usedIndices.size;
    }

    /**
     * Retrieves the value of the next unused ordered token.
     * That token will now be consider used.
     * @returns The value if there are tokens left.
     */
    public single(): string | null {
        if (this.finished) {
            return null;
        }

        while (this.usedIndices.has(this.position)) {
            this.position++;
        }

        this.usedIndices.add(this.position);
        return this.parserOutput.ordered[this.position++].value;
    }

    /**
     * Retrieves the value of the next unused ordered token from the end.
     * That token will now be consider used.
     * @returns The value if there are tokens left.
     */
    public singleFromEnd(): string | null {
        if (this.finished) {
            return null;
        }

        while (this.usedIndices.has(this.positionFromEnd)) {
            this.positionFromEnd--;
        }

        this.usedIndices.add(this.positionFromEnd);
        return this.parserOutput.ordered[this.positionFromEnd--].value;
    }

    /**
     * Retrieves many unused tokens.
     * @param limit - The limit on the amount of tokens to retrieve; defaults to infinite.
     * @param from - Where to start looking for tokens; defaults to current position.
     * @returns The tokens.
     */
    public many(limit = Infinity, from = this.position): Token[] {
        const ts = [];
        for (let i = from; i < this.length && ts.length < limit; i++) {
            if (this.usedIndices.has(i)) {
                continue;
            }

            this.usedIndices.add(i);
            ts.push(this.parserOutput.ordered[i]);
        }

        return ts;
    }

    /**
     * Checks if a flag was given.
     * @param key - The name of the flag.
     * @returns Whether the flag was given.
     */
    public flag(key: string): boolean {
        return this.parserOutput.flags.has(key);
    }

    /**
     * Gets the value of an option.
     * @param key - The name of the option.
     * @returns The value of the option if it was given.
     */
    public option(key: string): string[] | null {
        return this.parserOutput.options.has(key)
            ? this.parserOutput.options.get(key)!
            : null;
    }

    /**
     * Finds and retrieves the first unused token that could be transformed.
     * That token will now be consider used.
     * @param f - Gives a pair of whether the transformation worked, and the resulting value.
     * @param from - Where to start looking for tokens; defaults to current position.
     * @returns The resulting value if it was found.
     */
    public findMap<T>(f: (x: string) => Option<T>, from = this.position): Option<T> {
        for (let i = from; i < this.length; i++) {
            if (this.usedIndices.has(i)) {
                continue;
            }

            const x = this.parserOutput.ordered[i];
            const o = f(x.value);
            if (o.exists) {
                this.usedIndices.add(i);
                return some(o.value);
            }
        }

        return none();
    }

    /**
     * Filters and retrieves all unused tokens that could be transformed.
     * Those tokens will now be consider used.
     * @param f - Gives a pair of whether the transformation worked, and the resulting value.
     * @param limit - The limit on the amount of tokens to retrieve; defaults to infinite.
     * @param from - Where to start looking for tokens; defaults to current position.
     * @returns The resulting values.
     */
    public filterMap<T>(f: (x: string) => Option<T>, limit = Infinity, from = this.position): T[] {
        const ys = [];
        for (let i = from; i < this.length && ys.length < limit; i++) {
            if (this.usedIndices.has(i)) {
                continue;
            }

            const x = this.parserOutput.ordered[i];
            const o = f(x.value);
            if (o.exists) {
                this.usedIndices.add(i);
                ys.push(o.value);
            }
        }

        return ys;
    }
}
