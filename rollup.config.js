import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'


export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'iife',
    },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    typescript({
      typescript: require('typescript'),
    }),
    terser({
      format: {
        comments: false,
      },
    }),
  ],
}
