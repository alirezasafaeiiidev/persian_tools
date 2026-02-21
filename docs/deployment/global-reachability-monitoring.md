# Global Reachability Monitoring

This monitor checks external reachability for both production domains:

- `persiantoolbox.ir`
- `alirezasafaeisystems.ir`

It runs three checks per domain from multiple global probes:

1. HTTP on port 80 (`http://...`)
2. HTTPS on port 443 (`https://...`)
3. TCP connect on 443 (`domain:443`)

If HTTPS success is below threshold while TCP is mostly healthy, status is marked:

- `degraded_https_external`

This pattern helps detect external TLS/path issues that are not caused by app-level blocks.

## Script

- `scripts/ops/global-reachability-check.sh`

Important env vars:

- `BASE_DIR` (default: `/var/log/site-reachability`)
- `MAX_NODES` (default: `20`)
- `HTTPS_OK_MIN` (default: `6`)
- `CHECKHOST_TIMEOUT_SEC` (default: `25`)

## Output

Per run:

- `reachability-<timestamp>.json`
- `latest.json`
- `events.log`

Default location:

- `/var/log/site-reachability`

## Recommended cron

Example every 15 minutes:

```cron
*/15 * * * * BASE_DIR=/var/log/site-reachability MAX_NODES=20 HTTPS_OK_MIN=6 /usr/local/bin/site-global-reachability-check >> /var/log/site-reachability/cron.log 2>&1
```
