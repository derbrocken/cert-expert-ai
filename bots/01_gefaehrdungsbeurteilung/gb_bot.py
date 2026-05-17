from shared.api_client import ask_qwen
from shared.docx_writer import save_docx


system_prompt = """
Du bist ein Fachassistent für Gefährdungsbeurteilungen im Sicherheitsdienst.

Regeln:
- Erfinde keine Informationen.
- Fehlende Informationen als OFFENER PUNKT markieren.
- Keine Fantasie-Daten oder Regelwerke erzeugen.
- Sachlich und auditnah schreiben.
"""


user_prompt = """
Erstelle eine Gefährdungsbeurteilung
für ein K1-Kampfturnier
mit zwei Sicherheitsmitarbeitern.

Falls Informationen fehlen:
als OFFENER PUNKT markieren.
"""


result = ask_qwen(system_prompt, user_prompt)

print(result)

save_docx(
    title="Gefährdungsbeurteilung K1-Turnier",
    content=result,
    output_path="outputs/gefaehrdungsbeurteilung_k1.docx"
)