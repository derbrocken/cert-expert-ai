import requests

LM_STUDIO_URL = "http://127.0.0.1:1234/v1/chat/completions"
MODEL_NAME = "qwen/qwen3-30b-a3b-2507"


def ask_qwen(system_prompt: str, user_prompt: str, temperature: float = 0.3) -> str:
    payload = {
        "model": MODEL_NAME,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "temperature": temperature,
    }

    response = requests.post(LM_STUDIO_URL, json=payload, timeout=300)
    response.raise_for_status()

    result = response.json()
    return result["choices"][0]["message"]["content"]