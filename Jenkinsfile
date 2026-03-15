@Library('AI_agents_for_CI_shared_library') _

pipeline {
    agent any

    triggers {
        githubPush()
    }

    stages {

        stage('Scan') {
            steps {
                withSonarQubeEnv(installationName: 'sonarQube_server') {
                    sh '''
                        sonar-scanner \
                        -Dsonar.projectKey=AI-agents-for-continuous-integration \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=http://sonarqube:9000
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
                sh 'python3 Library/ia_analyzer.py'
                sh 'git add . && git commit -m "AI fixes for SonarQube issues" || echo "No changes to commit"'
                sh 'git push'
            }
        }
        stage('Run Tests') {
            when {
                expression { env.QUALITY_GATE_STATUS == 'OK' }
            }
            steps {
                sh 'python3 test.py > py_test_results.txt'
                sh 'node prueba.test.js > js_test_results.txt || npm test > js_test_results.txt'
            }
        }
    }
}