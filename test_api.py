import requests

url = "http://127.0.0.1:1234/v1/chat/completions"

payload = {
    "model": "qwen/qwen3-30b-a3b-2507",
    "messages": [
        {
            "role": "system",
            "content": "Du bist ein Experte für Gefährdungsbeurteilungen im Sicherheitsdienst."
        },
        {
            "role": "user",
            "content": """
            Erstelle eine einfache Gefährdungsbeurteilung
            für ein K1-Kampfturnier mit zwei Sicherheitsmitarbeitern.
            Fehlende Informationen sollen als offene Punkte markiert werden.
            """
        }
    ],
    "temperature": 0.3
}

response = requests.post(url, json=payload)

result = response.json()

print(result["choices"][0]["message"]["content"])
