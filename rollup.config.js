import ts from 'rollup-plugin-ts';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import istanbul from 'rollup-plugin-istanbul';

export default [
    {
        plugins: [
            nodeResolve(),
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
        output: {
            file: 'dist/keep-texts-in-tabs.js',
            format: 'iife'
        }
    },
    {
        plugins: [
            nodeResolve(),
            json({
                preferConst: true
            }),
            ts({
                browserslist: false
            }),
            istanbul({
                exclude: [
                    'node_modules/**/*',
                    'package.json'
                ]
            })
        ],
        input: 'src/keep-texts-in-tabs.ts',
        output: {
            file: '.hass/config/www/keep-texts-in-tabs.js',
            format: 'iife'
        }
    }
];