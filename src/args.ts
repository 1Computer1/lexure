import { ParserOutput } from './parserOutput';
import { Token } from './tokens';
import { Option, some, none } from './option';

export interface ArgsState {
    /**
     * The indices of the ordered tokens already retrieved.
     */
    usedIndices: Set<number>;

    /**
     * The current position in the ordered tokens.
     * Increments from 0.
     */
    position: number;

    /**
     * The current position backwards in the ordered tokens.
     * Decrements from the end.
     */
    positionFromEnd: number;
}

/**
 * A wrapper around the parser output for retrieving command arguments.
 */
export class Args {
    /**
     * The parser output.
     */
    public readonly parserOutput: ParserOutput;

    /**
     * The state of this instance.
     */
    public state: ArgsState;

    /**
     * @param parserOutput - The parser output.
     */
    public constructor(parserOutput: ParserOutput) {
        this.parserOutput = parserOutput;
        this.state = {
            usedIndices: new Set(),
            position: 0,
            positionFromEnd: parserOutput.ordered.length - 1
        };
    }

    /**
     * Whether all ordered tokens have been used.
     */
    public get finished(): boolean {
        return this.state.usedIndices.size === this.parserOutput.ordered.length;
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
        return this.parserOutput.ordered.length - this.state.usedIndices.size;
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

        while (this.state.usedIndices.has(this.state.position)) {
            this.state.position++;
        }

        this.state.usedIndices.add(this.state.position);
        return this.parserOutput.ordered[this.state.position++].value;
    }

    /**
     * Retrieves the value of the next unused ordered token, but only if it could be transformed.
     * That token will now be consider used if the transformation succeeds.
     * @typeparam T - Output type.
     * @param f - Gives an option of either the resulting value, or nothing if failed.
     * @returns The value if there are tokens left and the transformation succeeds.
     */
    public singleMap<T>(f: (x: string) => Option<T>): Option<T> {
        if (this.finished) {
            return none();
        }

        while (this.state.usedIndices.has(this.state.position)) {
            this.state.position++;
        }

        this.state.usedIndices.add(this.state.position);
        return f(this.parserOutput.ordered[this.state.position++].value);
    }

    /**
     * Retrieves the value of the next unused ordered token, but only if it could be transformed.
     * This variant of the function is asynchronous using `Promise`.
     * That token will now be consider used if the transformation succeeds.
     * @typeparam T - Output type.
     * @param f - Gives an option of either the resulting value, or nothing if failed.
     * @returns The value if there are tokens left and the transformation succeeds.
     */
    public singleMapAsync<T>(f: (x: string) => Promise<Option<T>>): Promise<Option<T>> {
        if (this.finished) {
            return Promise.resolve(none());
        }

        while (this.state.usedIndices.has(this.state.position)) {
            this.state.position++;
        }

        this.state.usedIndices.add(this.state.position);
        return f(this.parserOutput.ordered[this.state.position++].value);
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

        while (this.state.usedIndices.has(this.state.positionFromEnd)) {
            this.state.positionFromEnd--;
        }

        this.state.usedIndices.add(this.state.positionFromEnd);
        return this.parserOutput.ordered[this.state.positionFromEnd--].value;
    }

    /**
     * Retrieves many unused tokens.
     * @param limit - The limit on the amount of tokens to retrieve; defaults to infinite.
     * @param from - Where to start looking for tokens; defaults to current position.
     * @returns The tokens.
     */
    public many(limit = Infinity, from = this.state.position): Token[] {
        const ts = [];
        for (let i = from; i < this.length && ts.length < limit; i++) {
            if (this.state.usedIndices.has(i)) {
                continue;
            }

            this.state.usedIndices.add(i);
            ts.push(this.parserOutput.ordered[i]);
        }

        return ts;
    }

    /**
     * Retrieves many unused tokens from the end.
     * Note that the order of retrieved tokens will be the same order as in the ordered tokens list.
     * @param limit - The limit on the amount of tokens to retrieve; defaults to infinite.
     * @param from - Where to start looking for tokens; defaults to current position from end.
     * @returns The tokens.
     */
    public manyFromEnd(limit = Infinity, from = this.state.positionFromEnd): Token[] {
        const ts = [];
        for (let i = from; i >= 0 && ts.length < limit; i--) {
            if (this.state.usedIndices.has(i)) {
                continue;
            }

            this.state.usedIndices.add(i);
            ts.unshift(this.parserOutput.ordered[i]);
        }

        return ts;
    }

    /**
     * Checks if a flag was given.
     * @param keys - The name(s) of the flag.
     * @returns Whether the flag was given.
     */
    public flag(...keys: string[]): boolean {
        return keys.some(key => this.parserOutput.flags.has(key));
    }

