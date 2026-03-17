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
                withSonarQubeEnv(installationName: 'sonarQube_server') {
                    sh '''
                        sonar-scanner \
                        -Dsonar.projectKey=$SONARQUBE_PROJECT_KEY \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=$SONARQUBE_URL \
                        -Dsonar.login=$SONARQUBE_TOKEN
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
                expression { env.QUALITY_GATE_STATUS == 'OK' }
            }
            steps {
                sh 'python3 -m pip install -r requirements.txt'
            }
        }
        stage('Run Tests') {
            when {
                expression { env.QUALITY_GATE_STATUS == 'OK' }
            }
            steps {
                sh 'python3 -m pytest test.py --json-report --json-report-file=assets/python_test_results.json'
                sh 'npm test'
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: 'assets/python_test_results.json', fingerprint: true
        }
    }
}