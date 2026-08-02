import tseslint from 'typescript-eslint';
import js from '@eslint/js';
import globals from 'globals';

export default [
    {
        languageOptions: {
            globals: {
                Atomics: 'readonly',
                SharedArrayBuffer: 'readonly',
                ...globals.browser,
                ...globals.node,
                ...globals.es2020
            }
        }
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            quotes: [
                'error',
                'single',
                {
                    avoidEscape: true,
                    allowTemplateLiterals: true
                }
            ],
            indent: ['error', 4],
            semi: ['error', 'always'],
            'comma-dangle': ['error', 'never'],
            'no-trailing-spaces': ['error'],
            'array-bracket-spacing': ['error', 'never'],
            'comma-spacing': ['error'],
            '@typescript-eslint/no-var-requires': 'off'
        }
    }
];