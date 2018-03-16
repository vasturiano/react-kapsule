import babel from 'rollup-plugin-babel';
import { name, homepage, version } from './package.json';

export default {
  external: ['react'],
  input: 'index.js',
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
    babel()
  ]
};