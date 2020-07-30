import {
    some, none, ok, err, step, finish, fail,
    someToOk, okToSome, errToSome,
    someToStep, someToFinish, okToStep, okToFinish
} from '../src';

describe('someToOk', () => {
    it('some -> ok', () => {
        expect(someToOk(some(1), 0)).toEqual(ok(1));
    });

    it('none -> err', () => {
        expect(someToOk(none(), 0)).toEqual(err(0));
    });
});

describe('okToSome', () => {
    it('ok -> some', () => {
        expect(okToSome(ok(1))).toEqual(some(1));
    });

    it('err -> none', () => {
        expect(okToSome(err(0))).toEqual(none());
    });
});

describe('errToSome', () => {
    it('ok -> none', () => {
        expect(errToSome(ok(1))).toEqual(none());
    });

    it('err -> sone', () => {
        expect(errToSome(err(0))).toEqual(some(0));
    });
});

describe('someToStep', () => {
    it('some -> step', () => {
        expect(someToStep(some(1), 0)).toEqual(step(1));
    });

    it('none -> fail', () => {
        expect(someToStep(none(), 0)).toEqual(fail(0));
    });
});

describe('someToFinish', () => {
    it('some -> step', () => {
        expect(someToFinish(some(1), 0)).toEqual(finish(1));
    });

    it('none -> fail', () => {
        expect(someToFinish(none(), 0)).toEqual(fail(0));
    });
});

describe('okToStep', () => {
    it('ok -> step', () => {
        expect(okToStep(ok(1))).toEqual(step(1));
    });

    it('err -> fail', () => {
        expect(okToStep(err(0))).toEqual(fail(0));
    });
});

describe('okToFinish', () => {
    it('ok -> finish', () => {
        expect(okToFinish(ok(1))).toEqual(finish(1));
    });

    it('err -> fail', () => {
        expect(okToFinish(err(0))).toEqual(fail(0));
    });
});
