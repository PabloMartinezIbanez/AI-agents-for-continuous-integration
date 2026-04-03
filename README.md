# AI Agents for Continuous Integration

Experimental final degree project focused on studying how AI agents can be integrated into a Continuous Integration workflow. This repository is the reference application of the thesis: it contains the Jenkins pipeline, the Docker-based local environment, and the small Python and JavaScript codebases used to exercise the system.

The reusable automation does not live here. It is consumed from the companion repository `AI_agents_for_CI_shared_library`, which provides the Jenkins steps and the MCP-based agent runtime.

## Project goal

The goal is to build a controlled CI environment that can:

- analyze code automatically with SonarQube;
- run Python and JavaScript tests in pull-request builds;
- trigger an AI-assisted remediation stage outside pull-request builds;
- collect structured evidence for the thesis and for pipeline debugging.

This repository is intentionally not a production template. It is an academic testbed and it includes simple examples plus intentional failures to force analysis results, alerts, and remediation attempts.

## Technology stack

- Jenkins as the pipeline orchestrator.
- SonarQube Community as the static analysis engine.
- PostgreSQL as the SonarQube database.
- ngrok to expose Jenkins and receive GitHub webhooks.
- Python with `pytest` and `pytest-json-report`.
- Node.js with the native Node test runner.
- Docker and Docker Compose to provision the infrastructure.
- Jenkins Shared Library consumption through `@Library(...)`.

## General architecture

The infrastructure defined in this repository starts three main services:

1. Jenkins, built from a custom image with SonarScanner CLI, Python, pip, virtual environment support, and ngrok.
2. SonarQube, exposed on port 9000 and connected to PostgreSQL.
3. PostgreSQL, used as the persistent backend for SonarQube.

The pipeline then delegates reusable AI behavior to `AI_agents_for_CI_shared_library`, which exposes `FixWithAI(...)` and the Python MCP runtime used by the remediation stage.

## Pipeline flow

The current `Jenkinsfile` follows this sequence:

1. Load the shared library with `@Library('AI_agents_for_CI_shared_library@...')`.
2. Check out the repository.
3. Recreate `reports_for_IA`, the workspace directory used for AI-facing artifacts.
4. Run SonarScanner with a branch-specific effective `projectKey`.
5. Wait for the SonarQube Quality Gate.
6. If the build is for a pull request:
   - install Python dependencies;
   - run the Python and JavaScript test suites;
   - archive the generated test artifacts.
7. If the build is not for a pull request:
   - execute `FixWithAI(...)`.
8. Clean the workspace in `post`.

Important clarifications:

- The demo repository uses `ai-tests-config.json` as the explicit override for the base `.ai-tests.json` contract understood by the test-runner MCP server.
- The AI stage writes structured artifacts to `reports_for_IA/`, including `agent_summary.json` and `validation_results.json`.

## Current repository state

This repository intentionally contains minimal Python and JavaScript code plus a small verified test baseline that can be exercised by the Jenkins pipeline and by the AI remediation flow.

Locally verified state:

- Python tests: 4 passing.
- JavaScript tests: 6 passing.

The current baseline is green locally. For thesis experiments, failing scenarios can still be introduced deliberately, but they are no longer described here as the default checked-in state.

## Repository structure

```text
.
|-- Jenkinsfile
|-- README.md
|-- ai-tests-config.json
|-- docker/
|   `-- jenkins/
|       |-- docker-compose.yaml
|       |-- Dockerfile
|       `-- entrypoint.sh
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

- `src/calculator/suma.py`: simple script with addition and subtraction functions and a command-line interface.
- `src/calculator/prueba.js`: equivalent JavaScript version using `readline`.

### Tests

- `tests/python/test_suma.py`: validates the Python logic with the current green baseline.
- `tests/javascript/test_prueba.js`: validates the JavaScript logic with the current green baseline.
- `ai-tests-config.json`: the test-suite contract passed to `FixWithAI(...)` so that the MCP test runner knows how to execute this repository's suites.

### CI infrastructure

- `Jenkinsfile`: reference pipeline and integration point with the shared library.
- `docker/jenkins/Dockerfile`: custom Jenkins image with dependencies for analysis and automation.
- `docker/jenkins/docker-compose.yaml`: composition for Jenkins, SonarQube, and PostgreSQL.
- `docker/jenkins/entrypoint.sh`: starts ngrok and then Jenkins.

## Requirements

To work with the project, it is recommended to have:

- Docker and Docker Compose.
- Python 3.
- Node.js.
- A Jenkins instance with access to the `AI_agents_for_CI_shared_library` shared library.
- Credentials configured in Jenkins for SonarQube, the LLM provider, and GitHub.
- An ngrok token if Jenkins needs to be exposed to the Internet.

## Infrastructure startup

The repository includes the infrastructure definition in:

- `docker/jenkins/docker-compose.yaml`

Typical command to start the environment:

```bash
docker compose -f docker/jenkins/docker-compose.yaml up --build
```

Expected services once started:

- Jenkins at `http://localhost:8080`
- SonarQube at `http://localhost:9000`

Before running the pipeline, review the required credentials for Jenkins, SonarQube, GitHub, and the AI provider.

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

There are no npm dependencies in this repository; the JavaScript tests use Node's native test runner.

## Generated artifacts

The pipeline centralizes AI-facing artifacts in `reports_for_IA/`.

Current examples:

- PR builds store test artifacts such as `python_test_results.json` and `js_test_results.xml`.
- Non-PR AI builds can emit `agent_summary.json` and `validation_results.json` from the shared library runtime.

## Current limitations

- The project is focused on academic experimentation, not production deployment.
- The checked-in tests are currently green; failing scenarios are an experiment setup choice, not the default repository state.
- The pipeline consumes a companion shared library from a separate repository.
- The AI remediation stage requires credentials and external services to work.

## Possible future work

- Measure the quality of the fixes proposed by the AI.
- Compare execution time and results against a traditional pipeline without agents.
- Add more structured execution traces and acceptance policies.
- Expand the example with larger projects and more languages.

## Author and context

Repository developed as part of a final degree project in Computer Engineering, focused on the use of AI agents applied to Continuous Integration.
