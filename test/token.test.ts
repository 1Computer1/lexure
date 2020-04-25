import { joinTokens, Word } from '../src/token';

describe('joinTokens', () => {
    it('should join tokens losslessly', () => {
        const s = joinTokens([new Word('foo', '    '), new Word('bar', '\n\n')]);
        expect(s).toEqual('foo    bar\n\n');
    });

    it('should join tokens with normal spacing', () => {
        const s = joinTokens([new Word('foo', '    '), new Word('bar', '\n\n')], false);
        expect(s).toEqual('foo bar');
    });
});
