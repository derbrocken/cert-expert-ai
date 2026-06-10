/**
 * Schulungskatalog (Queue C) — DIN-77200-1 modulare Schulungen als planbare
 * **Lehrbausteine**. Quelle: `hq/10_Bridge/CURSOR_SCHULUNGSKATALOG_PLANUNG.md` §3.
 *
 * 🔴 KEIN Norm-Soll (Norm-Cross-Check §2.1): Diese Module sind Cert-Expert-
 * Lehrbausteine zur **Füllung** des CL-11-Jahres-Solls (40/24). Die Modul-UE
 * sind rein **informativ** — sie dürfen NIEMALS automatisch zum Jahres-Soll
 * aufsummiert oder als neue Pflicht/CL gesetzt werden. Soll bleibt CL-11.
 *
 * Bewusst NICHT enthalten: ÖPV-Werte (keine belegte CL, Cross-Check §2.4) und
 * der Veranstaltungs-FK-16-Konflikt (Cross-Check §2.3) — das sind Soll-/Norm-
 * Fragen, keine Katalog-Lehrbausteine. DIN-2-Scope-Schulungen werden hier nicht
 * dupliziert; sie sind bereits Engine-Soll-Posten (über `source:"soll-posten"`
 * planbar).
 */

export interface TrainingCatalogModule {
  /** z. B. "din1-modul-1". */
  id: string;
  /** Anzeige-Label des Lehrbausteins. */
  label: string;
  /** Informativer UE-Wert (4, FK 8) — KEIN Norm-Soll. */
  ue: number;
  /** Curriculum-Bezug: füllt CL-11, ändert es nicht. */
  clauseId: "CL-11";
  /** Gruppierung (erweiterbar). */
  group: "din1-modul";
  /** Lehrbaustein-Hinweis (immer gesetzt). */
  hinweis: string;
  /**
   * Lane S — Dateiname der `.docx`-Vorlage in S3 unter `appointments/schulungen/`.
   * Single source: der Generator baut daraus den logischen Pfad
   * `appointments/schulungen/<fileName>` (siehe `schulungTemplateLogicalPath`).
   * Zuordnung über die Modul-Nummer (din1-modul-1 → 01_…, … -9 → 09_…).
   */
  templateFileName: string;
}

const LEHRBAUSTEIN_HINWEIS =
  "Lehrbaustein zur Füllung des CL-11-Jahres-Solls — kein eigener Norm-UE-Wert";

/** S3-Ordner (Kategorie `appointments`), unter dem die Schulungs-Vorlagen liegen. */
export const SCHULUNG_TEMPLATE_FOLDER = "appointments/schulungen";

function modul(
  id: string,
  label: string,
  ue: number,
  templateFileName: string,
): TrainingCatalogModule {
  return {
    id,
    label,
    ue,
    clauseId: "CL-11",
    group: "din1-modul",
    hinweis: LEHRBAUSTEIN_HINWEIS,
    templateFileName,
  };
}

/**
 * DIN-1-Modulkatalog (§3): Module 1–8 je 4 UE + Modul 9 „Führungskraft" 8 UE.
 * Lane S: je Modul der S3-Vorlagen-Dateiname (`appointments/schulungen/`).
 */
