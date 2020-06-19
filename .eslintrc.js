module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
        'jest',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:jest/recommended',
    ],
    rules: {
        '@typescript-eslint/semi': 'error',
        '@typescript-eslint/indent': ['error', 4, { 'SwitchCase': 1 }],
        '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true, allowTypedFunctionExpressions: true }],
        '@typescript-eslint/no-non-null-assertion': ['off']
    }
};
