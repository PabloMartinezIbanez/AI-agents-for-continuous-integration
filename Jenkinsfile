@Library('AI_agents_for_CI_shared_library') _

pipeline {
    agent {
        node {
            label 'linux'
            customWorkspace "/var/jenkins_home/workspace/${env.JOB_NAME}/${env.BUILD_NUMBER}"
        }
    }

    options {
        skipDefaultCheckout(true)
    }

    tools {
        nodejs '25.6.1'
        dockerTool 'Docker-v27.3.1'
    }

    triggers {
        githubPush()
    }

    environment {
        // Environment variables consumed by the Python script
        SONARQUBE_TOKEN = credentials('SONARQUBE_TOKEN')
        SONARQUBE_URL = 'http://sonarqube:9000'
        SONARQUBE_PROJECT_KEY = 'AI-agents-for-continuous-integration'
        LLM_API_KEY_VALUE = credentials('LLM_API_KEY_VALUE')
        Github_AI_Auth = credentials('Github_AI_Auth')
        // Directory where AI-facing reports are centralized
        AI_REPORTS_DIR = 'reports_for_IA'
        DOCKER_HOST = 'tcp://host.docker.internal:2375'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Prepare AI Directory') {
            steps {
                sh '''
                    rm -rf "$AI_REPORTS_DIR"
                    mkdir -p "$AI_REPORTS_DIR"
                '''
            }
        }

        stage('Scan') {
            steps {
                script {
                    def safeBranch = (env.BRANCH_NAME ?: 'manual').replaceAll(/[^A-Za-z0-9._:-]/, '_')
                    env.SONARQUBE_EFFECTIVE_PROJECT_KEY = "${env.SONARQUBE_PROJECT_KEY}:${safeBranch}"
                }
                withSonarQubeEnv(installationName: 'sonarQube_server') {
                    sh '''
                        echo "Scanning with project key: ${SONARQUBE_EFFECTIVE_PROJECT_KEY}"
                        
                        sonar-scanner \
                        -Dsonar.projectKey="${SONARQUBE_EFFECTIVE_PROJECT_KEY}" \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=$SONARQUBE_URL \
                        -Dsonar.login=$SONARQUBE_TOKEN \
                        -Dsonar.scanner.metadataFilePath="$WORKSPACE/report-task.txt" > /dev/null 2>&1
                    '''
                }
            }
        }
        stage("Quality Gate") {
            steps {
                script {
                    waitForQualityGate abortPipeline: false
                }
            }
        }

        stage('Install Python Dependencies') {
            when {
                expression { env.CHANGE_ID && (env.CHANGE_BRANCH ?: '').startsWith('ai-fix/') }
            }
            steps {
                sh '''
                    python3 -m pip install --break-system-packages -r "$WORKSPACE/requirements/python_requirements.txt" > /dev/null 2>&1 || exit 0
                '''
            }
        }
        stage('Run Tests') {
            when {
                expression { env.CHANGE_ID && (env.CHANGE_BRANCH ?: '').startsWith('ai-fix/') }
            }
            steps {
                script {
                    def failedSuites = []

                    int pythonStatus = sh(
                        script: "PYTHONPATH=\"$WORKSPACE/src/calculator\" python3 -m pytest \"$WORKSPACE/tests/python/test_suma.py\" --json-report --json-report-file=\"$WORKSPACE/$AI_REPORTS_DIR/python_test_results.json\" > /dev/null 2>&1",
                        returnStatus: true
                    )
                    if (pythonStatus != 0) {
                        failedSuites << 'python'
                    }

                    int jsStatus = sh(
                        script: "node --test --test-reporter=junit --test-reporter-destination=\"$WORKSPACE/$AI_REPORTS_DIR/js_test_results.xml\" tests/javascript/test_prueba.js > /dev/null 2>&1",
                        returnStatus: true
                    )
                    if (jsStatus != 0) {
                        failedSuites << 'javascript'
                    }

                    archiveArtifacts artifacts: "${env.AI_REPORTS_DIR}/*", fingerprint: true, allowEmptyArchive: true

                    if (failedSuites) {
                        error("Test suites failed: ${failedSuites.join(', ')}")
                    }
                }
            }
        }

        stage('Fix Issues with AI') {
            when {
                expression { env.CHANGE_ID && !((env.CHANGE_BRANCH ?: '').startsWith('ai-fix/')) }
            }
            steps {
                echo "Attempting to fix issues with AI..."
                FixWithAI(
                    llmModel: 'gemini-3.1-pro-preview', // 'gemini-3-flash-preview',
                    llmCredentialId: 'LLM_API_KEY_VALUE',
                    githubCredentialId: 'Github_AI_Auth',
                    repoSlug: 'PabloMartinezIbanez/AI-agents-for-continuous-integration',
                    testConfigFile: 'ai-tests-config.json',
                    dryRun: false
                )
            }
        }
    }
    post {
        always {
            cleanWs(
                cleanWhenSuccess: true,
                cleanWhenFailure: false,
                deleteDirs: true
            )
        }
    }
}
