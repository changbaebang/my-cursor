#!/usr/bin/env node
/**
 * Slack permalink + (선택) PR 번호 → 리뷰 컨텍스트 출력, 시작/완료 리액션
 */

import { readFileSync } from 'node:fs';
import { parseSlackPermalink } from './parse-slack-url.mjs';
import { gatherPrContext } from './gather-pr-context.mjs';
import { addSlackReaction } from './slack-reaction.mjs';

function parseArgs(argv) {
  const args = {
    url: null,
    pr: null,
    repo: '29CM-Developers/frontend-29cm-platform',
    statOnly: false,
    reactStart: false,
    reactDone: false,
    noReact: true,
  };
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--url' && argv[i + 1]) args.url = argv[++i];
    else if (a === '--pr' && argv[i + 1]) args.pr = argv[++i];
    else if (a === '--repo' && argv[i + 1]) args.repo = argv[++i];
    else if (a === '--stat-only') args.statOnly = true;
    else if (a === '--react-start') {
      args.reactStart = true;
      args.noReact = false;
    } else if (a === '--react-done') {
      args.reactDone = true;
      args.noReact = false;
    } else if (a === '--react-both') {
      args.reactStart = true;
      args.reactDone = true;
      args.noReact = false;
    }
  }
  return args;
}

function extractPrFromText(text) {
  const found = new Set();
  const re = /github\.com\/[^/]+\/[^/]+\/pull\/(\d+)/gi;
  let m;
  while ((m = re.exec(text)) !== null) found.add(m[1]);
  return [...found];
}

async function maybeReact(flag, parsed, emoji) {
  if (!flag) return;
  try {
    await addSlackReaction({
      channel: parsed.channelId,
      timestamp: parsed.messageTs,
      emoji,
    });
    console.error(`✓ Slack :${emoji}: 리액션 추가 (${parsed.channelId} ${parsed.messageTs})`);
  } catch (e) {
    console.error(`⚠ Slack 리액션 스킵 (${emoji}): ${e.message}`);
    console.error('  → Cursor Slack MCP로 스레드 답글하거나 SLACK_BOT_TOKEN 설정 후 재시도');
  }
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.url) {
    console.error(
      'Usage: run.mjs --url <slack-permalink> [--pr N] [--stat-only] [--react-start] [--react-done]',
    );
    process.exit(1);
  }

  const parsed = parseSlackPermalink(args.url);
  console.error(`Slack: #${parsed.channelId} @ ${parsed.messageTs}`);

  await maybeReact(args.reactStart, parsed, 'eyes');

  let pr = args.pr;
  if (!pr) {
    console.error('PR 번호: --pr로 지정하거나 Slack MCP slack_read_thread로 스레드에서 추출');
  }

  if (pr) {
    const ctx = gatherPrContext(pr, args.repo, { statOnly: args.statOnly });
    const header = `# Slack PR Review\n- **Slack:** ${parsed.permalink}\n- **PR:** ${ctx.meta.url}\n\n`;
    console.log(header + formatBody(ctx));
  } else {
    console.log(
      JSON.stringify(
        {
          slack: parsed,
          hint: 'node gather-pr-context.mjs --pr <N> 로 PR 컨텍스트 생성',
        },
        null,
        2,
      ),
    );
  }

  await maybeReact(args.reactDone, parsed, 'white_check_mark');
}

function formatBody(ctx) {
  const { meta, files, stat, diff, reviewThreads } = ctx;
  return `## ${meta.title}
- URL: ${meta.url}
- \`${meta.baseRefName}\` ← \`${meta.headRefName}\`
- +${meta.additions} / -${meta.deletions}

### Files
${files.map((f) => `- ${f}`).join('\n')}

### stat
\`\`\`
${stat}
\`\`\`

### Reviews
${reviewThreads || '_none_'}

${diff ? `### diff (truncated)\n\`\`\`diff\n${diff.slice(0, 80000)}\n\`\`\`` : ''}`;
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
