import lexure from '../dist/lib/index.js';

export const {
    // args.js
    Args,
    // lexer.js
    Lexer,
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
    // tokens.js
    extractCommand,
    joinTokens,
    // unordered.js
    noStrategy,
    longStrategy,
    longShortStrategy,
    exactStrategy,
    caseInsensitiveStrategy
} = lexure;
