# Autonomer Bau — Ausblick, Review-Kadenz, Stop-Regel (für stundenlanges Bauen)

**Stand:** 2026-06-08 · **Autor:** Generalist (Spur P / Planer-Seite) · **Für:** Code-Track / Executor in Cursor
**Zweck:** Damit der Executor Stunden autonom bauen kann — mit Richtung, ohne zu „freelancen" oder am Ende alles aufzublähen.

---

## Review-Kadenz (gestaffelt — NICHT Review-Superagent pro Commit)

**Pro Commit (inline, schnell, deterministisch):**
- Jede berührte Norm-Regel trägt eine **`clauseId`** aus `knowledge/NORM_KLAUSEL_REGISTER_v1.md`. Ohne belegte CL → „fachlich prüfen", nicht committen als Fakt.
- **Forbidden-Wording-Check** (EC-10: keine „freigegeben/zertifiziert/auditfähig"-Aussage; Generator-Output `status: unchecked`).
- **`tsc --noEmit` = 0** + **EC-09-Smoke** grün (Person → Akte → Doc-Chips → ZIP).
- Das ist ohnehin harte Regel — kostet fast nichts, bremst nicht.

**Nachgelagerter Norm-Review (Batch, blockiert den Bau NICHT):**
- Gegen `NORM_MATRIX_Mitarbeiternachweise_v2.md` + `NORM_KLAUSEL_REGISTER_v1.md`.
- **Wichtig:** Executor und Generalist sind getrennte Agenten ohne Live-Gedächtnis. Der Executor **wartet NICHT** auf einen Review und pingt niemanden.
- Ablauf: Executor committet jeden Slice + schreibt einen HANDOFF-Eintrag „Slice X fertig, Commit `hash`, offene Punkte: …". **Später** (wenn Mark den Generalist reinholt) liest der Generalist **alle Commits auf einmal** per git-Diff und schreibt den Befund nach `CODE_REVIEW.md`.
- Sicher, weil **EC-10**: nichts ist automatisch „freigegeben/zertifiziert" (alles `unchecked`). Der Review gated „annehmen/deployen", nicht „bauen".

---

## Geordnete Bau-Queue (in dieser Reihenfolge)

0. **Prüfen:** Findings 1–5 (`CURSOR_FINDINGS_1_2_AUFTRAG.md`) + UE-Anzeige committet? (zuletzt `0d92ff2`). Falls offen → erst fertig + Commit.
1. **Slice 3 — Readiness-Ampel** (`CURSOR_BAUAUFTRAG_READINESS_DEKRA.md` §Slice 3): Status 🟢/🟡/🔴 je Akte/Firma, Stichtags-Logik relativ zum Audit-Termin (Unbedenklichkeiten ≤6 Mon., Gewerbezentralregister ≤12 Mon.), Gate Stage 4→5 erst wenn alle 7 Vorbedingungen grün. Vorlagen: `L-07 Unternehmensnachweisliste (mit Fristen)` + `CL-04 Audit-Readiness-Check` aus dem IMS-Master.
2. **Slice 4 — DEKRA-Assembler + Export** (§Slice 4): Slot-Mapping aus **`DEKRA_SLOT_MAP.md`**; generiertes Verfahrens-Set (Platzhalter füllen) aus **`knowledge/4_document_types/DIN77200_IMS_Dokumentenkatalog.md`**; Nachweise aus S3 in die Slots; Export → OneDrive `01_Kunden/<Kunde>/08_Generated/`; Upload-Routing nach **`DEKRA_KONTAKTE.md`** (A–G Brendel · H–P+W–Z Womela · Q–V+0–9 Gorny).
3. **Alt→Neu-Doc-Migration:** DEKRA-Kundenordner nutzen Alt-Namen (Kap.7 V1–V10), der IMS-Master neue IDs (V-04 …). Mapping-Tabelle erstellen, Slot↔Doc auf neue IDs umstellen.
4. **Hetzner-Deploy** = eigener Schritt (Pre-Deploy-Checkliste + `HETZNER_DEPLOY.md`) — **erst nach Marks „los"**.

---

## Regel „Parken & Weiter" (NICHT auf den Generalist warten)

Der Executor blockiert nie auf einen Review. Bei einer Scope-/Architektur-/Norm-Frage:
1. **Parken:** Punkt als „OFFENE FRAGE" in den HANDOFF schreiben (kurz, datiert).
2. **Weiter:** mit dem **nächsten machbaren** Queue-Item fortfahren.
3. **Hard-Stop nur,** wenn *alles* blockiert ist **oder** er sonst eine Guardrail verletzen müsste (Normwert ohne `clauseId`, EC-09, EC-10). Dann committen, Stand in HANDOFF, anhalten.

Planung/Review/Norm-Mapping = ausschließlich Spur P (Planer/Generalist). Der Executor baut den Auftrag, committet, meldet, parkt offene Fragen — **er plant nicht neu und erfindet keine Normwerte.**

## Guardrails (unverändert)
EC-09 (Generator/ZIP nie brechen) · EC-10 (kein Freigabe-/Auditfähigkeits-Status) · keine erfundenen Normpflichten · DSGVO (keine `.db`/`.env` committen) · **im echten Browser verifizieren**, nicht per Skript · Mark = Gate.

## Übergabe-Takt
Nach jedem Slice: stabiler Punkt → Commit (mit Marks OK) → HANDOFF-Abschlusseintrag (fertig/offen/nächster Schritt/Hash). Nicht bis 100 % Kontext warten.
