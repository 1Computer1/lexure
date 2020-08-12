import lexure from '../dist/lib/index.js';

export const {
    // args.js
    args,
    Args,
    // lexer.js
    lexer,
    Lexer,
    // loops.js
    loops,
    loop,
    loop1,
    loopAsync,
    loop1Async,
    // loopAction.js
    loopAction,
    LoopTag,
    step,
    step_,
    finish,
    fail,
    fail_,
    // option.js
    option,
    some,
    none,
    maybeOption,
    orOption,
    // parser.js
    parser,
    Parser,
    // parserOutput.js
    parserOutput,
    outputFromJSON,
    outputToJSON,
    mergeOutputs,
    emptyOutput,
    // result.js
    result,
    ok,
    err,
    err_,
    maybeResult,
    orResultAll,
    orResultFirst,
    orResultLast,
    // tokens.js
    tokens,
    extractCommand,
    joinTokens,
    // unordered.js
    unordered,
    noStrategy,
    longStrategy,
    longShortStrategy,
    prefixedStrategy,
    matchingStrategy,
    mapKeys,
    renameKeys,
    // util.js
    util,
    someToOk,
    okToSome,
    errToSome,
    someToStep,
    someToFinish,
    okToStep,
    okToFinish
} = lexure;
