import * as Lexure from '../src';

describe('readme', () => {
    it('should work', () => {
        const input = '!hello world "cool stuff" --foo --bar=baz a b c';
        
        const lexer = new Lexure.Lexer(input)
            .setQuotes([['"', '"'], ['“', '”']]);
        
        const tokens = lexer.lex();
        expect(tokens).toEqual([
            { value: '!hello', raw: '!hello', trailing: ' ' },
            { value: 'world', raw: 'world', trailing: ' ' },
            { value: 'cool stuff', raw: '"cool stuff"', trailing: ' ' },
            { value: '--foo', raw: '--foo', trailing: ' ' },
            { value: '--bar=baz', raw: '--bar=baz', trailing: ' ' },
            { value: 'a', raw: 'a', trailing: ' ' },
            { value: 'b', raw: 'b', trailing: ' ' },
            { value: 'c', raw: 'c', trailing: '' }
        ]);
        
        const c = Lexure.extractCommand(s => s.startsWith('!') ? 1 : null, tokens);
        expect(c).toEqual({ value: 'hello', raw: 'hello', trailing: ' ' });
        
        expect(tokens).toEqual([
            { value: 'world', raw: 'world', trailing: ' ' },
            { value: 'cool stuff', raw: '"cool stuff"', trailing: ' ' },
            { value: '--foo', raw: '--foo', trailing: ' ' },
            { value: '--bar=baz', raw: '--bar=baz', trailing: ' ' },
            { value: 'a', raw: 'a', trailing: ' ' },
            { value: 'b', raw: 'b', trailing: ' ' },
            { value: 'c', raw: 'c', trailing: '' }
        ]);
        
        const parser = new Lexure.Parser(tokens)
            .setUnorderedStrategy(Lexure.longStrategy());

        const res = parser.parse();
        expect(res).toEqual({
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

        const j = Lexure.joinTokens(res.ordered);
        expect(j).toEqual('world "cool stuff" a b c');

        const args = new Lexure.Args(res);
        
        const a1 = args.single();
        expect(a1).toEqual('world');
        
        const a2 = args.single();
        expect(a2).toEqual('cool stuff');
        
        const a3 = args.findMap(x => x === 'c' ? Lexure.some('it was a C') : Lexure.none());
        expect(a3).toEqual({ exists: true, value: 'it was a C' });
        
        const a4 = args.many();
        expect(a4).toEqual([
            { value: 'a', raw: 'a', trailing: ' ' },
            { value: 'b', raw: 'b', trailing: ' ' }
        ]);
        
        const a5 = args.flag('foo');
        expect(a5).toEqual(true);
        
        const a6 = args.option('bar');
        expect(a6).toEqual(['baz']);
    });
});
