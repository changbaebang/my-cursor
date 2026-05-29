#!/usr/bin/env node
/**
 * Slack 메시지에 이모지 리액션 추가 (reactions.add)
 * SLACK_BOT_TOKEN 또는 SLACK_USER_TOKEN 필요 (reactions:write)
 */

import { parseSlackPermalink } from './parse-slack-url.mjs';

const EMOJI_ALIASES = {
  check: 'white_check_mark',
  done: 'white_check_mark',
  ok: 'white_check_mark',
  eyes: 'eyes',
  review: 'eyes',
};

function parseArgs(argv) {
  const args = { url: null, channel: null, ts: null, emoji: 'white_check_mark' };
  for (let i = 2; i < argv.length; i += 1) {
    if (argv[i] === '--url' && argv[i + 1]) args.url = argv[++i];
    else if (argv[i] === '--channel' && argv[i + 1]) args.channel = argv[++i];
    else if (argv[i] === '--ts' && argv[i + 1]) args.ts = argv[++i];
    else if (argv[i] === '--emoji' && argv[i + 1]) args.emoji = argv[++i];
  }
  return args;
}

export async function addSlackReaction({ channel, timestamp, emoji }) {
  const token = process.env.SLACK_BOT_TOKEN ?? process.env.SLACK_USER_TOKEN;
  if (!token) {
    throw new Error('SLACK_BOT_TOKEN 또는 SLACK_USER_TOKEN 환경 변수가 필요합니다.');
  }

  const resolvedEmoji = EMOJI_ALIASES[emoji] ?? emoji.replace(/^:/, '').replace(/:$/, '');

  const body = new URLSearchParams({
    channel,
    timestamp,
    name: resolvedEmoji,
  });

  const res = await fetch('https://slack.com/api/reactions.add', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  const data = await res.json();
  if (!data.ok) {
    if (data.error === 'already_reacted') {
      return { ok: true, alreadyReacted: true, emoji: resolvedEmoji };
    }
    throw new Error(`Slack reactions.add 실패: ${data.error}`);
  }
  return { ok: true, emoji: resolvedEmoji };
}

async function main() {
  const args = parseArgs(process.argv);
  let channel = args.channel;
  let timestamp = args.ts;

  if (args.url) {
    const parsed = parseSlackPermalink(args.url);
    channel = parsed.channelId;
    timestamp = parsed.messageTs;
  }

  if (!channel || !timestamp) {
    console.error(
      'Usage: slack-reaction.mjs --url <permalink> [--emoji white_check_mark|eyes|check]\n' +
        '   or: slack-reaction.mjs --channel Cxxx --ts 1234567890.123456 [--emoji ...]',
    );
    process.exit(1);
  }

  const result = await addSlackReaction({
    channel,
    timestamp,
    emoji: args.emoji,
  });

  console.log(
    JSON.stringify(
      {
        channel,
        timestamp,
        emoji: result.emoji,
        alreadyReacted: result.alreadyReacted ?? false,
      },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
