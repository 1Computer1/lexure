import { loop, loop1, loopAsync, loop1Async, ok, err, step, step_, finish, fail } from '../src';

describe('loop', () => {
    it('(simple) loops until parsing completes', () => {
        const inputs = ['hello', 'world', '100', 'extra'];
        let i = 0;

        const result = loop(inputs[i++], {
            getInput() {
                return i < inputs.length
                    ? step(inputs[i++])
                    : fail('no input');
            },

            parse(s) {
                const n = Number(s);
                if (isNaN(n)) {
                    return fail('bad input');
                } else {
                    return finish(n);
                }
            },

            onInputError(e) {
                return fail(e);
            },

            onParseError() {
                return step_();
            }
        });

        expect(result).toEqual(ok(100));
        expect(i).toEqual(3);
    });

    it('(simple) loops until no more input', () => {
        const inputs = ['hello', 'world', 'extra'];
        let i = 0;

        const result = loop(inputs[i++], {
            getInput() {
                return i < inputs.length
                    ? step(inputs[i++])
                    : fail('no input');
            },

            parse(s) {
                const n = Number(s);
                if (isNaN(n)) {
                    return fail('bad input');
                } else {
                    return finish(n);
                }
            },

            onInputError(e) {
                return fail(e);
            },

            onParseError() {
                return step_();
            }
        });

        expect(result).toEqual(err('no input'));
        expect(i).toEqual(3);
    });

    it('(simple) loops until first bad parse', () => {
        const inputs = ['hello', 'world', 'extra'];
        let i = 0;

        const result = loop(inputs[i++], {
            getInput() {
                return i < inputs.length
                    ? step(inputs[i++])
                    : fail('no input');
            },

            parse(s) {
                const n = Number(s);
                if (isNaN(n)) {
                    return fail('bad input');
                } else {
                    return finish(n);
                }
            },

            onInputError(e) {
                return fail(e);
            },

            onParseError(e, x) {
                return fail(e + ' ' + x);
            }
        });

        expect(result).toEqual(err('bad input hello'));
        expect(i).toEqual(1);
    });
});

describe('loop1', () => {
    it('(simple) loops until parsing completes', () => {
        const inputs = ['hello', 'world', '100', 'extra'];
        let i = 0;

        const result = loop1({
            getInput() {
                return i < inputs.length
                    ? step(inputs[i++])
                    : fail('no input');
            },

            parse(s) {
                const n = Number(s);
                if (isNaN(n)) {
                    return fail('bad input');
                } else {
                    return finish(n);
                }
            },

            onInputError(e) {
                return fail(e);
            },

            onParseError() {
                return step_();
            }
        });

        expect(result).toEqual(ok(100));
        expect(i).toEqual(3);
    });

    it('(simple) loops until no more input', () => {
        const inputs = ['hello', 'world', 'extra'];
        let i = 0;

        const result = loop1({
            getInput() {
                return i < inputs.length
                    ? step(inputs[i++])
                    : fail('no input');
            },

            parse(s) {
                const n = Number(s);
                if (isNaN(n)) {
                    return fail('bad input');
                } else {
                    return finish(n);
                }
            },

            onInputError(e) {
                return fail(e);
            },

            onParseError() {
                return step_();
            }
        });

        expect(result).toEqual(err('no input'));
        expect(i).toEqual(3);
    });

    it('(simple) loops until first bad parse', () => {
        const inputs = ['hello', 'world', 'extra'];
        let i = 0;

        const result = loop1({
            getInput() {
                return i < inputs.length
                    ? step(inputs[i++])
                    : fail('no input');
            },

            parse(s) {
                const n = Number(s);
                if (isNaN(n)) {
                    return fail('bad input');
                } else {
                    return finish(n);
                }
            },

            onInputError(e) {
                return fail(e);
            },

            onParseError(e, x) {
                return fail(e + ' ' + x);
            }
        });

        expect(result).toEqual(err('bad input hello'));
        expect(i).toEqual(1);
    });
});

