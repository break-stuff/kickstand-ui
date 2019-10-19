import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { postcss } from '@stencil/postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

export const config: Config = {
    namespace: 'clutch',
    outputTargets: [
        {
            type: 'dist',
            esmLoaderPath: '../loader'
        },
        {
            type: 'docs-readme'
        },
        {
            type: 'www',
            serviceWorker: null // disable service workers
        }
    ],
    globalStyle: 'src/scss/styles.scss',
    plugins: [
        sass(),
        postcss({
            plugins: [
                autoprefixer(),
                cssnano()
            ]
        })
    ]
};
