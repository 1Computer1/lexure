import { Lexer } from '../src';

describe('lexer', () => {
    it('with no quotes, parses text without quotes', () => {
        const s = 'simple text   here';
        const ts = new Lexer(s).lex();
        expect(ts).toEqual([
            { value: 'simple', trailing: ' ' },
            { value: 'text', trailing: '   ' },
            { value: 'here', trailing: '' }
        ]);
    });

    it('with no quotes, parses text with quotes', () => {
        const s = 'simple "text"   here';
        const ts = new Lexer(s).lex();
        expect(ts).toEqual([
            { value: 'simple', trailing: ' ' },
            { value: '"text"', trailing: '   ' },
            { value: 'here', trailing: '' }
        ]);
    });

    it('with quotes, parses text without quotes', () => {
        const s = 'simple text   here';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        expect(ts).toEqual([
            { value: 'simple', trailing: ' ' },
            { value: 'text', trailing: '   ' },
            { value: 'here', trailing: '' }
        ]);
    });

    it('with quotes, parses text with quotes', () => {
        const s = 'simple "text"   here';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        expect(ts).toEqual([
            { value: 'simple', trailing: ' ' },
            { value: 'text', quoted: '"text"', trailing: '   ' },
            { value: 'here', trailing: '' }
        ]);
    });

    it('with quotes, parses text with spaces in quotes', () => {
        const s = 'simple " text here "';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        expect(ts).toEqual([
            { value: 'simple', trailing: ' ' },
            { value: ' text here ', quoted: '" text here "', trailing: '' }
        ]);
    });

    it('with quotes, parses quotes without spaces around it', () => {
        const s = 'simple"text"here';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        expect(ts).toEqual([
            { value: 'simple', trailing: '' },
            { value: 'text', quoted: '"text"', trailing: '' },
            { value: 'here', trailing: '' },
        ]);
    });

    it('with multiple quotes, parses text with multiple quotes', () => {
        const s = 'simple "text"   “here”';
        const ts = new Lexer(s).setQuotes([['"', '"'], ['“', '”']]).lex();
        expect(ts).toEqual([
            { value: 'simple', trailing: ' ' },
            { value: 'text', quoted: '"text"', trailing: '   ' },
            { value: 'here', quoted: '“here”', trailing: '' }
        ]);
    });

    it('with multiple quotes, parses text with unclosed quotes', () => {
        const s = 'simple "text"   “here';
        const ts = new Lexer(s).setQuotes([['"', '"'], ['“', '”']]).lex();
        expect(ts).toEqual([
            { value: 'simple', trailing: ' ' },
            { value: 'text', quoted: '"text"', trailing: '   ' },
            { value: 'here', quoted: '“here', trailing: '' }
        ]);
    });

    it('with multiple quotes, parses text with multiple unclosed quotes', () => {
        const s = 'simple "text “here';
        const ts = new Lexer(s).setQuotes([['"', '"'], ['“', '”']]).lex();
        expect(ts).toEqual([
            { value: 'simple', trailing: ' ' },
            { value: 'text “here', quoted: '"text “here', trailing: '' }
        ]);
    });

    it('can handle leading spaces', () => {
        const s = ' simple text here';
        const ts = new Lexer(s).lex();
        expect(ts).toEqual([
            { value: 'simple', trailing: ' ' },
            { value: 'text', trailing: ' ' },
            { value: 'here', trailing: '' }
        ]);
    });
});
