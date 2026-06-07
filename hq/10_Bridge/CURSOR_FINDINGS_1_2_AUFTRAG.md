# Cursor-Arbeitsauftrag — Slice-2-Review-Findings 1–5

**Quelle:** `CODE_REVIEW.md` (2026-06-07, Slice-2-Engine-Review) + Mark-Entscheidung zu F3/F4 (HANDOFF). **Track:** Executor baut · Planer/Claude reviewt · Mark = Gate.
**Repo:** `cert-expert-certification-os/apps/certification-os/` · Branch `main` · Port **3001**.
**Größe:** klein–mittel — Presenter-/Engine-Feinschliff. **Keine Architekturänderung.** EC-09 + EC-10 + `tsc` grün halten.
**Inhalt:** F1 (q-34a-Status) · F2 (Doppelzeilen-Dedup) · F3 (SDL-Soll gaten) · F4 (Leitungsrollen-Klassifikation) · F5 (Asyl-Label kosmetisch).

> **Reihenfolge-Hinweis:** Bitte **zusammen mit dem UE-Anzeige-Commit** oder direkt danach erledigen — beides ist Working-Tree-Feinschliff vor dem nächsten stabilen Punkt.

---

## Finding 1 — `q-34a` bei reiner Unterrichtung nicht „vorhanden" (grün)

**Datei:** `modules/03-mitarbeiterakte-tool-2/employee-file/requirement-engine.ts` (~Z. 286–302).

**Problem:** Bei Bewachungsrolle **ohne Sachkunde, nur Unterrichtung** liefert `q-34a` aktuell `status: "vorhanden"` (grün). Norm-Matrix v2 §2 = **gelb + Frist**. Die separate `frist-sachkunde` (CL-02) fängt die 6-Monats-Frist zwar ab, aber die Pflicht-Set-Zeile allein wirkt zu optimistisch.

