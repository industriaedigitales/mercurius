import * as esbuild from 'esbuild';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');

async function build() {
  try {
    await esbuild.build({
      entryPoints: [path.join(projectRoot, 'src', 'web', 'server.mjs')],
      bundle: true,
      platform: 'node',
      target: 'node18',
      format: 'esm',
      outfile: path.join(projectRoot, 'dist-server', 'server.mjs'),
      external: ['electron'],
      banner: {
        js: 'import { createRequire } from "module"; const require = createRequire(import.meta.url);',
      },
    });
    console.log('Server built successfully!');
  } catch (error) {
    console.error('Server build failed:', error);
    process.exit(1);
  }
}

build();
