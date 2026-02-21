#!/usr/bin/env bash
set -euo pipefail

# Lightweight global reachability monitor for dual-site VPS hosting.
# Uses Check-Host public API and stores compact JSONL logs.

BASE_DIR="${BASE_DIR:-/var/log/site-reachability}"
MAX_NODES="${MAX_NODES:-20}"
HTTPS_OK_MIN="${HTTPS_OK_MIN:-6}"
CHECKHOST_TIMEOUT_SEC="${CHECKHOST_TIMEOUT_SEC:-25}"

DOMAINS=(
  "persiantoolbox.ir"
  "alirezasafaeisystems.ir"
)

mkdir -p "$BASE_DIR"

timestamp_utc="$(date -u +%FT%TZ)"
run_file="${BASE_DIR}/reachability-${timestamp_utc//[:]/-}.json"
latest_file="${BASE_DIR}/latest.json"
events_file="${BASE_DIR}/events.log"

cookie_file="$(mktemp)"
trap 'rm -f "$cookie_file"' EXIT

extract_token() {
  sed -n 's/.*name="csrf_token" value="\([a-f0-9]*\)".*/\1/p' | head -n 1
}

create_check() {
  local endpoint="$1"
  local host="$2"
  local html token rid

  html="$(curl -fsS -c "$cookie_file" "https://check-host.net/${endpoint}?host=${host}&max_nodes=${MAX_NODES}")"
  token="$(printf '%s' "$html" | extract_token)"
  if [[ -z "$token" ]]; then
    echo "token_error"
    return 0
  fi

  html="$(curl -fsS -b "$cookie_file" "https://check-host.net/${endpoint}?host=${host}&max_nodes=${MAX_NODES}&csrf_token=${token}")"
  rid="$(printf '%s' "$html" | perl -0777 -ne "if(/get_check_results\(\s*'([^']+)'/s){print \$1}")"
  if [[ -z "$rid" ]]; then
    echo "rid_error"
    return 0
  fi
  echo "$rid"
}

fetch_result() {
  local rid="$1"
  local out_file="$2"
  local i nulls

  for i in $(seq 1 "$CHECKHOST_TIMEOUT_SEC"); do
    curl -fsS "https://check-host.net/check-result/${rid}" >"$out_file" || true
    if ! jq -e type "$out_file" >/dev/null 2>&1; then
      sleep 1
      continue
    fi
    nulls="$(jq '[.[] | select(. == null)] | length' "$out_file" 2>/dev/null || echo 999)"
    if [[ "$nulls" == "0" ]]; then
      return 0
    fi
    sleep 1
  done
  return 0
}

summarize_http_json() {
  local file="$1"
  jq -c '
    to_entries as $e |
    {
      total: ($e|length),
      ok: ($e|map(select(.value != null and .value[0][0] == 1))|length),
      timeout: ($e|map(select(.value != null and ((.value[0][2] // "")|ascii_downcase|contains("timed out"))))|length),
      other_fail: ($e|map(select(.value != null and .value[0][0] != 1 and ((.value[0][2] // "")|ascii_downcase|contains("timed out")|not)))|length),
      pending: ($e|map(select(.value == null))|length)
    }
  ' "$file"
}

summarize_tcp_json() {
  local file="$1"
  jq -c '
    to_entries as $e |
    {
      total: ($e|length),
      ok: ($e|map(select(.value != null and (.value[0]|type) == "object" and (.value[0].time != null)))|length),
      fail: ($e|map(select(.value == null or (.value[0].time == null)))|length)
    }
  ' "$file"
}

check_domain() {
  local domain="$1"
  local rid_http80 rid_https443 rid_tcp443
  local f_http80 f_https443 f_tcp443
  local s_http80 s_https443 s_tcp443

  rid_http80="$(create_check "check-http" "http://${domain}/")"
  rid_https443="$(create_check "check-http" "https://${domain}/")"
  rid_tcp443="$(create_check "check-tcp" "${domain}:443")"

  f_http80="$(mktemp)"
  f_https443="$(mktemp)"
  f_tcp443="$(mktemp)"

  if [[ "$rid_http80" != *error ]]; then fetch_result "$rid_http80" "$f_http80"; fi
  if [[ "$rid_https443" != *error ]]; then fetch_result "$rid_https443" "$f_https443"; fi
  if [[ "$rid_tcp443" != *error ]]; then fetch_result "$rid_tcp443" "$f_tcp443"; fi

  if [[ "$rid_http80" == *error ]]; then
    s_http80='{"total":0,"ok":0,"timeout":0,"other_fail":1,"pending":0}'
  else
    s_http80="$(summarize_http_json "$f_http80")"
  fi

  if [[ "$rid_https443" == *error ]]; then
    s_https443='{"total":0,"ok":0,"timeout":0,"other_fail":1,"pending":0}'
  else
    s_https443="$(summarize_http_json "$f_https443")"
  fi

  if [[ "$rid_tcp443" == *error ]]; then
    s_tcp443='{"total":0,"ok":0,"fail":1}'
  else
    s_tcp443="$(summarize_tcp_json "$f_tcp443")"
  fi

  rm -f "$f_http80" "$f_https443" "$f_tcp443"

  jq -n \
    --arg domain "$domain" \
    --arg rid_http80 "$rid_http80" \
    --arg rid_https443 "$rid_https443" \
    --arg rid_tcp443 "$rid_tcp443" \
    --argjson http80 "$s_http80" \
    --argjson https443 "$s_https443" \
    --argjson tcp443 "$s_tcp443" \
    '{
      domain: $domain,
      request_ids: {
        http80: $rid_http80,
        https443: $rid_https443,
        tcp443: $rid_tcp443
      },
      http80: $http80,
      https443: $https443,
      tcp443: $tcp443
    }'
}

domain_results_json="$(printf '[]')"
critical_count=0

for domain in "${DOMAINS[@]}"; do
  result="$(check_domain "$domain")"
  domain_results_json="$(jq -c --argjson item "$result" '. + [$item]' <<<"$domain_results_json")"

  https_ok="$(jq -r '.https443.ok' <<<"$result")"
  tcp_ok="$(jq -r '.tcp443.ok' <<<"$result")"
  if [[ "$https_ok" -lt "$HTTPS_OK_MIN" && "$tcp_ok" -ge 1 ]]; then
    critical_count=$((critical_count + 1))
  fi
done

overall_status="ok"
if [[ "$critical_count" -gt 0 ]]; then
  overall_status="degraded_https_external"
fi

final_json="$(jq -n \
  --arg timestamp "$timestamp_utc" \
  --arg status "$overall_status" \
  --argjson critical "$critical_count" \
  --argjson domains "$domain_results_json" \
  '{
    timestamp_utc: $timestamp,
    status: $status,
    critical_domains: $critical,
    domains: $domains
  }')"

printf '%s\n' "$final_json" | tee "$run_file" >"$latest_file"
printf '%s\t%s\n' "$timestamp_utc" "$overall_status" >>"$events_file"

if [[ "$overall_status" != "ok" ]]; then
  logger -t site-reachability "status=${overall_status} critical_domains=${critical_count} file=${run_file}"
fi

echo "$final_json"
