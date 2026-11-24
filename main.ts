// Office Joke Open — entry program.
//
// Writes one single-line office joke to /output/entry.txt (or
// $MAKEFUN_OUTPUT_DIR when set). The joke is a fixed string: the entry
// is the writing, so the program's job is to emit it exactly, with no
// trailing newline and no extra whitespace, after validating it against
// the competition gate (UTF-8 text, 1-200 characters, one line).

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const JOKE =
  "My review says I 'exceed expectations,' so I asked for a raise. HR replied: 'Expectations have been updated.'";

function codePoints(text: string): number {
  return [...text].length;
}

function validate(text: string): void {
  const chars = codePoints(text);
  if (chars < 1 || chars > 200) {
    throw new Error(`entry must be 1-200 characters, got ${chars}`);
  }
  if (text.trim() !== text) {
    throw new Error("entry must not have leading or trailing whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
}

function main(): void {
  validate(JOKE);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, JOKE, "utf8");
  // Read-back round trip: what landed on disk must be the validated
  // joke byte for byte, with no trailing newline added by the writer.
  const written = readFileSync(outPath, "utf8");
  if (written !== JOKE) {
    throw new Error("round-trip check failed: entry.txt does not match the joke");
  }
}

main();
