# AUFGABEN — Gemeinsames Register (Bridge)

**Zweck:** Eine Liste, drei Ausführende. Du sagst nur die **ID** ("mach T-02"), der zuständige Assistent liest hier den Kontext und führt aus.

**Stand:** 2026-06-07

---

## So funktioniert's (ADHS-einfach)

- Jede Aufgabe hat eine **ID** + **einen** Owner.
- Du brauchst dir nichts merken — nur die ID nennen.
- Owner-Kürzel:
  - **G-** = Generalist (Claude, dieser Chat) → Architektur, `hq`, `knowledge`, Migration. **Kein Code.**
  - **T-** = Code-Track (dein Bau-Chat) + Cursor → Tool/OS-Code & -Design.
  - **M-** = Mark (du selbst) → Finder, OneDrive, Outlook. Kann keiner für dich machen.
- Status: `OFFEN` · `LÄUFT` · `WARTET` (auf etwas/jemanden) · `FERTIG`

**Befehlsformat an einen Assistenten:**
> "Lies AUFGABEN.md, mach **T-02**." → er liest Zeile + Kontext, fragt nur bei echter Unklarheit, sonst macht er.

---

## Offen

| ID | Aufgabe | Owner | Fertig wenn | Status |
|----|---------|-------|-------------|--------|
| **T-04** | **Auf `main` konsolidieren** (Mark-Entscheidung 2026-06-07): COS-Code + T-02-Lint-Fixes auf EINEN Branch, Doppelung weg. **Sicher, mit Backup** — Schritte siehe unten „T-04 Detail". | T | nur noch `main`, b3 weg, Build+Lint sauber | OFFEN |
| **T-03** | `/intern`-Tool bauen (Slice 0 ff. lt. `CURSOR_BAUAUFTRAG_TOOL2.md`) — **erst nach „los" (D-02) + T-04** | T | nach Freigabe, Bau startet | WARTET (auf D-02 + T-04) |
| **D-02** | **„los"** geben → Cursor startet Slice 0 (Datenmodell). Bauauftrag steht in `CURSOR_BAUAUFTRAG_TOOL2.md` | M | du sagst „los" im Code-Track-Chat | WARTET (auf dich) |
| **D-03** | Export-Format für Slice 4 festlegen: Audit-Übersicht als **XLSX** oder **PDF** | M | Format gewählt | WARTET (auf dich) |
| **M-01** | OneDrive: alte Vault-Reste → `Archiv` | M | nur noch Aktenschrank-Inhalt sichtbar | OFFEN |
| **M-02** | OneDrive Clients aufräumen: "Neuer Ordner", "Client 22" weg | M | keine Junk-Ordner mehr | OFFEN |
| **M-03** | `inputs/raw_standards/_dups_check/` prüfen & löschen | M | Ordner leer/weg | OFFEN |
| **M-04** | Korrupten Wolf-Street-Entwurf in Outlook löschen | M | Entwurf weg | OFFEN |
| **M-05** | Dummy "Max Mustermann" in COS löschen | M | weg | OFFEN |
| **M-06** | Wolf-Street-Mail senden (Text steht in `Mail_Unterlagenliste_2026-06-07.md`) | M | Mail raus | OFFEN |

---

## Erledigt

- **T-01** (2026-06-07) — Nested-Clone-Löschung. **Ordner existiert nicht mehr → Migration code-seitig abgeschlossen.** Verifiziert: kein zweiter `cert-expert-ai/` im Repo.
- **T-02** (2026-06-07) — ESLint: 20 Fehler → 0. `npm run lint` + `npm run build` sauber (COS, Port 3001). Fixes: lazy localStorage-Hydration, Render-Sync statt setState-in-effect, UploadsPage-Typen, `tmp-upload-templates` ignoriert.
- **D-01** (2026-06-07) — Design abgestimmt. Code-Track hat DFSS-Gold (inkl. VOC/CTS/KANO/QFD) + O2C-Prozess ausgewertet, Lücken + Reihenfolge festgelegt, Bauauftrag geschrieben. Entscheidungen gesperrt in `CURSOR_BAUAUFTRAG_TOOL2.md`.

---

## T-04 Detail — Auf `main` konsolidieren (für Code-Track)

**Ziel:** Ein Branch (`main`) mit allem — COS-Code + T-02-Lint-Fixes. Doppelung (`main` ⇄ `b3-tool2-migration`) auflösen. Danach nur noch `main`.

**Ausgangslage (verifiziert 2026-06-07):** Branch `main` ausgecheckt, ~228 uncommittete Änderungen = COS-Quellcode (aus b3 „wiederhergestellt") + Lint-Fixes. `b3-tool2-migration` hat den COS-Code committet, aber NICHT die Lint-Fixes. Nichts auf `main` committet → reversibel.

**Schritte (in dieser Reihenfolge, nichts auslassen):**
1. **Sicherheitsnetz zuerst:** `git branch backup/b3-pre-merge b3-tool2-migration` — friert den b3-Stand ein, nichts kann verloren gehen.
2. **Vollständigkeit prüfen:** sicherstellen, dass der Arbeitsbaum von `main` den b3-Code **komplett** enthält (keine b3-Datei fehlt). Z. B. `git diff --stat b3-tool2-migration -- cert-expert-certification-os/` → es dürfen nur die Lint-Fixes als Unterschied auftauchen, keine fehlenden Dateien. Falls doch welche fehlen → erst nachziehen.
3. **Committen:** ein sauberer Commit auf `main`, z. B. `merge: COS-Code + T-02 lint fixes auf main konsolidiert`.
4. **Verifizieren auf `main`:** `npm run lint` **und** `npm run build` müssen sauber sein.
5. **Erst dann b3 entfernen:** `git branch -D b3-tool2-migration`. **Backup-Branch (`backup/b3-pre-merge`) bleibt** vorerst als Netz.
6. **Melden** an Generalist (HANDOFF): erledigt → Generalist stellt die Branch-Referenz in `CURSOR_BAUAUFTRAG_TOOL2.md` + `HANDOFF.md` von `b3-tool2-migration` auf `main` um.

**Guardrail:** Schritt 5 (Löschen) NIE vor erfolgreichem Schritt 4 (Build+Lint sauber).

---

## Hinweis zur Spur-Trennung

- **Tool/OS** (Design + Code) gehört dem **Code-Track + Cursor**. Der Generalist mischt sich da **nicht** ein.
- **Migration/Architektur/`hq`/`knowledge`** gehört dem **Generalist**.
- Braucht eine G-Aufgabe Code → wird als **T-Aufgabe** hier eingetragen, nie selbst gecodet.
