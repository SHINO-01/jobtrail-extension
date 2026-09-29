import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';
import { addEntry, sectionFor } from '../scripts/changelog.ts';
import { checkManifest, type Policy } from '../scripts/check-package.ts';

const root = resolve(import.meta.dirname, '..');
const policy = JSON.parse(readFileSync(resolve(root, 'policy/manifest-policy.json'), 'utf8')) as Policy;

const good = {
  manifest_version: 3,
  version: '0.2.0',
  permissions: ['activeTab', 'scripting', 'storage', 'unlimitedStorage', 'contextMenus'],
};

test('a manifest matching policy passes', () => {
  assert.deepEqual(checkManifest(good, policy, '0.2.0'), []);
});

test('permission creep fails the gate', () => {
  const errors = checkManifest({ ...good, permissions: [...good.permissions, 'tabs'] }, policy);
  assert.match(errors.join('\n'), /not allowed by policy: tabs/);
});

test('dropping a permission asks to tighten the policy', () => {
  const errors = checkManifest({ ...good, permissions: ['activeTab'] }, policy);
  assert.match(errors.join('\n'), /tighten the policy/);
});

test('host access, content scripts, weak CSP and wrong versions fail', () => {
  const errors = checkManifest(
    {
      ...good,
      manifest_version: 2,
      host_permissions: ['<all_urls>'],
      content_scripts: [{ matches: ['<all_urls>'], js: ['x.js'] }],
      externally_connectable: { matches: ['https://evil.example/*'] },
      content_security_policy: { extension_pages: "script-src 'self' 'unsafe-eval'" },
    },
    policy,
    '9.9.9',
  );
  assert.equal(errors.length, 6);
});

test('the policy matches what the source ships today', () => {
  const manifestPath = resolve(root, 'source/.output/chrome-mv3/manifest.json');
  let manifest: Record<string, unknown>;
  try {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as Record<string, unknown>;
  } catch {
    return; // not built in this run; CI builds before running the gate
  }
  assert.deepEqual(checkManifest(manifest, policy), []);
});

const CHANGELOG = '# Changelog\n\nIntro.\n\n## [0.1.0] — 2026-09-30\n\nFirst.\n';

test('adds a release entry on top, once', () => {
  const next = addEntry(CHANGELOG, '0.2.0', '2026-10-05', '### Fixed\n\n- Bug', 'https://github.com/o/r');
  assert.match(next, /Intro\.\n\n## \[0\.2\.0\] — 2026-10-05\n\nBuilt from source \[v0\.2\.0\]\(https:\/\/github\.com\/o\/r\/releases\/tag\/v0\.2\.0\)/);
  assert.equal(sectionFor(next, '0.1.0'), 'First.');
  assert.equal(addEntry(next, '0.2.0', '2026-10-06', 'again', 'x'), next);
  assert.match(addEntry('# Changelog\n', '1.0.0', 'd', '', 'u'), /_No notes in the source release\._/);
});