**Soll:**
- `sachkunde` vorhanden → weiterhin `"vorhanden"`.
- **nur `unterrichtung`** (kein `sachkunde`) → `status: "unvollständig"` (statt `"vorhanden"`). *(Alternative `"vorbereitet"` zulässig, falls Mark das im UI-Wording bevorzugt — `"unvollständig"` ist die Empfehlung, weil §34a damit nur teilerfüllt ist.)*
- weder noch → unverändert `"fehlt"`.
- `hint` unverändert lassen („Unterrichtung erfasst — Sachkunde-Frist beachten").

**Test:** `requirement-engine.test.ts` — Szenario 2 (SMA Teilzeit, Unterrichtung) auf den neuen `q-34a`-Status anpassen. Suite muss wieder **grün** sein.

---

## Finding 2 — Doppelzeilen im Pflicht-Set dedupen (CL-08 Erste Hilfe, CL-23 Brandschutz)

**Datei:** `modules/03-mitarbeiterakte-tool-2/employee-file/employee-file-requirements.ts` (Presenter, `getEmployeeFileSummary` → `engine.pflichtSet.map(engineRuleToRow)`).

**Problem:** Engine pusht bei **Bewachungsrolle UND passender Beauftragung** dieselbe Pflicht doppelt:
- Erste Hilfe: `q-ersthilfe` (CL-08) **+** `appt-ersthelfer` (CL-08).
- Brandschutz: `sdl-objekt-brandschutz` (CL-23) **+** `appt-brandschutz` (CL-23) — bei SDL Objekte **und** Beauftragung Brandschutzhelfer.

**Soll:** Im **Presenter** vor dem Row-Mapping nach `clauseId` dedupen:
- Für **nicht-`null`** `clauseId`: erscheint dieselbe CL mehrfach → **eine** Zeile behalten, die **Auslöser zusammenführen** (z. B. Trigger „Bewachungsrolle + Beauftragung Ersthelfer"). Status: den „strengeren" behalten (Priorität `abgelaufen` > `fehlt` > `beantragt`/`offen`/`unvollständig` > `vorbereitet` > `vorhanden` > `nicht erforderlich`).
- Für **`null`** `clauseId` (jede „fachlich prüfen") → **nicht** dedupen (jede ist eine eigenständige Prüfaufforderung).

**Sicherheits-Check (nicht fälschlich zusammenlegen):** Die übrigen Mehrfach-CLs sind in der Engine bereits **gegenseitig exklusiv** und dürfen durch das Dedup nichts verlieren — bitte verifizieren:
- CL-04/CL-05: `q-*` (Bewachung) vs. `v-*` (Verwaltung) — Rolle ist Bewachung **XOR** Verwaltung.
- CL-09: `q-intervention` (Bewachung) vs. `appt-intervention` (nur `… && !bewachung`).

Da exklusiv, ist „dedupe by clauseId, Trigger mergen" auch für diese Paare harmlos. **Engine-Logik bleibt unverändert** — Dedup ausschließlich im Presenter.

---

## Finding 5 — Asyl-Basiszeile-Label kosmetisch (optional, kann mitlaufen)

**Datei:** `requirement-engine.ts` (`sdl-asyl-base`, ~Z. 487–495).

`sdl-asyl-base` heißt „Flüchtling/Asyl — **EK/SMA**: 40 UE einmalig", wird aber auch für **FK** als Basis gepusht (+24 = 64, `sdl-asyl-fk`). Label rollen-neutral machen, z. B. **„Flüchtling/Asyl — Basis 40 UE einmalig (interkult. + Deeskalation + Brandschutz)"**. Rein kosmetisch, keine Wert-/CL-Änderung.

---

## Finding 4 — Leitungsrollen-Klassifikation (✅ Mark entschieden: Variante B + Upgrade-Pfad)

**Datei:** `requirement-engine.ts` (`FUEHRUNG_ROLES`, `isFuehrungskraft`, `isBewachungsrolle`, ~Z. 171–205).

**Entscheidung (Mark, 2026-06-07):** **Nur `roleType = "Führungskraft"` ist FK** (24 UE §5.3 + FK-Quali CL-10). **`Einsatzleitung`, `Objektleitung`, `Schichtleitung` = EK/SMA-Niveau (16 UE), kein Auto-FK.** Begründung: die DIN-FK ist die *eine* projektverantwortliche Führungskraft; ein Schicht-/Einsatzleiter übernimmt operativ Leitung (Übergabe, Wachbuch) und ist dort normativ gebunden, trägt aber — solange eine echte FK darüber sitzt — nicht das volle FK-Paket.

**Soll (Engine):**
- `isFuehrungskraft(roleType)` → **nur** `"Führungskraft"` (true). EL/OL/SL ⇒ false.
- **`isBewachungsrolle` muss EL/OL/SL weiterhin als Bewachung führen** (volles Basis-Pflichtset!) — also explizit aufnehmen, nicht über `isFuehrungskraft` ableiten. D. h. Bewachung = `Sicherheitsmitarbeiter | Subunternehmer-SMA | Führungskraft | Einsatzleitung | Objektleitung | Schichtleitung`.
- Folge automatisch korrekt: EL/OL/SL bekommen Basis-Set + bei SDL-Veranstaltung/Asyl die **EK-Werte** (16 / 40 UE) statt FK (24 / 64); **kein** `q-fk-quali` (CL-10).

**⚠️ Achtung Naming-Abgleich:** Engine-`FUEHRUNG_ROLES`/Bewachung nutzt deutsche `roleType`-Strings. Im Presenter/Katalog heißen Rollen u. a. `"SMA / Sicherheitsmitarbeiter"`, `"Praktikant / Auszubildender"` (`GRUNDROLLE_CATALOG`), die Engine matcht `"Sicherheitsmitarbeiter"` / `"Praktikant / Azubi"`. **Bitte beim Bau prüfen, dass die `roleType`-Werte, die tatsächlich gespeichert werden, exakt auf die Engine-Sets matchen** (sonst greift weder Bewachung noch FK). Ggf. Mapping/Normalisierung zentralisieren. *(Falls hier eine Diskrepanz besteht, ist das ein realer Bug über Finding 4 hinaus — melden.)*

**Upgrade-Pfad (Phase 2, NICHT jetzt bauen — als Design-Notiz aufnehmen):** Person kann auf FK „upgraden", sobald sie die FK-Schulung absolviert (künftig über Cert-Expert Distance-Learning direkt im Portal). Heute genügt: `roleType` auf `"Führungskraft"` setzen → Engine rechnet FK. Kein Sondercode in Slice 2.

---

## Finding 3 — SDL-Schulungssoll an Bewachungsrolle koppeln (✅ Mark: sichere Default = gaten)

**Datei:** `requirement-engine.ts` (Abschnitt C, ~Z. 437–533 — die `schulungsSoll.push(...)` für Veranstaltung/Asyl/Objekt-Zusatz).

**Problem:** Das einmalige/jährliche **SDL-Schulungssoll** (CL-20/21 Veranstaltung, CL-24/25 Asyl, CL-22 Objekt-Zusatz) wird allein aus `sdlScopes` erzeugt — unabhängig von der Rolle. Eine Nicht-Bewachungsrolle (Verwaltung) mit SDL-Scope bekäme so ein „schwebendes" UE-Soll ohne Basis-Pflichtset.

**Soll:** Das **Schulungssoll aus SDL** (Veranstaltung/Asyl/Objekt-Zusatz) nur erzeugen, wenn `bewachung === true`. *(Der Brandschutz-Pflichtnachweis aus SDL Objekte und die ÖPV/NON-DIN-„fachlich prüfen"-Zeilen sind davon unberührt — hier geht es nur um das **UE-Schulungssoll**.)* Scope minimal halten: einfach die betroffenen `schulungsSoll.push` unter die `bewachung`-Bedingung ziehen.

**✅ BESTÄTIGT (Mark, 2026-06-07):** gaten ist korrekt für den Normalfall (eine Rolle pro Person).

**🟡 Bekannte Modell-Grenze (NICHT in diesem Auftrag lösen — nur als Code-Kommentar an der Gate-Stelle vermerken):** Die Engine kennt pro Person nur **eine** `roleType`. Eine **Doppelrolle** (Verwaltung/Geschäftsführung **+** zusätzlich Bewachung, z. B. GF, der mit auf Schicht geht) ist heute nicht abbildbar und bekäme durch dieses Gate fälschlich kein SDL-Soll. Workaround bis Phase 2: solche Personen als Bewachungsrolle erfassen. Doppelrollen-Modellierung = Slice 3+ (Design-Notiz im HANDOFF). **Hier nur gaten + kurzer Kommentar — keine Doppelrollen-Logik bauen.**

---

## Definition of Done
- **F1:** `q-34a`-Status `unvollständig` bei reiner Unterrichtung; Test angepasst, **Suite grün**.
- **F2:** Pflicht-Set **ohne Doppelzeilen** für CL-08/CL-23 bei Bewachung + Beauftragung; Trigger zusammengeführt; exklusive CLs (CL-04/05/09) nicht fälschlich zusammengelegt.
- **F4:** Nur `"Führungskraft"` = FK; EL/OL/SL = EK (16 UE), bleiben aber Bewachung (Basis-Set). `roleType`-String-Matching verifiziert. Upgrade-Pfad als Kommentar/Design-Notiz.
- **F3:** SDL-Schulungssoll nur bei Bewachungsrolle.
- **F5 (optional):** Asyl-Basis-Label rollen-neutral.
- `npx tsc --noEmit` = 0 Fehler; keine **neuen** ESLint-Errors; **Engine-Test-Suite grün** (F1 + F3 + F4 brauchen aktualisierte/zusätzliche Szenarien: SL → 16 UE; Verwaltung+SDL → kein UE-Soll).
- **EC-09-Smoke grün** (Person → Akte → Doc-Chips → ZIP).
- **Browser-Akzeptanz:** (a) Bewachung + Ersthelfer + SDL-Objekte + Brandschutz-Beauftragung → Erste-Hilfe/Brandschutz **je einmal**; (b) reine-Unterrichtungs-Akte → §34a **nicht grün**; (c) Schichtleitung + SDL-Veranstaltung → **16 UE** (nicht 24), kein FK-Quali; (d) Verwaltung + SDL → **kein** Schulungssoll.
- Ergebnis + Commit-Hash in `HANDOFF.md` („Von Cursor an Claude").

**Reihenfolge:** F4 + F3 sind Engine-Regeln (mit Test); F1 Engine+Test; F2 Presenter; F5 kosmetisch. Alles ein Commit oder klein gestückelt — Planer 3 reviewt gegen Norm-Matrix v2 + dieser Entscheidung.
