import { Lexer, Parser, Args, some, none, longStrategy, ok, err } from '../src';

describe('Args#single', () => {
    it('can retrieve args', () => {
        const s = 'hello "world" baz "quux"';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        expect(args.single()).toEqual('hello');
    });

    it('returns null when there are no more', () => {
        const s = 'hello "world" baz "quux"';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        expect(args.single()).toEqual('hello');
        expect(args.single()).toEqual('world');
        expect(args.single()).toEqual('baz');
        expect(args.single()).toEqual('quux');
        expect(args.single()).toEqual(null);
    });
});

describe('Args#singleMap{Async}', () => {
    it('can retrieve and map arguments', () => {
        const s = 'a b c';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        const a = args.singleMap(x => x === 'a' ? some(1) : none());
        expect(a).toEqual(some(1));

        const b = args.singleMap(x => x === 'a' ? some(1) : none());
        expect(b).toEqual(none());
    });

    it('can retrieve and map arguments (async)', async () => {
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

describe('Args#singleParse{Async}', () => {
    it('can retrieve and parse arguments', () => {
        const s = 'a b';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        const a = args.singleParse(x => x === 'a' ? ok(1) : err('bad'));
        expect(a).toEqual(ok(1));

        const b = args.singleParse(x => x === 'a' ? ok(1) : err('bad'));
        expect(b).toEqual(err(some('bad')));

        const c = args.singleParse(x => x === 'a' ? ok(1) : err('bad'));
        expect(c).toEqual(err(none()));
    });

    it('can retrieve and parse arguments (async)', async () => {
        const s = 'a b';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        const a = await args.singleParseAsync(async x => x === 'a' ? ok(1) : err('bad'));
        expect(a).toEqual(ok(1));

        const b = await args.singleParseAsync(async x => x === 'a' ? ok(1) : err('bad'));
        expect(b).toEqual(err(some('bad')));

        const c = await args.singleParseAsync(async x => x === 'a' ? ok(1) : err('bad'));
        expect(c).toEqual(err(none()));
    });
});

describe('Args#singleFromEnd', () => {
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
});

describe('Args#many', () => {
    it('can retrieve all the args', () => {
        const s = 'hello "world" baz "quux"';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        expect(args.many()).toEqual([
            { value: 'hello', raw: 'hello', trailing: ' ' },
            { value: 'world', raw: '"world"', trailing: ' ' },
            { value: 'baz', raw: 'baz', trailing: ' ' },
            { value: 'quux', raw: '"quux"', trailing: '' }
        ]);

        expect(args.single()).toEqual(null);
    });

    it('can retrieve a limited amount of many args', () => {
        const s = 'hello "world" baz "quux"';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        expect(args.many(2)).toEqual([
            { value: 'hello', raw: 'hello', trailing: ' ' },
            { value: 'world', raw: '"world"', trailing: ' ' }
        ]);

        expect(args.many(2)).toEqual([
            { value: 'baz', raw: 'baz', trailing: ' ' },
            { value: 'quux', raw: '"quux"', trailing: '' }
        ]);

        expect(args.single()).toEqual(null);
    });
});

describe('Args#manyFromEnd', () => {
    it('can retrieve many from end', () => {
        const s = 'a b c d';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        expect(args.singleFromEnd()).toEqual('d');
        expect(args.manyFromEnd()).toEqual(ts.slice(0, 3));
    });
});

describe('Args#flag', () => {
    it('can retrieve a flag', () => {
        const s = '--foo';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        expect(args.flag('foo')).toEqual(true);
    });

    it('can not retrieve a flag', () => {
        const s = '--foo';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        expect(args.flag('bar')).toEqual(false);
    });

    it('can retrieve a flag given multiple names', () => {
        const s = '--bar';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        expect(args.flag('foo', 'bar', 'baz')).toEqual(true);
    });
});

describe('Args#option', () => {
    it('can retrieve an option', () => {
        const s = '--foo=123';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        expect(args.option('foo')).toEqual('123');
    });

    it('can not retrieve an option', () => {
        const s = '--foo=123';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        expect(args.option('bar')).toEqual(null);
    });

    it('can retrieve an option given multiple names', () => {
        const s = '--foo=123';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        expect(args.option('foo', 'bar', 'baz')).toEqual('123');
    });

    it('can retrieve the last value of an option inputted multiple times', () => {
        const s = '--foo=1 --foo=2 --foo=3';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        expect(args.option('foo')).toEqual('3');
    });
});

describe('Args#options', () => {
    it('can retrieve all the values of an option used mutiple times with multiple names', () => {
        const s = '--foo=1 --bar=2 --baz=3';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        expect(args.options('foo', 'bar', 'baz')).toEqual(['1', '2', '3']);
    });
});

describe('Args#findMap{Async}', () => {
    it('can find and map a token', () => {
        const s = 'hello "world" baz "quux"';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        const y = args.findMap(x => x === 'hello' ? some(10) : none());
        expect(y).toEqual(some(10));
    });

    it('cannot find and map a token', () => {
        const s = 'hello "world" baz "quux"';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        const y = args.findMap(x => x === 'goodbye' ? some(10) : none());
        expect(y).toEqual(none());
    });

    it('can find and map a token (async)', async () => {
        const s = 'hello "world" baz "quux"';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        const y = await args.findMapAsync(async x => x === 'hello' ? some(10) : none());
        expect(y).toEqual(some(10));
    });

    it('cannot find and map a token (async)', async () => {
        const s = 'hello "world" baz "quux"';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        const y = await args.findMapAsync(async x => x === 'goodbye' ? some(10) : none());
        expect(y).toEqual(none());
    });
});

describe('Args#findParse{Async}', () => {
    it('can find and parse a token', () => {
        const s = 'hello "world" baz "quux"';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        const y = args.findParse(x => x === 'hello' ? ok(10) : err('bad'));
        expect(y).toEqual(ok(10));
    });

    it('cannot find and parse a token', () => {
        const s = 'hello "world" baz "quux"';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        const y = args.findParse(x => x === 'goodbye' ? ok(10) : err('bad'));
        expect(y).toEqual(err(['bad', 'bad', 'bad', 'bad']));
    });

    it('can find and parse a token (async)', async () => {
        const s = 'hello "world" baz "quux"';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        const y = await args.findParseAsync(async x => x === 'hello' ? ok(10) : err('bad'));
        expect(y).toEqual(ok(10));
    });

    it('cannot find and parse a token (async)', async () => {
        const s = 'hello "world" baz "quux"';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        const y = await args.findParseAsync(async x => x === 'goodbye' ? ok(10) : err('bad'));
        expect(y).toEqual(err(['bad', 'bad', 'bad', 'bad']));
    });
});

describe('Args#filterMap{Async}', () => {
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
});

describe('Args (misc)', () => {
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

    it('can retrieve one, many, flags, and options', () => {
        const s = 'hello "world" --foo --bar=123 baz "quux"';
        const ts = new Lexer(s).setQuotes([['"', '"']]).lex();
        const po = new Parser(ts).setUnorderedStrategy(longStrategy()).parse();
        const args = new Args(po);

        expect(args.single()).toEqual('hello');
        expect(args.single()).toEqual('world');
        expect(args.many()).toEqual([
            { value: 'baz', raw: 'baz', trailing: ' ' },
            { value: 'quux', raw: '"quux"', trailing: '' }
        ]);

        expect(args.single()).toEqual(null);
        expect(args.flag('foo')).toEqual(true);
        expect(args.flag('hello')).toEqual(false);
        expect(args.options('bar')).toEqual(['123']);
        expect(args.options('world')).toEqual(null);
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
});
