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
                        -Dsonar.projectKey=mi-proyecto \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=http://localhost:9000
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
    }
}