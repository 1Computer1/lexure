import { Lexer, Parser, Unordered } from '../src';

describe('parser', () => {
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
        const out = new Parser(ts).setUnorderedStrategy(Unordered.longStrategy()).parse();
        expect(out).toEqual({
            ordered: ts.slice(0, 2),
            flags: new Set(['baz']),
            options: new Map()
        });
    });

    it('should parse options', () => {
        const ts = new Lexer('foo bar --baz= quux').lex();
        const out = new Parser(ts).setUnorderedStrategy(Unordered.longStrategy()).parse();
        expect(out).toEqual({
            ordered: ts.slice(0, 2),
            flags: new Set(),
            options: new Map([['baz', 'quux']])
        });
    });

    it('should parse options without value', () => {
        const ts = new Lexer('foo bar --baz=').lex();
        const out = new Parser(ts).setUnorderedStrategy(Unordered.longStrategy()).parse();
        expect(out).toEqual({
            ordered: ts.slice(0, 2),
            flags: new Set(),
            options: new Map([['baz', '']])
        });
    });

    it('should parse options followed by flag', () => {
        const ts = new Lexer('foo bar --baz= --foo').lex();
        const out = new Parser(ts).setUnorderedStrategy(Unordered.longStrategy()).parse();
        expect(out).toEqual({
            ordered: ts.slice(0, 2),
            flags: new Set(['foo']),
            options: new Map([['baz', '']])
        });
    });

    it('should parse compact options', () => {
        const ts = new Lexer('foo bar --baz=quux').lex();
        const out = new Parser(ts).setUnorderedStrategy(Unordered.longStrategy()).parse();
        expect(out).toEqual({
            ordered: ts.slice(0, 2),
            flags: new Set(),
            options: new Map([['baz', 'quux']])
        });
    });

    it('should parse everything', () => {
        const ts = new Lexer('hello --foo --bar= 123 --baz=quux world').lex();
        const out = new Parser(ts).setUnorderedStrategy(Unordered.longStrategy()).parse();
        expect(out).toEqual({
            ordered: [ts[0], ts[5]],
            flags: new Set(['foo']),
            options: new Map([['bar', '123'], ['baz', 'quux']])
        });
    });

    it('should not include the quotes in flags or options', () => {
        const ts = new Lexer('hello "--foo" "--bar=" "123" "--baz=quux" world')
            .setQuotes([['"', '"']])
            .lex();

        const out = new Parser(ts).setUnorderedStrategy(Unordered.longStrategy()).parse();
        expect(out).toEqual({
            ordered: [ts[0], ts[5]],
            flags: new Set(['foo']),
            options: new Map([['bar', '123'], ['baz', 'quux']])
        });
    });

    it('should give things in order', () => {
        const ts = new Lexer('hello --foo --bar= 123 --baz=quux world').lex();
        const parser = new Parser(ts).setUnorderedStrategy(Unordered.longStrategy());
        const ps = [...parser];
        expect(ps).toEqual([
            { ordered: [{ value: 'hello', trailing: ' ' }], flags: new Set(), options: new Map() },
            { ordered: [], flags: new Set(['foo']), options: new Map() },
            { ordered: [], flags: new Set(), options: new Map([['bar', '123']]) },
            { ordered: [], flags: new Set(), options: new Map([['baz', 'quux']]) },
            { ordered: [{ value: 'world', trailing: '' }], flags: new Set(), options: new Map() }
        ]);
    });
});
