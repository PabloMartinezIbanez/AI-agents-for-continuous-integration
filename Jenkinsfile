pipeline {
    agent any

    triggers {
        githubPush()
    }

    stages {

        stage('Scan') {
            steps {
                withSonarQubeEnv(installationName: 'SonarQube webhook') {
                    sh '''
                        sonar-scanner \
                        -Dsonar.projectKey=mi-proyecto \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=${SONAR_HOST_URL}
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