import buble from '@rollup/plugin-buble';
import typescript from '@rollup/plugin-typescript';
import createBubleConfig from 'buble-config-rhino';
import * as path from 'path';
import type {RollupOptions} from 'rollup';

function createConfig(format: 'cjs' | 'esm'): RollupOptions {
  return {
    external: ['kolmafia'],
    input: ['src/index.ts', 'src/assert/index.ts'],
    output: {
      dir: `build/${format}`,
      entryFileNames: chunkInfo => {
        // Emit output chunks according to their relative paths of the entry
        // points in the source dir
        if (!chunkInfo.facadeModuleId) throw new Error('No facadeModuleId');
        return path.join(
          path.relative('src', path.dirname(chunkInfo.facadeModuleId)),
          '[name].js'
        );
      },
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
