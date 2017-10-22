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
            file: `dist/${name}.js`,
            sourcemap: true
        }
    ],
    plugins: [
        babel()
    ],
    banner: `// Version ${version} ${name} - ${homepage}`
};