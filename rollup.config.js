import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'main.ts',
  output: {
    dir: '.',
    format: 'cjs',
    sourcemap: true
  },
  external: ['obsidian'],
  plugins: [typescript(), nodeResolve()]
};
