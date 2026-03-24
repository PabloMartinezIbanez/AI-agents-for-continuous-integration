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
    }

    stages {

        stage('Scan') {
            steps {
                sh 'echo "Branch name: $BRANCH_NAME"'
                withSonarQubeEnv(installationName: 'sonarQube_server') {
                    sh '''
                        sonar-scanner \
                        -Dsonar.projectKey=$SONARQUBE_PROJECT_KEY \
                        -Dsonar.branch.name=$BRANCH_NAME \
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
        stage('Fix Issues with AI') {
            when {
                expression { env.QUALITY_GATE_STATUS != 'OK' }
            }
            steps {
                echo "Quality Gate failed with status: ${env.QUALITY_GATE_STATUS}. Attempting to fix issues with AI..."
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
                sh '.project-venv/bin/pytest ${WORKSPACE}/test.py --json-report --json-report-file=${WORKSPACE}/assets/python_test_results.json > /dev/null 2>&1 || exit 0'
                sh 'npm run test:ci > /dev/null 2>&1 || exit 0'
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: 'assets/python_test_results.json, assets/js_test_results.xml, sonarqube-issues.json', fingerprint: true
        }
    }
}