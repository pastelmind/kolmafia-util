import buble from '@rollup/plugin-buble';
import typescript from '@rollup/plugin-typescript';
import createBubleConfig from 'buble-config-rhino';
import type {RollupOptions} from 'rollup';

function createConfig(format: 'cjs' | 'esm'): RollupOptions {
  return {
    external: ['kolmafia'],
    input: 'src/index.ts',
    output: {
      dir: `build/${format}`,
      format,
      sourcemap: true,
    },
    plugins: [
      buble(createBubleConfig()),
      typescript({outDir: `build/${format}`, tsconfig: 'src/tsconfig.json'}),
    ],
  };
}

export default [createConfig('cjs'), createConfig('esm')];