    /**
     * Gets the last value of an option.
     * @param keys - The name(s) of the option.
     * @returns The last value of the option if it was given.
     * When there are multiple names, the last value of the first found name is given.
     */
    public option(...keys: string[]): string | null {
        for (const key of keys) {
            if (this.parserOutput.options.has(key)) {
                const xs = this.parserOutput.options.get(key)!;
                if (xs.length !== 0) {
                    return xs[xs.length - 1];
                }
            }
        }

        return null;
    }

    /**
     * Gets all the values of an option.
     * @param keys - The name(s) of the option.
     * @returns The values of the option if it was given.
     */
    public options(...keys: string[]): string[] | null {
        let found = false;
        const ys: string[] = [];
        for (const key of keys) {
            if (this.parserOutput.options.has(key)) {
                found = true;
                ys.push(...this.parserOutput.options.get(key)!);
            }
        }

        return found ? ys : null;
    }

    /**
     * Finds and retrieves the first unused token that could be transformed.
     * That token will now be consider used.
     * @typeparam T - Output type.
     * @param f - Gives an option of either the resulting value, or nothing if failed.
     * @param from - Where to start looking for tokens; defaults to current position.
     * @returns The resulting value if it was found.
     */
    public findMap<T>(f: (x: string) => Option<T>, from = this.state.position): Option<T> {
        for (let i = from; i < this.length; i++) {
            if (this.state.usedIndices.has(i)) {
                continue;
            }

            const x = this.parserOutput.ordered[i];
            const o = f(x.value);
            if (o.exists) {
                this.state.usedIndices.add(i);
                return some(o.value);
            }
        }

        return none();
    }

    /**
     * Finds and retrieves the first unused token that could be transformed.
     * This variant of the function is asynchronous using `Promise`.
     * That token will now be consider used.
     * @typeparam T - Output type.
     * @param f - Gives an option of either the resulting value, or nothing if failed.
     * @param from - Where to start looking for tokens; defaults to current position.
     * @returns The resulting value if it was found.
     */
    public async findMapAsync<T>(
        f: (x: string) => Promise<Option<T>>,
        from = this.state.position
    ): Promise<Option<T>> {
        for (let i = from; i < this.length; i++) {
            if (this.state.usedIndices.has(i)) {
                continue;
            }

            const x = this.parserOutput.ordered[i];
            const o = await f(x.value);
            if (o.exists) {
                this.state.usedIndices.add(i);
                return some(o.value);
            }
        }

        return none();
    }

    /**
     * Filters and retrieves all unused tokens that could be transformed.
     * Those tokens will now be consider used.
     * @typeparam T - Output type.
     * @param f - Gives an option of either the resulting value, or nothing if failed.
     * @param limit - The limit on the amount of tokens to retrieve; defaults to infinite.
     * @param from - Where to start looking for tokens; defaults to current position.
     * @returns The resulting values.
     */
    public filterMap<T>(f: (x: string) => Option<T>, limit = Infinity, from = this.state.position): T[] {
        const ys = [];
        for (let i = from; i < this.length && ys.length < limit; i++) {
            if (this.state.usedIndices.has(i)) {
                continue;
            }

            const x = this.parserOutput.ordered[i];
            const o = f(x.value);
            if (o.exists) {
                this.state.usedIndices.add(i);
                ys.push(o.value);
            }
        }

        return ys;
    }

    /**
     * Filters and retrieves all unused tokens that could be transformed.
     * This variant of the function is asynchronous using `Promise`.
     * Those tokens will now be consider used.
     * @typeparam T - Output type.
     * @param f - Gives an option of either the resulting value, or nothing if failed.
     * @param limit - The limit on the amount of tokens to retrieve; defaults to infinite.
     * @param from - Where to start looking for tokens; defaults to current position.
     * @returns The resulting values.
     */
    public async filterMapAsync<T>(
        f: (x: string) => Promise<Option<T>>,
        limit = Infinity,
        from = this.state.position
    ): Promise<T[]> {
        const ys = [];
        for (let i = from; i < this.length && ys.length < limit; i++) {
            if (this.state.usedIndices.has(i)) {
                continue;
            }

            const x = this.parserOutput.ordered[i];
            const o = await f(x.value);
            if (o.exists) {
                this.state.usedIndices.add(i);
                ys.push(o.value);
            }
        }

        return ys;
    }

    /**
     * Saves the current state that can then be restored later.
     * @returns The current state.
     */
    public save(): ArgsState {
        return {
            usedIndices: new Set(this.state.usedIndices.values()),
            position: this.state.position,
            positionFromEnd: this.state.positionFromEnd
        };
    }

    /**
     * Sets the current state to the given state.
     * Use this to backtrack after a series of retrievals.
     * @param state - State to restore to.
     */
    public restore(state: ArgsState): void {
        this.state = state;
    }
}
