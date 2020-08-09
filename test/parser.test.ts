import * as fc from 'fast-check';
import { Lexer, Parser, longStrategy, mergeOutputs } from '../src';

describe('Parser#parse', () => {
    it('should parse normal words', () => {
        const ts = new Lexer('foo bar baz').lex();
        const out = new Parser(ts).parse();
        expect(out).toEqual({
            ordered: ts,
            flags: new Set(),
            options: new Map()
        });
    });

    it('should parse flags', () => {
        const ts = new Lexer('foo bar --baz').lex();
        const out = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        expect(out).toEqual({
            ordered: ts.slice(0, 2),
            flags: new Set(['baz']),
            options: new Map()
        });
    });

    it('should parse options', () => {
        const ts = new Lexer('foo bar --baz= quux').lex();
        const out = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        expect(out).toEqual({
            ordered: ts.slice(0, 2),
            flags: new Set(),
            options: new Map([['baz', ['quux']]])
        });
    });

    it('should parse options without value', () => {
        const ts = new Lexer('foo bar --baz=').lex();
        const out = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        expect(out).toEqual({
            ordered: ts.slice(0, 2),
            flags: new Set(),
            options: new Map([['baz', []]])
        });
    });

    it('should parse options followed by flag', () => {
        const ts = new Lexer('foo bar --baz= --foo').lex();
        const out = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        expect(out).toEqual({
            ordered: ts.slice(0, 2),
            flags: new Set(['foo']),
            options: new Map([['baz', []]])
        });
    });

    it('should parse compact options', () => {
        const ts = new Lexer('foo bar --baz=quux').lex();
        const out = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        expect(out).toEqual({
            ordered: ts.slice(0, 2),
            flags: new Set(),
            options: new Map([['baz', ['quux']]])
        });
    });

    it('should parse multiple same options', () => {
        const ts = new Lexer('--foo=w --foo=x --foo= y --foo=z').lex();
        const out = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        expect(out).toEqual({
            ordered: [],
            flags: new Set(),
            options: new Map([['foo', ['w', 'x', 'y', 'z']]])
        });
    });

    it('should parse everything', () => {
        const ts = new Lexer('hello --foo --bar= 123 --baz=quux world').lex();
        const out = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        expect(out).toEqual({
            ordered: [ts[0], ts[5]],
            flags: new Set(['foo']),
            options: new Map([['bar', ['123']], ['baz', ['quux']]])
        });
    });

    it('should not include the quotes in flags or options', () => {
        const ts = new Lexer('hello "--foo" "--bar=" "123" "--baz=quux" world')
            .setQuotes([['"', '"']])
            .lex();

        const out = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        expect(out).toEqual({
            ordered: [ts[0], ts[5]],
            flags: new Set(['foo']),
            options: new Map([['bar', ['123']], ['baz', ['quux']]])
        });
    });

    it('should give things in order', () => {
        const ts = new Lexer('hello --foo --bar= 123 --baz=quux world').lex();
        const parser = new Parser(ts).setUnorderedStrategy(longStrategy());
        const ps = [...parser];
        expect(ps).toEqual([
            { ordered: [{ value: 'hello', raw: 'hello', trailing: ' ' }], flags: new Set(), options: new Map() },
            { ordered: [], flags: new Set(['foo']), options: new Map() },
            { ordered: [], flags: new Set(), options: new Map([['bar', ['123']]]) },
            { ordered: [], flags: new Set(), options: new Map([['baz', ['quux']]]) },
            { ordered: [{ value: 'world', raw: 'world', trailing: '' }], flags: new Set(), options: new Map() }
        ]);
    });

    it('should never error', () => {
        fc.assert(fc.property(fc.string(), s => {
            const ts = new Lexer(s).lex();
            const p = new Parser(ts);
            expect(() => p.parse()).not.toThrow();
        }));
    });

    it('should be that mutation and merge are equivalent', () => {
        fc.assert(fc.property(fc.string(), s => {
            const ts = new Lexer(s).lex();
            const p1 = new Parser(ts).parse();
            const p2 = mergeOutputs(...new Parser(ts));
            expect(p1).toEqual(p2);
        }));
    });
});
