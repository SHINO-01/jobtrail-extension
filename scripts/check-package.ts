/**
 * Release gate for a built extension directory.
 *
 *   node scripts/check-package.ts <build-dir> [--expect-version x.y.z]
 *
 * Fails if the manifest asks for anything policy/manifest-policy.json does not
 * allow, weakens the extension CSP, has the wrong version, or the package is
 * over budget. Runs on Node ≥22.18 without dependencies.
 */
import { appendFileSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export interface Policy {
  permissions: string[];
  hostPermissions: string[];
  optionalHostPermissions: string[];
  allowContentScripts: boolean;
  maxPackageKB: number;
}

type Manifest = Record<string, unknown>;

const list = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];

function sameSet(a: string[], b: string[]): { added: string[]; removed: string[] } {
  return { added: a.filter((x) => !b.includes(x)), removed: b.filter((x) => !a.includes(x)) };
}

/** Returns human-readable violations; empty means the manifest passes. */
export function checkManifest(manifest: Manifest, policy: Policy, expectVersion?: string): string[] {
  const errors: string[] = [];

  if (manifest.manifest_version !== 3) errors.push(`manifest_version must be 3 (got ${String(manifest.manifest_version)})`);

  const perms = sameSet(list(manifest.permissions), policy.permissions);
  if (perms.added.length) errors.push(`permissions not allowed by policy: ${perms.added.join(', ')}`);
  if (perms.removed.length) errors.push(`policy lists permissions the build no longer uses (tighten the policy): ${perms.removed.join(', ')}`);

  const hosts = sameSet(list(manifest.host_permissions), policy.hostPermissions);
  if (hosts.added.length) errors.push(`host_permissions not allowed by policy: ${hosts.added.join(', ')}`);

  const optional = sameSet(list(manifest.optional_host_permissions), policy.optionalHostPermissions);
  if (optional.added.length) errors.push(`optional_host_permissions not allowed by policy: ${optional.added.join(', ')}`);

  const contentScripts = Array.isArray(manifest.content_scripts) ? manifest.content_scripts.length : 0;
  if (!policy.allowContentScripts && contentScripts > 0) {
    errors.push('content_scripts are not allowed by policy (the extractor must be injected on demand)');
  }
  if (manifest.externally_connectable !== undefined) errors.push('externally_connectable is not allowed');

  const csp = JSON.stringify(manifest.content_security_policy ?? '');
  if (/unsafe-eval|unsafe-inline|https?:\/\/|\*/.test(csp)) errors.push(`content_security_policy weakens the default: ${csp}`);

  if (expectVersion !== undefined && manifest.version !== expectVersion) {
    errors.push(`version ${String(manifest.version)} does not match the release ${expectVersion}`);
  }
  return errors;
}

export function directorySizeKB(dir: string): number {
  let bytes = 0;
  const walk = (path: string): void => {
    for (const entry of readdirSync(path)) {
      const full = join(path, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) walk(full);
      else bytes += stat.size;
    }
  };
  walk(dir);
  return Math.round(bytes / 1024);
}

function main(args: string[]): void {
  const [dir, flag, value] = args;
  if (!dir) throw new Error('Usage: node scripts/check-package.ts <build-dir> [--expect-version x.y.z]');
  const root = resolve(fileURLToPath(import.meta.url), '../..');
  const policy = JSON.parse(readFileSync(resolve(root, 'policy/manifest-policy.json'), 'utf8')) as Policy;
  const manifest = JSON.parse(readFileSync(resolve(dir, 'manifest.json'), 'utf8')) as Manifest;

  const errors = checkManifest(manifest, policy, flag === '--expect-version' ? value : undefined);
  const sizeKB = directorySizeKB(dir);
  // Zipped size is roughly half of this; the budget is on the unpacked build to stay conservative.
  if (sizeKB > policy.maxPackageKB * 2) errors.push(`build is ${sizeKB} KB, over the ${policy.maxPackageKB * 2} KB unpacked budget`);

  const summary = [
    `### Package check — v${String(manifest.version)}`,
    '',
    `- Permissions: ${list(manifest.permissions).join(', ') || 'none'}`,
    `- Host permissions: ${list(manifest.host_permissions).join(', ') || 'none'}`,
    `- Unpacked size: ${sizeKB} KB`,
    errors.length ? `- ❌ ${errors.length} problem(s):\n${errors.map((e) => `  - ${e}`).join('\n')}` : '- ✅ Matches policy',
    '',
  ].join('\n');
  console.log(summary);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
  if (errors.length) process.exit(1);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2));
}
