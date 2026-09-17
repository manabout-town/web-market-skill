#!/usr/bin/env bash
# web-market 스킬 설치 → ~/.claude/skills/web-market
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p ~/.claude/skills
rm -rf ~/.claude/skills/web-market
cp -R skill/web-market ~/.claude/skills/
echo "✓ 설치 끝: ~/.claude/skills/web-market"
