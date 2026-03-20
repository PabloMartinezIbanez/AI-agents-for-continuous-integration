@Library('AI_agents_for_CI_shared_library') _

pipeline {
    agent any

    tools {
        nodejs '25.6.1'
    }

    triggers {
        githubPush()
    }

    environment {
        // Variables de entorno que serán leídas por el script Python
        SONARQUBE_TOKEN = credentials('SONARQUBE_TOKEN')
        SONARQUBE_URL = 'http://sonarqube:9000'
        SONARQUBE_PROJECT_KEY = 'AI-agents-for-continuous-integration'
        // Carpeta donde se centralizan los reportes que leerá la IA
        AI_REPORTS_DIR = 'reports_for_IA'
    }

    stages {

        stage('Prepare AI Directory') {
            when {
                expression { env.QUALITY_GATE_STATUS != 'OK' }
            }
            steps {
                sh '''
                    mkdir -p "$AI_REPORTS_DIR"
                '''
            }
        }

        stage('Scan') {
            steps {
                withSonarQubeEnv(installationName: 'sonarQube_server') {
                    sh '''
                        sonar-scanner \
                        -Dsonar.projectKey=$SONARQUBE_PROJECT_KEY \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=$SONARQUBE_URL \
                        -Dsonar.login=$SONARQUBE_TOKEN \
                        > /dev/null 2>&1
                    '''
                }
            }
        }
        stage("Quality Gate") {
            steps {
                script {
                    def qg = waitForQualityGate abortPipeline: false
                    env.QUALITY_GATE_STATUS = qg.status
                }
            }
        }
        stage('Export SonarQube Issues') {
            steps {
                ExportSonarQubeIssues()
            }
        }
        stage('Install Python Dependencies') {
            when {
                expression { env.QUALITY_GATE_STATUS != 'OK' }
            }
            steps {
                sh '''
                    python3 -m venv .project-venv > /dev/null 2>&1
                    . .project-venv/bin/activate > /dev/null 2>&1
                    pip install -r ${WORKSPACE}/requirements.txt > /dev/null 2>&1
                '''
            }
        }
        stage('Run Tests') {
            when {
                expression { env.QUALITY_GATE_STATUS != 'OK' }
            }
            steps {
                sh ".project-venv/bin/pytest ${WORKSPACE}/test.py --json-report --json-report-file=${WORKSPACE}/assets/${AI_REPORTS_DIR}/python_test_results.json || exit 0"
                sh "node --test --test-reporter=junit --test-reporter-destination=${AI_REPORTS_DIR}/js_test_results.xml test.js || exit 0"
            }
        }

        stage('Fix Issues with AI') {
            when {
                expression { env.QUALITY_GATE_STATUS != 'OK' }
            }
            steps {
                echo "Quality Gate failed with status: ${env.QUALITY_GATE_STATUS}. Attempting to fix issues with AI..."
                FixWithAI(
                    reportsDir: env.AI_REPORTS_DIR,
                    llmModel: 'gpt-4o',
                    llmCredentialId: 'OPENAI_API_KEY',
                    githubCredentialId: 'GITHUB_PAT',
                    repoSlug: 'PabloMartinezIbanez/AI-agents-for-continuous-integration'
                )
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: "${env.AI_REPORTS_DIR}/*", fingerprint: true
        }
    }
}