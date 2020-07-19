import * as Lexure from '../src';

describe('readme', () => {
    it('should work', () => {
        const input = '!hello world "cool stuff" --foo --bar=baz a b c';
        
        const lexer = new Lexure.Lexer(input)
            .setQuotes([['"', '"'], ['“', '”']]);
        
        const res = lexer.lexCommand(s => s.startsWith('!') ? 1 : null);
        expect(res).not.toBeNull();

        const cmd = res![0];
        expect(cmd).toEqual({ value: 'hello', raw: 'hello', trailing: ' ' });

        const tokens = res![1]();
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

        const out = parser.parse();
        expect(out).toEqual({
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

        const j = Lexure.joinTokens(out.ordered);
        expect(j).toEqual('world "cool stuff" a b c');

        const args = new Lexure.Args(out);
        
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
        expect(a6).toEqual('baz');

        function prompt(): string | null {
            return '100';
        }

        const result = Lexure.loop1(null, {
            getInput() {
                const input = prompt();
                if (input == null) {
                    return Lexure.fail('bad input');
                } else {
                    return Lexure.step(input);
                }
            },
        
            parse(s: string) {
                const n = Number(s);
                if (isNaN(n)) {
                    return Lexure.fail('bad input');
                } else {
                    return Lexure.finish(n);
                }
            }
        });

        expect(result).toEqual({ success: true, value: 100 });
    });
});
