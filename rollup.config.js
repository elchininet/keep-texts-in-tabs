import ts from 'rollup-plugin-ts';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';

export default {
    plugins: [
        json(),
        ts({
            browserslist: false
        }),
        terser({
            output: {
                comments: false
            }
        })
    ],
    input: 'src/keep-texts-in-tabs.ts',
    output: [
        {
            file: 'dist/keep-texts-in-tabs.js',
            format: 'iife'
        }
    ]
};