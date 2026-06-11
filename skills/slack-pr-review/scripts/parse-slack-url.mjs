#!/usr/bin/env node
/**
 * Slack permalink → channel_id, message_ts
 * @example https://your-org.slack.com/archives/C0000000000/p1779264244219899
 */

import { pathToFileURL } from 'node:url';

export function parseSlackPermalink(url) {
  const trimmed = url.trim();
  const match = trimmed.match(/archives\/([A-Z0-9]+)\/p(\d+)/i);
  if (!match) {
    throw new Error(`Slack permalink를 파싱할 수 없습니다: ${url}`);
  }

  const channelId = match[1];
  const raw = match[2];
  const messageTs = `${raw.slice(0, -6)}.${raw.slice(-6)}`;

  return { channelId, messageTs, permalink: trimmed };
}

function main() {
  const url = process.argv[2];
  if (!url) {
    console.error('Usage: node parse-slack-url.mjs <slack-permalink>');
    process.exit(1);
  }
  console.log(JSON.stringify(parseSlackPermalink(url), null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
