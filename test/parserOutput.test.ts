import * as fc from 'fast-check';
import { ParserOutput, emptyOutput, mergeOutputs, outputFromJSON, outputToJSON } from '../src';

describe('mergeOutputs', () => {
    it('works', () => {
        const e = emptyOutput();

        const a: ParserOutput = {
            ordered: [
                { value: 'world', raw: 'world', trailing: ' ' },
                { value: 'cool stuff', raw: '"cool stuff"', trailing: ' ' },
            ],
            flags: new Set(['foo']),
            options: new Map()
        };

        const b: ParserOutput = {
            ordered: [
                { value: 'a', raw: 'a', trailing: ' ' },
                { value: 'b', raw: 'b', trailing: ' ' },
                { value: 'c', raw: 'c', trailing: '' }
            ],
            flags: new Set(),
            options: new Map([['bar', ['baz']]])
        };

        expect(mergeOutputs(e, a, b)).toEqual({
            ordered: [
                { value: 'world', raw: 'world', trailing: ' ' },
                { value: 'cool stuff', raw: '"cool stuff"', trailing: ' ' },
                { value: 'a', raw: 'a', trailing: ' ' },
                { value: 'b', raw: 'b', trailing: ' ' },
                { value: 'c', raw: 'c', trailing: '' }
            ],
            flags: new Set(['foo']),
            options: new Map([['bar', ['baz']]])
        });
    });

    it('has emptyOutput as the identity', () => {
        fc.property(genOutput, a => {
            expect(mergeOutputs(a, emptyOutput())).toEqual(a);
            expect(mergeOutputs(emptyOutput(), a)).toEqual(a);
        });
    });

    it('is associative', () => {
        fc.property(fc.tuple(genOutput, genOutput, genOutput), ([a, b, c]) => {
            const r1 = mergeOutputs(a, mergeOutputs(b, c));
            const r2 = mergeOutputs(mergeOutputs(a, b), c);
            const r3 = mergeOutputs(a, b, c);

            expect(r1).toEqual(r2);
            expect(r2).toEqual(r3);
            expect(r3).toEqual(r1);
        });
    });
});

describe('output{To,From}JSON', () => {
    it('works', () => {
        const a: ParserOutput = {
            ordered: [
                { value: 'world', raw: 'world', trailing: ' ' },
                { value: 'cool stuff', raw: '"cool stuff"', trailing: ' ' },
                { value: 'a', raw: 'a', trailing: ' ' },
                { value: 'b', raw: 'b', trailing: ' ' },
                { value: 'c', raw: 'c', trailing: '' }
            ],
            flags: new Set(['foo']),
            options: new Map([['bar', ['baz']]])
        };

        const b = {
            ordered: [
                { value: 'world', raw: 'world', trailing: ' ' },
                { value: 'cool stuff', raw: '"cool stuff"', trailing: ' ' },
                { value: 'a', raw: 'a', trailing: ' ' },
                { value: 'b', raw: 'b', trailing: ' ' },
                { value: 'c', raw: 'c', trailing: '' }
            ],
            flags: ['foo'],
            options: [['bar', ['baz']]]
        };

        expect(outputToJSON(a)).toEqual(b);
        expect(outputFromJSON(b)).toEqual(a);
    });

    it('from . to = id', () => {
        fc.property(genOutput, a => {
            const r = outputFromJSON(outputToJSON(a));
            expect(r).toEqual(a);
        });
    });

    it('to . from = id, except for duplicates', () => {
        fc.property(genOutput, a => {
            const b = outputToJSON(a);
            const r = outputToJSON(outputFromJSON(b));
            expect(r).toEqual(b);
        });
    });
});

const genOutput: fc.Arbitrary<ParserOutput> =
    fc.tuple(fc.array(fc.string()), fc.array(fc.string()), fc.array(fc.tuple(fc.string(), fc.array(fc.string()))))
        .map(([ws, fs, os]) => ({
            ordered: ws.map(w => ({ value: w, raw: w, trailing: ' ' })),
            flags: new Set(fs),
            options: new Map(os)
        }));
