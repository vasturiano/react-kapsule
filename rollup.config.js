import commonJs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { name, homepage, version } from './package.json';

export default {
    external: ['react'],
    globals: { react: 'React' },
    input: 'index.js',
    output: [
        {
            format: 'umd',
            name: 'fromKapsule',
            file: 'dist/react-kapsule.js',
            sourcemap: true
        }
    ],
    plugins: [
        commonJs(),
        nodeResolve(),
        babel({
            presets: [
                ["es2015", { "modules": false }],
                "react"
            ],
            plugins: [
                "external-helpers",
                "transform-object-rest-spread",
                "transform-class-properties"
            ],
            babelrc: false
        })
    ],
    banner: `// Version ${version} ${name} - ${homepage}`
};