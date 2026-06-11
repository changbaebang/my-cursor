#!/usr/bin/env node
/**
 * PR diff 신호 스캔 (slack-pr-review §4.1).
 * Usage:
 *   node scan-diff-signals.mjs --repo owner/name --pr 7088
 *   node scan-diff-signals.mjs --diff-file /path/to.diff
 */
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const SIGNALS = [
  { id: 'null-check', re: /^[+-].*(!== null|!= null|=== null|== null)/ },
  { id: 'mock', re: /^[+-].*(mock|__mocks__|enrich.*Mock|deriveMock)/i },
  { id: 'assert-cast', re: /^[+-].*( as [A-Z][A-Za-z0-9]*|as any|@ts-ignore|@ts-expect-error)/ },
  { id: 'schema', re: /^[+-].*(v\.optional|v\.nullable|default\(false\))/ },
  { id: 'shared-ui', re: /^[+-].*(BrandCard|ruler\/|ReactNode)/ },
  { id: 'contract', re: /^[+-].*(isBrandCartCoupon|couponSource|brandCartCouponBadge)/ },
];

function parseArgs(argv) {
  const out = { repo: null, pr: null, diffFile: null };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--repo') out.repo = argv[++i];
    else if (argv[i] === '--pr') out.pr = argv[++i];
    else if (argv[i] === '--diff-file') out.diffFile = argv[++i];
  }
  return out;
}

function getDiff({ repo, pr, diffFile }) {
  if (diffFile) return readFileSync(diffFile, 'utf8');
  if (!repo || !pr) {
    console.error('Usage: --repo owner/name --pr N  OR  --diff-file path');
    process.exit(1);
  }
  const token = process.env.GH_TOKEN?.trim();
  const env = token ? { ...process.env, GH_TOKEN: token } : { ...process.env };
  try {
    return execSync(`gh pr diff ${pr} --repo ${repo}`, {
      encoding: 'utf8',
      env: { ...env, GH_TOKEN: '', GITHUB_AUTH_TOKEN: '' },
      stdio: ['pipe', 'pipe', 'pipe'],
    });
  } catch {
    return execSync(`gh pr diff ${pr} --repo ${repo}`, { encoding: 'utf8', env });
  }
}

function scan(diff) {
  const hits = [];
  const lines = diff.split('\n');
  let currentFile = '';
  for (const line of lines) {
    if (line.startsWith('diff --git ')) {
      const m = line.match(/ b\/(.+)$/);
      currentFile = m ? m[1] : line;
    }
    for (const sig of SIGNALS) {
      if (sig.re.test(line)) {
        hits.push({ signal: sig.id, file: currentFile, line: line.slice(0, 120) });
      }
    }
  }
  return hits;
}

const args = parseArgs(process.argv);
const diff = getDiff(args);
const hits = scan(diff);

if (hits.length === 0) {
  console.log('No diff signals matched. Still read mock-removal / shared-component hunks manually.');
  process.exit(0);
}

const bySignal = new Map();
for (const h of hits) {
  if (!bySignal.has(h.signal)) bySignal.set(h.signal, []);
  bySignal.get(h.signal).push(h);
}

console.log(`# Diff signals (${hits.length} lines) — read hunks before Approve\n`);
for (const [signal, rows] of bySignal) {
  console.log(`## ${signal}`);
  const seen = new Set();
  for (const r of rows) {
    const key = `${r.file}|${r.line}`;
    if (seen.has(key)) continue;
    seen.add(key);
    console.log(`- ${r.file}`);
    console.log(`  ${r.line}`);
  }
  console.log('');
}
