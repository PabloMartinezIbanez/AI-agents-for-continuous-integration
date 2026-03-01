import os
import json
import requests
from google import genai

API_KEY = os.environ.get("GEMINI_API_KEY")

def analyze(lint_output, test_output, diff):
    prompt = f"""
You are an expert AI agent specialized in Continuous Integration, Python code quality,
and automated code review. Always respond in English.

Your task is to analyze the results of a CI pipeline using the following inputs:

CODE CHANGES (diff del commit / PR):
{diff}

LINTER RESULTS:
{lint_output}

TEST RESULTS:
{test_output}

Generate a Markdown report with the following structure:

## Summary
Brief overview of the detected issues.

## Detected Issues
For each issue:
- Affected file and code fragment
- Related commit change (if applicable)

## Root Cause Analysis
Explain why the issue occurs.

## Recommended Fix
Explain how to fix the issue.
Include code examples when relevant.

## Priority
Classify each issue as High, Medium, or Low priority.
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
    
    with open("diff.log", encoding="utf-8", errors="ignore") as f:
        diff = f.read()

    report = analyze(lint, tests, diff)

    with open("ai_report.md", "w", encoding="utf-8") as f:
        f.write(report)

    print("Informe IA generado: ai_report.md")
