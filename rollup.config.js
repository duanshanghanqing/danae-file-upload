import path from 'path';
// ts -> compile js
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';// compress

// commonjs -> ES2015
import commonjs from '@rollup/plugin-commonjs';

import { babel } from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';

// Empty directory
import del from 'rollup-plugin-delete';

import pkg from './package.json';

const globals = {
  'react': 'React'
};

export default {
  input: 'src/index.ts',
  output: [
    {
      file: path.resolve(__dirname, pkg.main),
      format: 'cjs',
      globals,
      exports: 'named',
    },
    {
      file: path.resolve(__dirname, pkg.module),
      format: 'es',
      globals,
      exports: 'named',
    },
    {
      file: path.resolve(__dirname, pkg.unpkg),
      format: 'umd',
      name: pkg.name,
      globals,
      exports: 'named',
    },
    {
      file: path.resolve(__dirname, pkg.browser),
      format: 'umd',
      name: pkg.name,
      plugins: [terser()],
      globals,
      exports: 'named',
    }
  ],
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: true,
      mainFields: ['browser']
    }),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
      extensions: [".ts", ".js", ".tsx"],
    }),
    typescript(),
    // image(),
    del({ 
      targets: [`${pkg.main.split('/')[0]}/*`, `${pkg.module.split('/')[0]}/*`, `${pkg.browser.split('/')[0]}/*`]
    })
  ],
  external: ['react']
}
