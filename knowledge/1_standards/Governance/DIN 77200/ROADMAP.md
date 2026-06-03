# DIN 77200 — Roadmap (Governance)

Geplante Erweiterungen — **ohne** Migration der normzentrierten Fachablage.

---

## Kurzfristig

- [x] Pfad-Links in `Anforderungsprofile.md`, Vorlagen-READMEs auf normzentrierte Pfade vereinheitlichen
- [x] Fehlablagen in `anforderungsprofile/` bereinigen (`fluechtlings_*` nur 77200-2; `veranstaltungssicherungsdienst` nur 77200-1)
- [x] `10_examples/anforderungsprofile/` endgültig entfernen (veraltete Dubletten)
- [ ] VA Kap. 7 V9 Organisation Qualifikation einarbeiten → `qualifikationssystem/` oder `Weiterbildung.md`

---

## Mittelfristig

- [x] Qualifikationsmatrizen-**Logik** in `qualifications/04` (keine Personalzeilen)
- [ ] 77200-2 Kap. 5–8 Module von Platzhalter auf aktive CEKS-Module
- [ ] Tool-1-Slots: Profil → Qualifikationssystem → Freigabe
- [ ] Einheitliche YAML: `document_type`, `norm_part`, `annex_reference`

---

## Explizit nicht geplant

- ~~Zentralisierung aller Dokumenttypen unter `din_77200/<typ>/`~~ — verworfen (Governance jetzt: `Governance/DIN 77200/`)
- ~~Migration von CEKS-Modulen aus `DIN 77200-1/` nach Governance~~
- ~~Root-Ordner `knowledge/standards/`~~

Siehe [[MIGRATION]].