describe('loopAsync', () => {
    it('(simple) loops until parsing completes', async () => {
        const inputs = ['hello', 'world', '100', 'extra'];
        let i = 0;

        const result = await loopAsync(inputs[i++], {
            async getInput() {
                return i < inputs.length
                    ? step(inputs[i++])
                    : fail('no input');
            },

            async parse(s) {
                const n = Number(s);
                if (isNaN(n)) {
                    return fail('bad input');
                } else {
                    return finish(n);
                }
            },

            async onInputError(e) {
                return fail(e);
            },

            async onParseError() {
                return step_();
            }
        });

        expect(result).toEqual(ok(100));
        expect(i).toEqual(3);
    });

    it('(simple) loops until no more input', async () => {
        const inputs = ['hello', 'world', 'extra'];
        let i = 0;

        const result = await loopAsync(inputs[i++], {
            async getInput() {
                return i < inputs.length
                    ? step(inputs[i++])
                    : fail('no input');
            },

            async parse(s) {
                const n = Number(s);
                if (isNaN(n)) {
                    return fail('bad input');
                } else {
                    return finish(n);
                }
            },

            async onInputError(e) {
                return fail(e);
            },

            async onParseError() {
                return step_();
            }
        });

        expect(result).toEqual(err('no input'));
        expect(i).toEqual(3);
    });

    it('(simple) loops until bad parse', async () => {
        const inputs = ['hello', 'world', 'extra'];
        let i = 0;

        const result = await loopAsync(inputs[i++], {
            async getInput() {
                return i < inputs.length
                    ? step(inputs[i++])
                    : fail('no input');
            },

            async parse(s) {
                const n = Number(s);
                if (isNaN(n)) {
                    return fail('bad input');
                } else {
                    return finish(n);
                }
            },

            async onInputError(e) {
                return fail(e);
            },

            async onParseError(e, x) {
                return fail(e + ' ' + x);
            }
        });

        expect(result).toEqual(err('bad input hello'));
        expect(i).toEqual(1);
    });

    it('(complex) can do complicated things (too many retries)', async () => {
        const inputs = ['hello', 'world', 'extra'];
        let i = 0;
        const st = { retries: 0 };

        const result = await loopAsync(inputs[i++], {
            async getInput() {
                if (st.retries > 1) {
                    return fail('too many retries');
                }

                if (i < inputs.length) {
                    st.retries++;
                    return step(inputs[i++]);
                }

                return fail('no input');
            },

            async parse(s) {
                const n = Number(s);
                if (isNaN(n)) {
                    return fail('bad input');
                } else {
                    return finish(n);
                }
            },

            async onInputError(e) {
                return fail(e);
            },

            async onParseError() {
                return step_();
            }
        });

        expect(result).toEqual(err('too many retries'));
        expect(i).toEqual(3);
        expect(st).toEqual({ retries: 2 });
    });

    it('(complex) can do complicated things (cancellation input)', async () => {
        const inputs = ['hello', 'cancel', 'extra'];
        let i = 0;

        const result = await loopAsync(inputs[i++], {
            async getInput() {
                if (i < inputs.length) {
                    const inp = inputs[i++];
                    if (inp === 'cancel') {
                        return fail('cancelled');
                    }

                    return step(inp);
                }

                return fail('no input');
            },

            async parse(s) {
                const n = Number(s);
                if (isNaN(n)) {
                    return fail('bad input');
                } else {
                    return finish(n);
                }
            },

            async onInputError(e) {
                return fail(e);
            },

            async onParseError() {
                return step_();
            }
        });

        expect(result).toEqual(err('cancelled'));
        expect(i).toEqual(2);
    });

    it('(complex) can do complicated things (collect multiple inputs)', async () => {
        const inputs = ['10', 'bad', '20', '30', 'stop', '40'];
        let i = 0;
        const st: number[] = [];

        const result = await loopAsync(inputs[i++], {
            async getInput() {
                if (i < inputs.length) {
                    const inp = inputs[i++];
                    if (inp === 'stop') {
                        return finish(st);
                    }

                    return step(inp);
                }

                return finish(st);
            },

            async parse(s) {
                const n = Number(s);
                if (isNaN(n)) {
                    return fail('bad input');
                } else {
                    st.push(n);
                    return step_();
                }
            },

            async onInputError(e) {
                return fail(e);
            },

            async onParseError() {
                return step_();
            }
        });

        expect(result).toEqual(ok([10, 20, 30]));
        expect(i).toEqual(5);
        expect(st).toEqual([10, 20, 30]);
    });
});


