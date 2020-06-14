import { Tokens } from '../src/';
import { Token } from '../src/tokens';

describe('joinTokens', () => {
    it('should join tokens with original spacing', () => {
        const s = Tokens.joinTokens([{ value: 'foo', raw: 'foo', trailing: '    ' }, { value: 'bar', raw: 'bar', trailing: '\n\n' }]);
        expect(s).toEqual('foo    bar');
    });

    it('should join tokens with given spacing', () => {
        const s = Tokens.joinTokens([{ value: 'foo', raw: 'foo', trailing: '    ' }, { value: 'bar', raw: 'bar', trailing: '\n\n' }], ' ');
        expect(s).toEqual('foo bar');
    });

    it('should join tokens with original spacing and keep quotes', () => {
        const s = Tokens.joinTokens([
            { value: 'foo', raw: '"foo"', trailing: '    ' },
            { value: 'bar', raw: 'bar', trailing: '\n\n' }
        ], null, true);

        expect(s).toEqual('"foo"    bar');
    });

    it('should join tokens with original spacing and not keep quotes', () => {
        const s = Tokens.joinTokens([
            { value: 'foo', raw: '"foo"', trailing: '    ' },
            { value: 'bar', raw: 'bar', trailing: '\n\n' }
        ], null, false);

        expect(s).toEqual('foo    bar');
    });

    it('should join tokens with given spacing and keep quotes', () => {
        const s = Tokens.joinTokens([
            { value: 'foo', raw: '"foo"', trailing: '    ' },
            { value: 'bar', raw: 'bar', trailing: '\n\n' }
        ], ' ', true);

        expect(s).toEqual('"foo" bar');
    });

    it('should join tokens with given spacing and not keep quotes', () => {
        const s = Tokens.joinTokens([
            { value: 'foo', raw: '"foo"', trailing: '    ' },
            { value: 'bar', raw: 'bar', trailing: '\n\n' }
        ], ' ', false);

        expect(s).toEqual('foo bar');
    });
});

describe('extractCommand', () => {
    it('can extract and mutate from one token', () => {
        const ts = [{ value: '!help', raw: '!help', trailing: ' ' }, { value: 'me', raw: 'me', trailing: '' }];
        const cmd = Tokens.extractCommand(s => s.startsWith('!') ? 1 : null, ts);
        expect(cmd).toEqual({ value: 'help', raw: 'help', trailing: ' ' });
        expect(ts).toEqual([{ value: 'me', raw: 'me', trailing: '' }]);
    });

    it('can extract and mutate from two tokens', () => {
        const ts = [{ value: '!', raw: '!', trailing: ' ' }, { value: 'help', raw: 'help', trailing: ' ' }, { value: 'me', raw: 'me', trailing: '' }];
        const cmd = Tokens.extractCommand(s => s.startsWith('!') ? 1 : null, ts);
        expect(cmd).toEqual({ value: 'help', raw: 'help', trailing: ' ' });
        expect(ts).toEqual([{ value: 'me', raw: 'me', trailing: '' }]);
    });

    it('can extract from one token', () => {
        const ts = [{ value: '!help', raw: '!help', trailing: ' ' }, { value: 'me', raw: 'me', trailing: '' }];
        const cmd = Tokens.extractCommand(s => s.startsWith('!') ? 1 : null, ts, false);
        expect(cmd).toEqual({ value: 'help', raw: 'help', trailing: ' ' });
        expect(ts).toEqual(ts);
    });

    it('can extract from two tokens', () => {
        const ts = [{ value: '!', raw: '!', trailing: ' ' }, { value: 'help', raw: 'help', trailing: ' ' }, { value: 'me', raw: 'me', trailing: '' }];
        const cmd = Tokens.extractCommand(s => s.startsWith('!') ? 1 : null, ts, false);
        expect(cmd).toEqual({ value: 'help', raw: 'help', trailing: ' ' });
        expect(ts).toEqual(ts);
    });

    it('can fail when not enough tokens', () => {
        const ts: Token[] = [];
        const cmd = Tokens.extractCommand(s => s.startsWith('!') ? 1 : null, ts);
        expect(cmd).toEqual(null);
        expect(ts).toEqual(ts);
    });

    it('can fail when not enough tokens after prefix', () => {
        const ts = [{ value: '!', raw: '!', trailing: ' ' }];
        const cmd = Tokens.extractCommand(s => s.startsWith('!') ? 1 : null, ts);
        expect(cmd).toEqual(null);
        expect(ts).toEqual(ts);
    });

    it('can fail when no matching prefix', () => {
        const ts = [{ value: '!', raw: '!', trailing: ' ' }, { value: 'help', raw: 'help', trailing: ' ' }, { value: 'me', raw: 'me', trailing: '' }];
        const cmd = Tokens.extractCommand(s => s.startsWith('?') ? 1 : null, ts);
        expect(cmd).toEqual(null);
        expect(ts).toEqual(ts);
    });
});
