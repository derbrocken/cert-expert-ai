# Agent-Workflow — Cert-Expert AI / DIN 77200

**Zweck:** Standardarbeitsweise für Cursor-Agents — von Orientierung bis Freigabe für Commits.

**Nicht:** Tool-2-Implementierung. Tool 2 = **spätere Perspektive** für Projektakten.

---

## Standardablauf

### Phase 1 — Orientierung (vor jeder inhaltlichen Arbeit)

```
1. [[AGENT_ONBOARDING]] lesen (oder refreshen)
2. [[CURRENT_STATE]] prüfen — was ist bereits umgesetzt?
3. [[ARCHITECTURE]] + [[AGENT_RULES]] bei Struktur-/Pfadfragen
4. [[DOCUMENT_TYPES]] + [[NAMING_CONVENTIONS]] bei neuen Dateien
```

### Phase 2 — Fachkontext laden

```
5. Betroffenen Fachordner lesen:
   - 77200-1 → overview.md, dann Modul
   - 77200-2 → README.md, dann 01_–08_
6. Profil-first bei Qualifikationsfragen
7. Primärquelle nur für Verifikation — nicht als ersten Schritt alles neu extrahieren
```

### Phase 3 — Änderung vorbereiten

```
8. git status + git diff — was ist lokal offen?
9. Scope klären: Governance vs. Fach vs. Projekt
10. Keine Migration ohne explizite Nutzer-Freigabe
11. Keine Dubletten (Ordner, Profile, examples)
```

### Phase 4 — Umsetzung

```
12. Minimale, fokussierte Änderungen
13. Pfade und Wikilinks konsistent halten
14. Generator nur anfassen mit Freigabe
```

### Phase 5 — Abschluss

```
15. Bericht: was geändert, warum, git status
16. Commit nur nach expliziter Nutzer-Freigabe („committen“, „commit“, „push“)
17. Bei Unsicherheit: stoppen und fragen
```

---

## Entscheidungsbaum: Wohin mit neuem Inhalt?

```
Neuer Inhalt?
├─ Meta / Agent / Roadmap / Architektur     → Governance/DIN 77200/
├─ Normwissen 77200-1                       → DIN 77200-1/
├─ Normwissen 77200-2                       → DIN 77200-2/
├─ Profil-Vorlage Anhang A                  → DIN 77200-1/anforderungsprofile/
├─ Profil-Vorlage Anhang C                  → DIN 77200-2/anforderungsprofile/
├─ Ausgefülltes Projekt                     → 10_examples/ (später Tool 2)
└─ Unklar                                   → Nutzer fragen
```

---

## Git-Regeln

| Aktion | Regel |
|--------|-------|
| `git status` | **Vor** und **nach** jeder Aufgabe |
| Commit | Nur auf Anweisung |
| Push | Nur auf Anweisung |
| Branch | Feature-Branch beibehalten, nicht ohne Absprache auf main |
| Untracked | `inputs/`, `.obsidian/` nicht pauschal committen |

---

## Verboten ohne Freigabe

- Ordnerstruktur DIN 77200-1 / 77200-2 / Governance umbauen
- Anforderungsprofile V1 verschieben oder umbenennen
- Fachinhalte nach `Governance/` verschieben
- `knowledge/standards/` oder `din_77200/` als Ablage neu anlegen
- Massen-Migration von Modulen
- Tool-2-Code oder Projektakten-Struktur **implementieren** (noch nicht Scope)

---

## Dubletten vermeiden

| Risiko | Gegenmaßnahme |
|--------|----------------|
| Profil in `10_examples/` und Standards | Nur Standards = Vorlagen |
| Unprefixed + prefixed Profile | Nur `77200-1_*` / `77200-2_*` |
| Qualifikation im Anforderungsprofil | Nur in Profil-Vorlagen — **nicht** in qualifikationssystem/ oder qualifications/ |
| Qualifikationscodes / Matrix | Nur in `qualifications/` (V2+) |
| Qualifikations-Bausteine DE | Nur in `qualifikationssystem/` (V1) |
| Parallel README in Governance und Fach | Governance = Meta, Fach = CEKS |

---

## Berichtspflicht (nach Aufgabe)

Kurz mitteilen:

1. Welche Dateien geändert/erstellt
2. Ob Struktur unangetastet blieb
3. `git status`
4. Ob Commit empfohlen — **nicht** automatisch committen

---

## Kontext voll / neuer Agent

1. [[AGENT_ONBOARDING]] von vorne  
2. [[CURRENT_STATE]] — nicht aus Chat-Historie raten  
3. Offene `git status`-Diffs lesen  

Detailregeln: [[AGENT_RULES]]

---

## Tool 1 vs. Tool 2 (Perspektive)

| | Tool 1 | Tool 2 |
|---|--------|--------|
| **Status** | Konzept in Governance/Modulen | **Später** — Projektakten |
| **Agent heute** | Slots/Logik in CEKS-Modulen beschreiben | Nicht implementieren |
| **Ablage heute** | `knowledge/1_standards/` | `10_examples/` / zukünftig `projects/` |

Siehe [[ROADMAP]], [[DOCUMENT_TYPES]].
