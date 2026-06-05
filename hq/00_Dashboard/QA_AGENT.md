# HQ Dashboard — QA-Agent (neuer Chat)

Anleitung für einen **Test-only**-Chat. Kein Feature-Code, nur strukturierter QA-Report.

## Neuen Chat starten

1. **Neuer Chat** in Cursor.
2. Rule aktivieren: **`@hq-dashboard-qa`** (Datei: `.cursor/rules/hq-dashboard-qa.mdc`).
3. Erste Nachricht (Beispiel):

   ```text
   Führe die HQ-Dashboard-QA durch (Setup + Tests A–G). Am Ende Report nach Vorlage in der Rule.
   ```

Für einen **schnellen Smoke** nur A–C:

   ```text
   Quick smoke: Setup + Tests A–C nur. Report mit übrigen Tests als „nicht gelaufen“.
   ```

## Vollständige Rule

Die komplette Spezifikation liegt in [`.cursor/rules/hq-dashboard-qa.mdc`](../../.cursor/rules/hq-dashboard-qa.mdc) — dort pflegen, nicht zwei divergierende Kopien.

## Setup (Kurz)

```bash
cd /Users/marwanmahra/cert-expert-ai
python3 hq/scripts/build_dashboard.py
python3 hq/scripts/serve_dashboard.py
```

- `http://127.0.0.1:8765/` (nicht `file://`)
- `curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8765/` → 200

## Referenz

- `DASHBOARD_ALLTAG.md`
- `DASHBOARD_PLAN_V2.md`
