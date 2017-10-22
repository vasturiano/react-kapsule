import babel from 'rollup-plugin-babel';
import { name, dependencies, peerDependencies } from './package.json';

export default {
    input: 'index.js',
    output: [
        {
            format: 'cjs',
            file: `dist/${name}.common.js`
        },
        {
            format: 'es',
            file: `dist/${name}.mjs`
        }
    ],
    external: [...Object.keys(dependencies), ...Object.keys(peerDependencies)],
    plugins: [
        babel()
    ]
};