import { Lexer, Parser, Args, some, none, longStrategy } from '../src';

describe('args', () => {
    it('can retrieve single and many args', () => {
        const s = 'hello "world" baz "quux"';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        expect(args.single()).toEqual('hello');
        expect(args.single()).toEqual('world');
        expect(args.many()).toEqual([{ value: 'baz', raw: 'baz', trailing: ' ' }, { value: 'quux', raw: '"quux"', trailing: '' }]);
        expect(args.single()).toEqual(null);
    });

    it('can retrieve a limited amount of many args', () => {
        const s = 'hello "world" baz "quux"';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        expect(args.many(2)).toEqual([{ value: 'hello', raw: 'hello', trailing: ' ' }, { value: 'world', raw: '"world"', trailing: ' ' }]);
        expect(args.single()).toEqual('baz');
        expect(args.single()).toEqual('quux');
        expect(args.single()).toEqual(null);
    });

    it('can retrieve flags and options', () => {
        const s = '--foo --bar=123';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        expect(args.flag('foo')).toEqual(true);
        expect(args.flag('hello')).toEqual(false);
        expect(args.options('bar')).toEqual(['123']);
        expect(args.options('world')).toEqual(null);
    });

    it('can retrieve last option value', () => {
        const s = '--foo=1 --foo=2 --foo=3';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        expect(args.option('foo')).toEqual('3');
    });

    it('can retrieve one, many, flags, and options', () => {
        const s = 'hello "world" --foo --bar=123 baz "quux"';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        expect(args.single()).toEqual('hello');
        expect(args.single()).toEqual('world');
        expect(args.many()).toEqual([{ value: 'baz', raw: 'baz', trailing: ' ' }, { value: 'quux', raw: '"quux"', trailing: '' }]);
        expect(args.single()).toEqual(null);
        expect(args.flag('foo')).toEqual(true);
        expect(args.flag('hello')).toEqual(false);
        expect(args.options('bar')).toEqual(['123']);
        expect(args.options('world')).toEqual(null);
    });

    it('has the correct state and counts', () => {
        const s = 'hello "world" baz "quux"';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        expect(args.length).toEqual(4);
        expect(args.remaining).toEqual(4);
        expect(args.finished).toEqual(false);
        expect(args.state.usedIndices).toEqual(new Set());

        args.single();
        args.single();

        expect(args.length).toEqual(4);
        expect(args.remaining).toEqual(2);
        expect(args.finished).toEqual(false);
        expect(args.state.usedIndices).toEqual(new Set([0, 1]));

        args.many();

        expect(args.length).toEqual(4);
        expect(args.remaining).toEqual(0);
        expect(args.finished).toEqual(true);
        expect(args.state.usedIndices).toEqual(new Set([0, 1, 2, 3]));
    });

    it('can find a token', () => {
        const s = 'hello "world" baz "quux"';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        const y = args.findMap(x => x === 'hello' ? some(10) : none());
        expect(y).toEqual(some(10));
    });

    it('cannot find a token', () => {
        const s = 'hello "world" baz "quux"';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        const y = args.findMap(x => x === 'goodbye' ? some(10) : none());
        expect(y).toEqual(none());
    });

    it('can find a token (async)', async () => {
        const s = 'hello "world" baz "quux"';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        const y = await args.findMapAsync(async x => x === 'hello' ? some(10) : none());
        expect(y).toEqual(some(10));
    });

    it('cannot find a token (async)', async () => {
        const s = 'hello "world" baz "quux"';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        const y = await args.findMapAsync(async x => x === 'goodbye' ? some(10) : none());
        expect(y).toEqual(none());
    });

    it('can filter multiple tokens', () => {
        const s = 'hello "world" hello "quux"';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        const y = args.filterMap(x => x === 'hello' ? some(10) : none());
        expect(y).toEqual([10, 10]);
    });

    it('can filter multiple tokens (async)', async () => {
        const s = 'hello "world" hello "quux"';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        const y = await args.filterMapAsync(async x => x === 'hello' ? some(10) : none());
        expect(y).toEqual([10, 10]);
    });

    it('will skip over a used token', () => {
        const s = 'hello "world" baz "quux"';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        args.findMap(x => x === 'hello' ? some(10) : none());
        expect(args.state.usedIndices).toEqual(new Set([0]));
        expect(args.single()).toEqual('world');
        expect(args.state.usedIndices).toEqual(new Set([0, 1]));
        expect(args.state.position).toEqual(2);
    });

    it('will skip over multiple used tokens', () => {
        const s = 'hello a hello b';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        args.filterMap(x => x === 'hello' ? some(10) : none());
        expect(args.state.usedIndices).toEqual(new Set([0, 2]));
        expect(args.many()).toEqual([{ value: 'a', raw: 'a', trailing: ' ' }, { value: 'b', raw: 'b', trailing: '' }]);
        expect(args.state.usedIndices).toEqual(new Set([0, 1, 2, 3]));
    });

    it('can retrieve single from end', () => {
        const s = 'a b c d';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        expect(args.singleFromEnd()).toEqual('d');
        expect(args.singleFromEnd()).toEqual('c');
        expect(args.singleFromEnd()).toEqual('b');
        expect(args.singleFromEnd()).toEqual('a');
    });

    it('can retrieve from start and end', () => {
        const s = 'a b c d';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        expect(args.single()).toEqual('a');
        expect(args.singleFromEnd()).toEqual('d');
        expect(args.single()).toEqual('b');
        expect(args.singleFromEnd()).toEqual('c');
    });

    it('can retrieve many from end', () => {
        const s = 'a b c d';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        expect(args.singleFromEnd()).toEqual('d');
        expect(args.manyFromEnd()).toEqual(ts.slice(0, 3));
    });

    it('can retrieve flags with multiple names', () => {
        const s = '--bar';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        expect(args.flag('foo', 'bar', 'baz')).toEqual(true);
    });

    it('can retrieve options with multiple names', () => {
        const s = '--bar=2';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        expect(args.option('foo', 'bar', 'baz')).toEqual('2');
    });

    it('can retrieve options used mutiple times with multiple names', () => {
        const s = '--foo=1 --bar=2 --baz=3';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        expect(args.option('foo', 'bar', 'baz')).toEqual('1');
    });

    it('can retrieve all the values of an option used mutiple times with multiple names', () => {
        const s = '--foo=1 --bar=2 --baz=3';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        expect(args.options('foo', 'bar', 'baz')).toEqual(['1', '2', '3']);
    });

    it('can save and restore state', () => {
        const s = 'a b c';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        args.single();
        const st = args.save();
        expect(st).toEqual({
            usedIndices: new Set([0]),
            position: 1,
            positionFromEnd: 2
        });

        args.single();
        args.single();
        args.restore(st);
        expect(st).toEqual({
            usedIndices: new Set([0]),
            position: 1,
            positionFromEnd: 2
        });

        expect(args.single()).toEqual('b');
    });

    it('can retrieve and map a single argument', () => {
        const s = 'a b c';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        const a = args.singleMap(x => x === 'a' ? some(1) : none());
        expect(a).toEqual(some(1));

        const b = args.singleMap(x => x === 'a' ? some(1) : none());
        expect(b).toEqual(none());
    });

    it('can retrieve and map a single argument (async)', async () => {
        const s = 'a b c';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        const a = await args.singleMapAsync(async x => x === 'a' ? some(1) : none());
        expect(a).toEqual(some(1));

        const b = await args.singleMapAsync(async x => x === 'a' ? some(1) : none());
        expect(b).toEqual(none());
    });
});
