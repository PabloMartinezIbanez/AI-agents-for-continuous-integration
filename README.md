# AI Agents for Continuous Integration

Experimental final degree project focused on studying how AI agents can be integrated into a Continuous Integration workflow. The repository combines Jenkins, SonarQube, automated tests, and a later AI-assisted correction stage to evaluate how far the code analysis and improvement cycle can be automated.

## Project goal

The goal is to build a CI environment that can:

- analyze code automatically with SonarQube;
- run Python and JavaScript tests;
- export quality reports and execution results;
- trigger an AI-based automated remediation stage;
- observe the system behavior in a controlled and reproducible environment.

This project is not intended to be a production-ready template. At the moment, it works as an experimental testbed for the thesis and contains simple examples and intentional failures to force analysis results, alerts, and pipeline executions.

## Technology stack

- Jenkins as the pipeline orchestrator.
- SonarQube Community as the static analysis engine.
- PostgreSQL as the SonarQube database.
- ngrok to expose Jenkins and receive GitHub webhooks.
- Python with pytest and pytest-json-report.
- Node.js with the native Node test runner.
- Docker and Docker Compose to provision the infrastructure.

## General architecture

The infrastructure defined in the repository starts three main services:

1. Jenkins, built from a custom image with SonarScanner CLI, Python, pip, virtual environment support, and ngrok.
2. SonarQube, exposed on port 9000 and connected to PostgreSQL.
3. PostgreSQL, used as the persistent backend for SonarQube.

In addition, Jenkins can be exposed through ngrok to receive external events such as GitHub webhooks.

## Pipeline flow

The pipeline defined in the Jenkinsfile follows this sequence:

1. Prepare the report directory used by the AI stage.
2. Run static analysis on the repository with SonarScanner.
3. Wait for the SonarQube Quality Gate result.
4. Export the issues detected by SonarQube.
5. If the build is for a pull request, install Python dependencies and run the Python and JavaScript tests.
6. If the build is not for a pull request, run the FixWithAI stage.
7. Archive the generated artifacts.

The pipeline uses a Jenkins shared library declared as AI_agents_for_CI_shared_library. Without that library, custom stages such as ExportSonarQubeIssues and FixWithAI cannot run.

## Current repository state

This repository intentionally contains minimal Python and JavaScript code. It also includes tests that currently fail on purpose in order to generate evidence during the experiments.

Locally verified state:

- Python tests: 2 passing and 2 failing;
- JavaScript tests: 4 passing and 2 failing;
- sample SonarQube report: 4 open issues exported in JSON format.

This is useful to validate that the pipeline detects problems, exports reports, and produces material for the automated remediation stage.

## Repository structure

```text
.
|-- Jenkinsfile
|-- README.md
|-- docker/
|   `-- jenkins/
|       |-- docker-compose.yaml
|       |-- Dockerfile
|       `-- entrypoint.sh
|-- reports/
|   `-- sonarqube-issues.json
|-- requirements/
|   `-- python_requirements.txt
|-- src/
|   `-- calculator/
|       |-- prueba.js
|       `-- suma.py
`-- tests/
    |-- javascript/
    |   `-- test_prueba.js
    `-- python/
        `-- test_suma.py
```

## Main components

### Example code

- src/calculator/suma.py: simple script with addition and subtraction functions and a command-line interface.
- src/calculator/prueba.js: equivalent JavaScript version using readline.

### Tests

- tests/python/test_suma.py: validates the Python logic and includes failing cases.
- tests/javascript/test_prueba.js: validates the JavaScript logic and includes failing cases.

### CI infrastructure

- docker/jenkins/Dockerfile: custom Jenkins image with dependencies for analysis and automation.
- docker/jenkins/docker-compose.yaml: composition for Jenkins, SonarQube, and PostgreSQL.
- docker/jenkins/entrypoint.sh: starts ngrok and then Jenkins.

## Requirements

To work with the project, it is recommended to have:

- Docker and Docker Compose.
- Python 3.
- Node.js.
- A Jenkins instance with access to the AI_agents_for_CI_shared_library shared library.
- Credentials configured in Jenkins for SonarQube, the LLM provider, and GitHub.
- An ngrok token if Jenkins needs to be exposed to the Internet.

## Infrastructure startup

The repository includes the infrastructure definition in:

- docker/jenkins/docker-compose.yaml

Typical command to start the environment:

```bash
docker compose -f docker/jenkins/docker-compose.yaml up --build
```

Expected services once started:

- Jenkins at http://localhost:8080
- SonarQube at http://localhost:9000

Before running the actual pipeline, the sensitive variables and the required credentials for Jenkins, SonarQube, GitHub, and the AI model provider must be reviewed.

## Running tests locally

### Python

Install dependencies:

```bash
python -m pip install -r requirements/python_requirements.txt
```

Run:

```bash
python -m pytest tests/python/test_suma.py
```

### JavaScript

Run:

```bash
node --test tests/javascript/test_prueba.js
```

There are no npm dependencies defined in the repository; the JavaScript tests use Node's native test runner.

## Generated reports

The pipeline centralizes artifacts for the AI layer in a reports directory. The repository already contains one example exported from SonarQube:

- reports/sonarqube-issues.json

That file summarizes severities, statuses, affected languages, and the detailed list of open issues.

## Current limitations

- The project is focused on academic experimentation, not production deployment.
- The failing tests are part of the current experimental scenario.
- The pipeline depends on an external shared library not included in this repository.
- The AI remediation stage requires credentials and external services to work.

## Possible future work

- Measure the quality of the fixes proposed by the AI.
- Compare execution time and results against a traditional pipeline without agents.
- Expand the example with larger projects and more languages.
- Introduce validation criteria to accept or reject automated changes.

## Author and context

Repository developed as part of a final degree project in Computer Engineering, focused on the use of AI agents applied to Continuous Integration.
