# Biswaas Database Backup Strategy

## Overview

Biswaas uses **Convex** as its managed backend and database. Convex handles automatic backups as part of its managed service, but this document outlines our full backup and disaster recovery strategy.

## Automatic Backups (Convex Managed)

Convex provides built-in automatic backups for all deployments:

- **Frequency**: Continuous (point-in-time recovery available on Pro/Enterprise plans)
- **Retention**: Varies by plan — free tier retains recent snapshots, paid plans offer longer retention
- **Scope**: All tables, documents, indexes, and file storage
- **No configuration required**: Backups are enabled by default

## Manual Exports

For additional safety and compliance, we perform manual exports on a regular schedule.

### How to Export

```bash
# Export all data from the production deployment
npx convex export --path ./backups/biswaas-$(date +%Y%m%d).zip

# Export from a specific deployment
npx convex export --prod --path ./backups/biswaas-prod-$(date +%Y%m%d).zip
```

### Recommended Schedule

| Export Type | Frequency | Retention |
|---|---|---|
| Full export | **Daily** | 30 days |
| Archival export | **Weekly** | 1 year |
| Pre-deploy snapshot | Before each production deploy | 7 days |

### Automation

Add to your CI/CD pipeline or use a cron job:

```bash
# Example cron entry (runs daily at 2:00 AM NPT)
0 2 * * * cd /path/to/biswaas && npx convex export --prod --path /backups/biswaas-$(date +\%Y\%m\%d).zip
```

Store exports in a secure, off-site location (e.g., AWS S3 bucket with versioning enabled).

## Disaster Recovery

### Scenario 1: Accidental Data Deletion

1. Identify the affected table(s) and time of deletion
2. If on Convex Pro/Enterprise, use point-in-time recovery via the Convex dashboard
3. Otherwise, restore from the most recent manual export:
   ```bash
   npx convex import --replace --path ./backups/biswaas-YYYYMMDD.zip
   ```

### Scenario 2: Schema Migration Failure

1. Immediately roll back the deployment:
   ```bash
   npx convex deploy --cmd 'git checkout HEAD~1 -- convex/'
   ```
2. Verify data integrity via the Convex dashboard
3. If data is corrupted, restore from the pre-deploy snapshot

### Scenario 3: Complete Service Outage

1. Check [Convex status page](https://status.convex.dev/) for known incidents
2. If prolonged, switch the frontend to a maintenance page
3. Once Convex recovers, verify data integrity
4. If data loss occurred, restore from the latest export

### Scenario 4: Account Compromise

1. Immediately rotate all Convex API keys and deploy keys
2. Audit recent changes via the Convex dashboard activity log
3. Restore from a known-good backup if unauthorized changes were made
4. Enable additional access controls and review team permissions

## Key Contacts

- **Convex Support**: support@convex.dev
- **Convex Status**: https://status.convex.dev/

## Review Schedule

This backup strategy should be reviewed quarterly and updated as the application scales.
