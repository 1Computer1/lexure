import { ParserOutput } from './parserOutput';
import { Token } from './tokens';
import { Option, some, none } from './option';
import { Result, err } from './result';

/**
 * The state for the argument wrapper.
 */
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
export class Args implements IterableIterator<string> {
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
     * Gets the next ordered argument.
     * @return An iterator result containing a string.
     */
    public next(): IteratorResult<string> {
        if (this.finished) {
            return { done: true, value: null };
        }

        return { done: false, value: this.single()! };
    }

    public [Symbol.iterator](): this {
        return this;
    }

    /**
     * Retrieves the value of the next unused ordered token.
     * That token will now be consider used.
     *
     * ```ts
     * // Suppose args are from '1 2 3'.
     * console.log(args.single());
     * >>> '1'
     *
     * console.log(args.single());
     * >>> '2'
     *
     * console.log(args.single());
     * >>> '3'
     *
     * console.log(args.single());
     * >>> null
     * ```
     *
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
     *
     * ```ts
     * // Suppose args are from '1 2 3'.
     * const parse = (x: string) => {
     *   const n = Number(x);
     *   return isNaN(n) ? none() : some(n);
     * };
     *
     * console.log(args.singleMap(parse));
     * >>> { exists: true, value: 1 }
     * ```
     *
     * @typeparam T - Output type.
     * @param f - Gives an option of either the resulting value, or nothing if failed.
     * @param useAnyways - Whether to consider the token used even if the transformation fails; defaults to false.
     * @returns The value if the transformation succeeds.
     * If there are no tokens left, null is returned.
     */
    public singleMap<T>(f: (x: string) => Option<T>, useAnyways = false): Option<T> | null {
        if (this.finished) {
            return null;
        }

        while (this.state.usedIndices.has(this.state.position)) {
            this.state.position++;
        }

        const o = f(this.parserOutput.ordered[this.state.position].value);
        if (o.exists) {
            this.state.usedIndices.add(this.state.position);
            this.state.position++;
            return o;
        }

        if (useAnyways) {
            this.state.usedIndices.add(this.state.position);
            this.state.position++;
        }

        return none();
    }

    /**
     * Retrieves the value of the next unused ordered token, but only if it could be transformed.
     * This variant of the function is asynchronous using `Promise`.
     * That token will now be consider used if the transformation succeeds.
     * @typeparam T - Output type.
     * @param f - Gives an option of either the resulting value, or nothing if failed.
     * @param useAnyways - Whether to consider the token used even if the transformation fails; defaults to false.
     * @returns The value if the transformation succeeds.
     * If there are no tokens left, null is returned.
     */
    public async singleMapAsync<T>(
        f: (x: string) => Promise<Option<T>>,
        useAnyways = false
    ): Promise<Option<T> | null> {
        if (this.finished) {
            return null;
        }

        while (this.state.usedIndices.has(this.state.position)) {
            this.state.position++;
        }

        const o = await f(this.parserOutput.ordered[this.state.position].value);
        if (o.exists) {
            this.state.usedIndices.add(this.state.position);
            this.state.position++;
            return o;
        }

        if (useAnyways) {
            this.state.usedIndices.add(this.state.position);
            this.state.position++;
        }

        return none();
    }

    /**
     * Retrieves the value of the next unused ordered token, but only if it could be transformed.
     * That token will now be consider used if the transformation succeeds.
     * This is a variant of {@linkcode Args#singleMap} that allows for a Result to be returned.
     *
     * ```ts
     * // Suppose args are from '1 a'.
     * const parse = (x: string) => {
     *   const n = Number(x);
     *   return isNaN(n) ? err(x + ' is not a number') : ok(n);
     * };
     *
     * console.log(args.singleParse(parse));
     * >>> { success: true, value: 1 }
     *
     * console.log(args.singleParse(parse));
     * >>> { success: false, error: 'a is not a number' }
     *
     * console.log(args.singleParse(parse));
     * >>> null
     * ```
     *
     * @typeparam T - Output type.
     * @typeparam E - Error type.
     * @param f - Gives a result of either the resulting value, or an error.
     * @param useAnyways - Whether to consider the token used even if the transformation fails; defaults to false.
     * @returns The result which succeeds if the transformation succeeds.
     * If there are no tokens left, null is returned.
     */
    public singleParse<T, E>(f: (x: string) => Result<T, E>, useAnyways = false): Result<T, E> | null {
        if (this.finished) {
            return null;
        }

        while (this.state.usedIndices.has(this.state.position)) {
            this.state.position++;
        }

        const o = f(this.parserOutput.ordered[this.state.position].value);
        if (o.success) {
            this.state.usedIndices.add(this.state.position);
            this.state.position++;
            return o;
        }

        if (useAnyways) {
            this.state.usedIndices.add(this.state.position);
            this.state.position++;
        }

        return o;
    }

    /**
     * Retrieves the value of the next unused ordered token, but only if it could be transformed.
     * That token will now be consider used if the transformation succeeds.
     * This variant of the function is asynchronous using `Promise`.
     * This is a variant of {@linkcode Args#singleMapAsync} that allows for a Result to be returned.
     * @typeparam T - Output type.
     * @typeparam E - Error type.
     * @param f - Gives a result of either the resulting value, or an error.
     * @param useAnyways - Whether to consider the token used even if the transformation fails; defaults to false.
     * @returns The result which succeeds if the transformation succeeds.
     * If there are no tokens left, null is returned.
     */
    public async singleParseAsync<T, E>(
        f: (x: string) => Promise<Result<T, E>>,
        useAnyways = false
    ): Promise<Result<T, E> | null> {
        if (this.finished) {
            return null;
        }

        while (this.state.usedIndices.has(this.state.position)) {
            this.state.position++;
        }

        const o = await f(this.parserOutput.ordered[this.state.position].value);
        if (o.success) {
            this.state.usedIndices.add(this.state.position);
            this.state.position++;
            return o;
        }

        if (useAnyways) {
            this.state.usedIndices.add(this.state.position);
            this.state.position++;
        }

        return o;
    }

