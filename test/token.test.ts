import { joinTokens } from '../src/tokens';

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
