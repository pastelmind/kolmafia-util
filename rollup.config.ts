import typescript from '@rollup/plugin-typescript';
import type {RollupOptions} from 'rollup';

const baseConfig: RollupOptions = {
  external: ['kolmafia'],
  input: 'src/index.ts',
};

const config: RollupOptions[] = [
  {
    ...baseConfig,
    output: {
      dir: 'build',
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [typescript({tsconfig: 'src/tsconfig.json'})],
  },
  {
    ...baseConfig,
    output: {
      dir: 'build/esm',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [typescript({outDir: 'build/esm', tsconfig: 'src/tsconfig.json'})],
  },
];

export default config;