    /**
     * Retrieves the value of the next unused ordered token from the end.
     * That token will now be consider used.
     *
     * ```ts
     * // Suppose args are from '1 2 3'.
     * console.log(args.singleFromEnd());
     * >>> '3'
     *
     * console.log(args.singleFromEnd());
     * >>> '2'
     *
     * console.log(args.singleFromEnd());
     * >>> '1'
     *
     * console.log(args.singleFromEnd());
     * >>> null
     * ```
     *
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
     *
     * ```ts
     * // Suppose args are from '1 2 3'.
     * const xs = args.many();
     * console.log(joinTokens(xs));
     * >>> '1 2 3'
     *
     * // Suppose args are from '1 2 3'.
     * const xs = args.many(2);
     * console.log(joinTokens(xs));
     * >>> '1 2'
     * ```
     *
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
     *
     * ```ts
     * // Suppose args are from '1 2 3'.
     * const xs = args.manyFromEnd();
     * console.log(joinTokens(xs));
     * >>> '1 2 3'
     *
     * // Suppose args are from '1 2 3'.
     * const xs = args.manyFromEnd(2);
     * console.log(joinTokens(xs));
     * >>> '2 3'
     * ```
     *
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
     *
     * ```ts
     * // Suppose args are from '--f --g'.
     * console.log(args.flag('f'));
     * >>> true
     *
     * console.log(args.flag('g', 'h'));
     * >>> true
     *
     * console.log(args.flag('h'));
     * >>> false
     * ```
     *
     * @param keys - The name(s) of the flag.
     * @returns Whether the flag was given.
     */
    public flag(...keys: string[]): boolean {
        return keys.some(key => this.parserOutput.flags.has(key));
    }

    /**
     * Gets the last value of an option.
     *
     * ```ts
     * // Suppose args are from '--a=1 --b=2 --c=3'.
     * console.log(args.option('a'));
     * >>> '1'
     *
     * console.log(args.option('b', 'c'));
     * >>> '2'
     *
     * console.log(args.option('d'));
     * >>> null
     * ```
     *
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
     *
     * ```ts
     * // Suppose args are from '--a=1 --a=1 --b=2 --c=3'.
     * console.log(args.options('a'));
     * >>> ['1', '1']
     *
     * console.log(args.option('b', 'c'));
     * >>> ['2', '3']
     *
     * console.log(args.option('d'));
     * >>> null
     * ```
     *
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
     *
     * ```ts
     * // Suppose args are from '1 2 3'.
     * const parse = (x: string) => {
     *   const n = Number(x);
     *   return isNaN(n) || n === 1 ? none() : some(n);
     * };
     *
     * console.log(args.findMap(parse));
     * >>> { exists: true, value: 2 }
     * ```
     *
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
     * Finds and retrieves the first unused token that could be transformed.
     * That token will now be consider used.
     * This is a variant of {@linkcode Args#findMap} that allows for a Result to be returned.
     * @typeparam T - Output type.
     * @typeparam E - Error type.
     * @param f - Gives a result of either the resulting value, or an error.
     * @param from - Where to start looking for tokens; defaults to current position.
     * @returns The resulting value if it was found or a list of errors during parsing.
     */
    public findParse<T, E>(f: (x: string) => Result<T, E>, from = this.state.position): Result<T, E[]> {
        const errors: E[] = [];
        for (let i = from; i < this.length; i++) {
            if (this.state.usedIndices.has(i)) {
                continue;
            }

            const x = this.parserOutput.ordered[i];
            const o = f(x.value);
            if (o.success) {
                this.state.usedIndices.add(i);
                return o;
            }

            errors.push(o.error);
        }

        return err(errors);
    }

    /**
     * Finds and retrieves the first unused token that could be transformed.
     * That token will now be consider used.
     * This variant of the function is asynchronous using `Promise`.
     * This is a variant of {@linkcode Args#findMapAsync} that allows for a Result to be returned.
     * @typeparam T - Output type.
     * @typeparam E - Error type.
     * @param f - Gives a result of either the resulting value, or an error.
     * @param from - Where to start looking for tokens; defaults to current position.
     * @returns The resulting value if it was found or a list of errors during parsing.
     */
    public async findParseAsync<T, E>(
        f: (x: string) => Promise<Result<T, E>>,
        from = this.state.position
    ): Promise<Result<T, E[]>> {
        const errors: E[] = [];
        for (let i = from; i < this.length; i++) {
            if (this.state.usedIndices.has(i)) {
                continue;
            }

            const x = this.parserOutput.ordered[i];
            const o = await f(x.value);
            if (o.success) {
                this.state.usedIndices.add(i);
                return o;
            }

            errors.push(o.error);
        }

        return err(errors);
    }

    /**
     * Filters and retrieves all unused tokens that could be transformed.
     * Those tokens will now be consider used.
     *
     * ```ts
     * // Suppose args are from '1 2 3'.
     * const parse = (x: string) => {
     *   const n = Number(x);
     *   return isNaN(n) || n === 1 ? none() : some(n);
     * };
     *
     * console.log(args.filterMap(parse));
     * >>> [2, 3]
     * ```
     *
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
     * Saves the current state that can then be restored later by using {@linkcode Args#restore}.
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
     * Sets the current state to the given state from {@linkcode Args#save}.
     * Use this to backtrack after a series of retrievals.
     * @param state - State to restore to.
     */
    public restore(state: ArgsState): void {
        this.state = state;
    }
}
