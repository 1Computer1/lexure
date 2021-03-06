import * as fc from 'fast-check';
import { Lexer } from '../src';

describe('Lexer#lex', () => {
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

    it('with multiple quotes, parses quotes without spaces around it', () => {
        const s = '!foo --reset="lorem ipsum"';
        const ts = new Lexer(s).setQuotes([['"', '"'], ['“', '”']]).lex();
        expect(ts).toEqual([
            { value: '!foo', raw: '!foo', trailing: ' ' },
            { value: '--reset=', raw: '--reset=', trailing: '' },
            { value: 'lorem ipsum', raw: '"lorem ipsum"', trailing: '' },
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

    it('can handle just spaces', () => {
        const s = '  ';
        const ts = new Lexer(s).lex();
        expect(ts).toEqual([]);
    });

    it('can handle empty strings', () => {
        const s = '';
        const ts = new Lexer(s).lex();
        expect(ts).toEqual([]);
    });

    it('should never error', () => {
        fc.assert(fc.property(fc.string(), s => {
            const l = new Lexer(s);
            expect(() => l.lex()).not.toThrow();
        }));
    });
});

describe('Lexer#lexCommand', () => {
    it('can match a prefix and command together', () => {
        const s = '!command here';
        const ts = new Lexer(s).lexCommand(s => s.startsWith('!') ? 1 : null);
        expect(ts).not.toBeNull();
        expect(ts![0]).toEqual({ value: 'command', raw: 'command', trailing: ' ' });
        expect(ts![1]()).toEqual([{ value: 'here', raw: 'here', trailing: '' }]);
    });

    it('can match a prefix and command separated', () => {
        const s = '! command here';
        const ts = new Lexer(s).lexCommand(s => s.startsWith('!') ? 1 : null);
        expect(ts).not.toBeNull();
        expect(ts![0]).toEqual({ value: 'command', raw: 'command', trailing: ' ' });
        expect(ts![1]()).toEqual([{ value: 'here', raw: 'here', trailing: '' }]);
    });

    it('can match a prefix and command together lazily', () => {
        const s = '!first second third';
        const l = new Lexer(s);
        const ts = l.lexCommand(s => s.startsWith('!') ? 1 : null);

        expect(ts).not.toBeNull();
        expect(ts![0]).toEqual({ value: 'first', raw: 'first', trailing: ' ' });

        const ys = l.lex();
        expect(ys).toEqual([
            { value: 'second', raw: 'second', trailing: ' ' },
            { value: 'third', raw: 'third', trailing: '' }
        ]);

        expect(ts![1]()).toEqual([]);
    });

    it('can match a prefix and command separately lazily', () => {
        const s = '! first second third';
        const l = new Lexer(s);
        const ts = l.lexCommand(s => s.startsWith('!') ? 1 : null);

        expect(ts).not.toBeNull();
        expect(ts![0]).toEqual({ value: 'first', raw: 'first', trailing: ' ' });

        const ys = l.lex();
        expect(ys).toEqual([
            { value: 'second', raw: 'second', trailing: ' ' },
            { value: 'third', raw: 'third', trailing: '' }
        ]);

        expect(ts![1]()).toEqual([]);
    });

    it('can fail to match a prefix and command (no prefix)', () => {
        const s = 'command here';
        const ts = new Lexer(s).lexCommand(s => s.startsWith('!') ? 1 : null);
        expect(ts).toBeNull();
    });

    it('can fail to match a prefix and command (no input)', () => {
        const s = '';
        const ts = new Lexer(s).lexCommand(s => s.startsWith('!') ? 1 : null);
        expect(ts).toBeNull();
    });

    it('can lex multiple inputs', () => {
        const lexer = new Lexer().setQuotes([['"', '"']]);

        expect(lexer.setInput('"hey"').lex()).toEqual([{ value: 'hey', raw: '"hey"', trailing: '' }]);
        expect(lexer.setInput('"foo"').lex()).toEqual([{ value: 'foo', raw: '"foo"', trailing: '' }]);
    });
});
