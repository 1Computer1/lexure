import Lexer from '../src/lexer';
import { Word, Quoted } from '../src/tokens';

describe('lexer', () => {
    it('with no quotes, parses text without quotes', () => {
        const s = 'simple text   here';
        const ts = new Lexer(s).lex();
        expect(ts).toEqual([
            new Word('simple', ' '),
            new Word('text', '   '),
            new Word('here', '')
        ]);
    });

    it('with no quotes, parses text with quotes', () => {
        const s = 'simple "text"   here';
        const ts = new Lexer(s).lex();
        expect(ts).toEqual([
            new Word('simple', ' '),
            new Word('"text"', '   '),
            new Word('here', '')
        ]);
    });

    it('with quotes, parses text without quotes', () => {
        const s = 'simple text   here';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        expect(ts).toEqual([
            new Word('simple', ' '),
            new Word('text', '   '),
            new Word('here', '')
        ]);
    });

    it('with quotes, parses text with quotes', () => {
        const s = 'simple "text"   here';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        expect(ts).toEqual([
            new Word('simple', ' '),
            new Quoted('"text"', 'text', '   '),
            new Word('here', '')
        ]);
    });

    it('with quotes, parses text with spaces in quotes', () => {
        const s = 'simple " text here "';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        expect(ts).toEqual([
            new Word('simple', ' '),
            new Quoted('" text here "', ' text here ', '')
        ]);
    });

    it('with quotes, parses quotes without spaces around it', () => {
        const s = 'simple"text"here';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        expect(ts).toEqual([
            new Word('simple', ''),
            new Quoted('"text"', 'text', ''),
            new Word('here', ''),
        ]);
    });

    it('with multiple quotes, parses text with multiple quotes', () => {
        const s = 'simple "text"   “here”';
        const ts = new Lexer(s).setQuotes([['"', '"'], ['“', '”']]).lex();
        expect(ts).toEqual([
            new Word('simple', ' '),
            new Quoted('"text"', 'text', '   '),
            new Quoted('“here”', 'here', '')
        ]);
    });

    it('with multiple quotes, parses text with unclosed quotes', () => {
        const s = 'simple "text"   “here';
        const ts = new Lexer(s).setQuotes([['"', '"'], ['“', '”']]).lex();
        expect(ts).toEqual([
            new Word('simple', ' '),
            new Quoted('"text"', 'text', '   '),
            new Quoted('“here', 'here', '')
        ]);
    });

    it('with multiple quotes, parses text with multiple unclosed quotes', () => {
        const s = 'simple "text “here';
        const ts = new Lexer(s).setQuotes([['"', '"'], ['“', '”']]).lex();
        expect(ts).toEqual([
            new Word('simple', ' '),
            new Quoted('"text “here', 'text “here', '')
        ]);
    });
});