export const TRAINING_CATALOG: TrainingCatalogModule[] = [
  modul(
    "din1-modul-1",
    "Dokumentation/Wachbuch/Meldewesen",
    4,
    "01_Dokumentation_Wachbuch_Meldewesen_4UE.docx",
  ),
  modul(
    "din1-modul-2",
    "Datenschutz/Verschwiegenheit/Informationsschutz",
    4,
    "02_Datenschutz_Verschwiegenheit_Informationsschutz_4UE.docx",
  ),
  modul(
    "din1-modul-3",
    "Kommunikation/Konflikt/Deeskalation",
    4,
    "03_Kommunikation_Konflikt_Deeskalation_4UE.docx",
  ),
  modul(
    "din1-modul-4",
    "Schließmittel/Ausrüstung/Kontrollsysteme",
    4,
    "04_Schliessmittel_Ausruestung_Kontrollsysteme_4UE.docx",
  ),
  modul(
    "din1-modul-5",
    "Arbeitsschutz/Notfallverhalten/Eigensicherung",
    4,
    "05_Arbeitsschutz_Notfallverhalten_Eigensicherung_4UE.docx",
  ),
  modul(
    "din1-modul-6",
    "Stationärer Objektschutz/Empfang/Kontrolldienst",
    4,
    "06_Stationaerer_Objektschutz_Empfang_Kontrolldienst_4UE.docx",
  ),
  modul(
    "din1-modul-7",
    "Revierdienst/Mobiler Kontrolldienst",
    4,
    "07_Revierdienst_Mobiler_Kontrolldienst_4UE.docx",
  ),
  modul(
    "din1-modul-8",
    "Veranstaltungsschutz Allgemein",
    4,
    "08_Veranstaltungsschutz_Allgemein_4UE.docx",
  ),
  modul(
    "din1-modul-9",
    "Führungskraft Sicherheitsdienst DIN 77200-1",
    8,
    "09_Fuehrungskraft_Sicherheitsdienst_DIN_77200-1_8UE.docx",
  ),
];

export function findCatalogModule(id: string): TrainingCatalogModule | undefined {
  return TRAINING_CATALOG.find((m) => m.id === id);
}

/**
 * Lane S — logischer S3-Pfad (`appointments/schulungen/<file>`) der Vorlage eines
 * Katalog-Moduls, wie ihn `buildLatestTemplateKeyMap` als Schlüssel liefert.
 * Liefert `null`, wenn die Modul-Id nicht im Katalog ist (kein erfundener Pfad).
 */
export function schulungTemplateLogicalPath(moduleId: string): string | null {
  const m = findCatalogModule(moduleId);
  if (!m) return null;
  return `${SCHULUNG_TEMPLATE_FOLDER}/${m.templateFileName}`;
}

/**
 * #5 UE-Anerkennung (Variante C) — Best-Effort-Extraktion eines UE-Werts aus
 * einem **extern** hochgeladenen Schulungsnachweis (z. B. Dateiname oder
 * extrahierter Text-Schnipsel). Reine **Heuristik** — der Treffer ist NUR ein
 * Vorschlag (`unchecked`) und wird erst nach fachlicher Bestätigung anerkannt
 * (siehe `TrainingPlanItem.ueBestaetigt`). **Keine Auto-Anerkennung (EC-10).**
 *
 * Erkennt einfache Muster wie „40 UE", „24 Unterrichtseinheiten", „16 UE.",
 * groß-/kleinschreibungs- und trennzeichen-tolerant. Liefert `null`, wenn kein
 * plausibler Wert gefunden wird (dann bleibt der Vorschlag leer → kein Auto-Ist).
 *
 * Bewusst NICHT: kein PDF-Parsing, keine Norm-Wertung, keine erfundenen UE —
 * nur das, was wörtlich im übergebenen Text steht.
 */
export function extractUeFromText(text: string | null | undefined): number | null {
  if (typeof text !== "string" || text.length === 0) return null;
  // „<Zahl> UE" / „<Zahl> Unterrichtseinheit(en)" — Zahl direkt vor der Einheit.
  const re = /(\d{1,3})\s*(?:ue\b|unterrichtseinheit(?:en)?\b)/gi;
  let best: number | null = null;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const n = Number(m[1]);
    if (Number.isFinite(n) && n > 0 && n <= 999) {
      // Bei mehreren Treffern den größten plausiblen Wert vorschlagen
      // (Gesamt-UE steht i. d. R. als höchste Zahl auf dem Nachweis).
      if (best === null || n > best) best = n;
    }
  }
  return best;
}
