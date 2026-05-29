#!/usr/bin/env bash
set -euo pipefail

if command -v fnm >/dev/null 2>&1; then
  eval "$(fnm env)"
  fnm use 22 >/dev/null 2>&1 || fnm use 24 >/dev/null 2>&1 || true
fi

if ! command -v gws >/dev/null 2>&1; then
  echo "ERROR: gws not found. See skills/slack-work-kickoff/calendar-setup.md" >&2
  exit 1
fi

QUERY="${1:-}"
TZ="${CALENDAR_TZ:-Asia/Seoul}"

gws calendar +agenda --today --timezone "$TZ" --format table

if [[ -n "$QUERY" ]]; then
  TIME_MIN=$(date "+%Y-%m-%dT00:00:00+09:00")
  TIME_MAX=$(date -v+1d "+%Y-%m-%dT00:00:00+09:00" 2>/dev/null || date -d "tomorrow" "+%Y-%m-%dT00:00:00+09:00")
  gws calendar events list --params "$(jq -nc \
    --arg q "$QUERY" --arg tmin "$TIME_MIN" --arg tmax "$TIME_MAX" \
    '{calendarId:"primary",timeMin:$tmin,timeMax:$tmax,q:$q,singleEvents:true,orderBy:"startTime"}')" \
    --format table
fi
