import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonJs from 'rollup-plugin-commonjs';
import { name, homepage, version } from './package.json';

export default {
  external: ['react'],
  input: 'src/index.js',
  output: [
    {
      format: 'umd',
      name: 'fromKapsule',
      file: `dist/${name}.js`,
      globals: { react: 'React' },
      sourcemap: true,
      banner: `// Version ${version} ${name} - ${homepage}`
    }
  ],
  plugins: [
    resolve(),
    commonJs(),
    babel({ exclude: '**/node_modules/**' })
  ]
};