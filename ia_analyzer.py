import os
import json
import requests
from google import genai

API_KEY = os.environ.get("GEMINI_API_KEY")

def analyze(lint_output, test_output):
    prompt = f"""
Eres un asistente experto en CI/CD y calidad de código Python, te vas a comunicar en español y vas a analizar la salida 
de un linter y de unos tests.

Resultados del LINTER:
{lint_output}

Resultados de TESTS:
{test_output}

Genera un informe con formato markdown con:
1. Errores detectados
2. Causa probable
3. Cómo corregirlos
4. Prioridad de cada problema
"""
    client = genai.Client(api_key=API_KEY)
    response = client.models.generate_content(
        model="gemini-3-pro-preview",
        contents=prompt
    )

    return response.text


if __name__ == "__main__":
    with open("lint.log") as f:
        lint = f.read()

    with open("tests.log") as f:
        tests = f.read()

    report = analyze(lint, tests)

    with open("ai_report.md", "w", encoding="utf-8") as f:
        f.write(report)

    print("Informe IA generado: ai_report.md")
