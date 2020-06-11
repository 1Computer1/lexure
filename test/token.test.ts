import { joinTokens, extractCommand, Token } from '../src/tokens';

describe('joinTokens', () => {
    it('should join tokens losslessly', () => {
        const s = joinTokens([{ value: 'foo', trailing: '    ' }, { value: 'bar', trailing: '\n\n' }]);
        expect(s).toEqual('foo    bar\n\n');
    });

    it('should join tokens with normal spacing', () => {
        const s = joinTokens([{ value: 'foo', trailing: '    ' }, { value: 'bar', trailing: '\n\n' }], false);
        expect(s).toEqual('foo bar');
    });
});

describe('extractCommand', () => {
    it('can extract and mutate from one token', () => {
        const ts = [{ value: '!help', trailing: ' ' }, { value: 'me', trailing: '' }];
        const cmd = extractCommand(s => s.startsWith('!') ? 1 : null, ts);
        expect(cmd).toEqual('help');
        expect(ts).toEqual([{ value: 'me', trailing: '' }]);
    });

    it('can extract and mutate from two tokens', () => {
        const ts = [{ value: '!', trailing: ' ' }, { value: 'help', trailing: ' ' }, { value: 'me', trailing: '' }];
        const cmd = extractCommand(s => s.startsWith('!') ? 1 : null, ts);
        expect(cmd).toEqual('help');
        expect(ts).toEqual([{ value: 'me', trailing: '' }]);
    });

    it('can extract from one token', () => {
        const ts = [{ value: '!help', trailing: ' ' }, { value: 'me', trailing: '' }];
        const cmd = extractCommand(s => s.startsWith('!') ? 1 : null, ts, false);
        expect(cmd).toEqual('help');
        expect(ts).toEqual(ts);
    });

    it('can extract from two tokens', () => {
        const ts = [{ value: '!', trailing: ' ' }, { value: 'help', trailing: ' ' }, { value: 'me', trailing: '' }];
        const cmd = extractCommand(s => s.startsWith('!') ? 1 : null, ts, false);
        expect(cmd).toEqual('help');
        expect(ts).toEqual(ts);
    });

    it('can fail when not enough tokens', () => {
        const ts: Token[] = [];
        const cmd = extractCommand(s => s.startsWith('!') ? 1 : null, ts);
        expect(cmd).toEqual(null);
        expect(ts).toEqual(ts);
    });

    it('can fail when not enough tokens after prefix', () => {
        const ts = [{ value: '!', trailing: ' ' }];
        const cmd = extractCommand(s => s.startsWith('!') ? 1 : null, ts);
        expect(cmd).toEqual(null);
        expect(ts).toEqual(ts);
    });

    it('can fail when no matching prefix', () => {
        const ts = [{ value: '!', trailing: ' ' }, { value: 'help', trailing: ' ' }, { value: 'me', trailing: '' }];
        const cmd = extractCommand(s => s.startsWith('?') ? 1 : null, ts);
        expect(cmd).toEqual(null);
        expect(ts).toEqual(ts);
    });
});
