# Cert-Expert AI — Portal Integration Concept

Version: 1.0 | Erstellt: 2026-05-18 | Status: Konzept (nicht implementiert)

---

## Kontext

Das Cert-Expert AI Bot System ist **nicht** das Portal.
Es ist die Fachbot/Dokumentengenerierungs-Engine, die das Portal später aufrufen wird.

Das Portal (Login, Dashboards, Formulare, Order-to-Cash) wird separat entwickelt.
Der AI Bot Layer muss sauber integrierbar bleiben — durch klare Input/Output-Grenzen.

---

## Was der AI Bot Layer liefert

```
Portal / Formular / CLI
        ↓  blueprint_id + input_json
AI Bot Layer
        ↓  placeholder_json + docx + qa_status + open_points
Portal / Storage / Ausgabe
```

Der AI Bot Layer hat genau diese Verantwortung:
1. Strukturierten Input entgegennehmen
2. Fachlichen Inhalt per Qwen generieren
3. QA und Open Points ermitteln
4. Finales DOCX und strukturiertes JSON zurückgeben

Alles andere — Projektverwaltung, Login, Freigabe-Workflows, Dashboards,
Dokumentenspeicherung, Benachrichtigungen — liegt im Portal.

---

## Klare Integrationsgrenzen

| Grenze | AI Bot Layer | Portal (Zukunft) |
|---|---|---|
| Blueprint wählen | Liest Blueprint-Config | Zeigt Auswahl-UI |
| Input bereitstellen | Validiert und verarbeitet JSON | Füllt Formular, baut Input-JSON |
| Fachinhalt generieren | Vollständig | Keine KI-Logik im Portal |
| QA durchführen | Vollständig | Zeigt QA-Bericht |
| DOCX rendern | Vollständig (Node.js Renderer) | Empfängt DOCX |
| Speichern | Gibt Dateien zurück | Speichert in Projekt/Storage |
| Freigabe-Workflow | Nicht zuständig | Portal-Aufgabe |
| Projektdossier | Nicht zuständig | Portal-Aufgabe |
| Upstream-Dokumente | Nimmt preprocessed Text entgegen | Lädt hoch, preprocessed |

---

## Zukünftiges Integrationsmuster

Das Portal wird den AI Bot Layer als interne Service-Schicht aufrufen.
In der einfachsten Ausbaustufe: Python-Funktion oder REST-Endpunkt.

```python
# Zukünftige API (nicht implementiert)
result = generate_document(
    blueprint_id="gb_event_kampfsport",
    input_data={ ... },
    upstream_context={ "sk": "..." }  # optional, Flow-Modus
)
# result.placeholder_json
# result.docx_path
# result.qa_status
# result.open_points
```

Das Portal behandelt dann: Speichern, Freigabe, Versionen, Projektgruppierung.

---

## Projektdossiers — Konzept

Das Portal wird zusammengehörige Dokumente in Projektdossiers gruppieren:
- Upstream-Dokumente (Sicherheitskonzept, Behördenauflagen)
- Generierte Dokumente (GB, EC, ODA)
- QA-Zustände und Freigaben
- Human Review Checkpoints

Der AI Bot Layer muss dafür keine eigene Projektverwaltung implementieren.
Er muss nur saubere, wiederholbare Outputs liefern, die das Portal versionieren kann.

**Jetzt relevant:** saubere Input/Output-Grenzen.
**Nicht jetzt:** Projekt-Datenbanken, Approval-Workflows, Portal-UI.
