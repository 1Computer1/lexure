import { Token } from './tokens';

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
 * Creates an empty parser output.
 * @returns An empty output.
 */
export function emptyOutput(): ParserOutput {
    return {
        ordered: [],
        flags: new Set(),
        options: new Map()
    };
}

/**
 * Merges multiple outputs into one.
 * Flags and options that appear later will be preferred if there are duplicates.
 * @param ps - The outputs to merge.
 * @returns The merged output.
 */
export function mergeOutputs(...ps: ParserOutput[]): ParserOutput {
    const ordered = Array.from(function *() {
        for (const p of ps) {
            yield* p.ordered;
        }
    }());

    const flags = new Set(function *() {
        for (const p of ps) {
            yield* p.flags;
        }
    }());

    const options = new Map(function *() {
        for (const p of ps) {
            yield* p.options;
        }
    }());

    return { ordered, flags, options };
}

/**
 * Converts an output to JSON, where the flags and options are turned into arrays of entries.
 * You can recover the output with 'outputFromJSON'.
 * @param p - The output.
 * @returns The JSON.
 */
export function outputToJSON(p: ParserOutput): Record<string, unknown> {
    return {
        ordered: p.ordered,
        flags: [...p.flags],
        options: [...p.options]
    };
}

/**
 * Converts JSON to a parser output.
 * @param obj - A valid JSON input, following the schema from 'outputToJSON'.
 * @returns The output.
 */
export function outputFromJSON(obj: Record<string, unknown>): ParserOutput {
    return {
        ordered: obj.ordered as Token[],
        flags: new Set(obj.flags as string[]),
        options: new Map(obj.options as [string, string][])
    };
}
