# CURSOR_OEPV_ENGINE_AUFTRAG — ÖPV-Schulungssoll in die Engine verdrahten (Lane A, Slice 1)

> **Lane A (Norm/Engine) — 1 Bot, NICHT parallel zu anderen Engine-Slices.** Klein, CL-belegt, sofort baubar. Norm-Gate ist geklärt (Mark, 2026-06-08): ÖPV = CL-29/CL-30 belegt aus DIN 77200-2 §6.3/§6.4.
> **Rollen-Kontrakt:** Bot baut nur diesen Auftrag, committet, hängt EINEN Ergebnis-Eintrag in HANDOFF an, parkt Zweifel als Frage. Plant nicht neu, erfindet keine Normwerte.

## 1. Was kann Mark am Ende
Bei einer Person mit Geltungsbereich **„Öffentlicher Personenverkehr (ÖPV)"** (`sdlScopes` enthält `din2-oepv`) erzeugt die Engine ein **echtes, CL-belegtes Schulungs-Soll** statt der heutigen „fachlich prüfen"-Platzhalterzeile:
- **EK/Einsatzkraft:** 40 UE einmalig (CL-29, §6.4).
- **FK/Führungskraft:** zusätzlich +16 UE = **56 UE gesamt** einmalig (CL-30, §6.3) — analog zum Asyl-Muster.

## 2. Norm-Basis (belegt — nicht ändern)
- **CL-29** — ÖPV **EK 40 UE einmalig** (DIN 77200-2 §6.4, „vor ihrem ersten Einsatz"), anrechenbar auf Jahres-WB §4.19.2 (CL-27).
- **CL-30** — ÖPV **FK +16 UE einmalig** (§6.3), **additiv** auf die EK-40-Schulung → 56 gesamt. Baut auf EK-Basis auf (gleiche Mechanik wie Asyl CL-24/CL-25).
- Beide Werte stehen bereits im `NORM_KLAUSEL_REGISTER_v1.md`. **Keine neue CL erfinden.**
- **Tarif-/Streckenkunde (§6.4):** nur „auf Wunsch des AG" → **kein** Baseline-UE-Soll. Optional als `hinweise`-Zeile, nicht als Pflicht/Soll.

## 3. Datei + Stelle
`cert-expert-certification-os/apps/certification-os/modules/03-mitarbeiterakte-tool-2/employee-file/requirement-engine.ts`
- **Ersetzen:** der `if (sdl.has("din2-oepv")) { … sdl-oepv … clauseId: null … "fachlich prüfen" }`-Block (akt. ~Z. 650–659).
- **Muster 1:1 vom Asyl-Block übernehmen** (akt. ~Z. 619–648: `sdl-asyl-base` + `if (fuehrung) sdl-asyl-fk`), **F3-Gate `bewachung`** beibehalten.

Neuer Block (Soll-Struktur, im `schulungsSoll`-Array):
```ts
if (sdl.has("din2-oepv") && bewachung) {
  schulungsSoll.push({
    id: "sdl-oepv-base",
    label: "ÖPV — Einsatzkräfte 40 UE einmalig (§6.4)",
    clauseId: "CL-29",
    ue: 40,
    period: "einmalig",
    trigger: "SDL Öffentlicher Personenverkehr",
    status: "fehlt",
  });
  if (fuehrung) {
    schulungsSoll.push({
      id: "sdl-oepv-fk",
      label: "ÖPV — Führungskraft: +16 UE (= 56) einmalig (§6.3)",
      clauseId: "CL-30",
      ue: 16,
      period: "einmalig",
      trigger: "SDL ÖPV · Rolle FK",
      status: "fehlt",
      hint: "Gesamt 56 UE (40 Basis + 16 FK-Aufschlag)",
    });
  }
}
```
- **SDL_SCOPE_CATALOG** (akt. ~Z. 167–172): `din2-oepv`-`hint` von „Scope-Nachweis — UE fachlich prüfen" → z. B. **„40 / 56 UE einmalig (CL-29/30)"** angleichen (kosmetisch, konsistent mit Veranstaltung/Asyl).

## 4. Tests
`requirement-engine.test.ts` — neue Szenarien (Muster wie Asyl 4a/4b):
- **ÖPV EK:** `roleClasses:["ek"], sdlScopes:["din2-oepv"]` → `sdl-oepv-base.ue=40`, `clauseId="CL-29"`; `sdl-oepv-fk` undefined.
- **ÖPV FK:** `roleClasses:["fk"], sdlScopes:["din2-oepv"]` → base 40 (CL-29) **und** `sdl-oepv-fk.ue=16`, `clauseId="CL-30"`.
- **Nicht-Bewachung:** `roleClasses:["verwaltung"], sdlScopes:["din2-oepv"]` → **kein** ÖPV-Soll (F3-Gate).
- **⚠️ Bestehenden Test anpassen:** das Invarianz-/Multi-Scope-Szenario (akt. ~Z. 480, `roleClasses:["ek"], sdlScopes:[…,"din2-oepv",…]`) erwartet aktuell die alte `sdl-oepv`-`null`-Zeile → auf `sdl-oepv-base` (CL-29) umstellen, nicht löschen.

## 5. DoD (alle grün)
- `tsc --noEmit` = 0.
- Engine-Suite `npx tsx --test requirement-engine.test.ts` grün **inkl. neuer ÖPV-Szenarien**.
- **EC-09:** echter Browser :3001 — Person mit ÖPV-Scope, ZIP `POST /employee-automation` **200**, kein 5xx (Generator unberührt).
- **EC-10** unverändert (keine Freigabe-/Auditaussage; `status:"fehlt"` wie die anderen Soll).
- **Keine neue CL/UE** über CL-29/CL-30 hinaus. `.env`/`.db`/`hq/03_Kundenprojekte/**` **nicht** committen.

## 6. Kickoff-Prompt (neuer Bot, `main`)
> Du bist Executor (Spur E). Lies `CLAUDE.md` + `hq/10_Bridge/HANDOFF.md` (HIER STARTEN) + **diesen Auftrag**. Baue **nur** §3–§4: ÖPV-Schulungssoll (CL-29 EK 40 / CL-30 FK +16 = 56) nach Asyl-Muster, F3-`bewachung`-gegatet, ersetze den `null`-Platzhalter; Tests ergänzen + den bestehenden ÖPV-Multi-Scope-Test anpassen. Halte §5-DoD grün (tsc 0 / Engine-Suite / EC-09-ZIP 200 / EC-10). Committe mit Marks OK, hänge EINEN Ergebnis-Eintrag in HANDOFF an. Plan nicht umschreiben; bei Norm-Zweifel parken + Frage an Planer.