describe('loop1Async', () => {
    it('(simple) loops until parsing completes', async () => {
        const inputs = ['hello', 'world', '100', 'extra'];
        let i = 0;

        const result = await loop1Async({
            async getInput() {
                return i < inputs.length
                    ? step(inputs[i++])
                    : fail('no input');
            },

            async parse(s) {
                const n = Number(s);
                if (isNaN(n)) {
                    return fail('bad input');
                } else {
                    return finish(n);
                }
            },

            async onInputError(e) {
                return fail(e);
            },

            async onParseError() {
                return step_();
            }
        });

        expect(result).toEqual(ok(100));
        expect(i).toEqual(3);
    });

    it('(simple) loops until no more input', async () => {
        const inputs = ['hello', 'world', 'extra'];
        let i = 0;

        const result = await loop1Async({
            async getInput() {
                return i < inputs.length
                    ? step(inputs[i++])
                    : fail('no input');
            },

            async parse(s) {
                const n = Number(s);
                if (isNaN(n)) {
                    return fail('bad input');
                } else {
                    return finish(n);
                }
            },

            async onInputError(e) {
                return fail(e);
            },

            async onParseError() {
                return step_();
            }
        });

        expect(result).toEqual(err('no input'));
        expect(i).toEqual(3);
    });

    it('(simple) loops until bad parse', async () => {
        const inputs = ['hello', 'world', 'extra'];
        let i = 0;

        const result = await loop1Async({
            async getInput() {
                return i < inputs.length
                    ? step(inputs[i++])
                    : fail('no input');
            },

            async parse(s) {
                const n = Number(s);
                if (isNaN(n)) {
                    return fail('bad input');
                } else {
                    return finish(n);
                }
            },

            async onInputError(e) {
                return fail(e);
            },

            async onParseError(e, x) {
                return fail(e + ' ' + x);
            }
        });

        expect(result).toEqual(err('bad input hello'));
        expect(i).toEqual(1);
    });

    it('(complex) can do complicated things (too many retries)', async () => {
        const inputs = ['hello', 'world', 'extra'];
        let i = 0;
        const st = { retries: 0 };

        const result = await loop1Async({
            async getInput() {
                if (st.retries > 1) {
                    return fail('too many retries');
                }

                if (i < inputs.length) {
                    st.retries++;
                    return step(inputs[i++]);
                }

                return fail('no input');
            },

            async parse(s) {
                const n = Number(s);
                if (isNaN(n)) {
                    return fail('bad input');
                } else {
                    return finish(n);
                }
            },

            async onInputError(e) {
                return fail(e);
            },

            async onParseError() {
                return step_();
            }
        });

        expect(result).toEqual(err('too many retries'));
        expect(i).toEqual(2);
        expect(st).toEqual({ retries: 2 });
    });

    it('(complex) can do complicated things (cancellation input)', async () => {
        const inputs = ['hello', 'cancel', 'extra'];
        let i = 0;

        const result = await loop1Async({
            async getInput() {
                if (i < inputs.length) {
                    const inp = inputs[i++];
                    if (inp === 'cancel') {
                        return fail('cancelled');
                    }

                    return step(inp);
                }

                return fail('no input');
            },

            async parse(s) {
                const n = Number(s);
                if (isNaN(n)) {
                    return fail('bad input');
                } else {
                    return finish(n);
                }
            },

            async onInputError(e) {
                return fail(e);
            },

            async onParseError() {
                return step_();
            }
        });

        expect(result).toEqual(err('cancelled'));
        expect(i).toEqual(2);
    });

    it('(complex) can do complicated things (collect multiple inputs)', async () => {
        const inputs = ['10', 'bad', '20', '30', 'stop', '40'];
        let i = 0;
        const st: number[] = [];

        const result = await loop1Async({
            async getInput() {
                if (i < inputs.length) {
                    const inp = inputs[i++];
                    if (inp === 'stop') {
                        return finish(st);
                    }

                    return step(inp);
                }

                return finish(st);
            },

            async parse(s) {
                const n = Number(s);
                if (isNaN(n)) {
                    return fail('bad input');
                } else {
                    st.push(n);
                    return step_();
                }
            },

            async onInputError(e) {
                return fail(e);
            },

            async onParseError() {
                return step_();
            }
        });

        expect(result).toEqual(ok([10, 20, 30]));
        expect(i).toEqual(5);
        expect(st).toEqual([10, 20, 30]);
    });
});
