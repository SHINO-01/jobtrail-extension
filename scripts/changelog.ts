/**
 * Maintains this repo's CHANGELOG.md: one entry per store release, linking
 * the source release it was built from.
 *
 *   node scripts/changelog.ts add <tag> <source-notes-file> <source-repo-url>   add entry if missing
 *   node scripts/changelog.ts notes <tag>                                        print an entry's body
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function sectionFor(changelog: string, version: string): string | undefined {
  const escaped = version.replace(/\./g, '\\.');
  const start = new RegExp(`^## \\[${escaped}\\][^\\n]*\\n`, 'm').exec(changelog);
  if (!start) return undefined;
  const rest = changelog.slice(start.index + start[0].length);
  const next = /^## \[/m.exec(rest);
  return (next ? rest.slice(0, next.index) : rest).trim();
}

/** Inserts a release entry above the newest existing one. Idempotent. */
export function addEntry(
  changelog: string,
  version: string,
  date: string,
  sourceNotes: string,
  sourceRepoUrl: string,
): string {
  if (sectionFor(changelog, version) !== undefined) return changelog;
  const notes = sourceNotes.trim() || '_No notes in the source release._';
  const entry =
    `## [${version}] — ${date}\n\n` +
    `Built from source [v${version}](${sourceRepoUrl}/releases/tag/v${version}).\n\n` +
    `${notes}\n\n`;
  const firstEntry = /^## \[/m.exec(changelog);
  return firstEntry
    ? changelog.slice(0, firstEntry.index) + entry + changelog.slice(firstEntry.index)
    : `${changelog.trimEnd()}\n\n${entry}`;
}

function main(args: string[]): void {
  const root = resolve(fileURLToPath(import.meta.url), '../..');
  const file = resolve(root, 'CHANGELOG.md');
  const [command, tag, notesFile, repoUrl] = args;
  const version = tag?.replace(/^v/, '');
  if (!version || !/^\d+\.\d+\.\d+$/.test(version)) throw new Error(`Invalid tag "${String(tag)}"`);

  if (command === 'add' && notesFile && repoUrl) {
    const today = new Date().toISOString().slice(0, 10);
    const next = addEntry(readFileSync(file, 'utf8'), version, today, readFileSync(notesFile, 'utf8'), repoUrl);
    writeFileSync(file, next);
    return;
  }
  if (command === 'notes') {
    const notes = sectionFor(readFileSync(file, 'utf8'), version);
    if (notes === undefined) throw new Error(`CHANGELOG.md has no entry for ${version}`);
    console.log(notes);
    return;
  }
  throw new Error('Usage: node scripts/changelog.ts <add <tag> <notes-file> <repo-url>|notes <tag>>');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
