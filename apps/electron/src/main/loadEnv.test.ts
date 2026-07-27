import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { afterEach, describe, expect, it } from 'bun:test';
import { loadAsterEnv } from './loadEnv.ts';

const touchedKeys = new Set<string>();

afterEach(() => {
  for (const key of touchedKeys) {
    delete process.env[key];
  }
  touchedKeys.clear();
});

describe('loadAsterEnv', () => {
  it('loads .env.local values without overriding shell-provided env', () => {
    const dir = mkdtempSync(join(tmpdir(), 'aster-env-'));
    touchedKeys.add('ASTER_TEST_ENV_KEY');
    touchedKeys.add('ASTER_TEST_SHELL_KEY');

    process.env.ASTER_TEST_SHELL_KEY = 'shell';
    writeFileSync(join(dir, '.env'), [
      'ASTER_TEST_ENV_KEY=base',
      'ASTER_TEST_SHELL_KEY=file',
    ].join('\n'));
    writeFileSync(join(dir, '.env.local'), 'ASTER_TEST_ENV_KEY="local"\n');

    try {
      loadAsterEnv({ roots: [dir] });
      expect(process.env.ASTER_TEST_ENV_KEY).toBe('local');
      expect(process.env.ASTER_TEST_SHELL_KEY).toBe('shell');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('does not walk into parent directories implicitly', () => {
    const parent = mkdtempSync(join(tmpdir(), 'aster-env-parent-'));
    const child = join(parent, 'child');
    touchedKeys.add('ASTER_TEST_PARENT_KEY');

    writeFileSync(join(parent, '.env'), 'ASTER_TEST_PARENT_KEY=parent\n');

    try {
      loadAsterEnv({ cwd: child });
      expect(process.env.ASTER_TEST_PARENT_KEY).toBeUndefined();
    } finally {
      rmSync(parent, { recursive: true, force: true });
    }
  });
});
