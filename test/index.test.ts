import * as lexure from '../src';
import {
    Lexer, Parser, Args, Result,
    prefixedStrategy,
    loopAsync, loop1Async, 
    err, ok, step, finish, fail, LoopStrategyAsync
} from '../src';

describe('readme', () => {
    it('should work', () => {
        const input = '!hello world "cool stuff" --foo --bar=baz a b c';

        const lexer = new lexure.Lexer(input)
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

        const parser = new lexure.Parser(tokens)
            .setUnorderedStrategy(lexure.longStrategy());

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

        const j = lexure.joinTokens(out.ordered);
        expect(j).toEqual('world "cool stuff" a b c');

        const args = new lexure.Args(out);

        const a1 = args.single();
        expect(a1).toEqual('world');

        const a2 = args.single();
        expect(a2).toEqual('cool stuff');

        const a3 = args.findMap(x => x === 'c' ? lexure.some('it was a C') : lexure.none());
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

        const result = lexure.loop1({
            getInput() {
                const input = prompt();
                if (input == null) {
                    return lexure.fail('bad input');
                } else {
                    return lexure.step(input);
                }
            },

            parse(s: string) {
                const n = Number(s);
                if (isNaN(n)) {
                    return lexure.fail('bad input');
                } else {
                    return lexure.finish(n);
                }
            }
        });

        expect(result).toEqual({ success: true, value: 100 });
    });
});

describe('complete-example', () => {
    function parseCommand(s: string): [string, Args] | null {
        const lexer = new Lexer(s)
            .setQuotes([
                ['"', '"'], // Double quotes
                ['“', '”'], // Fancy quotes (on iOS)
                ["「", "」"]  // Corner brackets (CJK)
            ]);             // Add more as you see fit!

        const lout = lexer.lexCommand(s => s.startsWith('!') ? 1 : null);
        if (lout == null) {
            return null;
        }

        const [command, getTokens] = lout;
        const tokens = getTokens();
        const parser = new Parser(tokens)
            .setUnorderedStrategy(prefixedStrategy(
                ['--', '-', '—'], // Various flag prefixes including em dash.
                ['=', ':']        // Various separators for options.
            ));

        const pout = parser.parse();
        return [command.value, new Args(pout)];
    }

    function runCommand(s: string): string {
        const out = parseCommand(s);
        if (out == null) {
            return 'Not a command.';
        }
    
        const [command, args] = out;
        if (command === 'add') {
            // These calls to `Args#single` can give a string or null.
            const x = args.single();
            const y = args.single();
            // Which means this could give NaN on bad inputs.
            const z = Number(x) + Number(y);
            return `The answer is ${z}.`;
        } else {
            return 'Not an implemented command.';
        }
    }

    it('should work', () => {
        expect(runCommand('!add 1 2')).toEqual('The answer is 3.');
        expect(runCommand('!add 1 x')).toEqual('The answer is NaN.');
        expect(runCommand('!foo')).toEqual('Not an implemented command.');
        expect(runCommand('hello')).toEqual('Not a command.');
    });
});

