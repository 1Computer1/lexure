import * as fc from 'fast-check';
import { Lexer } from '../src';

describe('lexer', () => {
    it('with no quotes, parses text without quotes', () => {
        const s = 'simple text   here';
        const ts = new Lexer(s).lex();
        expect(ts).toEqual([
            { value: 'simple', raw: 'simple', trailing: ' ' },
            { value: 'text', raw: 'text', trailing: '   ' },
            { value: 'here', raw: 'here', trailing: '' }
        ]);
    });

    it('with no quotes, parses text with quotes', () => {
        const s = 'simple "text"   here';
        const ts = new Lexer(s).lex();
        expect(ts).toEqual([
            { value: 'simple', raw: 'simple', trailing: ' ' },
            { value: '"text"', raw: '"text"', trailing: '   ' },
            { value: 'here', raw: 'here', trailing: '' }
        ]);
    });

    it('with quotes, parses text without quotes', () => {
        const s = 'simple text   here';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        expect(ts).toEqual([
            { value: 'simple', raw: 'simple', trailing: ' ' },
            { value: 'text', raw: 'text', trailing: '   ' },
            { value: 'here', raw: 'here', trailing: '' }
        ]);
    });

    it('with quotes, parses text with quotes', () => {
        const s = 'simple "text"   here';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        expect(ts).toEqual([
            { value: 'simple', raw: 'simple', trailing: ' ' },
            { value: 'text', raw: '"text"', trailing: '   ' },
            { value: 'here', raw: 'here', trailing: '' }
        ]);
    });

    it('with quotes, parses text with spaces in quotes', () => {
        const s = 'simple " text here "';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        expect(ts).toEqual([
            { value: 'simple', raw: 'simple', trailing: ' ' },
            { value: ' text here ', raw: '" text here "', trailing: '' }
        ]);
    });

    it('with quotes, parses quotes without spaces around it', () => {
        const s = 'simple"text"here';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        expect(ts).toEqual([
            { value: 'simple', raw: 'simple', trailing: '' },
            { value: 'text', raw: '"text"', trailing: '' },
            { value: 'here', raw: 'here', trailing: '' },
        ]);
    });

    it('with multiple quotes, parses text with multiple quotes', () => {
        const s = 'simple "text"   “here”';
        const ts = new Lexer(s).setQuotes([['"', '"'], ['“', '”']]).lex();
        expect(ts).toEqual([
            { value: 'simple', raw: 'simple', trailing: ' ' },
            { value: 'text', raw: '"text"', trailing: '   ' },
            { value: 'here', raw: '“here”', trailing: '' }
        ]);
    });

    it('with multiple quotes, parses text with unclosed quotes', () => {
        const s = 'simple "text"   “here';
        const ts = new Lexer(s).setQuotes([['"', '"'], ['“', '”']]).lex();
        expect(ts).toEqual([
            { value: 'simple', raw: 'simple', trailing: ' ' },
            { value: 'text', raw: '"text"', trailing: '   ' },
            { value: 'here', raw: '“here', trailing: '' }
        ]);
    });

    it('with multiple quotes, parses text with multiple unclosed quotes', () => {
        const s = 'simple "text “here';
        const ts = new Lexer(s).setQuotes([['"', '"'], ['“', '”']]).lex();
        expect(ts).toEqual([
            { value: 'simple', raw: 'simple', trailing: ' ' },
            { value: 'text “here', raw: '"text “here', trailing: '' }
        ]);
    });

    it('can handle leading spaces', () => {
        const s = ' simple text here';
        const ts = new Lexer(s).lex();
        expect(ts).toEqual([
            { value: 'simple', raw: 'simple', trailing: ' ' },
            { value: 'text', raw: 'text', trailing: ' ' },
            { value: 'here', raw: 'here', trailing: '' }
        ]);
    });

    it('should never error', () => {
        fc.property(fc.string(), s => {
            const l = new Lexer(s);
            expect(() => l.lex()).not.toThrow();
        });
    });
});
