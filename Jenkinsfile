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
                timeout(time: 2, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
        stage('Export SonarQube Issues') {
            steps {
                script {
                    def exportScript = libraryResource 'export_sonarqube_issues.py'
                    writeFile file: 'export_sonarqube_issues.py', text: exportScript
                    sh 'python3 export_sonarqube_issues.py'
                }
            }
        }
    }
}