describe('parsing-with-loops', () => {
    let aski = 0;
    let asks: string[] = [];
    function ask(): Promise<string | null> {
        if (aski >= asks.length) {
            return Promise.resolve(null);
        }

        return Promise.resolve(asks[aski++]);
    }

    let says: string[] = [];
    function say(s: string): Promise<void> {
        says.push(s);
        return Promise.resolve();
    }

    function sayError(e: ParseError): Promise<void> {
        switch (e) {
            case ParseError.PARSE_FAILURE:
                return say('Invalid input.');
    
            case ParseError.NO_INPUT_GIVEN:
                return say('You did not give a value in time.');
    
            case ParseError.TOO_MANY_TRIES:
                return say('You took too many tries.');
        }
    }

    enum ParseError {
        PARSE_FAILURE,
        NO_INPUT_GIVEN,
        TOO_MANY_TRIES
    }

    type Parser<T> = (x: string) => Result<T, ParseError>;
    type ParserAsync<T> = (x: string) => Promise<Result<T, ParseError>>;

    function makeLoopStrategy<T>(expected: string, runParser: Parser<T>): LoopStrategyAsync<string, T, ParseError> {
        let retries = 0;
        return {
            async getInput() {
                if (retries >= 3) {
                    return fail(ParseError.TOO_MANY_TRIES);
                }

                const s = await ask();
                retries++;
                if (s == null) {
                    return fail(ParseError.NO_INPUT_GIVEN);
                }

                return step(s);
            },

            async parse(s: string) {
                const res = runParser(s);
                if (res.success) {
                    return finish(res.value);
                }

                await say(`Invalid input ${s}, please give a valid ${expected}.`);
                return fail(ParseError.PARSE_FAILURE);
            }
        };
    }

    function loopParse<T>(expected: string, runParser: Parser<T>): ParserAsync<T> {
        return (init: string) => loopAsync(init, makeLoopStrategy(expected, runParser));
    }

    async function loop1Parse<T>(expected: string, runParser: Parser<T>): Promise<Result<T, ParseError>> {
        await say(`No input given, please give a valid ${expected}.`);
        return loop1Async(makeLoopStrategy(expected, runParser));
    }

    async function singleParseWithLoop<T>(
        args: Args,
        expected: string,
        parser: Parser<T>
    ): Promise<Result<T, ParseError>> {
        return await args.singleParseAsync(loopParse(expected, parser))
            ?? await loop1Parse(expected, parser);
    }

    function parseNumber(x: string): Result<number, ParseError> {
        const n = Number(x);
        return isNaN(n) ? err(ParseError.PARSE_FAILURE) : ok(n);
    }

    async function addCommand(args: Args): Promise<void> {
        const n1 = await singleParseWithLoop(args, 'number', parseNumber);
        if (!n1.success) {
            return sayError(n1.error);
        }

        const n2 = await singleParseWithLoop(args, 'number', parseNumber);
        if (!n2.success) {
            return sayError(n2.error);
        }

        const z = n1.value + n2.value;
        return say(`That adds to ${z}.`);
    }

    it('should work with correct inputs', async () => {
        asks = [];

        const input = '1 3';
        const args = new Args(new Parser(new Lexer(input).lex()).parse());
        await addCommand(args);
        expect(aski).toEqual(0);
        expect(says).toEqual(['That adds to 4.']);

        aski = 0;
        asks = [];
        says = [];
    });

    it('should work with one incorrect input, one retry', async () => {
        asks = ['ok', '3'];

        const input = '1 b';
        const args = new Args(new Parser(new Lexer(input).lex()).parse());
        await addCommand(args);
        expect(aski).toEqual(2);
        expect(says).toEqual([
            'Invalid input b, please give a valid number.',
            'Invalid input ok, please give a valid number.',
            'That adds to 4.'
        ]);

        aski = 0;
        asks = [];
        says = [];
    });

    it('should work with two incorrect inputs, no retries', async () => {
        asks = ['1', '3'];

        const input = 'a b';
        const args = new Args(new Parser(new Lexer(input).lex()).parse());
        await addCommand(args);
        expect(aski).toEqual(2);
        expect(says).toEqual([
            'Invalid input a, please give a valid number.',
            'Invalid input b, please give a valid number.',
            'That adds to 4.'
        ]);

        aski = 0;
        asks = [];
        says = [];
    });

    it('should work with no initial inputs', async () => {
        asks = ['1', '3'];

        const input = '';
        const args = new Args(new Parser(new Lexer(input).lex()).parse());
        await addCommand(args);
        expect(aski).toEqual(2);
        expect(says).toEqual([
            'No input given, please give a valid number.',
            'No input given, please give a valid number.',
            'That adds to 4.'
        ]);

        aski = 0;
        asks = [];
        says = [];
    });

    it('should work one incorrect input, retry limit reached', async () => {
        asks = ['bad', 'badder', 'baddest', 'bad?', 'bad!'];

        const input = '1 b';
        const args = new Args(new Parser(new Lexer(input).lex()).parse());
        await addCommand(args);
        expect(aski).toEqual(3);
        expect(says).toEqual([
            'Invalid input b, please give a valid number.',
            'Invalid input bad, please give a valid number.',
            'Invalid input badder, please give a valid number.',
            'Invalid input baddest, please give a valid number.',
            'You took too many tries.'
        ]);

        aski = 0;
        asks = [];
        says = [];
    });

    it('should work with two incorrect inputs, no input given', async () => {
        asks = [];

        const input = 'a b';
        const args = new Args(new Parser(new Lexer(input).lex()).parse());
        await addCommand(args);
        expect(aski).toEqual(0);
        expect(says).toEqual([
            'Invalid input a, please give a valid number.',
            'You did not give a value in time.'
        ]);

        aski = 0;
        asks = [];
        says = [];
    });
});
