import lexure from '../dist/lib/index.js';

export const {
    // args.js
    Args,
    // lexer.js
    Lexer,
    // loops.js
    loop,
    loop1,
    loopAsync,
    loop1Async,
    // loopAction.js
    LoopTag,
    step,
    step_,
    finish,
    fail,
    // option.js
    some,
    none,
    // parser.js
    Parser,
    // parserOutput.js
    outputFromJSON,
    outputToJSON,
    mergeOutputs,
    emptyOutput,
    // result.js
    ok,
    err,
    // tokens.js
    extractCommand,
    joinTokens,
    // unordered.js
    noStrategy,
    longStrategy,
    longShortStrategy,
    prefixedStrategy,
    exactStrategy,
    caseInsensitiveStrategy
} = lexure;
