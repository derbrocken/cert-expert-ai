# Bugbot-Projektregeln — Cert-Expert Certification OS

Prüfe PRs zusätzlich zu generischen Bugs gegen diese Projekt-Guardrails und markiere Verstöße deutlich:

- **EC-09:** Der Pfad Person → Akte → Doc-Chips → ZIP-Generator (`generate-employee-docs`, `employeeFileToEmployee`) darf nicht brechen. Flagge Änderungen, die diesen Pfad gefährden.
- **EC-10:** Keine automatische Freigabe-/Auditfähigkeits-/Zertifizierungsaussage. Eingehende Nachweise müssen `unchecked` bleiben. Flagge Code, der Evidence automatisch auf „geprüft/freigegeben" setzt oder Wörter wie „auditfähig/freigegeben/zertifiziert" als Status ausgibt.
- **Keine erfundenen Normpflichten:** Hartkodierte DIN-Werte (UE-Zahlen, Fristen, Quoten) ohne `clauseId` (CL-xx aus `knowledge/NORM_KLAUSEL_REGISTER_v1.md`) flaggen.
- **DSGVO:** `prisma/**/*.db` und `.env*` dürfen nie hinzugefügt/committet werden. Flagge solche Dateien sofort.
- **Hygiene:** `tsc --noEmit` muss sauber bleiben; `any` vermeiden.
