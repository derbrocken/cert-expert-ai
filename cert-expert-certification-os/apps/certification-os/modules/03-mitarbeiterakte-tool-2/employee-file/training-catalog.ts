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
}

const LEHRBAUSTEIN_HINWEIS =
  "Lehrbaustein zur Füllung des CL-11-Jahres-Solls — kein eigener Norm-UE-Wert";

function modul(id: string, label: string, ue: number): TrainingCatalogModule {
  return {
    id,
    label,
    ue,
    clauseId: "CL-11",
    group: "din1-modul",
    hinweis: LEHRBAUSTEIN_HINWEIS,
  };
}

/**
 * DIN-1-Modulkatalog (§3): Module 1–8 je 4 UE + Modul 9 „Führungskraft" 8 UE.
 */
export const TRAINING_CATALOG: TrainingCatalogModule[] = [
  modul("din1-modul-1", "Dokumentation/Wachbuch/Meldewesen", 4),
  modul("din1-modul-2", "Datenschutz/Verschwiegenheit/Informationsschutz", 4),
  modul("din1-modul-3", "Kommunikation/Konflikt/Deeskalation", 4),
  modul("din1-modul-4", "Schließmittel/Ausrüstung/Kontrollsysteme", 4),
  modul("din1-modul-5", "Arbeitsschutz/Notfallverhalten/Eigensicherung", 4),
  modul("din1-modul-6", "Stationärer Objektschutz/Empfang/Kontrolldienst", 4),
  modul("din1-modul-7", "Revierdienst/Mobiler Kontrolldienst", 4),
  modul("din1-modul-8", "Veranstaltungsschutz Allgemein", 4),
  modul("din1-modul-9", "Führungskraft Sicherheitsdienst DIN 77200-1", 8),
];

export function findCatalogModule(id: string): TrainingCatalogModule | undefined {
  return TRAINING_CATALOG.find((m) => m.id === id);
}
