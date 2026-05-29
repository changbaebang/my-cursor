#!/usr/bin/env node
/**
 * GitHub PR 메타·diff·리뷰 코멘트를 수집해 리뷰용 마크다운을 stdout에 출력합니다.
 */

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const DEFAULT_REPO = '29CM-Developers/frontend-29cm-platform';

function parseArgs(argv) {
  const args = { pr: null, repo: DEFAULT_REPO, statOnly: false };
  for (let i = 2; i < argv.length; i += 1) {
    if (argv[i] === '--pr' && argv[i + 1]) {
      args.pr = argv[++i];
    } else if (argv[i] === '--repo' && argv[i + 1]) {
      args.repo = argv[++i];
    } else if (argv[i] === '--stat-only') {
      args.statOnly = true;
    }
  }
  return args;
}

function gh(args) {
  try {
    return execSync(`gh ${args}`, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 }).trim();
  } catch (error) {
    const stderr = error.stderr?.toString() ?? error.message;
    throw new Error(`gh 명령 실패: gh ${args}\n${stderr}`);
  }
}

function extractPrFromText(text) {
  const patterns = [
    /github\.com\/[^/]+\/[^/]+\/pull\/(\d+)/gi,
    /\bPR\s*#?\s*(\d+)\b/gi,
  ];
  const found = new Set();
  for (const pattern of patterns) {
    let m;
    // eslint-disable-next-line no-cond-assign
    while ((m = pattern.exec(text)) !== null) {
      found.add(m[1]);
    }
  }
  return [...found];
}

export function gatherPrContext(prNumber, repo = DEFAULT_REPO, { statOnly = false } = {}) {
  const fields = [
    'title',
    'body',
    'url',
    'state',
    'baseRefName',
    'headRefName',
    'author',
    'additions',
    'deletions',
    'changedFiles',
    'reviewDecision',
    'statusCheckRollup',
  ].join(',');

  const meta = JSON.parse(gh(`pr view ${prNumber} --repo ${repo} --json ${fields}`));

  const files = gh(`pr diff ${prNumber} --repo ${repo} --name-only`)
    .split('\n')
    .filter(Boolean);

  const stat = gh(`pr diff ${prNumber} --repo ${repo} --stat`);

  let diff = '';
  if (!statOnly) {
    const rawDiff = gh(`pr diff ${prNumber} --repo ${repo}`);
    const maxChars = 120_000;
    diff =
      rawDiff.length > maxChars
        ? `${rawDiff.slice(0, maxChars)}\n\n... [diff truncated: ${rawDiff.length - maxChars} chars omitted]`
        : rawDiff;
  }

  let reviewThreads = '';
  try {
    const comments = JSON.parse(
      gh(`api repos/${repo}/pulls/${prNumber}/comments --paginate`),
    );
    reviewThreads = comments
      .slice(0, 20)
      .map((c) => `- **${c.path ?? 'general'}** (${c.user?.login}): ${(c.body ?? '').split('\n')[0]}`)
      .join('\n');
  } catch {
    reviewThreads = '(리뷰 코멘트 조회 실패 — gh auth 확인)';
  }

  return { meta, files, stat, diff, reviewThreads };
}

function formatMarkdown({ meta, files, stat, diff, reviewThreads }) {
  const author = meta.author?.login ?? meta.author?.name ?? 'unknown';
  const checks =
    meta.statusCheckRollup?.map((c) => `${c.name}: ${c.state ?? c.conclusion}`).join(', ') ||
    'n/a';

  return `# PR #${meta.url?.match(/pull\/(\d+)/)?.[1] ?? '?'} 리뷰 컨텍스트

## 메타
- **제목:** ${meta.title}
- **URL:** ${meta.url}
- **상태:** ${meta.state} | **리뷰:** ${meta.reviewDecision ?? 'n/a'}
- **베이스 ← 헤드:** \`${meta.baseRefName}\` ← \`${meta.headRefName}\`
- **작성자:** ${author}
- **변경:** +${meta.additions} / -${meta.deletions} (${meta.changedFiles} files)
- **CI:** ${checks}

## PR 본문
${meta.body || '_empty_'}

## 변경 파일
${files.map((f) => `- ${f}`).join('\n')}

## diff --stat
\`\`\`
${stat}
\`\`\`

## 기존 리뷰 코멘트 (요약)
${reviewThreads || '_none_'}

${diff ? `## diff\n\`\`\`diff\n${diff}\n\`\`\`` : ''}
`;
}

function main() {
  const args = parseArgs(process.argv);
  let pr = args.pr;

  if (!pr) {
    const stdin = process.stdin.isTTY ? '' : readFileSync(0, 'utf8');
    const fromStdin = extractPrFromText(stdin);
    if (fromStdin.length === 1) pr = fromStdin[0];
    else if (fromStdin.length > 1) {
      console.error(`PR 번호가 여러 개입니다: ${fromStdin.join(', ')} — --pr로 지정하세요.`);
      process.exit(1);
    }
  }

  if (!pr) {
    console.error('Usage: gather-pr-context.mjs --pr <number> [--repo owner/repo] [--stat-only]');
    process.exit(1);
  }

  const ctx = gatherPrContext(pr, args.repo, { statOnly: args.statOnly });
  console.log(formatMarkdown(ctx));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
